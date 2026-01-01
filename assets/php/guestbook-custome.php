<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validasi
    if (empty($input['name']) || empty($input['phone']) || empty($input['address'])) {
        echo json_encode(['success' => false, 'message' => 'Harap isi semua field']);
        exit;
    }
    
    // Data untuk dikirim ke Google Sheets
    $data = [
        'name' => $input['name'],
        'phone' => $input['phone'],
        'address' => $input['address'],
        'interest' => $input['interest'] ?? '',
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    // URL Google Apps Script Web App (GANTI DENGAN URL ANDA)
    $googleAppsScriptUrl = 'https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec';
    
    // Kirim data ke Google Sheets
    $ch = curl_init($googleAppsScriptUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Penting untuk Google Apps Script
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    // Simpan ke lokal juga (backup)
    $existingData = [];
    if (file_exists('guestbook_data.json')) {
        $existingData = json_decode(file_get_contents('guestbook_data.json'), true);
    }
    $existingData[] = $data;
    file_put_contents('guestbook_data.json', json_encode($existingData, JSON_PRETTY_PRINT));
    
    echo json_encode([
        'success' => true,
        'message' => 'Data berhasil disimpan!',
        'google_sheets_response' => json_decode($response, true)
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
