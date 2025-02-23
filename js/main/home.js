import {onClick} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.6/element.js";

let currentIndex = 0;
const slides = document.querySelectorAll("main .slide");

export function afterContentLoad() {
    console.log("content loaded");
    onClick('prevSlide',prevSlide);
    onClick('nextSlide',nextSlide);
    setInterval(nextSlide, 5000);
}

function showSlide(index) {
    if (index >= slides.length) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = slides.length - 1;
    } else {
        currentIndex = index;
    }
    document.querySelector("main .slider").style.transform = `translateX(-${currentIndex * 100}%)`;
}

function nextSlide() {
    showSlide(currentIndex + 1);
}
function prevSlide() {
    showSlide(currentIndex - 1);
}