const API_URL = "https://mock-api.driven.com.br/api/v6/uol/"
let loginToken = 0;
let chatReqToken = 0;
let participantsToken = 0;
let currentUser = {
    name: ""
}
let targetUser = "Todos";
let msgType = "message"
let currentParticipants = [];
let chatHistory = [];
const MAX_LOG = 100;


function deleteOlder() {
    const loadedMsg = document.querySelector(".message-area")
    if(loadedMsg.childElementCount >= MAX_LOG)
        loadedMsg.firstElementChild.remove()
}

function sameAsPrevious(msg) {
    const lastHistory = chatHistory[chatHistory.length-1]
    if(lastHistory.name === msg.name && lastHistory.time === msg.time)
        return true
    return false
}

function updateHistory(msg) {
    if(chatHistory.length === 0 || !sameAsPrevious(msg))
    {
        const deleteFlag = chatHistory.push(msg)
        if(deleteFlag >= MAX_LOG) {
            chatHistory.shift()
        }
    }
    deleteOlder()
}

function writeChatMsg(msgData) {
    const msgBox = document.querySelector(".message-area")
    let msgCat = msgData.type;

    switch (msgCat) {
        case "message":
            msgBox.innerHTML += `
                <div class="global messages">
                    <span class="system">(${msgData.time})&nbsp;</span>
                    <span class="user-context">${msgData.from}&nbsp;</span>
                    <span>para&nbsp;</span>
                    <span class="user-context">${msgData.to}:&nbsp;</span>
                    <div class="msg-data">${msgData.text}</div>
                </div>`
            msgBox.lastElementChild.scrollIntoView()
            break;
        case "status":
            msgBox.innerHTML += `
                <div class="system messages">
                    <span class="system">(${msgData.time})&nbsp</span>
                    <span class="user-context">${msgData.from}&nbsp</span>
                    <div class="msg-data">${msgData.text}</div>
                </div>`
            msgBox.lastElementChild.scrollIntoView()
            break;
        case "private_message":
            if (msgData.to === currentUser.name || msgData.from === currentUser.name) {
                msgBox.innerHTML += `
                    <div class="private messages">
                        <span class="system">(${msgData.time})&nbsp;</span>
                        <span class="user-context">${msgData.from}&nbsp;</span>
                        <span>para&nbsp;</span>
                        <span class="user-context">${msgData.to}:&nbsp;</span>
                        <div class="msg-data">${msgData.text}</div>
                    </div>`
                msgBox.lastElementChild.scrollIntoView()
            }
            break;
    }
    updateHistory(msgData)
}

function lastMsgIndex(item, index) {
    const lastIndex = chatHistory.length-1
    if(item.name === chatHistory[lastIndex].name && item.time === chatHistory[lastIndex].time)
        return index
}

function loadChat(chatLog) {
    const chatData = chatLog.data
    if(chatHistory.length === 0)
        chatData.forEach(writeChatMsg)
    const newIndex = chatData.findIndex(lastMsgIndex)
    const updateArray = chatData.slice(newIndex+1)
    updateArray.forEach(writeChatMsg)
}

function updateChat() {
    const promise = axios.get(API_URL+"messages")
    promise.then(loadChat)
    promise.catch(errorHandle)
}

function sendMessage(btn) {
    const msgContent = btn.parentNode.querySelector("input").value;
    if(msgContent) 
    {
        const msgBody = {
            from: currentUser.name,
            to: targetUser,
            text: msgContent,
            type: msgType
        }
        // console.log(msgBody);
        const promise = axios.post(API_URL+"messages", msgBody);
        btn.parentNode.querySelector("input").value = "";
        promise.then(updateChat);
        promise.catch(errorHandle);
    }
}

function keyCheck(keyEvent) {
    const btn = keyEvent.path[0]
    if(keyEvent.key === "Enter") {
        sendMessage(btn)
    }
}

function isUser(data) {
    if(data === "Todos")
        return false;
    return true;
}

function setMsgTarget(userName) {
    targetUser = userName
    if(isUser(userName)) {
        setMsgVisibility(false)
    }
    changeIfPrivate()
}

function changeIfPrivate() {
    const setting = document.querySelector(".visibility .hidden").parentNode
    const settingName = getNameField(setting.querySelector("span").innerHTML)
    // console.log(settingName)
    if (settingName === "Público") {
        setting.lastElementChild.classList.remove("hidden")
        setting.nextElementSibling.lastElementChild.classList.add("hidden")
    }
}

