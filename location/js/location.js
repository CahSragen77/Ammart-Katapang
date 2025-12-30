// Location Page System for A-Mart Katapang
class LocationSystem {
    constructor() {
        this.storeLocation = {
            lat: -7.003456,  // Ganti dengan latitude sebenarnya
            lng: 107.556789, // Ganti dengan longitude sebenarnya
            name: "A-Mart Katapang",
            address: "Jl. Raya Katapang No. 123, Katapang, Bandung",
            phone: "+622212345678",
            whatsapp: "6281234567890"
        };
        
        this.map = null;
        this.marker = null;
        this.infoWindow = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeMap();
        this.generateQRCode();
        this.setupBackToTop();
        this.setupDirectionTabs();
    }
    
    // Initialize Google Maps
    initializeMap() {
        // Check if Google Maps API is loaded
        if (typeof google === 'undefined' || !google.maps) {
            console.error('Google Maps API not loaded');
            this.showFallbackMap();
            return;
        }
        
        const mapElement = document.getElementById('map');
        if (!mapElement) return;
        
        // Create map
        const mapOptions = {
            center: { lat: this.storeLocation.lat, lng: this.storeLocation.lng },
            zoom: 17,
            styles: this.getMapStyles(),
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            gestureHandling: 'cooperative'
        };
        
        this.map = new google.maps.Map(mapElement, mapOptions);
        
        // Create custom marker
        this.createCustomMarker();
        
        // Create info window
        this.createInfoWindow();
        
        // Add click event to marker
        this.marker.addListener('click', () => {
            this.infoWindow.open(this.map, this.marker);
        });
        
        // Auto open info window
        setTimeout(() => {
            this.infoWindow.open(this.map, this.marker);
        }, 1000);
        
        // Hide loading
        const loadingElement = mapElement.querySelector('.map-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
    
    // Custom map styles
    getMapStyles() {
        return [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#f5f5f5" }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "gamma": 0.01 },
                    { "lightness": 20 },
                    { "weight": "1.39" },
                    { "color": "#000000" }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    { "weight": "0.96" },
                    { "saturation": "9" },
                    { "visibility": "on" },
                    { "color": "#000000" }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    { "visibility": "off" }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    { "lightness": 30 },
                    { "saturation": "9" },
                    { "color": "#e6e6e6" }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    { "saturation": 20 }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    { "lightness": 20 },
                    { "saturation": -20 }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    { "lightness": 10 },
                    { "saturation": -30 }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    { "color": "#d9d9d9" }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    { "saturation": 25 },
                    { "lightness": 25 },
                    { "weight": "0.01" }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    { "lightness": -20 }
                ]
            }
        ];
    }
    
    // Create custom marker
    createCustomMarker() {
        // Create custom marker icon
        const markerIcon = {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="65" viewBox="0 0 50 65">
                    <path fill="#1a6d1a" d="M25 0C11.2 0 0 11.2 0 25c0 18.75 25 40 25 40s25-21.25 25-40C50 11.2 38.8 0 25 0z"/>
                    <circle cx="25" cy="25" r="15" fill="#ffd700"/>
                    <text x="25" y="30" text-anchor="middle" fill="#1a6d1a" font-family="Arial" font-size="12" font-weight="bold">AM</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(50, 65),
            anchor: new google.maps.Point(25, 65)
        };
        
        this.marker = new google.maps.Marker({
            position: { lat: this.storeLocation.lat, lng: this.storeLocation.lng },
            map: this.map,
            title: this.storeLocation.name,
            icon: markerIcon,
            animation: google.maps.Animation.DROP
        });
    }
    
