const API_URL = "https://mock-api.driven.com.br/api/v6/uol/"
let loginToken = 0;
let chatReqToken = 0;
let participantsToken = 0;
let currentUser = {
    name: ""
}
let currentParticipants = [];

function closeSideMenu() {
    const sideMenu = document.querySelector(".side-menu")
    sideMenu.classList.add("hidden")
}

function showSideMenu() {
    console.log('side-menu')
    const sideMenu = document.querySelector(".side-menu")
    sideMenu.classList.toggle("hidden")
}

function hideIntro() {
    const introMenu = document.querySelector(".intro-screen")
    introMenu.classList.add("hidden")
}

function showIntro() {
    const introMenu = document.querySelector(".intro-screen")
    introMenu.classList.remove("hidden")
}

function writePrivateMsg(response) {
    const msgBox = document.querySelector(".message-area")
    // adicionar espaço na resposta do servidor na hora de colocar no template string
    msgBox.innerHTML += `
    <div class="private messages">
        <span class="system">(oiahora)</span>
        <span class="user-context">oionome</span>
        <span>para</span>
        <span class="user-context">oiofulano:</span>
        <span class="msg-data">oianude</span>
    </div>`
}

function writeChatMsg(msgData) {
    const msgBox = document.querySelector(".message-area")
    const msgCat = msgData.type

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
            msgBox.firstElementChild.scrollIntoView()
        case "status":
            msgBox.innerHTML += `
            <div class="system messages">
                <span class="system">(${msgData.time})&nbsp</span>
                <span class="user-context">${msgData.from}&nbsp</span>
                <span>${msgData.text}</span>
            </div>`
            msgBox.firstElementChild.scrollIntoView()
    }        
}


function registerUser(btn) {
    const nameReq = {
        name: btn.parentNode.querySelector("input").value
    }
    console.log(nameReq)
    const promise = axios.post(API_URL+"participants", nameReq)
    currentUser.name = nameReq.name
    promise.then(userLogin);
    promise.catch(errorHandle)
}

function updateChat() {
    const promise = axios.get(API_URL+"messages")
    promise.then(loadChat)
    promise.catch(errorHandle)
}

function loadChat(chatLog) {
    console.log(chatLog)
    document.querySelector(".message-area").innerHTML = ""
    const history = chatLog.data.reverse()
    history.forEach(writeChatMsg)
}

function usersOnline() {
    const promise = axios.get(API_URL+"participants")
    promise.then(updateUsersOnline)
}

function updateUsersOnline(usersList) {
    currentParticipants = usersList.data
}

function userLogin() {
    hideIntro()
    participantsToken = setInterval(usersOnline, 4000);
    loginToken = setInterval(serverHandshake, 4000);
    chatReqToken = setInterval(updateChat, 3000);
}

function serverHandshake() {
    const promise = axios.post(API_URL+"status", currentUser)
    promise.then(console.log('ok'))
    promise.catch(errorHandle)
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
            alert("Usuário já existe, escolha outro nome.")
            showIntro()
            break;
        case 498:
            console.log(errorCode, code.response)
            alert("Login expirado, faça um novo login")
            showIntro()
            break;
        case 500:
            console.log(errorCode, code.response)
            alert("Erro ao acessar o servidor, tente novamente mais tarde.")
            showIntro()
            break;
        case 502:
            console.log(errorCode, code.response)
            alert("Erro ao acessar o servidor, tente novamente mais tarde.")
            showIntro()
            break;
        case 503:
            console.log(errorCode, code.response)
            alert("Serviço indisponível, tente novamente mais tarde.")
            showIntro()
            break;
        case 504:
            console.log(errorCode, code.response)
            alert("Timeout.")
            showIntro()
            break;
        case 521:
            console.log(errorCode, code.response)
            alert("Erro ao acessar o servidor, tente novamente mais tarde.")
            showIntro()
            break;
        case 523:
            console.log(errorCode, code.response)
            alert("Erro ao acessar o servidor, tente novamente mais tarde.")
            showIntro()
            break;
        case 599:
            console.log(errorCode, code.response)
            alert("Erro ao acessar o servidor, tente novamente mais tarde.")
            showIntro()
            break;
        default:
            alert("Erro desconhecido")
            showIntro()
            break;
    }
}