import {onClick,container} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.3/element.js";


export function afterHeaderLoad(){
    console.log("header loader");
    onClick('burger-menu',openMobileMenu);
    onClick('close-btn',closeMobileMenu);
}

function openMobileMenu(element){
    container('mobileMenu').style.display = "block";
}
function closeMobileMenu(element){
    container('mobileMenu').style.display = "none";
}