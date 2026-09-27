/**
 * ==============================================================================
 * MSME Sahayak AI - Google Sheets Webhook Bridge (Google Apps Script)
 * ==============================================================================
 *
 * HOW TO INSTALL IN YOUR GOOGLE SHEET (Takes 30 seconds):
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1rfT9LvjYD1FJQyqsVASVshZllne8lt1lEODQTgLqoIY/edit
 * 2. In top menu, click: Extensions > Apps Script
 * 3. Delete any default code in Code.gs, paste this entire file, and click Save (Ctrl+S).
 * 4. Click the blue 'Deploy' button (top right) > 'New deployment'.
 * 5. Click the gear icon ⚙️ next to 'Select type' > Choose 'Web app'.
 * 6. Set Description: "MSME Backend Bridge"
 * 7. Set 'Execute as': 'Me'
 * 8. Set 'Who has access': 'Anyone'
 * 9. Click 'Deploy', authorize permissions when prompted, and copy the Web App URL!
 * 10. Paste the Web App URL into your backend/.env:
 *     GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
 * ==============================================================================
 */

function doGet(e) {
  try {
    var table = (e && e.parameter && e.parameter.table) || "";
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (!table) {
      // Return status summary
      var sheets = ss.getSheets();
      var summary = {};
      for (var s = 0; s < sheets.length; s++) {
        summary[sheets[s].getName()] = sheets[s].getLastRow() - 1;
      }
      return respondJson({
        status: "connected",
        spreadsheet_name: ss.getName(),
        spreadsheet_id: ss.getId(),
        sheets: summary
      });
    }

    var sheet = ss.getSheetByName(table);
    if (!sheet) {
      return respondJson([]);
    }

    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return respondJson([]);
    }

    var headers = data[0];
    var records = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row || !row[0]) continue;
      var obj = {};
      for (var h = 0; h < headers.length; h++) {
        var val = row[h];
        if (typeof val === "string" && (val.indexOf("{") === 0 || val.indexOf("[") === 0)) {
          try { val = JSON.parse(val); } catch (err) {}
        }
        obj[headers[h]] = val;
      }
      records.push(obj);
    }
    return respondJson(records);
  } catch (err) {
    return respondJson({ error: err.toString() });
  }
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var table = payload.table;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Ensure sheet exists with headers
    var sheet = ss.getSheetByName(table);
    if (!sheet) {
      sheet = ss.insertSheet(table);
      if (payload.headers && payload.headers.length > 0) {
        sheet.appendRow(payload.headers);
        sheet.setFrozenRows(1);
      }
    }

    if (action === "insert") {
      var rowData = payload.row;
      sheet.appendRow(rowData);
      return respondJson({ success: true, message: "Row inserted" });
    }

    if (action === "init_table") {
      return respondJson({ success: true, message: "Table initialized" });
    }

    if (action === "update") {
      var keyIndex = payload.key_index || 0;
      var keyValue = String(payload.key_value);
      var updatedRow = payload.row;
      var data = sheet.getDataRange().getValues();

      for (var r = 1; r < data.length; r++) {
        if (String(data[r][keyIndex]) === keyValue) {
          sheet.getRange(r + 1, 1, 1, updatedRow.length).setValues([updatedRow]);
          return respondJson({ success: true, message: "Row updated" });
        }
      }
      return respondJson({ success: false, message: "Key not found" });
    }

    if (action === "delete") {
      var keyIndex = payload.key_index || 0;
      var keyValue = String(payload.key_value);
      var data = sheet.getDataRange().getValues();

      for (var r = 1; r < data.length; r++) {
        if (String(data[r][keyIndex]) === keyValue) {
          sheet.deleteRow(r + 1);
          return respondJson({ success: true, message: "Row deleted" });
        }
      }
      return respondJson({ success: false, message: "Key not found" });
    }

    return respondJson({ success: false, message: "Unknown action" });
  } catch (err) {
    return respondJson({ error: err.toString() });
  }
}

function respondJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
