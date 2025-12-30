// ============================================
// FEEDBACK & TESTIMONI SYSTEM - A-Mart Katapang
// ============================================

class FeedbackSystem {
    constructor() {
        this.currentTab = 'feedback';
        this.testimoniRating = 5;
        this.init();
    }
    
    init() {
        this.setupTabs();
        this.setupForms();
        this.setupCharacterCounter();
        this.setupTestimoniPreview();
        this.setupRatingSelector();
        this.setupFileUpload();
        this.loadTestimonies();
        this.animateStats();
        this.setupBackupSync();
    }
    
    // ========== TAB SYSTEM ==========
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked
                button.classList.add('active');
                this.currentTab = button.dataset.tab;
                
                // Show corresponding content
                const tabId = `tab-${this.currentTab}`;
                const tabElement = document.getElementById(tabId);
                if (tabElement) {
                    tabElement.classList.add('active');
                }
                
                // Smooth scroll to top of tab content
                document.querySelector('.tab-contents').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }
    
    // ========== FORM HANDLING ==========
    setupForms() {
        // Feedback Form
        const feedbackForm = document.getElementById('feedback-form');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitFeedback();
            });
        }
        
        // Testimoni Form
        const testimoniForm = document.getElementById('testimoni-form');
        if (testimoniForm) {
            testimoniForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitTestimoni();
            });
        }
    }
    
    // Character counter for feedback message
    setupCharacterCounter() {
        const messageInput = document.getElementById('feedback-message');
        const charCounter = document.getElementById('char-counter');
        
        if (messageInput && charCounter) {
            messageInput.addEventListener('input', () => {
                const length = messageInput.value.length;
                charCounter.textContent = length;
                
                // Warning at 400 characters
                if (length >= 400) {
                    charCounter.style.color = '#ff6b6b';
                } else if (length >= 300) {
                    charCounter.style.color = '#ffa502';
                } else {
                    charCounter.style.color = '#666';
                }
            });
        }
    }
    
    // ========== TESTIMONI PREVIEW ==========
    setupTestimoniPreview() {
        const nameInput = document.getElementById('testimoni-name');
        const messageInput = document.getElementById('testimoni-message');
        const ratingInput = document.getElementById('testimoni-rating');
        
        const updatePreview = () => {
            const name = nameInput?.value || 'Nama Anda';
            const message = messageInput?.value || 'Testimoni Anda akan muncul di sini...';
            const rating = parseInt(ratingInput?.value || 5);
            
            // Update preview
            const previewName = document.getElementById('preview-name');
            const previewText = document.getElementById('preview-text');
            const previewStars = document.querySelectorAll('.preview-rating i');
            
            if (previewName) previewName.textContent = name;
            if (previewText) previewText.textContent = message;
            
            // Update stars
            if (previewStars) {
                previewStars.forEach((star, index) => {
                    if (index < rating) {
                        star.style.color = '#ffd700';
                    } else {
                        star.style.color = '#ddd';
                    }
                });
            }
        };
        
        // Update preview on input
        if (nameInput) nameInput.addEventListener('input', updatePreview);
        if (messageInput) messageInput.addEventListener('input', updatePreview);
        if (ratingInput) ratingInput.addEventListener('change', updatePreview);
        
        // Initial update
        updatePreview();
    }
    
    // ========== RATING SELECTOR ==========
    setupRatingSelector() {
        const ratingOptions = document.querySelectorAll('.rating-option');
        const ratingInput = document.getElementById('testimoni-rating');
        
        ratingOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all
                ratingOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked
                option.classList.add('active');
                
                // Update hidden input
                const rating = option.dataset.value;
                if (ratingInput) {
                    ratingInput.value = rating;
                    this.testimoniRating = parseInt(rating);
                }
                
                // Update preview
                this.updateTestimoniPreview();
            });
        });
    }
    
    updateTestimoniPreview() {
        const ratingInput = document.getElementById('testimoni-rating');
        const previewStars = document.querySelectorAll('.preview-rating i');
        
        if (ratingInput && previewStars) {
            const rating = parseInt(ratingInput.value);
            
            previewStars.forEach((star, index) => {
                if (index < rating) {
                    star.style.color = '#ffd700';
                } else {
                    star.style.color = '#ddd';
                }
            });
        }
    }
    
    // ========== FILE UPLOAD ==========
    setupFileUpload() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('testimoni-photo');
        const previewArea = document.getElementById('preview-area');
        const photoPreview = document.getElementById('photo-preview');
        const removePhotoBtn = document.querySelector('.remove-photo');
        
        if (!uploadArea || !fileInput) return;
        
        // Click on upload area triggers file input
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            uploadArea.style.borderColor = '#4a6bff';
            uploadArea.style.background = 'rgba(74, 107, 255, 0.05)';
        }
        
        function unhighlight() {
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.background = '#f9f9f9';
        }
        
        // Handle file selection
        uploadArea.addEventListener('drop', handleDrop, false);
        fileInput.addEventListener('change', handleFileSelect, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }
        
        function handleFileSelect(e) {
            const files = e.target.files;
            handleFiles(files);
        }
        
        function handleFiles(files) {
            if (files.length === 0) return;
            
            const file = files[0];
            
            // Validate file
            if (!file.type.match('image.*')) {
                FeedbackSystem.showAlert('Error', 'Hanya file gambar yang diperbolehkan', 'error');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                FeedbackSystem.showAlert('Error', 'Ukuran file maksimal 5MB', 'error');
                return;
            }
            
            // Preview image
            const reader = new FileReader();
            reader.onload = function(e) {
                if (photoPreview) {
                    photoPreview.src = e.target.result;
                    uploadArea.style.display = 'none';
                    previewArea.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
        
        // Remove photo
        if (removePhotoBtn && previewArea && uploadArea) {
            removePhotoBtn.addEventListener('click', () => {
                fileInput.value = '';
                previewArea.style.display = 'none';
                uploadArea.style.display = 'block';
            });
        }
    }
    
    // ========== FORM SUBMISSION ==========
    async submitFeedback() {
        const form = document.getElementById('feedback-form');
        if (!form) return;
        
        // Validate form
        if (!this.validateFeedbackForm(form)) {
            return;
        }
        
        // Get form data
        const formData = {
            timestamp: new Date().toLocaleString('id-ID'),
            type: 'feedback',
            name: document.getElementById('feedback-name').value.trim(),
            contact: document.getElementById('feedback-contact').value.trim(),
            display_type: document.querySelector('input[name="display_type"]:checked').value,
            feedback_type: document.querySelector('input[name="feedback_type"]:checked').value,
            category: document.getElementById('feedback-category').value,
            message: document.getElementById('feedback-message').value.trim(),
            rating: document.querySelector('input[name="rating"]:checked')?.value || '0',
            status: 'pending'
        };
        
        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitBtn.disabled = true;
        
        try {
            // LAYER 1: Save to Google Sheets
            const sheetsResult = await this.saveToGoogleSheets(formData, 'feedback');
            
            // LAYER 2: Send email notification
            await this.sendEmailNotification(formData, 'feedback');
            
            // LAYER 3: Save to local backup
            this.saveToLocalStorage('feedback', formData);
            
            // Show success message
            FeedbackSystem.showAlert(
                'Terima Kasih!',
                'Saran dan kritik Anda telah berhasil dikirim. Tim kami akan menindaklanjuti dalam 1x24 jam.',
                'success'
            );
            
            // Reset form
            form.reset();
            document.getElementById('char-counter').textContent = '0';
            
            // Update stats
            this.incrementStat('feedback');
            
        } catch (error) {
            console.error('Error submitting feedback:', error);
            
            // Fallback to local storage
            this.saveToLocalStorage('feedback', formData);
            
            FeedbackSystem.showAlert(
                'Data Disimpan Lokal',
                'Koneksi internet bermasalah. Data telah disimpan dan akan dikirim otomatis saat koneksi pulih.',
                'warning'
            );
            
            form.reset();
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async submitTestimoni() {
        const form = document.getElementById('testimoni-form');
        if (!form) return;
        
        // Validate form
        if (!this.validateTestimoniForm(form)) {
            return;
        }
        
        // Get form data
        const formData = {
            timestamp: new Date().toLocaleString('id-ID'),
            type: 'testimoni',
            name: document.getElementById('testimoni-name').value.trim(),
            role: document.getElementById('testimoni-role').value.trim() || '',
            rating: document.getElementById('testimoni-rating').value,
            message: document.getElementById('testimoni-message').value.trim(),
            agree_publish: document.getElementById('agree-publish').checked,
            photo: '', // Base64 will be added if exists
            status: 'pending_review'
        };
        
        // Handle photo if exists
        const fileInput = document.getElementById('testimoni-photo');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            formData.photo = await this.fileToBase64(file);
            formData.photo_name = file.name;
        }
        
        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mempublikasikan...';
        submitBtn.disabled = true;
        
        try {
            // LAYER 1: Save to Google Sheets
            const sheetsResult = await this.saveToGoogleSheets(formData, 'testimoni');
            
            // LAYER 2: Send email notification
            await this.sendEmailNotification(formData, 'testimoni');
            
            // LAYER 3: Save to local backup
            this.saveToLocalStorage('testimoni', formData);
            
            // Show success message
            FeedbackSystem.showAlert(
                'Testimoni Terpublikasi!',
                'Terima kasih telah berbagi pengalaman. Testimoni Anda akan ditampilkan setelah proses moderasi.',
                'success'
            );
            
            // Reset form
            form.reset();
            const previewArea = document.getElementById('preview-area');
            const uploadArea = document.getElementById('upload-area');
            if (previewArea && uploadArea) {
                previewArea.style.display = 'none';
                uploadArea.style.display = 'block';
            }
            
            // Reload public testimonies
            this.loadTestimonies();
            
            // Update stats
            this.incrementStat('testimoni');
            
        } catch (error) {
            console.error('Error submitting testimoni:', error);
            
            // Fallback to local storage
            this.saveToLocalStorage('testimoni', formData);
            
            FeedbackSystem.showAlert(
                'Data Disimpan Lokal',
                'Koneksi internet bermasalah. Data telah disimpan dan akan dikirim otomatis saat koneksi pulih.',
                'warning'
            );
            
            form.reset();
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    // ========== VALIDATION ==========
    validateFeedbackForm(form) {
        const requiredFields = [
            { id: 'feedback-name', name: 'Nama' },
            { id: 'feedback-contact', name: 'Kontak' },
            { id: 'feedback-category', name: 'Kategori' },
            { id: 'feedback-message', name: 'Pesan' }
        ];
        
        for (const field of requiredFields) {
            const element = document.getElementById(field.id);
            if (!element || !element.value.trim()) {
                FeedbackSystem.showAlert(
                    'Form Tidak Lengkap',
                    `Harap isi field "${field.name}"`,
                    'error'
                );
                element?.focus();
                return false;
            }
        }
        
        // Validate message length
        const message = document.getElementById('feedback-message').value.trim();
        if (message.length < 20) {
            FeedbackSystem.showAlert(
                'Pesan Terlalu Pendek',
                'Harap tulis pesan minimal 20 karakter',
                'error'
            );
            return false;
        }
        
        // Validate contact
        const contact = document.getElementById('feedback-contact').value.trim();
        if (!this.isValidContact(contact)) {
            FeedbackSystem.showAlert(
                'Format Kontak Tidak Valid',
                'Harap masukkan nomor HP atau email yang valid',
                'error'
            );
            return false;
        }
        
        return true;
    }
    
    validateTestimoniForm(form) {
        const requiredFields = [
            { id: 'testimoni-name', name: 'Nama' },
            { id: 'testimoni-message', name: 'Testimoni' }
        ];
        
        for (const field of requiredFields) {
            const element = document.getElementById(field.id);
            if (!element || !element.value.trim()) {
                FeedbackSystem.showAlert(
                    'Form Tidak Lengkap',
                    `Harap isi field "${field.name}"`,
                    'error'
                );
                element?.focus();
                return false;
            }
        }
        
        // Check agreement
        if (!document.getElementById('agree-publish').checked) {
            FeedbackSystem.showAlert(
                'Persetujuan Diperlukan',
                'Anda harus menyetujui untuk mempublikasikan testimoni',
                'error'
            );
            return false;
        }
        
        return true;
    }
    
    isValidContact(contact) {
        // Check if it's email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(contact)) return true;
        
        // Check if it's phone number (Indonesian format)
        const phoneRegex = /^(?:\+62|62|0)[2-9][0-9]{7,11}$/;
        const cleanPhone = contact.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone);
    }
    
    // ========== GOOGLE SHEETS INTEGRATION ==========
    async saveToGoogleSheets(data, type) {
        const scriptURL = GOOGLE_SHEETS[type] || GOOGLE_SHEETS.feedback;
        
        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'saveData',
                    type: type,
                    data: data
                })
            });
            
            // Since we're using no-cors, we can't read the response
            // But we assume it's successful if no network error
            console.log(`Data sent to Google Sheets (${type}):`, data);
            return { success: true };
            
        } catch (error) {
            console.error('Google Sheets error:', error);
            throw new Error('Gagal mengirim ke Google Sheets');
        }
    }
    
    // ========== EMAIL NOTIFICATION ==========
    async sendEmailNotification(data, type) {
        // This would be handled by Google Apps Script
        // We just log it for now
        console.log(`Email notification for ${type}:`, data);
        return { success: true };
    }
    
    // ========== LOCAL STORAGE BACKUP ==========
    saveToLocalStorage(type, data) {
        try {
            const key = `amart_${type}_backup`;
            const existingData = JSON.parse(localStorage.getItem(key)) || [];
            
            // Add metadata
            const backupData = {
                ...data,
                _backup_timestamp: new Date().toISOString(),
                _backup_id: Date.now(),
                _sync_status: 'pending'
            };
            
            existingData.push(backupData);
            
            // Keep only last 100 items
            if (existingData.length > 100) {
                existingData.shift();
            }
            
            localStorage.setItem(key, JSON.stringify(existingData));
            console.log(`Data backed up to localStorage (${type}):`, backupData);
            
            // Trigger sync in background
            this.syncPendingData();
            
        } catch (error) {
            console.error('Local storage error:', error);
        }
    }
    
    async syncPendingData() {
        // Sync feedback
        await this.syncType('feedback');
        
        // Sync testimoni
        await this.syncType('testimoni');
        
        // Sync donation (handled in donation.js)
    }
    
    async syncType(type) {
        const key = `amart_${type}_backup`;
        const pendingData = JSON.parse(localStorage.getItem(key)) || [];
        
        if (pendingData.length === 0) return;
        
        console.log(`Syncing ${pendingData.length} ${type} items...`);
        
        const successfulSyncs = [];
        
        for (const item of pendingData) {
            if (item._sync_status === 'synced') continue;
            
            try {
                await this.saveToGoogleSheets(item, type);
                
                // Mark as synced
                item._sync_status = 'synced';
                item._synced_at = new Date().toISOString();
                successfulSyncs.push(item._backup_id);
                
            } catch (error) {
                console.error(`Failed to sync ${type} item:`, error);
                break; // Stop on first error
            }
        }
        
        // Update localStorage with synced status
        if (successfulSyncs.length > 0) {
            const updatedData = pendingData.map(item => {
                if (successfulSyncs.includes(item._backup_id)) {
                    return { ...item, _sync_status: 'synced' };
                }
                return item;
            });
            
            localStorage.setItem(key, JSON.stringify(updatedData));
            console.log(`Synced ${successfulSyncs.length} ${type} items`);
        }
    }
    
    setupBackupSync() {
        // Sync every 5 minutes if online
        setInterval(() => {
            if (navigator.onLine) {
                this.syncPendingData();
            }
        }, 5 * 60 * 1000);
        
        // Sync when coming online
        window.addEventListener('online', () => {
            console.log('Connection restored, syncing pending data...');
            this.syncPendingData();
        });
    }
    
    // ========== PUBLIC TESTIMONIES ==========
    async loadTestimonies(filter = 'all') {
        const grid = document.getElementById('testimonies-grid');
        if (!grid) return;
        
        grid.innerHTML = `
            <div class="loading-testimonies">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Memuat testimoni...</p>
            </div>
        `;
        
        try {
            // Try to get from Google Sheets first
            let testimonies = await this.fetchTestimoniesFromSheets();
            
            // Fallback to sample data
            if (!testimonies || testimonies.length === 0) {
                testimonies = this.getSampleTestimonies();
            }
            
            // Filter if needed
            if (filter !== 'all') {
                testimonies = testimonies.filter(t => t.rating == filter);
            }
            
            // Display testimonies
            this.displayTestimonies(testimonies);
            
            // Update stats
            this.updateTestimonyStats(testimonies);
            
        } catch (error) {
            console.error('Error loading testimonies:', error);
            
            // Use sample data on error
            const sampleTestimonies = this.getSampleTestimonies();
            this.displayTestimonies(sampleTestimonies);
            this.updateTestimonyStats(sampleTestimonies);
        }
    }
    
    async fetchTestimoniesFromSheets() {
        // This would fetch from Google Sheets
        // For now, return sample data
        return this.getSampleTestimonies();
    }
    
    getSampleTestimonies() {
        return [
            {
                id: 1,
                name: "Budi Santoso",
                role: "Warga Katapang",
                rating: 5,
                message: "Pelayanan di A-Mart sangat ramah dan produknya lengkap. Harga juga bersaing dengan toko lain. Recommended!",
                date: "3 hari yang lalu",
                avatar: "BS"
            },
            {
                id: 2,
                name: "Ibu Siti",
                role: "Ibu Rumah Tangga",
                rating: 5,
                message: "Sayur dan buah selalu segar, dagingnya juga berkualitas. Sekarang belanja jadi lebih praktis dengan layanan antar.",
                date: "1 minggu yang lalu",
                avatar: "IS"
            },
            {
                id: 3,
                name: "Rudi Hermawan",
                role: "Karyawan Swasta",
                rating: 4,
                message: "Parkirannya luas dan toko bersih. Hanya kadang antrian di kasir agak panjang saat weekend.",
                date: "2 minggu yang lalu",
                avatar: "RH"
            },
            {
                id: 4,
                name: "Ani Wijaya",
                rating: 5,
                message: "Produk importnya lengkap, bisa dapat barang yang susah dicari di toko lain. Staffnya sangat helpful!",
                date: "1 bulan yang lalu",
                avatar: "AW"
            },
            {
                id: 5,
                name: "Pak Hadi",
                role: "Pedagang",
                rating: 5,
                message: "Untuk grosir harganya sangat kompetitif. Bisa nego untuk pembelian dalam jumlah besar. Puas berbelanja disini.",
                date: "1 bulan yang lalu",
                avatar: "PH"
            },
            {
                id: 6,
                name: "Maya Sari",
                rating: 4,
                message: "Tempatnya nyaman dan AC dingin. Cuma kadang beberapa produk cepat habis, harus datang pagi.",
                date: "2 bulan yang lalu",
                avatar: "MS"
            }
        ];
    }
    
    displayTestimonies(testimonies) {
        const grid = document.getElementById('testimonies-grid');
        if (!grid) return;
        
        if (testimonies.length === 0) {
            grid.innerHTML = `
                <div class="no-testimonies">
                    <i class="fas fa-comment-slash"></i>
                    <p>Belum ada testimoni untuk ditampilkan</p>
                </div>
            `;
            return;
        }
        
        const testimoniesHTML = testimonies.map(testimoni => `
            <div class="testimonial-card" data-rating="${testimoni.rating}">
                <div class="testimonial-header">
                    <div class="testimonial-avatar">
                        ${testimoni.avatar || testimoni.name.charAt(0)}
                    </div>
                    <div class="testimonial-info">
                        <h4>${testimoni.name}</h4>
                        ${testimoni.role ? `<p class="testimonial-role">${testimoni.role}</p>` : ''}
                        <div class="testimonial-rating">
                            ${'<i class="fas fa-star"></i>'.repeat(testimoni.rating)}
                        </div>
                    </div>
                </div>
                <div class="testimonial-body">
                    <p>"${testimoni.message}"</p>
                </div>
                <span class="testimonial-date">${testimoni.date}</span>
            </div>
        `).join('');
        
        grid.innerHTML = testimoniesHTML;
        
        // Setup filter buttons
        this.setupTestimonyFilters();
    }
    
    setupTestimonyFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                
                // Filter cards
                testimonialCards.forEach(card => {
                    if (filter === 'all' || card.dataset.rating === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    updateTestimonyStats(testimonies) {
        const total = testimonies.length;
        const averageRating = testimonies.reduce((sum, t) => sum + t.rating, 0) / total;
        const positive = testimonies.filter(t => t.rating >= 4).length;
        
        document.getElementById('total-testimonies').textContent = total;
        document.getElementById('average-rating').textContent = averageRating.toFixed(1);
        document.getElementById('positive-testimonies').textContent = positive;
    }
    
    // ========== ANIMATIONS ==========
    animateStats() {
        const statCards = document.querySelectorAll('.stat-card h3[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.dataset.count);
                    this.animateValue(element, 0, target, 2000);
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
        
        statCards.forEach(card => observer.observe(card));
    }
    
    animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    incrementStat(type) {
        const statElements = {
            feedback: document.querySelector('.stat-card:nth-child(3) h3'),
            testimoni: document.querySelector('.stat-card:nth-child(1) h3')
        };
        
        const element = statElements[type];
        if (element) {
            const current = parseInt(element.textContent);
            this.animateValue(element, current, current + 1, 1000);
        }
    }
    
    // ========== UTILITIES ==========
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    static showAlert(title, text, icon) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'OK',
            confirmButtonColor: '#4a6bff',
            timer: icon === 'success' ? 3000 : undefined,
            timerProgressBar: icon === 'success'
        });
    }
}

// Initialize the system
const feedbackSystem = new FeedbackSystem();
