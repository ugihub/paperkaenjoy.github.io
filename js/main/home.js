import {onClick} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.6/element.js";

export function afterContentLoad() {
    console.log("content loaded");
    initSlider();
}

export function initSlider() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;

    // Fungsi untuk memperbarui slide
    function showSlide(index) {
        currentIndex = index;
        currentTranslate = -currentIndex * window.innerWidth;
        prevTranslate = currentTranslate;
        setSliderPosition();
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    // Fungsi untuk mengatur posisi slider
    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Menambahkan event listener untuk setiap slide
    slides.forEach((slide, index) => {
        const slideImage = slide.querySelector('img');
        slideImage.addEventListener('dragstart', (e) => e.preventDefault());

        // Touch events
        slide.addEventListener('touchstart', touchStart(index));
        slide.addEventListener('touchend', touchEnd);
        slide.addEventListener('touchmove', touchMove);

        // Mouse events
        slide.addEventListener('mousedown', touchStart(index));
        slide.addEventListener('mouseup', touchEnd);
        slide.addEventListener('mousemove', touchMove);
        slide.addEventListener('mouseleave', touchEnd);
    });

    // Fungsi ketika touch atau mouse mulai
    function touchStart(index) {
        return function (event) {
            isDragging = true;
            startPos = getPositionX(event);
            animationID = requestAnimationFrame(animation);
            currentIndex = index;
        };
    }

    // Fungsi ketika touch atau mouse berhenti
    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;
        if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

        showSlide(currentIndex);
    }

    // Fungsi ketika touch atau mouse bergerak
    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
            setSliderPosition();
        }
    }

    // Mendapatkan posisi X dari touch atau mouse
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    // Animasi agar pergerakan terasa smooth
    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    // Auto-slide (opsional)
    setInterval(() => {
        if (!isDragging) {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }
    }, 5000);

}
