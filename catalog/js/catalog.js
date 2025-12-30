// Product Catalog System for A-Mart Katapang
class ProductCatalog {
    constructor() {
        this.products = this.getSampleProducts();
        this.currentCategory = 'all';
        this.currentProduct = null;
        this.init();
    }
    
    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.setupSearch();
    }
    
    // Sample products data
    getSampleProducts() {
        return [
            {
                id: 1,
                name: "Beras Pandan Wangi Premium",
                category: "sembako",
                description: "Beras premium kualitas terbaik, pulen dan wangi. Cocok untuk nasi sehari-hari maupun acara khusus.",
                image: "assets/products/beras.jpg",
                priceUnit: "Rp 12.500",
                priceKg: "Rp 12.000",
                weight: "1 kg",
                unit: "karung",
                featured: true,
                badge: "HOT"
            },
            {
                id: 2,
                name: "Minyak Goreng Bimoli 2L",
                category: "sembako",
                description: "Minyak goreng berkualitas tinggi, tidak mudah beku dan tahan lama.",
                image: "assets/products/minyak.jpg",
                priceUnit: "Rp 36.000",
                priceLiter: "Rp 34.000",
                weight: "2 liter",
                unit: "botol",
                featured: true
            },
            {
                id: 3,
                name: "Gula Pasir Gulaku 1kg",
                category: "sembako",
                description: "Gula pasir halus, manis alami tanpa bahan pengawet.",
                image: "assets/products/gula.jpg",
                priceUnit: "Rp 14.000",
                priceKg: "Rp 13.500",
                weight: "1 kg",
                unit: "pack"
            },
            {
                id: 4,
                name: "Tepung Terigu Segitiga 1kg",
                category: "sembako",
                description: "Tepung terigu serbaguna, cocok untuk segala jenis kue dan roti.",
                image: "assets/products/tepung.jpg",
                priceUnit: "Rp 10.500",
                priceKg: "Rp 9.800",
                weight: "1 kg",
                unit: "pack"
            },
            {
                id: 5,
                name: "Apel Fuji Premium Import",
                category: "buah-sayur",
                description: "Apel manis dan renyah langsung dari petani lokal.",
                image: "assets/products/apel.jpg",
                priceUnit: "Rp 25.000",
                priceKg: "Rp 22.000",
                weight: "1 kg",
                unit: "kg",
                badge: "NEW"
            },
            {
                id: 6,
                name: "Jeruk Pontianak Segar",
                category: "buah-sayur",
                description: "Jeruk manis dengan kandungan vitamin C tinggi.",
                image: "assets/products/jeruk.jpg",
                priceUnit: "Rp 18.000",
                priceKg: "Rp 16.000",
                weight: "1 kg",
                unit: "kg"
            },
            {
                id: 7,
                name: "Sayur Sawi Hijau Segar",
                category: "buah-sayur",
                description: "Sayur sawi hijau segar langsung dari kebun.",
                image: "assets/products/sawi.jpg",
                priceUnit: "Rp 8.000",
                pricePack: "Rp 35.000",
                weight: "1 ikat",
                unit: "ikat"
            },
            {
                id: 8,
                name: "Wortel Import Segar",
                category: "buah-sayur",
                description: "Wortel merah segar, kaya vitamin A.",
                image: "assets/products/wortel.jpg",
                priceUnit: "Rp 12.000",
                priceKg: "Rp 11.000",
                weight: "1 kg",
                unit: "kg"
            },
            {
                id: 9,
                name: "Daging Sapi Paha Premium",
                category: "daging",
                description: "Daging sapi segar bagian paha, empuk dan rendah lemak.",
                image: "assets/products/sapi.jpg",
                priceUnit: "Rp 120.000",
                priceKg: "Rp 115.000",
                weight: "1 kg",
                unit: "kg",
                featured: true
            },
            {
                id: 10,
                name: "Daging Ayam Potong Segar",
                category: "daging",
                description: "Daging ayam segar, sudah dipotong dan dibersihkan.",
                image: "assets/products/ayam.jpg",
                priceUnit: "Rp 45.000",
                priceKg: "Rp 42.000",
                weight: "1 kg",
                unit: "kg"
            },
            {
                id: 11,
                name: "Telur Ayam Kampung",
                category: "daging",
                description: "Telur ayam kampung organik, kaya nutrisi.",
                image: "assets/products/telur.jpg",
                priceUnit: "Rp 3.500",
                priceKg: "Rp 28.000",
                weight: "1 butir",
                unit: "butir"
            },
            {
                id: 12,
                name: "Ikan Segar Bandeng",
                category: "daging",
                description: "Ikan bandeng segar, siap dimasak.",
                image: "assets/products/bandeng.jpg",
                priceUnit: "Rp 35.000",
                priceKg: "Rp 33.000",
                weight: "1 kg",
                unit: "kg"
            },
            {
                id: 13,
                name: "Aqua Galon 19L",
                category: "minuman",
                description: "Air mineral kemasan galon, aman dan sehat.",
                image: "assets/products/aqua.jpg",
                priceUnit: "Rp 20.000",
                priceUnit: "Rp 20.000",
                weight: "19 liter",
                unit: "galon"
            },
            {
                id: 14,
                name: "Susu Ultra Milk 1L",
                category: "minuman",
                description: "Susu UHT full cream, kaya kalsium.",
                image: "assets/products/susu.jpg",
                priceUnit: "Rp 12.000",
                pricePack: "Rp 110.000",
                weight: "1 liter",
                unit: "kotak"
            },
            {
                id: 15,
                name: "Kopi Kapal Api 200g",
                category: "minuman",
                description: "Kopi bubuk pilihan, aroma dan rasa kuat.",
                image: "assets/products/kopi.jpg",
                priceUnit: "Rp 25.000",
                pricePack: "Rp 120.000",
                weight: "200 gram",
                unit: "pack"
            },
            {
                id: 16,
                name: "Bumbu Racik Indofood",
                category: "bumbu",
                description: "Bumbu instan lengkap, praktis untuk masakan sehari-hari.",
                image: "assets/products/bumbu-racik.jpg",
                priceUnit: "Rp 5.000",
                pricePack: "Rp 45.000",
                weight: "1 pack",
                unit: "pack"
            }
        ];
    }
    
    // Load products to grid
    loadProducts(filter = '') {
        const grid = document.getElementById('product-grid');
        if (!grid) return;
        
        let filteredProducts = this.products;
        
        // Filter by category
        if (this.currentCategory !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.category === this.currentCategory);
        }
        
        // Filter by search
        if (filter.trim()) {
            const searchTerm = filter.toLowerCase();
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm)
            );
        }
        
        // Generate HTML
        grid.innerHTML = filteredProducts.map(product => this.createProductCard(product)).join('');
        
        // Add click events to cards
        this.addCardClickEvents();
    }
    
    // Create product card HTML
    createProductCard(product) {
        const badgeHTML = product.badge ? 
            `<div class="product-badge ${product.badge.toLowerCase()}">${product.badge}</div>` : '';
        
        const featuredClass = product.featured ? 'featured' : '';
        
        return `
            <div class="product-card ${featuredClass}" data-id="${product.id}">
                ${badgeHTML}
                <img src="${product.image}" alt="${product.name}" class="product-image"
                     onerror="this.src='https://via.placeholder.com/300x200?text=Produk'">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <div class="price-unit">
                            <span class="price-label">Satuan:</span>
                            <span class="price-value">${product.priceUnit}</span>
                        </div>
                        ${product.priceKg ? `
                        <div class="price-bulk">
                            <span class="price-label">Per Kg:</span>
                            <span class="price-value">${product.priceKg}</span>
                        </div>
                        ` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn-quick-add" onclick="catalog.quickAddToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Tambah
                        </button>
                        <button class="btn-detail" onclick="catalog.showProductDetail(${product.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Add click events to product cards
    addCardClickEvents() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Jangan trigger jika klik pada button
                if (!e.target.closest('button')) {
                    const productId = parseInt(card.dataset.id);
                    this.showProductDetail(productId);
                }
            });
        });
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Category filter buttons
        document.querySelectorAll('.cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category;
                this.loadProducts();
            });
        });
        
        // Quantity controls in modal
        const quantityInput = document.getElementById('quantity');
        const qtyMinus = document.querySelector('.qty-minus');
        const qtyPlus = document.querySelector('.qty-plus');
        
        if (qtyMinus) {
            qtyMinus.addEventListener('click', () => {
                let value = parseFloat(quantityInput.value) || 1;
                const unitType = document.getElementById('unit-type').value;
                const step = unitType === 'kg' ? 0.1 : 1;
                quantityInput.value = Math.max(0.1, value - step).toFixed(unitType === 'kg' ? 1 : 0);
                this.updateModalTotal();
            });
        }
        
        if (qtyPlus) {
            qtyPlus.addEventListener('click', () => {
                let value = parseFloat(quantityInput.value) || 1;
                const unitType = document.getElementById('unit-type').value;
                const step = unitType === 'kg' ? 0.1 : 1;
                quantityInput.value = (value + step).toFixed(unitType === 'kg' ? 1 : 0);
                this.updateModalTotal();
            });
        }
        
        // Quantity input change
        if (quantityInput) {
            quantityInput.addEventListener('input', () => {
                this.updateModalTotal();
            });
        }
        
        // Unit type change
        const unitTypeSelect = document.getElementById('unit-type');
        if (unitTypeSelect) {
            unitTypeSelect.addEventListener('change', () => {
                this.updatePriceOptions();
                this.updateModalTotal();
            });
        }
        
        // Price option selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.price-option')) {
                document.querySelectorAll('.price-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                e.target.closest('.price-option').classList.add('active');
                this.updateModalTotal();
            }
        });
        
        // Add to cart from modal
        document.getElementById('modal-add-cart')?.addEventListener('click', () => {
            this.addCurrentToCart();
        });
        
        // Buy now from modal
        document.getElementById('modal-buy-now')?.addEventListener('click', () => {
            this.addCurrentToCart();
            cart.toggleCartSidebar(true);
        });
    }
    
    // Setup search functionality
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.loadProducts(searchInput.value);
            }, 300);
        });
    }
    
    // Quick add to cart
    quickAddToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            cart.addItem(product, 1, 'unit');
        }
    }
    
    // Show product detail modal
    showProductDetail(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        this.currentProduct = product;
        
        const modal = document.getElementById('product-modal');
        const overlay = document.getElementById('overlay');
        const modalBody = document.getElementById('modal-body');
        
        // Generate modal content
        modalBody.innerHTML = this.createModalContent(product);
        
        // Show modal
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Initialize modal
        this.updatePriceOptions();
        this.updateModalTotal();
    }
    
    // Create modal content
    createModalContent(product) {
        const badgeHTML = product.badge ? 
            `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : '';
        
        return `
            <div class="modal-product">
                <div class="modal-image">
                    <img src="${product.image}" alt="${product.name}"
                         onerror="this.src='https://via.placeholder.com/400x300?text=Produk'">
                </div>
                <div class="modal-details">
                    <h2>${product.name} ${badgeHTML}</h2>
                    <div class="modal-category">
                        <i class="fas fa-tag"></i> ${this.getCategoryName(product.category)}
                    </div>
                    <div class="modal-description">
                        <p>${product.description}</p>
                        <p><strong>Berat:</strong> ${product.weight}</p>
                        <p><strong>Kemasan:</strong> ${product.unit}</p>
                    </div>
                    
                    <div class="modal-prices" id="price-options">
                        <!-- Price options will be inserted here -->
                    </div>
                    
                    <div class="quantity-selector">
                        <label class="quantity-label">Jumlah:</label>
                        <div class="quantity-controls">
                            <div class="quantity-input">
                                <button type="button" class="qty-btn qty-minus">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" id="quantity" value="1" min="0.1" step="0.1">
                                <button type="button" class="qty-btn qty-plus">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div class="unit-selector">
                                <select id="unit-type">
                                    <option value="unit">Unit</option>
                                    ${product.priceKg ? '<option value="kg">Kilogram</option>' : ''}
                                    ${product.pricePcs ? '<option value="pcs">Pieces</option>' : ''}
                                    ${product.pricePack ? '<option value="pack">Pack</option>' : ''}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-total">
                        <div class="total-label">Total Harga:</div>
                        <div class="total-amount" id="modal-total-price">Rp 0</div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-add-cart" id="modal-add-cart">
                            <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                        </button>
                        <button class="btn-buy-now" id="modal-buy-now">
                            <i class="fas fa-bolt"></i> Beli Sekarang
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Update price options based on selected unit
    updatePriceOptions() {
        if (!this.currentProduct) return;
        
        const unitType = document.getElementById('unit-type').value;
        const container = document.getElementById('price-options');
        
        let optionsHTML = '';
        
        // Unit price option
        optionsHTML += `
            <div class="price-option ${unitType === 'unit' ? 'active' : ''}" data-type="unit" data-price="${this.currentProduct.priceUnit}">
                <div class="price-header">
                    <span class="price-type">Harga Satuan</span>
                    <span class="price-amount">${this.currentProduct.priceUnit}</span>
                </div>
                <div class="price-note">Per ${this.currentProduct.unit}</div>
            </div>
        `;
        
        // Kilogram price option
        if (this.currentProduct.priceKg && unitType === 'kg') {
            optionsHTML += `
                <div class="price-option active" data-type="kg" data-price="${this.currentProduct.priceKg}">
                    <div class="price-header">
                        <span class="price-type">Harga per Kilogram</span>
                        <span class="price-amount">${this.currentProduct.priceKg}</span>
                    </div>
                    <div class="price-note">Harga khusus untuk pembelian kiloan</div>
                </div>
            `;
        }
        
        // Pack price option
        if (this.currentProduct.pricePack && unitType === 'pack') {
            optionsHTML += `
                <div class="price-option active" data-type="pack" data-price="${this.currentProduct.pricePack}">
                    <div class="price-header">
                        <span class="price-type">Harga per Pack</span>
                        <span class="price-amount">${this.currentProduct.pricePack}</span>
                    </div>
                    <div class="price-note">Isi 10 pack</div>
                </div>
            `;
        }
        
        container.innerHTML = optionsHTML;
    }
    
    // Update modal total price
    updateModalTotal() {
        if (!this.currentProduct) return;
        
        const quantity = parseFloat(document.getElementById('quantity').value) || 1;
        const unitType = document.getElementById('unit-type').value;
        
        // Get selected price
        const selectedOption = document.querySelector('.price-option.active');
        let price = this.currentProduct.priceUnit;
        
        if (selectedOption) {
            price = selectedOption.dataset.price;
        } else if (unitType === 'kg' && this.currentProduct.priceKg) {
            price = this.currentProduct.priceKg;
        } else if (unitType === 'pack' && this.currentProduct.pricePack) {
            price = this.currentProduct.pricePack;
        }
        
        // Calculate total
        const priceNum = cart.parsePrice(price);
        const total = priceNum * quantity;
        
        // Update display
        document.getElementById('modal-total-price').textContent = cart.formatPrice(total);
    }
    
    // Add current product to cart
    addCurrentToCart() {
        if (!this.currentProduct) return;
        
        const quantity = parseFloat(document.getElementById('quantity').value) || 1;
        const unitType = document.getElementById('unit-type').value;
        
        // Get selected price
        const selectedOption = document.querySelector('.price-option.active');
        let price = this.currentProduct.priceUnit;
        
        if (selectedOption) {
            price = selectedOption.dataset.price;
        }
        
        // Add to cart
        cart.addItem(this.currentProduct, quantity, unitType, price);
        
        // Close modal
        document.getElementById('product-modal').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Get category display name
    getCategoryName(category) {
        const names = {
            'sembako': 'Sembako',
            'buah-sayur': 'Buah & Sayur',
            'daging': 'Daging Segar',
            'minuman': 'Minuman',
            'bumbu': 'Bumbu Dapur'
        };
        return names[category] || category;
    }
}

// Initialize catalog
const catalog = new ProductCatalog();
