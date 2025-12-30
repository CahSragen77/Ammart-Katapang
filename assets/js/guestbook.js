// Konfigurasi Google Sheets
const GOOGLE_SHEETS_CONFIG = {
    scriptURL: 'https://script.google.com/macros/s/AKfycby.../exec', // GANTI dengan URL Apps Script Anda
    sheetName: 'BukuTamu',
    fields: ['timestamp', 'nama', 'telepon', 'email', 'alamat', 'minat', 'pesan']
};

// Inisialisasi Form Buku Tamu
document.addEventListener('DOMContentLoaded', function() {
    const guestbookForm = document.getElementById('guestbook-form');
    
    if (guestbookForm) {
        guestbookForm.addEventListener('submit', handleGuestbookSubmit);
    }
});

// Handle form submission
async function handleGuestbookSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const messageElement = document.getElementById('guestbook-message');
    
    // Validasi form
    if (!validateGuestbookForm(form)) {
        showMessage(messageElement, 'Harap isi semua field yang wajib diisi.', 'error');
        return;
    }
    
    // Collect form data
    const formData = {
        timestamp: new Date().toLocaleString('id-ID'),
        nama: document.getElementById('name').value.trim(),
        telepon: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim() || '-',
        alamat: document.getElementById('address').value.trim(),
        minat: document.getElementById('interest').value,
        pesan: document.getElementById('message').value.trim() || '-'
    };
    
    // Tampilkan loading
    showMessage(messageElement, 'Mengirim data ke Google Sheets...', 'success');
    
    try {
        // Kirim ke Google Sheets
        const response = await saveToGoogleSheets(formData);
        
        if (response.success) {
            // Success
            showMessage(messageElement, '✅ Terima kasih! Data Anda berhasil disimpan.', 'success');
            form.reset();
            
            // Tampilkan konfirmasi di console
            console.log('Data berhasil dikirim ke Google Sheets:', formData);
            
            // Simpan juga ke localStorage sebagai backup
            saveToLocalStorage(formData);
            
        } else {
            throw new Error(response.message || 'Gagal menyimpan data');
        }
        
    } catch (error) {
        // Error handling
        console.error('Error:', error);
        showMessage(messageElement, `❌ Gagal menyimpan: ${error.message}. Coba lagi nanti.`, 'error');
        
        // Fallback: simpan ke localStorage
        saveToLocalStorage(formData);
        showMessage(messageElement, 'Data disimpan lokal (akan sync nanti).', 'success');
    }
}

// Validasi form
function validateGuestbookForm(form) {
    const requiredFields = ['name', 'phone', 'address', 'interest'];
    
    for (const fieldName of requiredFields) {
        const field = form.elements[fieldName];
        if (!field.value.trim()) {
            field.focus();
            return false;
        }
    }
    
    // Validasi nomor telepon
    const phone = form.elements['phone'].value;
    const phoneRegex = /^[0-9\-\+]{9,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showMessage(document.getElementById('guestbook-message'), 
                   'Format nomor telepon tidak valid.', 'error');
        return false;
    }
    
    // Validasi email jika diisi
    const email = form.elements['email'].value;
    if (email && !isValidEmail(email)) {
        showMessage(document.getElementById('guestbook-message'), 
                   'Format email tidak valid.', 'error');
        return false;
    }
    
    return true;
}

// Validasi email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Kirim data ke Google Sheets
async function saveToGoogleSheets(data) {
    // Format data untuk Google Sheets
    const payload = {
        action: 'addGuestbookEntry',
        sheetName: GOOGLE_SHEETS_CONFIG.sheetName,
        data: data
    };
    
    try {
        const response = await fetch(GOOGLE_SHEETS_CONFIG.scriptURL, {
            method: 'POST',
            mode: 'no-cors', // Untuk Google Apps Script
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        // Karena no-cors, kita tidak bisa membaca response
        // Asumsikan berhasil jika tidak error
        return { success: true, message: 'Data berhasil dikirim' };
        
    } catch (error) {
        throw new Error('Network error: ' + error.message);
    }
}

// Simpan ke localStorage sebagai backup
function saveToLocalStorage(data) {
    try {
        // Ambil data yang sudah ada
        const existingData = JSON.parse(localStorage.getItem('amart_guestbook_backup')) || [];
        
        // Tambah data baru
        existingData.push({
            ...data,
            localSaveTime: new Date().toISOString()
        });
        
        // Simpan kembali
        localStorage.setItem('amart_guestbook_backup', JSON.stringify(existingData));
        
        console.log('Data disimpan ke localStorage:', data);
        
        // Coba sync data yang pending
        syncPendingData();
        
    } catch (error) {
        console.error('Gagal menyimpan ke localStorage:', error);
    }
}

// Sync data yang pending ke Google Sheets
async function syncPendingData() {
    try {
        const pendingData = JSON.parse(localStorage.getItem('amart_guestbook_backup')) || [];
        
        if (pendingData.length === 0) return;
        
        console.log(`Mencoba sync ${pendingData.length} data pending...`);
        
        // Di sini bisa ditambahkan logika untuk sync data yang pending
        // Saat koneksi internet kembali
        
    } catch (error) {
        console.error('Error syncing pending data:', error);
    }
}

// Tampilkan pesan
function showMessage(element, text, type) {
    if (!element) return;
    
    element.textContent = text;
    element.className = `message ${type}`;
    element.style.display = 'block';
    
    // Auto hide setelah 5 detik
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// Ekspor fungsi untuk testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateGuestbookForm,
        isValidEmail,
        saveToLocalStorage
    };
}
