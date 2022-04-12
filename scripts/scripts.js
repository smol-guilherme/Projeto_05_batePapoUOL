
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
        <span class="msg-data">oianude</span>
    </div>`
}