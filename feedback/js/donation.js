// ============================================
// DONATION SYSTEM - A-Mart Katapang
// ============================================

class DonationSystem {
    constructor() {
        this.selectedBank = 'mandiri';
        this.selectedAmount = 50000;
        this.selectedProgram = 'quran';
        this.bankAccounts = {
            mandiri: {
                name: 'Bank Mandiri',
                number: '123-456-7890',
                holder: 'A-Mart Katapang',
                image: 'assets/banks/mandiri.png'
            },
            bca: {
                name: 'Bank BCA',
                number: '098-765-4321',
                holder: 'A-Mart Katapang',
                image: 'assets/banks/bca.png'
            },
            bri: {
                name: 'Bank BRI',
                number: '456-789-0123',
                holder: 'A-Mart Katapang',
                image: 'assets/banks/bri.png'
            },
            bsi: {
                name: 'Bank BSI',
                number: '789-012-3456',
                holder: 'A-Mart Katapang',
                image: 'assets/banks/bsi.png'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupAmountSelection();
        this.setupBankSelection();
        this.setupProgramSelection();
        this.setupForm();
        this.setupPreview();
        this.generateDonationCode();
    }
    
    // ========== AMOUNT SELECTION ==========
    setupAmountSelection() {
        const amountOptions = document.querySelectorAll('.amount-option');
        const customAmountDiv = document.getElementById('custom-amount');
        const donationAmountInput = document.getElementById('donation-amount');
        const selectedAmountInput = document.getElementById('selected-amount');
        
        amountOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all
                amountOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked
                option.classList.add('active');
                
                const amount = option.dataset.amount;
                
                if (amount === 'custom') {
                    // Show custom amount input
                    customAmountDiv.style.display = 'block';
                    donationAmountInput.focus();
                    this.selectedAmount = 0;
                } else {
                    // Hide custom amount
                    customAmountDiv.style.display = 'none';
                    this.selectedAmount = parseInt(amount);
                    if (selectedAmountInput) {
                        selectedAmountInput.value = amount;
                    }
                }
            });
        });
        
        // Handle custom amount input
        if (donationAmountInput) {
            donationAmountInput.addEventListener('input', () => {
                const value = parseInt(donationAmountInput.value) || 0;
                this.selectedAmount = value;
                if (selectedAmountInput) {
                    selectedAmountInput.value = value;
                }
            });
            
            // Validate minimum amount
            donationAmountInput.addEventListener('blur', () => {
                const value = parseInt(donationAmountInput.value) || 0;
                if (value < 10000 && value > 0) {
                    DonationSystem.showAlert(
                        'Jumlah Minimum',
                        'Donasi minimal Rp 10.000',
                        'warning'
                    );
                    donationAmountInput.value = 10000;
                    this.selectedAmount = 10000;
                }
            });
        }
        
        // Set first option as active by default
        if (amountOptions.length > 0) {
            amountOptions[0].classList.add('active');
        }
    }
    
    // ========== BANK SELECTION ==========
    setupBankSelection() {
        const bankOptions = document.querySelectorAll('.bank-option');
        const selectedBankInput = document.getElementById('selected-bank');
        
        bankOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all
                bankOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked
                option.classList.add('active');
                
                // Update selected bank
                this.selectedBank = option.dataset.bank;
                if (selectedBankInput) {
                    selectedBankInput.value = this.selectedBank;
                }
                
                // Update preview if open
                this.updatePreview();
            });
        });
    }
    
    // ========== PROGRAM SELECTION ==========
    setupProgramSelection() {
        const programCards = document.querySelectorAll('.program-card');
        const programSelect = document.getElementById('donor-program');
        
        programCards.forEach(card => {
            card.addEventListener('click', () => {
                const program = card.dataset.program;
                this.selectedProgram = program;
                
                if (programSelect) {
                    programSelect.value = program;
                }
                
                // Visual feedback
                programCards.forEach(c => c.style.transform = 'translateY(0)');
                card.style.transform = 'translateY(-5px)';
            });
        });
        
        // Sync select with cards
        if (programSelect) {
            programSelect.addEventListener('change', () => {
                this.selectedProgram = programSelect.value;
                
                // Visual feedback on cards
                programCards.forEach(card => {
                    if (card.dataset.program === this.selectedProgram) {
                        card.style.transform = 'translateY(-5px)';
                    } else {
                        card.style.transform = 'translateY(0)';
                    }
                });
            });
        }
    }
    
    // ========== FORM HANDLING ==========
    setupForm() {
        const form = document.getElementById('donation-form');
        const previewBtn = document.getElementById('preview-donation');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitDonation();
            });
        }
        
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                this.showPreview();
            });
        }
    }
    
    validateDonationForm() {
        const requiredFields = [
            { id: 'donor-name', name: 'Nama Donatur' },
            { id: 'donor-email', name: 'Email' },
            { id: 'donor-phone', name: 'Nomor WhatsApp' },
            { id: 'donor-program', name: 'Program Donasi' }
        ];
        
        for (const field of requiredFields) {
            const element = document.getElementById(field.id);
            if (!element || !element.value.trim()) {
                DonationSystem.showAlert(
                    'Form Tidak Lengkap',
                    `Harap isi field "${field.name}"`,
                    'error'
                );
                element?.focus();
                return false;
            }
        }
        
        // Validate email
        const email = document.getElementById('donor-email').value.trim();
        if (!this.isValidEmail(email)) {
            DonationSystem.showAlert(
                'Email Tidak Valid',
                'Harap masukkan alamat email yang valid',
                'error'
            );
            return false;
        }
        
        // Validate phone
        const phone = document.getElementById('donor-phone').value.trim();
        if (!this.isValidPhone(phone)) {
            DonationSystem.showAlert(
                'Nomor WhatsApp Tidak Valid',
                'Harap masukkan nomor WhatsApp yang valid (contoh: 081234567890)',
                'error'
            );
            return false;
        }
        
        // Validate amount
        if (this.selectedAmount < 10000) {
            DonationSystem.showAlert(
                'Jumlah Donasi',
                'Donasi minimal Rp 10.000',
                'error'
            );
            return false;
        }
        
        // Check agreement
        if (!document.getElementById('agree-terms').checked) {
            DonationSystem.showAlert(
                'Persetujuan Diperlukan',
                'Anda harus menyetujui syarat dan ketentuan donasi',
                'error'
            );
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^(?:\+62|62|0)[2-9][0-9]{7,11}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone);
    }
    
    // ========== DONATION SUBMISSION ==========
    async submitDonation() {
        if (!this.validateDonationForm()) {
            return;
        }
        
        // Get form data
        const formData = {
            timestamp: new Date().toLocaleString('id-ID'),
            type: 'donation',
            donation_code: this.generateDonationCode(),
            name: document.getElementById('donor-name').value.trim(),
            email: document.getElementById('donor-email').value.trim(),
            phone: document.getElementById('donor-phone').value.trim(),
            program: document.getElementById('donor-program').value,
            amount: this.selectedAmount,
            bank: this.selectedBank,
            message: document.getElementById('donation-message').value.trim() || '',
            status: 'pending_payment',
            payment_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('id-ID')
        };
        
        // Show loading
        const submitBtn = document.querySelector('#donation-form button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        submitBtn.disabled = true;
        
        try {
            // LAYER 1: Save to Google Sheets
            await this.saveToGoogleSheets(formData);
            
            // LAYER 2: Send email notification
            await this.sendDonationEmail(formData);
            
            // LAYER 3: Save to local backup
            this.saveDonationToLocal(formData);
            
            // Show success modal with payment instructions
            this.showPaymentInstructions(formData);
            
            // Reset form
            document.getElementById('donation-form').reset();
            
            // Reset selections
            this.selectedAmount = 50000;
            this.selectedBank = 'mandiri';
            this.selectedProgram = 'quran';
            
            // Update UI
            this.updateUIAfterDonation();
            
            // Update stats
            this.incrementDonationStat();
            
        } catch (error) {
            console.error('Donation submission error:', error);
            
            // Fallback to local storage
            this.saveDonationToLocal(formData);
            
            DonationSystem.showAlert(
                'Data Disimpan Lokal',
                'Koneksi internet bermasalah. Data donasi telah disimpan dan akan diproses saat koneksi pulih.',
                'warning'
            );
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    // ========== PAYMENT INSTRUCTIONS ==========
    showPaymentInstructions(donationData) {
        const bank = this.bankAccounts[this.selectedBank];
        const modalBody = document.getElementById('modal-body');
        const modal = document.getElementById('donation-modal');
        
        if (!modalBody || !modal) return;
        
        const instructions = `
            <div class="donation-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                
                <h4>Donasi Berhasil Dicatat!</h4>
                <p>Kode Donasi: <strong>${donationData.donation_code}</strong></p>
                
                <div class="payment-details">
                    <h5><i class="fas fa-university"></i> Transfer ke:</h5>
                    <div class="bank-detail">
                        <p><strong>Bank:</strong> ${bank.name}</p>
                        <p><strong>No. Rekening:</strong> ${bank.number}</p>
                        <p><strong>Atas Nama:</strong> ${bank.holder}</p>
                        <p><strong>Jumlah:</strong> Rp ${donationData.amount.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                
                <div class="instructions">
                    <h5><i class="fas fa-list-ol"></i> Langkah-langkah:</h5>
                    <ol>
                        <li>Transfer sesuai jumlah di atas</li>
                        <li>Screenshot bukti transfer</li>
                        <li>Kirim ke WhatsApp: <strong>0812-3456-7890</strong></li>
                        <li>Sertakan kode: <strong>${donationData.donation_code}</strong></li>
                    </ol>
                </div>
                
                <div class="deadline-warning">
                    <i class="fas fa-clock"></i>
                    <p>Konfirmasi sebelum: <strong>${donationData.payment_deadline}</strong></p>
                </div>
                
                <div class="action-buttons">
                    <button class="btn-copy-code" data-code="${donationData.donation_code}">
                        <i class="fas fa-copy"></i> Salin Kode
                    </button>
                    <button class="btn-open-whatsapp" data-phone="6281234567890" data-message="Konfirmasi Donasi ${donationData.donation_code}">
                        <i class="fab fa-whatsapp"></i> Buka WhatsApp
                    </button>
                </div>
            </div>
        `;
        
        modalBody.innerHTML = instructions;
        modal.classList.add('active');
        
        // Add event listeners to buttons
        this.setupModalButtons(donationData);
        
        // Setup modal close
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
    }
    
    setupModalButtons(donationData) {
        // Copy code button
        const copyBtn = document.querySelector('.btn-copy-code');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const code = copyBtn.dataset.code;
                navigator.clipboard.writeText(code).then(() => {
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Salin Kode';
                    }, 2000);
                });
            });
        }
        
        // WhatsApp button
        const whatsappBtn = document.querySelector('.btn-open-whatsapp');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => {
                const phone = whatsappBtn.dataset.phone;
                const message = encodeURIComponent(whatsappBtn.dataset.message);
                const url = `https://wa.me/${phone}?text=${message}`;
                window.open(url, '_blank');
            });
        }
    }
    
    // ========== PREVIEW FUNCTIONALITY ==========
    setupPreview() {
        const previewBtn = document.getElementById('preview-donation');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                this.showPreview();
            });
        }
    }
    
    showPreview() {
        if (!this.validateDonationForm(true)) { // true for preview mode
            return;
        }
        
        const bank = this.bankAccounts[this.selectedBank];
        const programSelect = document.getElementById('donor-program');
        const programText = programSelect?.options[programSelect.selectedIndex]?.text || '';
        
        Swal.fire({
            title: 'Preview Donasi',
            html: `
                <div class="donation-preview">
                    <div class="preview-section">
                        <h5><i class="fas fa-user"></i> Data Donatur</h5>
                        <p><strong>Nama:</strong> ${document.getElementById('donor-name').value}</p>
                        <p><strong>Email:</strong> ${document.getElementById('donor-email').value}</p>
                        <p><strong>WhatsApp:</strong> ${document.getElementById('donor-phone').value}</p>
                    </div>
                    
                    <div class="preview-section">
                        <h5><i class="fas fa-project-diagram"></i> Program Donasi</h5>
                        <p><strong>Program:</strong> ${programText}</p>
                        <p><strong>Jumlah:</strong> Rp ${this.selectedAmount.toLocaleString('id-ID')}</p>
                    </div>
                    
                    <div class="preview-section">
                        <h5><i class="fas fa-university"></i> Bank Transfer</h5>
                        <p><strong>Bank:</strong> ${bank.name}</p>
                        <p><strong>Rekening:</strong> ${bank.number}</p>
                        <p><strong>Atas Nama:</strong> ${bank.holder}</p>
                    </div>
                    
                    ${document.getElementById('donation-message').value ? `
                    <div class="preview-section">
                        <h5><i class="fas fa-comment"></i> Pesan</h5>
                        <p>${document.getElementById('donation-message').value}</p>
                    </div>
                    ` : ''}
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Lanjutkan Donasi',
            cancelButtonText: 'Edit Data',
            confirmButtonColor: '#4a6bff',
            width: 600,
            customClass: {
                popup: 'donation-preview-modal'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Submit the form
                document.getElementById('donation-form').dispatchEvent(new Event('submit'));
            }
        });
    }
    
    updatePreview() {
        // This would update any real-time preview if needed
    }
    
    // ========== DATA PERSISTENCE ==========
    async saveToGoogleSheets(data) {
        const scriptURL = GOOGLE_SHEETS.donation || GOOGLE_SHEETS.feedback;
        
        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'saveDonation',
                    data: data
                })
            });
            
            console.log('Donation sent to Google Sheets:', data);
            return { success: true };
            
        } catch (error) {
            console.error('Google Sheets donation error:', error);
            throw new Error('Gagal mengirim donasi ke Google Sheets');
        }
    }
    
    async sendDonationEmail(data) {
        // This would trigger email via Google Apps Script
        console.log('Donation email notification:', data);
        return { success: true };
    }
    
    saveDonationToLocal(data) {
        try {
            const key = 'amart_donation_backup';
            const existingData = JSON.parse(localStorage.getItem(key)) || [];
            
            const backupData = {
                ...data,
                _backup_timestamp: new Date().toISOString(),
                _backup_id: Date.now(),
                _sync_status: 'pending'
            };
            
            existingData.push(backupData);
            
            // Keep only last 50 donations
            if (existingData.length > 50) {
                existingData.shift();
            }
            
            localStorage.setItem(key, JSON.stringify(existingData));
            console.log('Donation backed up to localStorage:', backupData);
            
        } catch (error) {
            console.error('Local storage donation error:', error);
        }
    }
    
    // ========== UTILITIES ==========
    generateDonationCode() {
        const date = new Date();
        const timestamp = date.getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `DON-${timestamp}${random}`;
    }
    
    updateUIAfterDonation() {
        // Reset amount selection
        const amountOptions = document.querySelectorAll('.amount-option');
        const customAmountDiv = document.getElementById('custom-amount');
        
        if (amountOptions.length > 0) {
            amountOptions.forEach(opt => opt.classList.remove('active'));
            amountOptions[0].classList.add('active');
        }
        
        if (customAmountDiv) {
            customAmountDiv.style.display = 'none';
        }
        
        // Reset bank selection
        const bankOptions = document.querySelectorAll('.bank-option');
        if (bankOptions.length > 0) {
            bankOptions.forEach(opt => opt.classList.remove('active'));
            bankOptions[0].classList.add('active');
        }
    }
    
    incrementDonationStat() {
        const statElement = document.querySelector('.stat-card:nth-child(1) h3');
        if (statElement) {
            const current = parseInt(statElement.textContent);
            this.animateValue(statElement, current, current + 1, 1000);
        }
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
    
    static showAlert(title, text, icon) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'OK',
            confirmButtonColor: '#4a6bff',
            timer: icon === 'success' ? 3000 : undefined
        });
    }
}

// Initialize the system
const donationSystem = new DonationSystem();
