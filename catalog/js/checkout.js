// Checkout System for WhatsApp & Telegram Integration
class CheckoutSystem {
    constructor() {
        this.storeInfo = {
            name: "A-Mart Katapang",
            phone: "6281234567890", // Ganti dengan nomor WhatsApp A-Mart
            telegram: "@amartkatapang", // Ganti dengan username Telegram
            address: "Jl. Raya Katapang No. 123, Katapang, Bandung"
        };
        
        this.init();
    }
    
    init() {
        this.setupCheckoutButtons();
    }
    
    setupCheckoutButtons() {
        // WhatsApp checkout
        document.getElementById('checkout-whatsapp')?.addEventListener('click', () => {
            this.checkoutViaWhatsApp();
        });
        
        // Telegram checkout
        document.getElementById('checkout-telegram')?.addEventListener('click', () => {
            this.checkoutViaTelegram();
        });
    }
    
    // Checkout via WhatsApp
    checkoutViaWhatsApp() {
        if (cart.cart.length === 0) {
            cart.showNotification('Keranjang belanja kosong!', 'error');
            return;
        }
        
        const message = this.generateOrderMessage();
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${this.storeInfo.phone}?text=${encodedMessage}`;
        
        // Open in new tab
        window.open(url, '_blank');
        
        // Log order
        this.logOrder('whatsapp');
    }
    
    // Checkout via Telegram
    checkoutViaTelegram() {
        if (cart.cart.length === 0) {
            cart.showNotification('Keranjang belanja kosong!', 'error');
            return;
        }
        
        const message = this.generateOrderMessage();
        const encodedMessage = encodeURIComponent(message);
        const url = `https://t.me/${this.storeInfo.telegram}?text=${encodedMessage}`;
        
        // Open in new tab
        window.open(url, '_blank');
        
        // Log order
        this.logOrder('telegram');
    }
    
    // Generate order message
    generateOrderMessage() {
        const timestamp = new Date().toLocaleString('id-ID');
        const items = cart.cart;
        const subtotal = cart.calculateSubtotal();
        const discount = cart.calculateDiscount(subtotal);
        const total = subtotal - discount;
        
        let message = `🛒 *ORDER BARU - A-MART KATAPANG*\n`;
        message += `📅 ${timestamp}\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `*Detail Pesanan:*\n`;
        
        // Add items
        items.forEach((item, index) => {
            const itemTotal = cart.calculateItemTotal(item);
            message += `${index + 1}. ${item.name}\n`;
            message += `   └ ${cart.formatNumber(item.quantity, 3)} ${cart.getUnitLabel(item.unitType)} × ${item.price} = ${cart.formatPrice(itemTotal)}\n`;
        });
        
        message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        message += `*RINGKASAN PEMBAYARAN*\n`;
        message += `Subtotal: ${cart.formatPrice(subtotal)}\n`;
        
        if (discount > 0) {
            message += `Diskon: -${cart.formatPrice(discount)}\n`;
        }
        
        message += `*TOTAL: ${cart.formatPrice(total)}*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `*DATA PENGIRIMAN*\n`;
        message += `Nama: [ISI NAMA ANDA]\n`;
        message += `No. HP: [ISI NOMOR HP]\n`;
        message += `Alamat: [ISI ALAMAT LENGKAP]\n\n`;
        message += `*METODE PENGIRIMAN*\n`;
        message += `[ ] Ambil di Toko\n`;
        message += `[ ] Antar ke Alamat\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `*INFO TOKO*\n`;
        message += `${this.storeInfo.name}\n`;
        message += `${this.storeInfo.address}\n`;
        message += `WA: ${this.storeInfo.phone}\n\n`;
        message += `_*Harap lengkapi data di atas sebelum mengirim pesan*_`;
        
        return message;
    }
    
    // Log order to localStorage
    logOrder(method) {
        try {
            const order = {
                timestamp: new Date().toISOString(),
                method: method,
                items: cart.cart,
                subtotal: cart.calculateSubtotal(),
                discount: cart.calculateDiscount(cart.calculateSubtotal()),
                total: cart.calculateSubtotal() - cart.calculateDiscount(cart.calculateSubtotal())
            };
            
            // Get existing orders
            const existingOrders = JSON.parse(localStorage.getItem('amart_orders')) || [];
            existingOrders.push(order);
            
            // Save orders (max 50 orders)
            if (existingOrders.length > 50) {
                existingOrders.shift();
            }
            
            localStorage.setItem('amart_orders', JSON.stringify(existingOrders));
            
            // Clear cart after successful order
            setTimeout(() => {
                cart.clearCart();
            }, 1000);
            
        } catch (error) {
            console.error('Error logging order:', error);
        }
    }
    
    // Generate order summary for display
    generateOrderSummary() {
        const items = cart.cart;
        const subtotal = cart.calculateSubtotal();
        const discount = cart.calculateDiscount(subtotal);
        const total = subtotal - discount;
        
        return {
            items,
            subtotal,
            discount,
            total,
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
        };
    }
}

// Initialize checkout system
const checkout = new CheckoutSystem();
