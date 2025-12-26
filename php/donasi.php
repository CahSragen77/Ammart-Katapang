<?php
// php/donasi.php
header('Content-Type: application/json; charset=utf-8');
$tujuan = $_POST['tujuan'] ?? '';
$nominal = intval($_POST['nominal'] ?? 0);
$metode = $_POST['metode'] ?? '';
$catatan = $_POST['catatan'] ?? '';
$record = [
  'tujuan' => $tujuan, 'nominal' => $nominal, 'metode' => $metode, 'catatan' => $catatan, 'ts' => date('c')
];
$file = __DIR__ . '/donasi.json';
$all = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
$all[] = $record;
file_put_contents($file, json_encode($all, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Contoh respons berisi instruksi pembayaran (ganti sesuai rekening/QR)
$instruksi = [
  'bank' => 'Transfer ke Bank BCA a.n. A‑Mart Katapang No. 1234567890.',
  'dana' => 'Kirim via DANA ke 081234567890 (A‑Mart Katapang).',
  'gopay' => 'Kirim via GoPay ke 081234567890.',
  'ovo' => 'Kirim via OVO ke 081234567890.',
  'linkaja' => 'Kirim via LinkAja ke 081234567890.'
];
echo json_encode(['ok'=>true, 'message'=>'Donasi tercatat. Ikuti instruksi berikut.', 'instruksi'=>$instruksi[$metode] ?? '']);
