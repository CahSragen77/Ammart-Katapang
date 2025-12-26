<?php
// php/guestbook.php
header('Content-Type: application/json; charset=utf-8');
$data = [
  'nama' => $_POST['nama'] ?? '',
  'telepon' => $_POST['telepon'] ?? '',
  'alamat' => $_POST['alamat'] ?? '',
  'info' => $_POST['info'] ?? '',
  'ts' => date('c')
];
$file = __DIR__ . '/guestbook.json';
$all = [];
if (file_exists($file)) {
  $raw = file_get_contents($file);
  $all = json_decode($raw, true) ?: [];
}
$all[] = $data;
file_put_contents($file, json_encode($all, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo json_encode(['ok' => true, 'message' => 'Terima kasih sudah mengisi buku tamu!']);
