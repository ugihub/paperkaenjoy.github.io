export function afterPreviewLoad(){
    console.log("preview loaded");
    initSlider();
}

export function initSlider() {
    const slider = document.querySelector('.preview .slider');
    if (!slider) {
        console.error('Slider tidak ditemukan');
        return;
    }
    
    const slides = document.querySelectorAll('.preview .slide');
    const dots = document.querySelectorAll('.preview .dot');
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    

    function getSlidesPerView() {
        const containerWidth = slider.parentElement.clientWidth;
        

        if (containerWidth <= 768) {
            return 1;
        } else if (containerWidth <= 1024) {
            return 2;
        } else {
            return 3;
        }
    }
    
    let slidesPerView = getSlidesPerView();
    
    function showSlide(index) {

        if (index < 0) {
            index = 0;
        }
        
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        if (index > maxIndex) {
            index = maxIndex;
        }
        
        currentIndex = index;
        

        let slideWidth;
        let gapWidth = 0;
        
        if (slidesPerView === 1) {

            slideWidth = slider.parentElement.clientWidth - 40; 
            slideWidth = slideWidth + 40;
        } else {
            const containerWidth = slider.parentElement.clientWidth;
            const totalGapWidth = 20 * (slidesPerView - 1); 
            slideWidth = (containerWidth - totalGapWidth) / slidesPerView;
            gapWidth = 20;
        }
        
        // Hitung total pergeseran
        currentTranslate = -index * slideWidth;
        prevTranslate = currentTranslate;
        
        setSliderPosition();
        updateDots();
    }
    
    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function touchStart(index) {
        return function(event) {
            isDragging = true;
            startPos = getPositionX(event);
            animationID = requestAnimationFrame(animation);
            slider.style.cursor = 'grabbing';
        };
    }
    
    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        slider.style.cursor = 'grab';
        
        const movedBy = currentTranslate - prevTranslate;
        
        // Jika pergeseran cukup besar
        if (Math.abs(movedBy) > 50) {
            if (movedBy < 0 && currentIndex < slides.length - slidesPerView) {
                currentIndex += 1;
            }
            if (movedBy > 0 && currentIndex > 0) {
                currentIndex -= 1;
            }
        }
        
        showSlide(currentIndex);
    }
    
    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
            setSliderPosition();
        }
    }
    
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const oldSlidesPerView = slidesPerView;
        slidesPerView = getSlidesPerView();
        

        if (oldSlidesPerView !== slidesPerView) {

            if (slidesPerView > oldSlidesPerView) {

                showSlide(currentIndex);
            } else {
                showSlide(Math.min(currentIndex, slides.length - slidesPerView));
            }
        } else {
            showSlide(currentIndex);
        }
    });
    
    slides.forEach((slide, index) => {
        const slideImage = slide.querySelector('img');
        if (slideImage) {
            slideImage.addEventListener('dragstart', (e) => e.preventDefault());
        }
        
        slide.addEventListener('touchstart', touchStart(index));
        slide.addEventListener('touchend', touchEnd);
        slide.addEventListener('touchmove', touchMove);
        slide.addEventListener('mousedown', touchStart(index));
        slide.addEventListener('mouseup', touchEnd);
        slide.addEventListener('mousemove', touchMove);
        slide.addEventListener('mouseleave', touchEnd);
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    showSlide(0);
}