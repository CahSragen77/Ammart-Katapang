<?php
// php/saran.php
header('Content-Type: application/json; charset=utf-8');
$data = [
  'display' => $_POST['display_name'] ?? 'anon',
  'nama' => $_POST['nama'] ?? '',
  'saran' => $_POST['saran'] ?? '',
  'ts' => date('c')
];
$file = __DIR__ . '/saran.json';
$all = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
$all[] = $data;
file_put_contents($file, json_encode($all, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo json_encode(['ok' => true, 'message' => 'Terima kasih atas masukan kamu!']);
