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
    document.querySelector(".message-area").firstElementChild.remove()
}

function sameAsPrevious(msg) {
    const lastHistory = chatHistory[chatHistory.length-1]
    if(lastHistory.name === msg.name && lastHistory.time === msg.time)
        return true
    return false
}

function updateHistory(msg) {
    if(chatHistory.length === MAX_LOG) {
        chatHistory.shift()
        deleteOlder()
    }
    if(chatHistory.length === 0 || !sameAsPrevious(msg))
        chatHistory.push(msg)
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
                    <span class="msg-data">${msgData.text}</span>
                </div>`
            msgBox.lastElementChild.scrollIntoView()
            break;
        case "status":
            msgBox.innerHTML += `
                <div class="system messages">
                    <span class="system">(${msgData.time})&nbsp</span>
                    <span class="user-context">${msgData.from}&nbsp</span>
                    <span>${msgData.text}</span>
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
                        <span class="msg-data">${msgData.text}</span>
                    </div>`
                msgBox.lastElementChild.scrollIntoView()
            }
            break;
    }
    updateHistory(msgData)
}

function lastMsgIndex(item, index) {
    const lastIndex = chatHistory.length-1
    // console.log(chatHistory,"\n",index,"\n",item,"\n",lastIndex)
    if(item.name === chatHistory[lastIndex].name && item.time === chatHistory[lastIndex].time)
        return index
}

function loadChat(chatLog) {
    const chatData = chatLog.data
    if(chatHistory.length === 0)
        chatData.forEach(writeChatMsg)
    const newIndex = chatData.findIndex(lastMsgIndex)
    const updateArray = chatData.slice(newIndex+1)
    console.log(updateArray)
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
        const promise = axios.post(API_URL+"messages", msgBody)
        btn.parentNode.querySelector("input").value = ""
        promise.then(updateChat)
        promise.catch(errorHandle)
    }
}

function keyCheck(keyEvent) {
    const btn = keyEvent.path[0]
    if(keyEvent.key === "Enter") {
        sendMessage(btn)
    }
}

function notAUser(data) {
    if(data === "Público" || data === "Reservadamente" || data === "Todos")
        return true;
    return false;
}

function setMsgTarget(userName) {
    const infoBox = document.querySelector(".info")
    console.log(userName)
    if(notAUser(userName)) {
        infoBox.classList.add("hidden")
        infoBox.innerHTML = "Enviando para todos"
        msgType = "message"
    }
    else {
        infoBox.classList.remove("hidden")
        infoBox.innerHTML = `Enviando para ${userName}`
        msgType = "private_message"
    }
    targetUser = userName
}

function getNameField(string) {
    return string.replace(/\W<?.+>\W+/, "").replace(/\W+$/, "")
}

function toggleVisibility(item) {
    item.classList.add("hidden")
}

function checkBox(content) {
    const checks = content.parentNode.querySelectorAll(".selected")
    checks.forEach(toggleVisibility)
    content.querySelector(".selected").classList.remove("hidden")
    const userSelected = getNameField(content.querySelector("span").innerHTML)
    if(userSelected === "Todos") {
        const isPublic = document.querySelector(".visibility").firstElementChild.lastElementChild.querySelector(".hidden")
        if(!isPublic)
            checkBox(document.querySelector(".visibility").firstElementChild)
    }
    setMsgTarget(userSelected)
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
    if(userName) {
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
    promise.then(console.log('ok'))
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
            alert("Aconteceu um erro!\nVoltando ao menu inicial...")
            break;
        default:
            alert("Erro desconhecido")
            break;
    }
    window.location.reload()
}
