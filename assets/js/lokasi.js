// location.js - JavaScript khusus untuk halaman lokasi A-Mart Katapang

// Konfigurasi lokasi A-Mart Katapang
const LOCATION_CONFIG = {
    name: "A-Mart Katapang",
    address: "Bojong Salak, No. 1 RT / RW : 1 / 21, Cilampeni, Kec : KATAPANG, Kab : Bandung, Jawa Barat 40921",
    phone: "081111120670",
    whatsapp: "62811-1112-0670",
    latitude: -6.934952,
    longitude: 107.552441,
    googleMapsLink: "https://maps.app.goo.gl/7Ah9ezhcviZHefX87",
    businessHours: {
        weekdays: "06:00 - 22:00",
        weekends: "06:00 - 22:00",
        everyday: true
    }
};

// =====================
// FUNGSI UTAMA
// =====================

/**
 * Buka Google Maps dengan lokasi A-Mart
 */
function openGoogleMaps() {
    try {
        window.open(LOCATION_CONFIG.googleMapsLink, '_blank', 'noopener,noreferrer');
        
        // Track analytics (jika ada)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'maps_open', {
                'event_category': 'engagement',
                'event_label': 'Location Page'
            });
        }
        
        console.log('Google Maps opened for:', LOCATION_CONFIG.name);
    } catch (error) {
        console.error('Error opening Google Maps:', error);
        // Fallback: buka URL biasa
        window.location.href = LOCATION_CONFIG.googleMapsLink;
    }
}

/**
 * Dapatkan rute dari lokasi pengguna saat ini
 */
