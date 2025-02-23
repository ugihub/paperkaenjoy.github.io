import {addCSS,renderHTML,onClick} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.3/element.js";
await addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");


await addCSS("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css");
await addCSS("./css/body.css");
await addCSS("./css/header.css");
await addCSS("./css/main.css");

renderHTML('header', 'html/header/home.html', afterHeaderLoad);
renderHTML('main', 'html/main/home.html', afterContentLoad);

function afterHeaderLoad(){
    const burger = document.querySelector("header .burger-menu");
    const menu = document.querySelector("header .menu");
    const closeBtn = document.querySelector("header .close-menu");

    // Buka menu saat burger diklik
    burger.addEventListener("click", function() {
        menu.classList.add("active");
    });

    // Tutup menu saat tombol close diklik
    closeBtn.addEventListener("click", function() {
        menu.classList.remove("active");
    });

    // Tutup menu jika klik di luar menu
    document.addEventListener("click", function(event) {
        if (!menu.contains(event.target) && !burger.contains(event.target)) {
            menu.classList.remove("active");
        }
    });
}

function afterContentLoad() {
    console.log("conten loaded");

}

