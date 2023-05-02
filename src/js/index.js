let button = document.querySelector(".menu_toggle");

function toggleMenu(ev) {
    document.querySelector(".nav").classList.toggle("active");
    document.querySelector(".menu_toggle").classList.toggle("active");
};
button.addEventListener("click", toggleMenu);