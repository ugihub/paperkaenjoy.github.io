// Age Verification
document.addEventListener('DOMContentLoaded', function () {
    const ageVerification = document.getElementById('ageVerification');
    const verifyButton = document.getElementById('verifyAge');
    const exitButton = document.getElementById('exitSite');

    // Check if age has been verified (using localStorage)
    if (!localStorage.getItem('ageVerified')) {
        ageVerification.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    verifyButton.addEventListener('click', function () {
        localStorage.setItem('ageVerified', 'true');
        ageVerification.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    exitButton.addEventListener('click', function () {
        window.location.href = 'https://www.google.com';
    });

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Product Carousel
    const productTrack = document.getElementById('productTrack');
    const productSlides = document.querySelectorAll('.product-slide');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselDots = document.getElementById('carouselDots');

    let currentSlide = 0;
    const slideCount = productSlides.length;

    // Create dots
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        carouselDots.appendChild(dot);
    }

    // Update carousel position
    function updateCarousel() {
        const slideWidth = productSlides[0].offsetWidth;
        productTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

        // Update dots
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Go to specific slide
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }

    // Next slide
    function nextSlide() {
        if (currentSlide < slideCount - 1) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        updateCarousel();
    }

    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = slideCount - 1;
        }
        updateCarousel();
    }

    // Event listeners
    carouselNext.addEventListener('click', nextSlide);
    carouselPrev.addEventListener('click', prevSlide);

    // Auto-advance carousel (optional)
    let autoSlideInterval = setInterval(nextSlide, 5000);

    // Pause auto-slide on hover
    const carouselContainer = document.querySelector('.product-carousel');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });

    // Handle window resize
    window.addEventListener('resize', updateCarousel);

    // Initialize carousel
    updateCarousel();

    // Add animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .testimonial-card').forEach(card => {
        observer.observe(card);
    });

    // Testimonial carousel pause functionality
    const testimonialContainer = document.querySelector('.testimonial-container');
    let isPaused = false;

    // Pause on click
    testimonialContainer.addEventListener('click', function () {
        isPaused = !isPaused;
        if (isPaused) {
            testimonialContainer.classList.add('paused');
        } else {
            testimonialContainer.classList.remove('paused');
        }
    });

    // Hover functionality is handled by CSS
});

