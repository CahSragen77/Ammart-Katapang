// Sistem Keranjang Belanja A-Mart Katapang
class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateCartUI();
        this.setupNotifications();
    }
    
    // Load cart dari localStorage
    loadCart() {
        try {
            const saved = localStorage.getItem('amart_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }
    
    // Save cart ke localStorage
    saveCart() {
        try {
            localStorage.setItem('amart_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Cart icon click
        document.getElementById('cart-floating')?.addEventListener('click', () => {
            this.toggleCartSidebar();
        });
        
        // Close cart
        document.querySelector('.close-cart')?.addEventListener('click', () => {
            this.toggleCartSidebar(false);
        });
        
        // Overlay click
        document.getElementById('overlay')?.addEventListener('click', () => {
            this.toggleCartSidebar(false);
            document.getElementById('product-modal')?.classList.remove('active');
        });
        
        // Clear cart
        document.getElementById('clear-cart')?.addEventListener('click', () => {
            this.clearCart();
        });
        
        // Close modal
        document.querySelector('.close-modal')?.addEventListener('click', () => {
            document.getElementById('product-modal').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
        });
    }
    
    // Toggle cart sidebar
    toggleCartSidebar(show) {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('overlay');
        
        if (typeof show === 'undefined') {
            show = !sidebar.classList.contains('active');
        }
        
        if (show) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Add item to cart dengan support decimal quantity
    addItem(product, quantity = 1, unitType = 'unit', customPrice = null) {
        // Cari apakah item sudah ada di cart
        const existingIndex = this.cart.findIndex(item => 
            item.id === product.id && 
            item.unitType === unitType &&
            item.customPrice === customPrice
        );
        
        if (existingIndex > -1) {
            // Update quantity jika sudah ada
            this.cart[existingIndex].quantity = this.parseQuantity(
                this.cart[existingIndex].quantity + quantity
            );
        } else {
            // Tambah item baru
            const cartItem = {
                id: product.id,
                name: product.name,
                price: customPrice || this.getPriceByUnit(product, unitType),
                originalPrice: customPrice || this.getPriceByUnit(product, unitType),
                image: product.image,
                quantity: this.parseQuantity(quantity),
                unitType: unitType,
                category: product.category,
                weight: product.weight || null,
                note: ''
            };
            
            this.cart.push(cartItem);
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} ditambahkan ke keranjang`, 'success');
    }
    
    // Parse quantity untuk handle decimal
    parseQuantity(qty) {
        const num = parseFloat(qty);
        return isNaN(num) ? 1 : Math.max(0.001, num); // Minimum 0.001 kg
    }
    
    // Get price berdasarkan unit type
    getPriceByUnit(product, unitType) {
        if (unitType === 'unit') {
            return product.priceUnit;
        } else if (unitType === 'kg') {
            return product.priceKg || product.priceUnit;
        } else if (unitType === 'pcs') {
            return product.pricePcs || product.priceUnit;
        } else if (unitType === 'pack') {
            return product.pricePack || product.priceUnit;
        }
        return product.priceUnit;
    }
    
    // Update quantity item
    updateQuantity(itemId, newQuantity, unitType = null) {
        const itemIndex = this.cart.findIndex(item => 
            item.id === itemId && 
            (unitType ? item.unitType === unitType : true)
        );
        
        if (itemIndex > -1) {
            if (newQuantity <= 0) {
                this.cart.splice(itemIndex, 1);
            } else {
                this.cart[itemIndex].quantity = this.parseQuantity(newQuantity);
            }
            
            this.saveCart();
            this.updateCartUI();
        }
    }
    
    // Remove item dari cart
    removeItem(itemId, unitType = null) {
        this.cart = this.cart.filter(item => 
            !(item.id === itemId && (unitType ? item.unitType === unitType : true))
        );
        
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Item dihapus dari keranjang', 'error');
    }
    
    // Clear seluruh cart
    clearCart() {
        if (this.cart.length === 0) return;
        
        if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.showNotification('Keranjang dikosongkan', 'error');
        }
    }
    
    // Update cart UI
    updateCartUI() {
        this.updateCartCount();
        this.updateCartItems();
        this.updateCartSummary();
    }
    
    // Update cart count badge
    updateCartCount() {
        const countElement = document.getElementById('cart-count');
        if (!countElement) return;
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.textContent = this.formatNumber(totalItems, 3);
        
        // Animasi jika ada perubahan
        if (totalItems > 0) {
            countElement.style.animation = 'none';
            setTimeout(() => {
                countElement.style.animation = 'bounce 0.5s';
            }, 10);
        }
    }
    
    // Update cart items list
    updateCartItems() {
        const itemsContainer = document.getElementById('cart-items');
        if (!itemsContainer) return;
        
        if (this.cart.length === 0) {
            itemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Keranjang belanja kosong</p>
                </div>
            `;
            return;
        }
        
        let itemsHTML = '';
        
        this.cart.forEach((item, index) => {
            const total = this.calculateItemTotal(item);
            
            itemsHTML += `
                <div class="cart-item" data-id="${item.id}" data-unit="${item.unitType}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                         onerror="this.src='https://via.placeholder.com/80x80?text=Produk'">
                    <div class="cart-item-details">
                        <div class="cart-item-header">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <button class="remove-item" onclick="cart.removeItem(${item.id}, '${item.unitType}')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="cart-item-price">
                            ${this.formatPrice(item.price)} / ${this.getUnitLabel(item.unitType)}
                        </div>
                        <div class="cart-item-controls">
                            <div class="quantity-control">
                                <button class="qty-change decrease" 
                                        onclick="cart.updateQuantity(${item.id}, ${item.quantity - (item.unitType === 'kg' ? 0.1 : 1)}, '${item.unitType}')"
                                        ${item.quantity <= (item.unitType === 'kg' ? 0.1 : 1) ? 'disabled' : ''}>
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="qty-display">${this.formatNumber(item.quantity, 3)} ${this.getUnitLabel(item.unitType)}</span>
                                <button class="qty-change increase" 
                                        onclick="cart.updateQuantity(${item.id}, ${item.quantity + (item.unitType === 'kg' ? 0.1 : 1)}, '${item.unitType}')">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div class="cart-item-total">
                                ${this.formatPrice(total)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        itemsContainer.innerHTML = itemsHTML;
    }
    
    // Update cart summary
    updateCartSummary() {
        const subtotal = this.calculateSubtotal();
        const discount = this.calculateDiscount(subtotal);
        const total = subtotal - discount;
        
        document.getElementById('subtotal')?.textContent = this.formatPrice(subtotal);
        document.getElementById('discount')?.textContent = this.formatPrice(discount);
        document.getElementById('total')?.textContent = this.formatPrice(total);
    }
    
    // Calculate item total
    calculateItemTotal(item) {
        const price = this.parsePrice(item.price);
        return price * item.quantity;
    }
    
    // Calculate subtotal
    calculateSubtotal() {
        return this.cart.reduce((sum, item) => {
            return sum + this.calculateItemTotal(item);
        }, 0);
    }
    
    // Calculate discount (contoh: diskon 5% jika > 100k)
    calculateDiscount(subtotal) {
        if (subtotal > 100000) {
            return subtotal * 0.05; // 5% discount
        }
        return 0;
    }
    
    // Get unit label
    getUnitLabel(unitType) {
        const labels = {
            'unit': 'unit',
            'kg': 'kg',
            'pcs': 'pcs',
            'pack': 'pack',
            'liter': 'liter'
        };
        return labels[unitType] || 'unit';
    }
    
    // Format number dengan decimal places
    formatNumber(num, decimals = 2) {
        return parseFloat(num).toFixed(decimals);
    }
    
    // Parse price string ke number
    parsePrice(priceStr) {
        if (typeof priceStr === 'number') return priceStr;
        return parseFloat(priceStr.replace(/[^0-9.-]+/g, '')) || 0;
    }
    
    // Format price ke Rupiah
    formatPrice(amount) {
        const num = typeof amount === 'string' ? this.parsePrice(amount) : amount;
        return 'Rp ' + Math.round(num).toLocaleString('id-ID');
    }
    
    // Show notification
    showNotification(message, type = 'success') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <div class="notification-content">
                <h4>${type === 'success' ? 'Berhasil!' : 'Perhatian!'}</h4>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-10px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    setupNotifications() {
        // Setup notification styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.15);
                z-index: 1100;
                display: flex;
                align-items: center;
                gap: 15px;
                animation: slideDown 0.3s;
                border-left: 5px solid;
                transition: all 0.3s;
            }
            
            .notification.success { border-left-color: #1a6d1a; }
            .notification.error { border-left-color: #ff4757; }
            
            @keyframes slideDown {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize cart system
const cart = new ShoppingCart();
