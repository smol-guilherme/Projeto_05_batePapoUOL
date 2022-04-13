const API_URL = "https://mock-api.driven.com.br/api/v6/uol/"
let loginToken = 0;
let currentUser = {
    name: ""
}

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


// PROVAVELMENTE DA PRA USAR UM MÉTODO SÓ E ELE PEGA O TIPO DA MSG OU POR SWITCH-CASE
// OU PELA STRING DA RESPOSTA MSM, ISSO AQUI É TEMPORÁRIO, MAS WAIFUS SÃO ETERNAS
function writeSystemMsg(response) {
    const msgBox = document.querySelector(".message-area")
    // adicionar espaço na resposta do servidor na hora de colocar no template string
    msgBox.innerHTML += `
    <div class="system messages">
        <span class="system">(oiahora)</span>
        <span class="user-context">oionome</span>
        <span>entrou na sala</span>
    </div>`
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

function writeGlobalMsg(response) {
    const msgBox = document.querySelector(".message-area")
    // adicionar espaço na resposta do servidor na hora de colocar no template string
    msgBox.innerHTML += `
    <div class="global messages">
        <span class="system">(oiahora)</span>
        <span class="user-context">oionome</span>
        <span>para</span>
        <span class="user-context">oiofulano:</span>
        <span class="msg-data">oiatrova</span>
    </div>`
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

function userLogin() {
    hideIntro()
    loginToken = setInterval(serverHandshake, 4000);
}

function serverHandshake() {
    const promise = axios.post(API_URL+"status", currentUser)
    promise.then(console.log('ok'))
    promise.catch(errorHandle)
}

function errorHandle(code) {
    const errorCode = code.response.status;
    switch (errorCode) {
        case 400:
            console.log(errorCode, code.response)
            alert("Usuário já existe, escolha outro nome.")
            showIntro()
            break;
        case 498:
            console.log(errorCode, code.response)
            clearInterval(loginToken)
            alert("Login expirado, faça um novo login")
            showIntro()
            break;
        case 500:
            console.log(errorCode, code.response)
            clearInterval(loginToken)
            alert("Erro ao acessar o servidor, tente novamente mais tarde.")
            showIntro()
            break;
        case 502:
            console.log(errorCode, code.response)
            clearInterval(loginToken)
            alert("Erro ao acessar o servidor, tente novamente mais tarde.")
            showIntro()
            break;
        case 503:
            console.log(errorCode, code.response)
            clearInterval(loginToken)
            alert("Serviço indisponível, tente novamente mais tarde.")
            showIntro()
            break;
        case 504:
            console.log(errorCode, code.response)
            clearInterval(loginToken)
            alert("Timeout.")
            showIntro()
            break;
        case 521:
            console.log(errorCode, code.response)
            clearInterval(loginToken)
            alert("Erro ao acessar o servidor, tente novamente mais tarde.")
            showIntro()
            break;
        case 523:
            console.log(errorCode, code.response)
            clearInterval(loginToken)
            alert("Erro ao acessar o servidor, tente novamente mais tarde.")
            showIntro()
            break;
        case 599:
            console.log(errorCode, code.response)
            clearInterval(loginToken)
            alert("Erro ao acessar o servidor, tente novamente mais tarde.")
            showIntro()
            break;
        default:
            alert("Erro desconhecido")
            showIntro()
            break;
    }
}