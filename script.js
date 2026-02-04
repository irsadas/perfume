document.addEventListener('DOMContentLoaded', () => {
    
    // --- Intersection Observer for Fade-in Animations ---
    const observerOptions = { threshold: 0.1 };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply to static product cards (Masterpiece Collection)
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        observer.observe(card);
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Product Data (Main Collection) ---
    const products = [
        { name: "Velvet Santal", price: 145.00, category: "unisex", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop" },
        { name: "Ocean Mist", price: 130.00, category: "men", image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=800&auto=format&fit=crop" },
        { name: "Midnight Oud", price: 195.00, category: "men", image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=800&auto=format&fit=crop" },
        { name: "Amber Whisper", price: 175.00, category: "women", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop" },
        { name: "Citrus Grove", price: 120.00, category: "unisex", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop" },
        { name: "Leather & Smoke", price: 220.00, category: "men", image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=800&auto=format&fit=crop" },
        { name: "Vanilla Dreams", price: 150.00, category: "women", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop" },
        { name: "Spiced Cardamom", price: 160.00, category: "unisex", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop" },
        { name: "Jasmine Breeze", price: 140.00, category: "women", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop" },
        { name: "Royal Patchouli", price: 190.00, category: "men", image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=800&auto=format&fit=crop" },
        { name: "Cedarwood Intense", price: 180.00, category: "men", image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=800&auto=format&fit=crop" },
        { name: "Lavender Fields", price: 135.00, category: "women", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop" }
    ];

    // --- Wishlist Logic ---
    class Wishlist {
        constructor() {
            this.items = JSON.parse(localStorage.getItem('scent_wishlist')) || [];
        }

        toggle(product) {
            const index = this.items.findIndex(item => item.name === product.name);
            if (index > -1) {
                this.items.splice(index, 1);
            } else {
                this.items.push(product);
            }
            localStorage.setItem('scent_wishlist', JSON.stringify(this.items));
            this.updateUI();
            this.renderWishlist();
        }

        exists(name) {
            return this.items.some(item => item.name === name);
        }

        clear() {
            this.items = [];
            localStorage.removeItem('scent_wishlist');
            this.updateUI();
            this.renderWishlist();
        }

        updateUI() {
            document.querySelectorAll('.product-card').forEach(card => {
                const name = card.querySelector('h3').innerText;
                const btn = card.querySelector('.wishlist-btn');
                if (btn) {
                    const isActive = this.exists(name);
                    btn.classList.toggle('active', isActive);
                    btn.innerHTML = isActive ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
                }
            });
        }

        renderWishlist() {
            const grid = document.getElementById('wishlist-grid');
            const emptyMsg = document.getElementById('empty-wishlist-msg');
            const controls = document.getElementById('wishlist-controls');
            
            if (!grid) return;

            grid.innerHTML = '';
            
            if (this.items.length === 0) {
                if (emptyMsg) emptyMsg.style.display = 'block';
                if (controls) controls.style.display = 'none';
                return;
            }
            
            if (emptyMsg) emptyMsg.style.display = 'none';
            if (controls) controls.style.display = 'flex';

            this.items.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('product-card');
                
                const urlName = encodeURIComponent(product.name);
                const urlImg = encodeURIComponent(product.image);
                const productUrl = `product.html?name=${urlName}&price=${product.price.toFixed(2)}&img=${urlImg}`;

                card.innerHTML = `
                    <div class="card-image-wrapper">
                        <a href="${productUrl}"><img src="${product.image}" alt="${product.name}"></a>
                        <button class="wishlist-btn active" aria-label="Remove from Wishlist"><i class="fa-solid fa-heart"></i></button>
                        <button class="quick-add-btn add-to-cart">Quick Add</button>
                    </div>
                    <div class="card-details">
                        <a href="${productUrl}"><h3>${product.name}</h3></a>
                        <span class="price">$${product.price.toFixed(2)}</span>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    }
    const wishlist = new Wishlist();

    // --- Recently Viewed Logic ---
    function addToRecentlyViewed(product) {
        let recent = JSON.parse(localStorage.getItem('scent_recent')) || [];
        // Remove if exists (to move to top)
        recent = recent.filter(item => item.name !== product.name);
        // Add to front
        recent.unshift(product);
        // Limit to 4 items
        if (recent.length > 4) recent.pop();
        localStorage.setItem('scent_recent', JSON.stringify(recent));
    }

    function renderRecentlyViewed() {
        const recentGrid = document.getElementById('recently-viewed-grid');
        const recentSection = document.getElementById('recently-viewed-section');
        
        if (!recentGrid) return;

        let recent = JSON.parse(localStorage.getItem('scent_recent')) || [];
        
        // Exclude current product if on product page
        const params = new URLSearchParams(window.location.search);
        const currentName = params.get('name');
        if (currentName) {
            recent = recent.filter(item => item.name !== currentName);
        }

        if (recent.length === 0) {
            if (recentSection) recentSection.style.display = 'none';
            return;
        }

        recentGrid.innerHTML = '';
        recent.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            
            // Animation Init
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            observer.observe(card);

            const urlName = encodeURIComponent(product.name);
            const urlImg = encodeURIComponent(product.image);
            const productUrl = `product.html?name=${urlName}&price=${product.price.toFixed(2)}&img=${urlImg}`;

            const isWishlisted = wishlist.exists(product.name);

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <a href="${productUrl}">
                        <img src="${product.image}" alt="${product.name}">
                    </a>
                    <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" aria-label="Add to Wishlist"><i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i></button>
                    <button class="quick-add-btn add-to-cart">Quick Add</button>
                </div>
                <div class="card-details">
                    <a href="${productUrl}">
                        <h3>${product.name}</h3>
                    </a>
                    <span class="price">$${product.price.toFixed(2)}</span>
                </div>
            `;
            recentGrid.appendChild(card);
        });
    }

    // --- Unified Filter, Sort & Pagination Logic ---
    const itemsPerPage = 12;
    let currentPage = 1;

    // Elements
    const searchIcon = document.querySelector('.fa-magnifying-glass');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearchBtn = document.querySelector('.close-search');
    const searchInput = document.querySelector('.search-input');
    const sortSelect = document.getElementById('sort-select');
    const productGrid = document.querySelector('#collection .product-grid');
    const filterCheckboxes = document.querySelectorAll('input[name="category"]');
    const paginationContainer = document.querySelector('.pagination-container');

    // Main Render Function
    function renderProducts() {
        if (!productGrid) return;

        const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategories = Array.from(filterCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        // 1. Filter
        let filteredProducts = products.filter(product => {
            const title = product.name.toLowerCase();
            const category = product.category;
            
            const matchesSearch = title.includes(searchQuery);
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(category);

            return matchesSearch && matchesCategory;
        });

        // 2. Sort
        if (sortSelect) {
            const sortValue = sortSelect.value;
            if (sortValue === 'price-asc') {
                filteredProducts.sort((a, b) => a.price - b.price);
            } else if (sortValue === 'price-desc') {
                filteredProducts.sort((a, b) => b.price - a.price);
            }
        }

        // 3. Paginate
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        
        // Reset to page 1 if current page is out of bounds (unless it's 0)
        if (currentPage > totalPages) currentPage = 1;
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);

        // 4. Render HTML
        productGrid.innerHTML = '';
        
        productsToShow.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.setAttribute('data-category', product.category);
            
            // Animation Init
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            observer.observe(card);

            // Encode URL parameters
            const urlName = encodeURIComponent(product.name);
            const urlImg = encodeURIComponent(product.image);
            const productUrl = `product.html?name=${urlName}&price=${product.price.toFixed(2)}&img=${urlImg}`;

            const isWishlisted = wishlist.exists(product.name);

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <a href="${productUrl}">
                        <img src="${product.image}" alt="${product.name}">
                    </a>
                    <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" aria-label="Add to Wishlist"><i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i></button>
                    <button class="quick-add-btn add-to-cart">Quick Add</button>
                </div>
                <div class="card-details">
                    <a href="${productUrl}">
                        <h3>${product.name}</h3>
                    </a>
                    <span class="price">$${product.price.toFixed(2)}</span>
                </div>
            `;
            productGrid.appendChild(card);
        });

        // 5. Render Pagination
        renderPaginationControls(totalPages);
    }

    // --- Related Products (Product Detail Page) ---
    const relatedGrid = document.getElementById('related-products');
    if (relatedGrid) {
        // Display first 3 products as recommendations
        const relatedProducts = products.slice(0, 3);
        
        relatedProducts.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            
            // Animation Init
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            observer.observe(card);

            const urlName = encodeURIComponent(product.name);
            const urlImg = encodeURIComponent(product.image);
            const productUrl = `product.html?name=${urlName}&price=${product.price.toFixed(2)}&img=${urlImg}`;

            const isWishlisted = wishlist.exists(product.name);

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <a href="${productUrl}">
                        <img src="${product.image}" alt="${product.name}">
                    </a>
                    <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" aria-label="Add to Wishlist"><i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i></button>
                    <button class="quick-add-btn add-to-cart">Quick Add</button>
                </div>
                <div class="card-details">
                    <a href="${productUrl}">
                        <h3>${product.name}</h3>
                    </a>
                    <span class="price">$${product.price.toFixed(2)}</span>
                </div>
            `;
            relatedGrid.appendChild(card);
        });
    }

    function renderPaginationControls(totalPages) {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.innerText = i;
            btn.classList.add('page-btn');
            if (i === currentPage) btn.classList.add('active');
            
            btn.addEventListener('click', () => {
                currentPage = i;
                renderProducts();
                // Scroll to top of grid
                document.getElementById('collection').scrollIntoView({ behavior: 'smooth' });
            });
            
            paginationContainer.appendChild(btn);
        }
    }

    // Event Listeners
    if (searchIcon && searchOverlay && closeSearchBtn && searchInput) {
        // Open Search
        searchIcon.parentElement.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchInput.focus();
        });

        // Close Search
        closeSearchBtn.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
            currentPage = 1;
            renderProducts();
        });

        // Search Input
        searchInput.addEventListener('input', (e) => {
            currentPage = 1;
            renderProducts();
        });
    }

    if (sortSelect && productGrid) {
        sortSelect.addEventListener('change', () => {
            currentPage = 1;
            renderProducts();
        });
    }

    if (filterCheckboxes.length > 0) {
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                currentPage = 1;
                renderProducts();
            });
        });
    }

    // Initial Render
    renderProducts();
    
    // Initial Wishlist UI Update (for static items)
    wishlist.updateUI();
    wishlist.renderWishlist();

    // --- Shopping Cart Class ---
    class ShoppingCart {
        constructor() {
            this.cart = JSON.parse(localStorage.getItem('scent_cart')) || [];
            this.cartOverlay = document.querySelector('.cart-overlay');
            this.cartItemsContainer = document.querySelector('.cart-items');
            this.cartTotalElement = document.querySelector('.total-price');
            this.cartCountElement = document.querySelector('.cart-count');
            this.checkoutItemsList = null;
            
            this.init();
        }

        init() {
            // Event Listeners for Cart UI
            const cartIcon = document.querySelector('.cart-icon');
            const closeCartBtn = document.querySelector('.close-cart');

            if (cartIcon) cartIcon.addEventListener('click', () => this.toggleCart());
            if (closeCartBtn) closeCartBtn.addEventListener('click', () => this.toggleCart());
            if (this.cartOverlay) {
                this.cartOverlay.addEventListener('click', (e) => {
                    if (e.target === this.cartOverlay) this.toggleCart();
                });
            }

            // Initialize Checkout if present
            this.initCheckout();
            
            // Initial UI Update
            this.updateCartUI();
        }

        toggleCart() {
            if (this.cartOverlay) this.cartOverlay.classList.toggle('open');
        }

        addItem(product) {
            this.cart.push(product);
            this.save();
            this.updateCartUI();
            if (this.cartOverlay && !this.cartOverlay.classList.contains('open')) {
                this.toggleCart();
            }
        }

        removeItem(index) {
            this.cart.splice(index, 1);
            this.save();
            this.updateCartUI();
        }

        save() {
            localStorage.setItem('scent_cart', JSON.stringify(this.cart));
        }

        updateCartUI() {
            // Update Header Count
            if (this.cartCountElement) this.cartCountElement.innerText = this.cart.length;
            
            // Calculate Total
            const total = this.cart.reduce((acc, item) => acc + item.price, 0);
            
            // Update Overlay Total
            if (this.cartTotalElement) this.cartTotalElement.innerText = '$' + total.toFixed(2);

            // Render Overlay Items
            if (this.cartItemsContainer) {
                this.cartItemsContainer.innerHTML = '';
                if (this.cart.length === 0) {
                    this.cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your bag is currently empty.</p>';
                } else {
                    this.cart.forEach((item, index) => {
                        const cartItem = document.createElement('div');
                        cartItem.classList.add('cart-item');
                        cartItem.innerHTML = `
                            <img src="${item.imageSrc}" alt="${item.title}">
                            <div class="cart-item-details">
                                <h4>${item.title}</h4>
                                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                                <button class="remove-item" data-index="${index}">Remove</button>
                            </div>
                        `;
                        this.cartItemsContainer.appendChild(cartItem);
                    });

                    this.cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const index = parseInt(e.target.getAttribute('data-index'));
                            this.removeItem(index);
                        });
                    });
                }
            }

            // Update Checkout UI if active
            this.renderCheckoutItems();
        }

        initCheckout() {
            const checkoutContainer = document.querySelector('.checkout-container');
            if (checkoutContainer) {
                const summaryContainer = document.querySelector('.order-summary');
                
                // Create Items Container
                this.checkoutItemsList = document.createElement('div');
                this.checkoutItemsList.style.marginBottom = '20px';
                this.checkoutItemsList.style.borderBottom = '1px solid #333';
                this.checkoutItemsList.style.paddingBottom = '20px';
                
                const summaryTitle = summaryContainer.querySelector('h2');
                summaryTitle.insertAdjacentElement('afterend', this.checkoutItemsList);

                // Handle Form Submission
                const checkoutForm = checkoutContainer.querySelector('form');
                checkoutForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    if (this.cart.length === 0) {
                        alert("Your cart is empty.");
                        return;
                    }

                    const submitBtn = checkoutForm.querySelector('button[type="submit"]');
                    submitBtn.innerText = "Processing...";
                    submitBtn.disabled = true;

                    setTimeout(() => {
                        this.cart = [];
                        this.save();
                        window.location.href = 'thankyou.html';
                    }, 2000);
                });
            }
        }

        renderCheckoutItems() {
            if (!this.checkoutItemsList) return;

            this.checkoutItemsList.innerHTML = '';
            let total = 0;

            this.cart.forEach((item, index) => {
                total += item.price;
                const itemRow = document.createElement('div');
                itemRow.style.display = 'flex';
                itemRow.style.justifyContent = 'space-between';
                itemRow.style.alignItems = 'center';
                itemRow.style.marginBottom = '10px';
                itemRow.style.color = '#aaa';
                itemRow.style.fontSize = '0.9rem';
                
                // Animation Init
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                observer.observe(card);

                itemRow.innerHTML = `
                    <span>${item.title}</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>$${item.price.toFixed(2)}</span>
                        <button class="remove-checkout-item" data-index="${index}">Remove</button>
                    </div>
                `;
                this.checkoutItemsList.appendChild(itemRow);
            });

            // Update Totals in Summary
            const summaryContainer = document.querySelector('.order-summary');
            if (summaryContainer) {
                const subtotalEl = summaryContainer.querySelectorAll('.summary-item span:last-child');
                if (subtotalEl.length > 0) subtotalEl[0].innerText = '$' + total.toFixed(2);
                
                const totalEl = summaryContainer.querySelector('.summary-total span:last-child');
                if (totalEl) totalEl.innerText = '$' + total.toFixed(2);
            }

            // Bind remove buttons
            this.checkoutItemsList.querySelectorAll('.remove-checkout-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    this.removeItem(index);
                });
            });
        }
    }

    const shoppingCart = new ShoppingCart();

    // --- Quick View Logic ---
    const quickViewOverlay = document.querySelector('.quick-view-overlay');
    const closeQuickViewBtn = document.querySelector('.close-quick-view');
    const quickViewAddBtn = document.querySelector('.quick-view-add-btn');
    const sizeBtns = document.querySelectorAll('.size-btn');
    let quickViewBasePrice = 0;
    
    // Close Modal
    if (closeQuickViewBtn) {
        closeQuickViewBtn.addEventListener('click', () => {
            quickViewOverlay.classList.remove('active');
        });
    }
    
    if (quickViewOverlay) {
        quickViewOverlay.addEventListener('click', (e) => {
            if (e.target === quickViewOverlay) {
                quickViewOverlay.classList.remove('active');
            }
        });
    }

    // Size Selector Logic
    if (sizeBtns.length > 0) {
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update Active State
                sizeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Calculate Price
                const size = btn.dataset.size;
                let newPrice = quickViewBasePrice;
                if (size === '100ml') {
                    newPrice = quickViewBasePrice * 1.5; // 1.5x multiplier for 100ml
                }

                // Update UI and Data
                const priceEl = quickViewOverlay.querySelector('.quick-view-price');
                if (priceEl) priceEl.innerText = '$' + newPrice.toFixed(2);
                if (quickViewAddBtn) quickViewAddBtn.dataset.price = newPrice.toFixed(2);
                if (quickViewAddBtn) quickViewAddBtn.dataset.size = size;
            });
        });
    }

    // --- Size Guide Modal Logic ---
    const sizeGuideLink = document.querySelector('.size-guide-link');
    const sizeGuideOverlay = document.querySelector('.size-guide-overlay');
    const closeSizeGuideBtn = document.querySelector('.close-size-guide');

    if (sizeGuideLink && sizeGuideOverlay) {
        sizeGuideLink.addEventListener('click', (e) => {
            e.preventDefault();
            sizeGuideOverlay.classList.add('active');
        });

        const closeSizeGuide = () => sizeGuideOverlay.classList.remove('active');
        
        if (closeSizeGuideBtn) closeSizeGuideBtn.addEventListener('click', closeSizeGuide);
        
        sizeGuideOverlay.addEventListener('click', (e) => {
            if (e.target === sizeGuideOverlay) closeSizeGuide();
        });
    }

    // Open Modal (Event Delegation)
    document.body.addEventListener('click', (e) => {
        // Target the image link inside the card-image-wrapper
        const imageLink = e.target.closest('.card-image-wrapper a');
        
        if (imageLink && quickViewOverlay) {
            e.preventDefault();
            
            const card = imageLink.closest('.product-card');
            const title = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.price').innerText;
            const imageSrc = card.querySelector('img').src;
            const productUrl = imageLink.getAttribute('href');
            
            // Set Base Price
            quickViewBasePrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            
            // Populate Modal
            const qvImage = quickViewOverlay.querySelector('img');
            const qvSpinner = quickViewOverlay.querySelector('.image-spinner');

            if (qvImage) {
                qvImage.style.opacity = '0';
                if (qvSpinner) qvSpinner.style.display = 'block';

                qvImage.onload = () => {
                    qvImage.style.opacity = '1';
                    if (qvSpinner) qvSpinner.style.display = 'none';
                };

                qvImage.src = imageSrc;
                if (qvImage.complete) qvImage.onload(); // Handle cached images
            }
            
            quickViewOverlay.querySelector('.quick-view-title').innerText = title;
            quickViewOverlay.querySelector('.quick-view-price').innerText = priceText;
            quickViewOverlay.querySelector('.quick-view-full-details').href = productUrl;

            // Reset Size Selector
            sizeBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.size === '50ml') btn.classList.add('active');
            });
            
            // Store data for Add to Cart
            quickViewAddBtn.dataset.title = title;
            quickViewAddBtn.dataset.price = priceText;
            quickViewAddBtn.dataset.image = imageSrc;
            quickViewAddBtn.dataset.size = '50ml';
            
            quickViewOverlay.classList.add('active');

            // --- Populate Related Products ---
            const relatedContainer = quickViewOverlay.querySelector('.related-grid');
            if (relatedContainer) {
                relatedContainer.innerHTML = '';
                
                // Find current product data to determine category
                const currentProductData = products.find(p => p.name === title);
                let relatedItems = [];

                if (currentProductData) {
                    // Filter by same category, exclude current
                    relatedItems = products.filter(p => p.category === currentProductData.category && p.name !== title);
                }
                
                // Fallback: If no category match (e.g. Masterpiece items) or not enough items, fill with randoms
                if (relatedItems.length < 3) {
                    const remaining = products.filter(p => p.name !== title && !relatedItems.includes(p));
                    // Shuffle remaining (simple random sort)
                    remaining.sort(() => 0.5 - Math.random());
                    relatedItems = [...relatedItems, ...remaining];
                }

                // Take top 3
                relatedItems.slice(0, 3).forEach(item => {
                    const div = document.createElement('div');
                    div.classList.add('related-card');
                    div.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <h4>${item.name}</h4>
                        <span class="price">$${item.price.toFixed(2)}</span>
                    `;
                    
                    // Allow clicking related item to update modal
                    div.addEventListener('click', () => {
                        // Update Image with Fade
                        const qvImage = quickViewOverlay.querySelector('.quick-view-image img');
                        qvImage.style.opacity = '0';
                        setTimeout(() => {
                            qvImage.src = item.image;
                            qvImage.onload = () => qvImage.style.opacity = '1';
                        }, 300);

                        // Update Details
                        quickViewOverlay.querySelector('.quick-view-title').innerText = item.name;
                        quickViewOverlay.querySelector('.quick-view-price').innerText = '$' + item.price.toFixed(2);
                        
                        // Update Add Button Data
                        quickViewAddBtn.dataset.title = item.name;
                        quickViewAddBtn.dataset.price = item.price.toFixed(2);
                        quickViewAddBtn.dataset.image = item.image;
                    });

                    relatedContainer.appendChild(div);
                });
            }
        }
    });

    // Handle Quick View Add to Cart
    if (quickViewAddBtn) {
        quickViewAddBtn.addEventListener('click', () => {
            let title = quickViewAddBtn.dataset.title;
            const priceText = quickViewAddBtn.dataset.price;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            const imageSrc = quickViewAddBtn.dataset.image;
            const size = quickViewAddBtn.dataset.size || '50ml';
            
            shoppingCart.addItem({ title: `${title} (${size})`, price, imageSrc });
            
            // Feedback
            const originalText = quickViewAddBtn.innerText;
            quickViewAddBtn.innerText = "Added";
            quickViewAddBtn.style.backgroundColor = "#d4af37";
            quickViewAddBtn.style.color = "#000";
            setTimeout(() => {
                quickViewAddBtn.innerText = originalText;
                quickViewAddBtn.style.backgroundColor = "";
                quickViewAddBtn.style.color = "";
            }, 2000);
        });
    }

    // Add to Cart (Event Delegation for Grid)
    // This handles both static Masterpiece items and dynamic Main Collection items
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const button = e.target;
            
            // Find product details relative to the button
            const card = e.target.closest('.product-card');
            const title = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            const imageSrc = card.querySelector('img').src;

            shoppingCart.addItem({ title, price, imageSrc });
            
            // Button Feedback
            const originalText = button.innerText;
            button.innerText = "Added";
            button.style.backgroundColor = "#d4af37";
            button.style.color = "#000";
            setTimeout(() => {
                button.innerText = originalText;
                button.style.backgroundColor = "";
                button.style.color = "";
            }, 2000);
        }
    });

    // Wishlist Button Logic (Event Delegation)
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.wishlist-btn');
        if (btn) {
            e.preventDefault();
            const card = btn.closest('.product-card');
            const name = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            const image = card.querySelector('img').src;

            wishlist.toggle({ name, price, image });
        }
    });

    // Clear Wishlist Button
    const clearWishlistBtn = document.getElementById('clear-wishlist-btn');
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your wishlist?')) {
                wishlist.clear();
            }
        });
    }

    // Product Detail Page Logic
    const detailTitle = document.getElementById('detail-title');
    if (detailTitle) {
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name');
        const price = params.get('price');
        const img = params.get('img');

        if (name) detailTitle.innerText = name;
        if (price) document.getElementById('detail-price').innerText = '$' + parseFloat(price).toFixed(2);
        if (img) document.getElementById('detail-img').src = img;

        // Add to Recently Viewed
        if (name && price && img) {
            const product = { 
                name: name, 
                price: parseFloat(price), 
                image: img 
            };
            addToRecentlyViewed(product);
        }

        // Handle Add to Cart on Detail Page
        const detailBtn = document.getElementById('detail-add-btn');
        if (detailBtn) {
            detailBtn.addEventListener('click', () => {
                const product = { 
                    title: name || 'Unknown Product', 
                    price: parseFloat(price) || 0, 
                    imageSrc: img || '' 
                };
                
                shoppingCart.addItem(product);

                // Button Feedback
                const originalText = detailBtn.innerText;
                detailBtn.innerText = "Added to Bag";
                detailBtn.style.backgroundColor = "#d4af37";
                detailBtn.style.color = "#000";
                setTimeout(() => {
                    detailBtn.innerText = originalText;
                    detailBtn.style.backgroundColor = "";
                    detailBtn.style.color = "";
                }, 2000);
            });
        }
    }

    // Render Recently Viewed (runs on all pages where the grid exists)
    renderRecentlyViewed();

    // Contact Form Logic
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Message sent successfully! We will get back to you soon.');
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // Apply animation styles initially to sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        section.style.transition = "all 0.8s ease-out";
        observer.observe(section);
    });
});