// Fungsi untuk load header dan footer ke semua halaman
function loadCommonComponents() {
    // Load header
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
            initializeHeader();
        })
        .catch(error => {
            console.error('Error loading header:', error);
            document.getElementById('header').innerHTML = '<p>Header loading failed</p>';
        });

    // Load navigation
    fetch('components/navigation.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navigation').innerHTML = data;
            initializeNavigation();
        });

    // Load footer
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
}

// Update waktu dan tanggal
function updateDateTime() {
    const now = new Date();
    
    const optionsDate = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateString = now.toLocaleDateString('id-ID', optionsDate);
    
    const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');
    
    if (dateElement) dateElement.textContent = dateString;
    if (timeElement) timeElement.textContent = timeString;
}

// Inisialisasi header
function initializeHeader() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// Inisialisasi navigation
function initializeNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Set active link berdasarkan halaman saat ini
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Fungsi untuk load produk di halaman beranda
function loadHomeProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    const products = [
        { name: "Beras Premium", price: "Rp 12.500/kg", img: "assets/products/beras.jpg" },
        { name: "Minyak Goreng", price: "Rp 18.000/liter", img: "assets/products/minyak.jpg" },
        { name: "Tepung Terigu", price: "Rp 10.000/kg", img: "assets/products/tepung.jpg" },
        { name: "Gula Pasir", price: "Rp 14.000/kg", img: "assets/products/gula.jpg" },
        { name: "Telur Ayam", price: "Rp 28.000/kg", img: "assets/products/telur.jpg" },
        { name: "Ikan Segar", price: "Rp 35.000/kg", img: "assets/products/ikan.jpg" },
        { name: "Daging Ayam", price: "Rp 45.000/kg", img: "assets/products/ayam.jpg" },
        { name: "Sayur Segar", price: "Rp 8.000/ikat", img: "assets/products/sayur.jpg" },
        { name: "Buah Lokal", price: "Rp 15.000/kg", img: "assets/products/buah.jpg" },
        { name: "Susu UHT", price: "Rp 12.000/liter", img: "assets/products/susu.jpg" }
    ];

    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        productItem.innerHTML = `
            <img src="${product.img}" alt="${product.name}" class="product-img" 
                 onerror="this.src='https://via.placeholder.com/300x200?text=Produk'">
            <div class="product-info">
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price">${product.price}</p>
            </div>
        `;
        
        productsGrid.appendChild(productItem);
    });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Load komponen umum
    if (document.getElementById('header')) {
        loadCommonComponents();
    }
    
    // Load produk untuk halaman beranda
    if (document.getElementById('products-grid')) {
        loadHomeProducts();
    }
    
    // Inisialisasi lainnya
    initializeNavigation();
});
