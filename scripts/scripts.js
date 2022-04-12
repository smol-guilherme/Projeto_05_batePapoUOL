
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