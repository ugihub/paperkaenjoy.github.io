import {addCSS,renderHTML,onClick,container} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.3/element.js";

await addCSS("./css/img.css")

renderHTML('main', 'html/main/img.html', afterContentLoad);

function afterContentLoad() {
    let video = document.getElementById("myVideo");
    video.setAttribute("autoplay", "true");
    video.muted = true;
    video.play(); // Memaksa video untuk diputar
    onClick('unmuteButton', toggleMute);
}

function toggleMute(button) {
    console.log("Tombol diklik!");
    let video = document.getElementById("myVideo");
    video.muted = !video.muted;
    button.textContent = video.muted ? "Unmute" : "Mute";
}