document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Filter Toggle for Mobile
    const filterToggle = document.getElementById('filterToggle');
    const filterSidebar = document.getElementById('filterSidebar');

    if (filterToggle && filterSidebar) {
        filterToggle.addEventListener('click', function () {
            filterSidebar.classList.toggle('hidden');
            filterSidebar.classList.toggle('lg:block');
        });
    }

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
        searchButton.addEventListener('click', function() {
            filters.search = searchInput.value.toLowerCase();
            applyFilters();
        });

        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filters.search = searchInput.value.toLowerCase();
                applyFilters();
            }
        });
    }

    if (sortSelect) {
        // Sort functionality
        sortSelect.addEventListener('change', function() {
            filters.sort = this.value;
            applyFilters();
        });
    }

    // Category filters
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            filters.categories = Array.from(categoryFilters)
                .filter(f => f.checked)
                .map(f => f.value);
            applyFilters();
        });
    });

    // Price range filters
    priceFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            filters.priceRange = this.checked ? this.value : '';
            applyFilters();
        });
    });

    // Rating filters
    ratingFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            filters.rating = this.checked ? this.value.replace('+', '') : '';
            applyFilters();
        });
    });

    // Clear all filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
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

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = this.dataset.price;
            const productImage = this.dataset.image;

            // Create product object
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };

            // Add to cart (using existing cart functionality from script.js)
            if (typeof addToCart === 'function') {
                addToCart(product);
            } else {
                // Fallback if addToCart function is not available
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                
                // Check if product already exists in cart
                const existingProductIndex = cart.findIndex(item => item.id === product.id);
                
                if (existingProductIndex > -1) {
                    // Increment quantity if product already exists
                    cart[existingProductIndex].quantity += 1;
                } else {
                    // Add new product to cart
                    cart.push(product);
                }
                
                // Save cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Update cart count
                const cartCountElement = document.querySelector('.cart-count');
                if (cartCountElement) {
                    cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
                }
                
                // Show confirmation message
                alert(`${productName} added to cart!`);
            }
        });
    });

    // Initialize filters on page load
    applyFilters();
});