function getDirections() {
    // Cek apakah browser support geolocation
    if (!navigator.geolocation) {
        alert('Browser Anda tidak mendukung geolocation. Membuka peta standar...');
        openGoogleMaps();
        return;
    }
    
    // Tampilkan loading indicator
    const routeBtn = document.getElementById('getDirectionsBtn');
    const originalText = routeBtn.innerHTML;
    routeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mendeteksi lokasi...';
    routeBtn.disabled = true;
    
    // Minta izin lokasi
    navigator.geolocation.getCurrentPosition(
        // Success callback
        function(position) {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const destination = `${LOCATION_CONFIG.latitude},${LOCATION_CONFIG.longitude}`;
            
            // Buka Google Maps dengan rute
            const mapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${destination}/`;
            window.open(mapsUrl, '_blank', 'noopener,noreferrer');
            
            // Reset button
            routeBtn.innerHTML = originalText;
            routeBtn.disabled = false;
            
            // Log success
            console.log('Directions generated from:', { userLat, userLng });
        },
        // Error callback
        function(error) {
            console.warn('Geolocation error:', error);
            
            // Beri feedback kepada pengguna
            let errorMessage = 'Tidak dapat mendapatkan lokasi Anda. ';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Izin lokasi ditolak.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Informasi lokasi tidak tersedia.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Permintaan lokasi timeout.';
                    break;
                default:
                    errorMessage += 'Terjadi kesalahan yang tidak diketahui.';
            }
            
            alert(errorMessage + '\n\nMembuka peta standar...');
            openGoogleMaps();
            
            // Reset button
            routeBtn.innerHTML = originalText;
            routeBtn.disabled = false;
        },
        // Options
        {
            enableHighAccuracy: true,
            timeout: 10000, // 10 detik
            maximumAge: 0
        }
    );
}

/**
 * Telepon toko A-Mart
 */
function callStore() {
    if (confirm(`Hubungi ${LOCATION_CONFIG.name} di ${LOCATION_CONFIG.phone}?`)) {
        try {
            // Format nomor untuk telepon
            const telUrl = `tel:${LOCATION_CONFIG.phone}`;
            window.location.href = telUrl;
            
            // Fallback untuk desktop
            setTimeout(() => {
                if (!/Mobi|Android/i.test(navigator.userAgent)) {
                    alert(`Untuk desktop, silakan hubungi: ${LOCATION_CONFIG.phone}`);
                }
            }, 1000);
        } catch (error) {
            console.error('Error calling store:', error);
            alert(`Silakan hubungi: ${LOCATION_CONFIG.phone}`);
        }
    }
}

/**
 * Bagikan lokasi melalui Web Share API
 */
function shareLocation() {
    const shareData = {
        title: LOCATION_CONFIG.name,
        text: `Kunjungi ${LOCATION_CONFIG.name} - ${LOCATION_CONFIG.address}`,
        url: LOCATION_CONFIG.googleMapsLink
    };
    
    // Cek apakah Web Share API didukung
    if (navigator.share && navigator.canShare(shareData)) {
        navigator.share(shareData)
            .then(() => {
                console.log('Location shared successfully');
                
                // Track share event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'share', {
                        'method': 'Web Share API',
                        'content_type': 'location',
                        'item_id': 'amart_location'
                    });
                }
            })
            .catch(error => {
                console.log('Sharing cancelled or failed:', error);
                fallbackShare();
            });
    } else {
        fallbackShare();
    }
}

/**
 * Fallback untuk browser yang tidak support Web Share API
 */
function fallbackShare() {
    // Salin link ke clipboard
    navigator.clipboard.writeText(LOCATION_CONFIG.googleMapsLink)
        .then(() => {
            // Tampilkan notifikasi sukses
            showNotification('✅ Link lokasi berhasil disalin ke clipboard!', 'success');
            
            // Optional: Tampilkan modal dengan QR code
            showShareOptions();
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            alert(`Salin link berikut:\n${LOCATION_CONFIG.googleMapsLink}`);
        });
}

/**
 * Tampilkan pilihan share alternatif
 */
function showShareOptions() {
    const shareModal = document.createElement('div');
    shareModal.className = 'share-modal';
    shareModal.innerHTML = `
        <div class="share-modal-content">
            <h3>Bagikan Lokasi A-Mart</h3>
            <p>Link telah disalin! Anda juga bisa:</p>
            <div class="share-options">
                <a href="https://wa.me/?text=${encodeURIComponent(`Lokasi ${LOCATION_CONFIG.name}: ${LOCATION_CONFIG.googleMapsLink}`)}" 
                   target="_blank" class="share-option whatsapp">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(LOCATION_CONFIG.googleMapsLink)}" 
                   target="_blank" class="share-option facebook">
                    <i class="fab fa-facebook"></i> Facebook
                </a>
                <button onclick="navigator.clipboard.writeText('${LOCATION_CONFIG.address}')" class="share-option copy">
                    <i class="fas fa-copy"></i> Salin Alamat
                </button>
            </div>
            <button onclick="this.closest('.share-modal').remove()" class="close-modal">
                Tutup
            </button>
        </div>
    `;
    
    // Tambahkan styling
    const style = document.createElement('style');
    style.textContent = `
        .share-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s;
        }
        .share-modal-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 400px;
            width: 90%;
            text-align: center;
        }
        .share-options {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin: 1.5rem 0;
        }
        .share-option {
            padding: 1rem;
            border-radius: 10px;
            text-decoration: none;
            color: white;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: transform 0.3s;
        }
        .share-option:hover {
            transform: translateY(-3px);
        }
        .whatsapp { background: #25D366; }
        .facebook { background: #1877F2; }
        .copy { background: #6C757D; border: none; cursor: pointer; }
        .close-modal {
            background: #2a9d8f;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 1rem;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(shareModal);
    
    // Auto-close setelah 10 detik
    setTimeout(() => {
        if (shareModal.parentNode) {
            shareModal.remove();
        }
    }, 10000);
}

/**
 * Deteksi device untuk optimalisasi tombol
 */
function optimizeForDevice() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const mapsBtn = document.getElementById('openMapsBtn');
    
    if (isMobile && mapsBtn) {
        mapsBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i><span>Buka di Aplikasi Maps</span>';
        mapsBtn.title = 'Buka di aplikasi Google Maps smartphone Anda';
    }
    
    // Optimalkan untuk touch devices
    if (isMobile) {
        document.querySelectorAll('.action-btn, .btn-home, .btn-navigate').forEach(btn => {
            btn.classList.add('touch-target');
        });
    }
}

/**
 * Tampilkan notifikasi
 */
function showNotification(message, type = 'info') {
    // Hapus notifikasi lama
    const oldNotification = document.querySelector('.location-notification');
    if (oldNotification) oldNotification.remove();
    
    // Buat notifikasi baru
    const notification = document.createElement('div');
    notification.className = `location-notification ${type}`;
    notification.textContent = message;
    
    // Styling
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#2a9d8f' : type === 'error' ? '#e76f51' : '#457b9d'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 1500;
        animation: slideInUp 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    // Animasi
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes slideInUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOutDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);
    document.body.appendChild(notification);
    
    // Auto-remove setelah 3 detik
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Inisialisasi event listeners
 */
function initEventListeners() {
    // Tombol utama
    document.getElementById('openMapsBtn')?.addEventListener('click', openGoogleMaps);
    document.getElementById('getDirectionsBtn')?.addEventListener('click', getDirections);
    document.getElementById('callStoreBtn')?.addEventListener('click', callStore);
    document.getElementById('shareLocationBtn')?.addEventListener('click', shareLocation);
    
    // Smooth scroll untuk anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL tanpa reload
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Lazy load untuk iframe maps
    const mapsIframe = document.querySelector('.maps-iframe');
    if (mapsIframe) {
        // Delay loading untuk performance
        setTimeout(() => {
            mapsIframe.setAttribute('loading', 'lazy');
        }, 1000);
    }
}

/**
 * Inisialisasi halaman
 */
function initLocationPage() {
    console.log('Initializing Location Page...');
    
    // Update live time (jika ada di datetime.js)
    if (typeof updateLiveTime === 'function') {
        updateLiveTime();
        setInterval(updateLiveTime, 1000);
    }
    
    // Optimalkan untuk device
    optimizeForDevice();
    
    // Setup event listeners
    initEventListeners();
    
    // Track page view (jika ada analytics)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': 'Location Page',
            'page_location': window.location.href
        });
    }
    
    console.log('Location Page initialized successfully');
}

// =====================
// EXPORT FUNGSI KE GLOBAL SCOPE
// =====================
window.openGoogleMaps = openGoogleMaps;
window.getDirections = getDirections;
window.callStore = callStore;
window.shareLocation = shareLocation;

// =====================
// START APPLICATION
// =====================
document.addEventListener('DOMContentLoaded', initLocationPage);

// Fallback untuk browser lama
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLocationPage);
} else {
    initLocationPage();
}
