import {addCSS,renderHTML} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.3/element.js";
await addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");


await addCSS("./css/main.css")

renderHTML('content', 'html/home.html', afterContentLoad);

function afterContentLoad() {
    let video = document.getElementById("myVideo");
    video.setAttribute("controls", "true");
    video.setAttribute("autoplay", "true");
    video.muted = true;
    video.play(); // Memaksa video untuk diputar
}