document.addEventListener('DOMContentLoaded', function () {
    const viewCartBtn = document.getElementById('viewCartBtn');
    const cartModal = document.getElementById('cartModal');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCountElement = document.querySelector('.cart-count');
    const itemCountElement = document.querySelector('.item-count');

    // Cart data structure
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Toggle modal visibility
    viewCartBtn.addEventListener('click', () => {
        cartModal.style.transform = 'translateX(0)';
    });

    // Close modal
    document.querySelector('.close-btn').addEventListener('click', () => {
        cartModal.style.transform = 'translateX(100%)';
    });

    // Initialize cart from localStorage
    function initCart() {
        updateCartDisplay();
        updateCartCount();
    }

    // Add product to cart
    function addToCart(product) {
        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => item.id === product.id);

        if (existingProductIndex > -1) {
            // Increment quantity if product already in cart
            cart[existingProductIndex].quantity += 1;
        } else {
            // Add new product to cart
            cart.push({
                ...product,
                quantity: 1
            });
        }

        // Save to localStorage
        saveCart();
        updateCartDisplay();
        updateCartCount();
    }

    // Remove product from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartDisplay();
        updateCartCount();
    }

    // Update product quantity
    function updateProductQuantity(productId, newQuantity) {
        const productIndex = cart.findIndex(item => item.id === productId);

        if (productIndex > -1) {
            if (newQuantity <= 0) {
                // Remove product if quantity is 0 or less
                removeFromCart(productId);
            } else {
                // Update quantity
                cart[productIndex].quantity = newQuantity;
                saveCart();
                updateCartTotal();
            }
        }
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update cart display
    function updateCartDisplay() {
        // Clear current cart display
        cartItemsContainer.innerHTML = '';

        // Check if cart is empty
        if (cart.length === 0) {
            // Show empty cart message
            const emptyCartHTML = `
                <div class="empty-cart-container" id="emptyCartContainer">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart fa-4x text-gray-300"></i>
                    </div>
                    <h3 class="empty-cart-title">Keranjang Anda kosong</h3>
                    <p class="empty-cart-message">Anda belum menambahkan produk apapun ke keranjang.</p>
                    <a href="#products" class="btn btn-primary px-6 py-2 rounded mt-4 empty-cart-button" id="browseProductsBtn">
                        <i class="fas fa-shopping-bag mr-2"></i>Jelajahi Produk
                    </a>
                </div>
            `;
            cartItemsContainer.innerHTML = emptyCartHTML;

            // Update total to zero
            document.querySelector('.total-price').textContent = '$0.00';

            // Hide the cart footer button when cart is empty
            document.getElementById('cartFooter').style.display = 'none';

            // Add event listener to browse products button to close the cart modal
            setTimeout(() => {
                const browseProductsBtn = document.getElementById('browseProductsBtn');
                if (browseProductsBtn) {
                    browseProductsBtn.addEventListener('click', () => {
                        cartModal.style.transform = 'translateX(100%)';
                    });
                }
            }, 100);

            return;
        }

        // Add each item to cart display
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.dataset.id = item.id;

            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease"><i class="fas fa-minus"></i></button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase"><i class="fas fa-plus"></i></button>
                    </div>
                    <p class="price">$${item.price}</p>
                </div>
            `;

            cartItemsContainer.appendChild(cartItemElement);
        });

        // Add event listeners to quantity buttons
        addQuantityControlListeners();

        // Update total
        updateCartTotal();

        // Show the cart footer button when cart has items
        document.getElementById('cartFooter').style.display = 'block';
    }

    // Add event listeners to quantity control buttons
    function addQuantityControlListeners() {
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function () {
                const cartItem = this.closest('.cart-item');
                const productId = cartItem.dataset.id;
                const quantityValue = this.parentElement.querySelector('.quantity-value');
                let quantity = parseInt(quantityValue.textContent);

                if (this.classList.contains('increase')) {
                    quantity++;
                } else if (this.classList.contains('decrease')) {
                    quantity--;
                }

                updateProductQuantity(productId, quantity);

                if (quantity > 0) {
                    quantityValue.textContent = quantity;
                }
            });
        });
    }

    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        itemCountElement.textContent = totalItems;
    }

    // Function to update cart total
    function updateCartTotal() {
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });

        document.querySelector('.total-price').textContent = '$' + total.toFixed(2);
    }

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        if (button.textContent.trim() === 'Add to Cart') {
            button.addEventListener('click', function () {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = parseFloat(productCard.querySelector('.text-lg').textContent.replace('$', ''));
                const productImage = productCard.querySelector('img').src;

                const product = {
                    id: productName.replace(/\s+/g, '-').toLowerCase(),
                    name: productName,
                    price: productPrice,
                    image: productImage
                };

                addToCart(product);
            });
        }
    });

    // Initialize cart on page load
    initCart();

    // Products Filtering and Searching
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const sortSelect = document.getElementById('sortSelect');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const productsGrid = document.getElementById('productsGrid');
    const productsCount = document.getElementById('productsCount');
    const productCards = document.querySelectorAll('.product-card');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const priceFilters = document.querySelectorAll('.price-filter');
    const ratingFilters = document.querySelectorAll('.rating-filter');

    // Current filter state
    let filters = {
        search: '',
        categories: [],
        priceRange: '',
        rating: '',
        sort: 'featured'
    };

    // Apply filters and update product display
    function applyFilters() {
        let visibleCount = 0;

        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productDesc = card.querySelector('p').textContent.toLowerCase();
            const productCategory = card.dataset.category;
            const productPrice = parseFloat(card.dataset.price);
            const productRating = parseFloat(card.dataset.rating);

            // Search filter
            const matchesSearch = filters.search === '' ||
                productName.includes(filters.search) ||
                productDesc.includes(filters.search);

            // Category filter
            const matchesCategory = filters.categories.length === 0 ||
                filters.categories.includes(productCategory);

            // Price range filter
            let matchesPrice = true;
            if (filters.priceRange) {
                const [min, max] = filters.priceRange.split('-').map(val => val === '+' ? Infinity : parseFloat(val));
                matchesPrice = productPrice >= min && (max === Infinity || productPrice <= max);
            }

            // Rating filter
            let matchesRating = true;
            if (filters.rating) {
                const minRating = parseFloat(filters.rating);
                matchesRating = productRating >= minRating;
            }

            // Show/hide product based on filters
            const shouldShow = matchesSearch && matchesCategory && matchesPrice && matchesRating;
            card.classList.toggle('hidden', !shouldShow);

            if (shouldShow) {
                visibleCount++;
            }
        });

        // Update products count
        productsCount.textContent = `Showing ${visibleCount} product${visibleCount !== 1 ? 's' : ''}`;

        // Apply sorting
        sortProducts(filters.sort);
    }

    // Sort products
    function sortProducts(sortBy) {
        const products = Array.from(productCards);
        const visibleProducts = products.filter(product => !product.classList.contains('hidden'));

        visibleProducts.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            const ratingA = parseFloat(a.dataset.rating);
            const ratingB = parseFloat(b.dataset.rating);

            switch (sortBy) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'rating':
                    return ratingB - ratingA;
                case 'newest':
                    // For demo purposes, we'll just use a random sort for "newest"
                    return 0.5 - Math.random();
                default: // featured
                    return 0; // Keep original order
            }
        });

        // Reorder products in the DOM
        const parent = productsGrid;
        visibleProducts.forEach(product => {
            parent.appendChild(product);
        });
    }

    // Event listeners
    if (searchInput && searchButton) {
        // Search functionality
        searchButton.addEventListener('click', function () {
            filters.search = searchInput.value.toLowerCase();
            applyFilters();
        });

        searchInput.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
                filters.search = searchInput.value.toLowerCase();
                applyFilters();
            }
        });
    }

    if (sortSelect) {
        // Sort functionality
        sortSelect.addEventListener('change', function () {
            filters.sort = this.value;
            applyFilters();
        });
    }

    // Category filters
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', function () {
            filters.categories = Array.from(categoryFilters)
                .filter(f => f.checked)
                .map(f => f.value);
            applyFilters();
        });
    });

    // Price range filters
    priceFilters.forEach(filter => {
        filter.addEventListener('change', function () {
            filters.priceRange = this.checked ? this.value : '';
            applyFilters();
        });
    });

    // Rating filters
    ratingFilters.forEach(filter => {
        filter.addEventListener('change', function () {
            filters.rating = this.checked ? this.value.replace('+', '') : '';
            applyFilters();
        });
    });

    // Clear all filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function () {
            // Reset all filter inputs
            searchInput.value = '';
            categoryFilters.forEach(f => f.checked = false);
            priceFilters.forEach(f => f.checked = false);
            ratingFilters.forEach(f => f.checked = false);
            sortSelect.value = 'featured';

            // Reset filter state
            filters = {
                search: '',
                categories: [],
                priceRange: '',
                rating: '',
                sort: 'featured'
            };

            applyFilters();
        });
    }
});