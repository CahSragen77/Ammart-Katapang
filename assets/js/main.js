// Update waktu dan tanggal secara real-time
function updateDateTime() {
    const now = new Date();
    
    // Format tanggal: Hari, DD MMMM YYYY
    const optionsDate = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateString = now.toLocaleDateString('id-ID', optionsDate);
    
    // Format waktu: HH:MM:SS
    const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Update elemen HTML
    document.getElementById('current-date').textContent = dateString;
    document.getElementById('current-time').textContent = timeString;
}

// Panggil fungsi updateDateTime setiap detik
setInterval(updateDateTime, 1000);

// Inisialisasi tanggal dan waktu saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    
    // Inisialisasi menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Tutup menu mobile saat klik di luar
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu-btn') && !event.target.closest('.nav-menu')) {
            navMenu.classList.remove('active');
        }
    });
    
    // Load produk fast moving
    loadFastMovingProducts();
    
    // Inisialisasi promo banners
    initializePromoBanners();
});

// Data produk fast moving
const fastMovingProducts = [
    { name: "Beras Premium", price: "Rp 12.500/kg", img: "assets/products/beras.jpg" },
    { name: "Minyak Goreng", price: "Rp 18.000/liter", img: "assets/products/minyak.jpg" },
    { name: "Tepung Terigu", price: "Rp 10.000/kg", img: "assets/products/tepung.jpg" },
    { name: "Gula Pasir", price: "Rp 14.000/kg", img: "assets/products/gula.jpg" },
    { name: "Garam Halus", price: "Rp 5.000/kg", img: "assets/products/garam.jpg" },
    { name: "Telur Ayam", price: "Rp 28.000/kg", img: "assets/products/telur.jpg" },
    { name: "Ikan Segar", price: "Rp 35.000/kg", img: "assets/products/ikan.jpg" },
    { name: "Daging Ayam", price: "Rp 45.000/kg", img: "assets/products/ayam.jpg" },
    { name: "Daging Sapi", price: "Rp 120.000/kg", img: "assets/products/sapi.jpg" },
    { name: "Sayur Segar", price: "Rp 8.000/ikat", img: "assets/products/sayur.jpg" },
    { name: "Buah Lokal", price: "Rp 15.000/kg", img: "assets/products/buah.jpg" },
    { name: "Bumbu Dapur", price: "Rp 5.000/pack", img: "assets/products/bumbu.jpg" },
    { name: "Mie Instan", price: "Rp 3.500/pcs", img: "assets/products/mie.jpg" },
    { name: "Susu UHT", price: "Rp 12.000/liter", img: "assets/products/susu.jpg" },
    { name: "Air Mineral", price: "Rp 5.000/botol", img: "assets/products/air.jpg" },
    { name: "Kopi Bubuk", price: "Rp 25.000/200g", img: "assets/products/kopi.jpg" },
    { name: "Teh Celup", price: "Rp 15.000/box", img: "assets/products/teh.jpg" },
    { name: "Sabun Mandi", price: "Rp 8.000/pcs", img: "assets/products/sabun.jpg" },
    { name: "Shampoo", price: "Rp 20.000/botol", img: "assets/products/shampoo.jpg" },
    { name: "Pasta Gigi", price: "Rp 10.000/tube", img: "assets/products/pasta-gigi.jpg" }
];

// Fungsi untuk memuat produk fast moving
function loadFastMovingProducts() {
    const productsGrid = document.querySelector('.products-grid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    fastMovingProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        productItem.innerHTML = `
            <img src="${product.img}" alt="${product.name}" class="product-img" onerror="this.src='assets/products/default.jpg'">
            <div class="product-info">
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price">${product.price}</p>
            </div>
        `;
        
        productsGrid.appendChild(productItem);
    });
}

// Fungsi untuk inisialisasi promo banners
function initializePromoBanners() {
    const promoBanners = document.querySelectorAll('.promo-banner.empty');
    
    promoBanners.forEach((banner, index) => {
        banner.addEventListener('click', function() {
            alert(`Iklan promo ${index + 1} siap diupload. Silakan upload gambar atau video promosi Anda.`);
        });
    });
}
