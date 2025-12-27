// Guestbook Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookMessage = document.getElementById('guestbook-message');
    
    if (guestbookForm) {
        guestbookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ambil data dari form
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const interest = document.getElementById('interest').value;
            
            // Validasi sederhana
            if (!name || !phone || !address) {
                showMessage('Harap isi semua field yang wajib diisi.', 'error');
                return;
            }
            
            // Validasi nomor telepon
            const phoneRegex = /^[0-9\-\+]{9,15}$/;
            if (!phoneRegex.test(phone)) {
                showMessage('Format nomor telepon tidak valid.', 'error');
                return;
            }
            
            // Simulasi pengiriman data ke Google Sheets
            // Di implementasi nyata, ini akan dihubungkan dengan Google Apps Script
            simulateSubmitToGoogleSheets({
                name,
                phone,
                address,
                interest,
                timestamp: new Date().toISOString()
            });
            
            // Tampilkan pesan sukses
            showMessage('Terima kasih! Data Anda telah berhasil dikirim.', 'success');
            
            // Reset form
            guestbookForm.reset();
        });
    }
    
    // Fungsi untuk menampilkan pesan
    function showMessage(text, type) {
        if (!guestbookMessage) return;
        
        guestbookMessage.textContent = text;
        guestbookMessage.className = `message ${type}`;
        guestbookMessage.style.display = 'block';
        
        // Sembunyikan pesan setelah 5 detik
        setTimeout(() => {
            guestbookMessage.style.display = 'none';
        }, 5000);
    }
    
    // Fungsi simulasi pengiriman ke Google Sheets
    function simulateSubmitToGoogleSheets(data) {
        console.log('Data dikirim ke Google Sheets:', data);
        
        // Di implementasi nyata, ini akan menggunakan fetch() untuk mengirim data
        // ke Google Apps Script yang terhubung dengan Google Sheets
        /*
        const scriptURL = 'URL_GOOGLE_APPS_SCRIPT_ANDA';
        
        fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => console.log('Sukses!', response))
        .catch(error => console.error('Error!', error.message));
        */
    }
});
