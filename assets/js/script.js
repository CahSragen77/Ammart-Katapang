// Fungsi untuk memperbarui waktu secara real-time
function updateCurrentTime() {
    const now = new Date();
    const options = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
    };
    const timeString = now.toLocaleTimeString('id-ID', options) + ' WIB';
    
    // Update semua elemen dengan kelas 'current-time'
    const timeElements = document.querySelectorAll('.current-time');
    timeElements.forEach(element => {
        element.textContent = timeString;
    });
}

// Fungsi untuk animasi keranjang belanja
function setupCartButtons() {
    const cartButtons = document.querySelectorAll('.btn-cart');
    
    cartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animasi tombol
            this.style.transform = 'scale(0.9)';
            
            // Dapatkan nama produk dari kartu terdekat
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            // Tampilkan notifikasi
            showNotification(`${productName} ditambahkan ke keranjang!`);
            
            // Reset animasi setelah 200ms
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Log untuk debugging (bisa diganti dengan fungsi keranjang yang sebenarnya)
            console.log(`Produk ditambahkan: ${productName} - ${productPrice}`);
        });
    });
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message) {
    // Buat elemen notifikasi jika belum ada
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
        
        // Tambahkan styling untuk notifikasi
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: var(--primary-color);
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 9999;
                transform: translateX(150%);
                transition: transform 0.3s ease;
                max-width: 300px;
                font-weight: 500;
            }
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set pesan dan tampilkan
    notification.textContent = message;
    notification.classList.add('show');
    
    // Sembunyikan setelah 3 detik
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Fungsi untuk animasi scroll ke bagian produk
function setupSmoothScroll() {
    const productLink = document.querySelector('a[href="#products"]');
    
    if (productLink) {
        productLink.addEventListener('click', function(e) {
            e.preventDefault();
            const productsSection = document.getElementById('products');
            
            if (productsSection) {
                window.scrollTo({
                    top: productsSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Fungsi untuk menampilkan/menyembunyikan produk berdasarkan kategori (untuk pengembangan selanjutnya)
function filterProducts(category) {
    const allCategories = document.querySelectorAll('.product-category');
    
    if (category === 'all') {
        allCategories.forEach(cat => {
            cat.style.display = 'block';
        });
    } else {
        allCategories.forEach(cat => {
            if (cat.querySelector('.category-header h2').textContent.includes(category)) {
                cat.style.display = 'block';
            } else {
                cat.style.display = 'none';
            }
        });
    }
}

// Fungsi untuk inisialisasi saat halaman dimuat
function init() {
    // Update waktu saat halaman dimuat
    updateCurrentTime();
    
    // Update waktu setiap menit
    setInterval(updateCurrentTime, 60000);
    
    // Setup tombol keranjang
    setupCartButtons();
    
    // Setup smooth scroll
    setupSmoothScroll();
    
    // Tambahkan event listener untuk filter (contoh untuk pengembangan)
    console.log('A-Mart Katapang siap beroperasi!');
    
    // Tambahkan efek saat halaman di-scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
        }
    });
}

// Jalankan inisialisasi saat dokumen siap
document.addEventListener('DOMContentLoaded', init);