function setMsgVisibility(isPrivate) {
    const infoBox = document.querySelector(".info")
    if(isPrivate) {
        infoBox.classList.remove("hidden");
        msgType = "private_message";
        infoBox.innerHTML = 
        `Enviando reservadamente para ${(targetUser !== "Todos") ? targetUser : "..."}`;
        return;
    }
    infoBox.classList.add("hidden");
    msgType = "message";
    infoBox.innerHTML = "Enviando para todos";
}

function getNameField(string) {
    return string.replace(/\W<?.+>\W+/, "").replace(/\W+$/, "")
}

function toggleVisibility(item) {
    item.classList.add("hidden")
}

function checkBox(content) {
    const checks = content.parentNode;
    checks.querySelectorAll(".selected").forEach(toggleVisibility);
    content.querySelector(".selected").classList.remove("hidden");
    const userSelection = getNameField(content.querySelector("span").innerHTML);
    
    if (checks.className === "visibility") {
        if (userSelection === "Público") {
            setMsgVisibility(false)
            return;
        }
        setMsgVisibility(true)
        return;
    }
    setMsgTarget(userSelection);
}

function updateSideMenu(userName) {
    const userList = document.querySelector(".users")
    userList.innerHTML += 
    `
    <li onclick="checkBox(this)">
        <span>
            <ion-icon name="person-circle"></ion-icon>
            ${userName.name}
        </span>
        <ion-icon class="selected hidden" name="checkmark-outline"></ion-icon>
    </li>
    `
}

function removeUser(data) {
    return (data.name !== currentUser.name)
}

function updateUsersOnline(usersList) {
    currentParticipants = usersList.data.filter(removeUser)
    document.querySelector(".users").innerHTML = 
    `
    <li onclick="checkBox(this)">
        <span>
            <ion-icon name="person-circle"></ion-icon>
            Todos
        </span>
        <ion-icon class="selected hidden" name="checkmark-outline"></ion-icon>
    </li>
    `
    currentParticipants.forEach(updateSideMenu)
}

function usersOnline() {
    const promise = axios.get(API_URL+"participants")
    promise.then(updateUsersOnline)
}

function registerUser(btn) {
    const userName = btn.parentNode.querySelector("input").value
    if(userName !== "") {
        btn.parentNode.querySelector("input").value = ""
        if(userName.length > 128) {
            alert("Nome muito longo, escolha um nome com menos carateres")
            return;
        }
        const nameReq = {
            name: userName
        }
        hideLogin()
        console.log(nameReq)
        const promise = axios.post(API_URL+"participants", nameReq)
        currentUser.name = nameReq.name
        promise.then(userLogin);
        promise.catch(errorHandle)    
    }
}

function serverHandshake() {
    const promise = axios.post(API_URL+"status", currentUser)
    promise.catch(errorHandle)
}

function userLogin() {
    hideIntro()
    usersOnline()
    participantsToken = setInterval(usersOnline, 10000);
    loginToken = setInterval(serverHandshake, 4000);
    chatReqToken = setInterval(updateChat, 3000);
}

function sideMenu() {
    const sideMenu = document.querySelector(".side-menu")
    sideMenu.classList.toggle("hidden")
    const shadow = document.querySelector(".shadow")
    shadow.classList.toggle("hidden")
}

function hideIntro() {
    const introMenu = document.querySelector(".intro-screen")
    introMenu.classList.add("hidden")
}

function hideLogin() {
    const introMenu = document.querySelector(".intro-screen")
    introMenu.querySelector("div").classList.add("hidden")
    introMenu.querySelector("input").classList.add("hidden")
    introMenu.querySelector(".loading").classList.remove("hidden")
}

function errorHandle(code) {
    const errorCode = code.response.status;
    console.log(errorCode)
    console.log(code)
    clearInterval(loginToken)
    clearInterval(chatReqToken)
    clearInterval(participantsToken)
    switch (errorCode) {
        case 400:
            console.log(errorCode, code.response)
            alert("Nome de usuário já existe. Por favor escolha outro nome");
            break;
        default:
            alert("Erro desconhecido")
            break;
    }
    window.location.reload()
}
