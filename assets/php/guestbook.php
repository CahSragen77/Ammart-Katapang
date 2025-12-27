<?php
/**
 * Simulasi PHP untuk Guestbook
 * Dalam implementasi nyata, ini akan terhubung dengan database atau Google Sheets
 */

// Header untuk response JSON
header('Content-Type: application/json');

// Simulasi delay server
sleep(1);

// Data yang diterima dari form
$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validasi data
    if (empty($input['name']) || empty($input['phone']) || empty($input['address'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Harap isi semua field yang wajib diisi.'
        ]);
        exit;
    }
    
    // Simulasi penyimpanan data
    // Di implementasi nyata, data akan disimpan ke database atau Google Sheets
    
    $data = [
        'name' => htmlspecialchars($input['name']),
        'phone' => htmlspecialchars($input['phone']),
        'address' => htmlspecialchars($input['address']),
        'interest' => htmlspecialchars($input['interest']),
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    // Simpan ke file JSON (simulasi)
    $existingData = [];
    if (file_exists('guestbook_data.json')) {
        $existingData = json_decode(file_get_contents('guestbook_data.json'), true);
    }
    
    $existingData[] = $data;
    file_put_contents('guestbook_data.json', json_encode($existingData, JSON_PRETTY_PRINT));
    
    // Response sukses
    echo json_encode([
        'success' => true,
        'message' => 'Terima kasih! Data Anda telah berhasil disimpan.',
        'data' => $data
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Metode request tidak valid.'
    ]);
}
?>
