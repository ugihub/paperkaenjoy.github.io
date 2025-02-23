import {onClick} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.6/element.js";

export function afterContentLoad() {
    console.log("content loaded");
    initSlider("main", "#prev", "#next");
}

export function initSlider(mainSelector, prevBtnSelector, nextBtnSelector) {
    let currentIndex = 0;
    const main = document.querySelector(mainSelector);
    const slider = main.querySelector(".slider");
    const slides = main.querySelectorAll(".slide");
    const prevButton = document.querySelector(prevBtnSelector);
    const nextButton = document.querySelector(nextBtnSelector);
    let startX = 0;
    let endX = 0;
    let isDragging = false;
    let startPos = 0;

    function showSlide(index) {
        if (index >= slides.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex = index;
        }
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    prevButton.addEventListener("click", prevSlide);
    nextButton.addEventListener("click", nextSlide);
    setInterval(nextSlide, 5000);

    // Swipe functionality for touch devices
    slider.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });
    slider.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].clientX;
        if (startX > endX + 50) {
            nextSlide();
        } else if (startX < endX - 50) {
            prevSlide();
        }
    });

    // Mouse drag functionality
    slider.addEventListener("mousedown", (e) => {
        isDragging = true;
        startPos = e.clientX;
        slider.style.cursor = "grabbing";
    });
    window.addEventListener("mouseup", () => {
        isDragging = false;
        slider.style.cursor = "grab";
    });
    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const moveX = e.clientX - startPos;
        if (moveX > 50) {
            prevSlide();
            isDragging = false;
        } else if (moveX < -50) {
            nextSlide();
            isDragging = false;
        }
    });
}