    // Create info window
    createInfoWindow() {
        const contentString = `
            <div class="map-info-window">
                <div class="info-header">
                    <h3>${this.storeLocation.name}</h3>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span>4.5 (128 reviews)</span>
                    </div>
                </div>
                <div class="info-body">
                    <p><i class="fas fa-map-marker-alt"></i> ${this.storeLocation.address}</p>
                    <p><i class="fas fa-clock"></i> Buka: 07:00 - 22:00</p>
                    <p><i class="fas fa-phone"></i> ${this.storeLocation.phone}</p>
                    <div class="info-actions">
                        <button onclick="locationSystem.getDirections()" class="btn-directions">
                            <i class="fas fa-directions"></i> Petunjuk Arah
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.infoWindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 300
        });
    }
    
    // Fallback map if Google Maps fails
    showFallbackMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;
        
        mapElement.innerHTML = `
            <div class="fallback-map">
                <div class="fallback-content">
                    <i class="fas fa-map-marked-alt"></i>
                    <h3>Lokasi A-Mart Katapang</h3>
                    <p>${this.storeLocation.address}</p>
                    <p>Koordinat: ${this.storeLocation.lat}, ${this.storeLocation.lng}</p>
                    <button onclick="locationSystem.openInGoogleMaps()" class="btn-fallback">
                        <i class="fab fa-google"></i> Buka di Google Maps
                    </button>
                </div>
            </div>
        `;
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('nav-google')?.addEventListener('click', () => {
            this.openInGoogleMaps();
        });
        
        document.getElementById('nav-waze')?.addEventListener('click', () => {
            this.openInWaze();
        });
        
        document.getElementById('nav-apple')?.addEventListener('click', () => {
            this.openInAppleMaps();
        });
        
        // Share buttons
        document.getElementById('share-whatsapp')?.addEventListener('click', () => {
            this.shareViaWhatsApp();
        });
        
        document.getElementById('share-telegram')?.addEventListener('click', () => {
            this.shareViaTelegram();
        });
        
        document.getElementById('copy-link')?.addEventListener('click', () => {
            this.copyLocationLink();
        });
    }
    
    // Navigation functions
    openInGoogleMaps() {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${this.storeLocation.lat},${this.storeLocation.lng}&destination_place_id=ChIJN1t_tDeuEmsRUsoyG83frY4`;
        window.open(url, '_blank');
    }
    
    openInWaze() {
        const url = `https://waze.com/ul?ll=${this.storeLocation.lat},${this.storeLocation.lng}&navigate=yes`;
        window.open(url, '_blank');
    }
    
    openInAppleMaps() {
        const url = `http://maps.apple.com/?daddr=${this.storeLocation.lat},${this.storeLocation.lng}`;
        window.open(url, '_blank');
    }
    
    getDirections() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${this.storeLocation.lat},${this.storeLocation.lng}`;
                window.open(url, '_blank');
            }, () => {
                this.openInGoogleMaps();
            });
        } else {
            this.openInGoogleMaps();
        }
    }
    
    // Share functions
    shareViaWhatsApp() {
        const message = `📍 *Lokasi A-Mart Katapang*\n\n${this.storeLocation.address}\n\nBuka di Google Maps: https://maps.app.goo.gl/cMZFGbiJisJzbCSv5`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }
    
    shareViaTelegram() {
        const message = `📍 Lokasi A-Mart Katapang\n\n${this.storeLocation.address}\n\nBuka di Google Maps: https://maps.app.goo.gl/cMZFGbiJisJzbCSv5`;
        const url = `https://t.me/share/url?url=${encodeURIComponent('https://amartkatapang.com')}&text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }
    
    copyLocationLink() {
        const text = `${this.storeLocation.name}\n${this.storeLocation.address}\nhttps://maps.app.goo.gl/cMZFGbiJisJzbCSv5`;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Link lokasi berhasil disalin!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showNotification('Link lokasi berhasil disalin!', 'success');
        });
    }
    
    // Generate QR Code
    generateQRCode() {
        const qrElement = document.getElementById('qr-code');
        if (!qrElement || typeof QRCode === 'undefined') return;
        
        const qrContent = `https://www.google.com/maps?q=${this.storeLocation.lat},${this.storeLocation.lng}`;
        
        try {
            // Clear placeholder
            qrElement.innerHTML = '';
            
            // Generate QR Code
            new QRCode(qrElement, {
                text: qrContent,
                width: 160,
                height: 160,
                colorDark: "#1a6d1a",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (error) {
            console.error('QR Code generation failed:', error);
        }
    }
    
    // Setup direction tabs
    setupDirectionTabs() {
        const tabs = document.querySelectorAll('.dir-tab');
        const routes = document.querySelectorAll('.dir-route');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                routes.forEach(r => r.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding route
                const routeId = tab.dataset.route;
                const routeElement = document.getElementById(routeId);
                if (routeElement) {
                    routeElement.classList.add('active');
                }
            });
        });
    }
    
    // Setup back to top button
    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
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
}

// Initialize location system
const locationSystem = new LocationSystem();
