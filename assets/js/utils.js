// Fungsi bantuan untuk A-Mart Katapang

// Format angka ke Rupiah
function formatRupiah(angka) {
    return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Validasi email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validasi telepon Indonesia
function validatePhone(phone) {
    const re = /^(?:\+62|62|0)[2-9][0-9]{7,11}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Tampilkan loading spinner
function showLoading(element) {
    element.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
}

// Hilangkan loading
function hideLoading(element, originalContent) {
    element.innerHTML = originalContent;
}

// Simpan ke localStorage dengan timestamp
function saveWithTimestamp(key, data) {
    const dataWithTime = {
        ...data,
        _savedAt: new Date().toISOString(),
        _source: 'A-Mart Katapang Web'
    };
    localStorage.setItem(key, JSON.stringify(dataWithTime));
}

// Ambil dari localStorage dengan validasi waktu
function getWithTimestamp(key, maxAgeHours = 24) {
    const data = JSON.parse(localStorage.getItem(key));
    if (!data) return null;
    
    const savedTime = new Date(data._savedAt);
    const now = new Date();
    const hoursDiff = (now - savedTime) / (1000 * 60 * 60);
    
    if (hoursDiff > maxAgeHours) {
        localStorage.removeItem(key);
        return null;
    }
    
    return data;
}

// Export untuk testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatRupiah,
        validateEmail,
        validatePhone
    };
}
