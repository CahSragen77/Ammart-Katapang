// ============================================
// GOOGLE APPS SCRIPT - A-Mart Katapang
// 3-Layer Data Collection System
// ============================================

const CONFIG = {
  spreadsheetId: 'YOUR_SPREADSHEET_ID',
  emailRecipient: 'admin@amartkatapang.com',
  sheets: {
    feedback: 'Feedback',
    testimoni: 'Testimoni',
    donation: 'Donasi',
    backup: 'Backup'
  }
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    switch(data.action) {
      case 'saveData':
        return handleSaveData(data);
      case 'saveDonation':
        return handleSaveDonation(data);
      case 'getTestimonies':
        return handleGetTestimonies();
      default:
        return createResponse(400, 'Action not recognized');
    }
  } catch (error) {
    return createResponse(500, 'Error: ' + error.toString());
  }
}

function doGet(e) {
  return createResponse(200, 'A-Mart Katapang Data API is running');
}

// ========== FEEDBACK & TESTIMONI ==========
function handleSaveData(data) {
  try {
    const sheetName = data.type === 'testimoni' ? CONFIG.sheets.testimoni : CONFIG.sheets.feedback;
    const sheet = getOrCreateSheet(sheetName);
    
    // Prepare headers if new sheet
    if (sheet.getLastRow() === 0) {
      const headers = data.type === 'testimoni' 
        ? ['Timestamp', 'Nama', 'Pekerjaan', 'Rating', 'Testimoni', 'Foto', 'Status']
        : ['Timestamp', 'Nama', 'Kontak', 'Tipe Display', 'Jenis', 'Kategori', 'Pesan', 'Rating', 'Status'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Prepare row data
    const rowData = data.type === 'testimoni'
      ? [
          data.timestamp,
          data.name,
          data.role || '',
          data.rating,
          data.message,
          data.photo ? 'ADA' : 'TIDAK ADA',
          data.status
        ]
      : [
          data.timestamp,
          data.name,
          data.contact,
          data.display_type,
          data.feedback_type,
          data.category,
          data.message,
          data.rating,
          data.status
        ];
    
    // Append to sheet
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    
    // Send email notification
    sendEmailNotification(data);
    
    // Save to backup sheet
    saveToBackup(data);
    
    return createResponse(200, `Data ${data.type} saved successfully! ID: ${nextRow}`);
    
  } catch (error) {
    return createResponse(500, 'Error saving data: ' + error.toString());
  }
}

// ========== DONATION HANDLING ==========
function handleSaveDonation(data) {
  try {
    const sheet = getOrCreateSheet(CONFIG.sheets.donation);
    
    // Prepare headers if new sheet
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp', 'Kode Donasi', 'Nama', 'Email', 'WhatsApp',
        'Program', 'Jumlah', 'Bank', 'Pesan', 'Status', 'Batas Waktu'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Prepare row data
    const rowData = [
      data.timestamp,
      data.donation_code,
      data.name,
      data.email,
      data.phone,
      data.program,
      data.amount,
      data.bank,
      data.message,
      data.status,
      data.payment_deadline
    ];
    
    // Append to sheet
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    
    // Format amount column
    sheet.getRange(nextRow, 7).setNumberFormat('"Rp"#,##0');
    
    // Send donation email
    sendDonationEmail(data);
    
    // Save to backup
    saveToBackup(data, 'donation');
    
    return createResponse(200, `Donasi saved! Kode: ${data.donation_code}`);
    
  } catch (error) {
    return createResponse(500, 'Error saving donation: ' + error.toString());
  }
}

// ========== EMAIL NOTIFICATIONS ==========
function sendEmailNotification(data) {
  try {
    const subject = data.type === 'testimoni' 
      ? '📢 TESTIMONI BARU - A-Mart Katapang'
      : '📝 FEEDBACK BARU - A-Mart Katapang';
    
    const body = `
      ${data.type === 'testimoni' ? 'TESTIMONI BARU' : 'FEEDBACK BARU'}
      
      Waktu: ${data.timestamp}
      Nama: ${data.name}
      ${data.type === 'testimoni' ? `Rating: ${'⭐'.repeat(data.rating)}` : `Kategori: ${data.category}`}
      
      Pesan:
      ${data.message}
      
      ${data.type === 'testimoni' ? 'Status: Menunggu moderasi' : 'Status: Akan ditindaklanjuti'}
      
      ---
      A-Mart Katapang
      https://amartkatapang.com
    `;
    
    MailApp.sendEmail(CONFIG.emailRecipient, subject, body);
    
  } catch (error) {
    console.log('Email notification failed:', error);
  }
}

function sendDonationEmail(data) {
  try {
    const subject = '💰 DONASI BARU - A-Mart Katapang';
    
    const body = `
      DONASI BARU DITERIMA!
      
      Kode Donasi: ${data.donation_code}
      Waktu: ${data.timestamp}
      
      Data Donatur:
      Nama: ${data.name}
      Email: ${data.email}
      WhatsApp: ${data.phone}
      
      Detail Donasi:
      Program: ${data.program}
      Jumlah: Rp ${data.amount.toLocaleString('id-ID')}
      Bank: ${data.bank}
      
      Pesan Donatur:
      ${data.message || '-'}
      
      Status: ${data.status}
      Batas Konfirmasi: ${data.payment_deadline}
      
      ---
      Segera konfirmasi via WhatsApp jika bukti transfer sudah diterima.
      
      A-Mart Katapang
      https://amartkatapang.com
    `;
    
    MailApp.sendEmail(CONFIG.emailRecipient, subject, body);
    
  } catch (error) {
    console.log('Donation email failed:', error);
  }
}

// ========== BACKUP SYSTEM ==========
function saveToBackup(data, type = 'general') {
  try {
    const sheet = getOrCreateSheet(CONFIG.sheets.backup);
    
    if (sheet.getLastRow() === 0) {
      const headers = ['Timestamp', 'Data Type', 'Original Data', 'Backup Time'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    const backupData = [
      new Date().toLocaleString('id-ID'),
      type,
      JSON.stringify(data),
      new Date().toISOString()
    ];
    
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, backupData.length).setValues([backupData]);
    
  } catch (error) {
    console.log('Backup failed:', error);
  }
}

// ========== UTILITY FUNCTIONS ==========
function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    // Apply basic formatting
    sheet.getRange(1, 1, 1, sheet.getLastColumn())
      .setFontWeight('bold')
      .setBackground('#1a6d1a')
      .setFontColor('white');
  }
  
  return sheet;
}

function createResponse(code, message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: code === 200,
      message: message,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========== AUTO-BACKUP SCHEDULE ==========
function setupAutoBackup() {
  // Create time-based trigger
  ScriptApp.newTrigger('autoBackupData')
    .timeBased()
    .everyHours(6)
    .create();
  
  console.log('Auto-backup schedule created');
}

function autoBackupData() {
  // Backup all sheets to a separate spreadsheet
  const backupSpreadsheet = SpreadsheetApp.create('A-Mart Katapang Backup ' + new Date().toISOString());
  
  const sourceSheets = ['Feedback', 'Testimoni', 'Donasi'];
  const sourceSpreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  
  sourceSheets.forEach(sheetName => {
    const sourceSheet = sourceSpreadsheet.getSheetByName(sheetName);
    if (sourceSheet) {
      const data = sourceSheet.getDataRange().getValues();
      const backupSheet = backupSpreadsheet.insertSheet(sheetName);
      backupSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
    }
  });
  
  console.log('Auto-backup completed at ' + new Date().toLocaleString('id-ID'));
}
