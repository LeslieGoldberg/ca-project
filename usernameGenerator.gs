// Triggers.gs holds the following triggers:

/**
 * Creates a trigger for when a spreadsheet opens.
 * Creates a time-driven trigger for an hour later that deletes the values in the Welcome sheet.
 *
 * @customfunction
 */
function createSpreadsheetOpenTrigger() {
  var ss = SpreadsheetApp.openById('1GD5UBfEcWwxopL3pS7t4MIjFWFzk_NsPXT24T1JxVa');
  ScriptApp.newTrigger('usernameGenerator')
      .forSpreadsheet(ss)
      .onOpen()
      .create();
  
  ScriptApp.newTrigger('deleteList')
      .timeBased().after(60 * 60 * 1000)
      .create(); 
}

/**
 * Creates a trigger to reset usernameIndex values at midnight.
 *
 * @customfunction
 */
function createTimeDrivenTriggers() {
  // Trigger to delete hidden usernameIndex sheet at 00:00. 
  ScriptApp.newTrigger('resetUserNames')
      .timeBased().everyDays(1)
      .atHour(0)
      .create();  
}

//usernameGenerator.gs holds the following code:
/**
 * Creates an array of names and grade-specific usernames 
 * and writes them into a spreadsheet
 *
 * @customfunction
 */
function usernameGenerator() {
  // Sets variables to be used throughout the rest of the script. **Also used in resetUsernames.gs and deleteList.gs
  var welcomeSpreadsheetId = '1GD5UBfEcWwxopL3pS7t4MIjFWFzk_NsPXT24T1JxVa8';
  var loginCardsSpreadsheetId = '1Mdj3bOHrA9qq2D-N7Oj8tglEc8m90pYtfAA-V8fjd8o';
  var usernameSheetName = 'Sheet2';
  var welcomeSheetName = 'Form Responses 2';
  var namesAndUsernamesSheetName = 'NamesAndUserNames';
  var gradeLabels = ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];

  // Get Login Master Card sheet.
  var usernameSpreadsheet = SpreadsheetApp.openById(loginCardsSpreadsheetId);
  var usernameSheet = usernameSpreadsheet.getSheetByName(usernameSheetName);
  
  // Gets grade levels and names from Welcome spreadsheet.
  var welcomeSpreadsheet = SpreadsheetApp.openById(welcomeSpreadsheetId);
  var welcomeSheet = welcomeSpreadsheet.getSheetByName(welcomeSheetName);
  var gradeLevelsRange = welcomeSheet.getRange('B2:B');
  var gradeLevelsValues = gradeLevelsRange.getValues();
  var teacherNamesRange = welcomeSheet.getRange('C2:C');
  var teacherNamesValues = teacherNamesRange.getValues();
  
  // Set index sheet variables.
  var usernameIndexSheetName = 'Username Index Sheet';
  var usernameIndexSheet = welcomeSpreadsheet.getSheetByName(usernameIndexSheetName);
  
  // Create usernameList of grade-level-matched usernames.
  var usernameList = [];
  var usernameIndexes = returnUsernameIndexes_(usernameIndexSheet);
  
  var kinderI = usernameIndexes[0];
  var firstI = usernameIndexes[1];
  var secondI = usernameIndexes[2];
  var thirdI = usernameIndexes[3];
  var fourthI = usernameIndexes[4];
  var fifthI = usernameIndexes[5];
  var sixthI = usernameIndexes[6];
  var seventhI = usernameIndexes[7];
  var eighthI = usernameIndexes[8];
  
  // Iterates through each row of gradeLevelsValues.
  for (var row = 0; row < gradeLevelsValues.length; row++) {
    
    // Adds the next grade-matched username to usernameList.
    if (gradeLevelsValues[row] == gradeLabels[0]) {
      var kinderUsernames = getUsernamesByRange_('A1:A', usernameSheet);
      usernameList.push(kinderUsernames[kinderI][0]);
      kinderI++;
    }
    else if (gradeLevelsValues[row] == gradeLabels[1]) {
      var firstUsernames = getUsernamesByRange_('B1:B', usernameSheet);
      usernameList.push(firstUsernames[firstI][0]);
      firstI++;
    }
    else if (gradeLevelsValues[row] == gradeLabels[2]) {
      var secondUsernames = getUsernamesByRange_('C1:C', usernameSheet);
      usernameList.push(secondUsernames[secondI][0]);
      secondI++;
    }
    else if (gradeLevelsValues[row] == gradeLabels[3]) {
      var thirdUsernames = getUsernamesByRange_('D1:D', usernameSheet);
      usernameList.push(thirdUsernames[thirdI][0]);
      thirdI++;
    }
    else if (gradeLevelsValues[row] == gradeLabels[4]) {
      var fourthUsernames = getUsernamesByRange_('E1:E', usernameSheet);
      usernameList.push(fourthUsernames[fourthI][0]);
      fourthI++;
    }
    else if (gradeLevelsValues[row] == gradeLabels[5]) {
      var fifthUsernames = getUsernamesByRange_('F1:F', usernameSheet);
      usernameList.push(fifthUsernames[fifthI][0]);
      fifthI++;
    }
    else if (gradeLevelsValues[row] == gradeLabels[6]) {
      var sixthUsernames = getUsernamesByRange_('G1:G', usernameSheet);
      usernameList.push(sixthUsernames[sixthI][0]);
      sixthI++;
    }
    else if (gradeLevelsValues[row] == gradeLabels[7]) {
      var seventhUsernames = getUsernamesByRange_('H1:H', usernameSheet);
      usernameList.push(seventhUsernames[seventhI][0]);
      seventhI++;
    }
    else if (gradeLevelsValues[row] == gradeLabels[8]) {
      var eighthUsernames = getUsernamesByRange_('I1:I', usernameSheet);
      usernameList.push(eighthUsernames[eighthI][0]);
      eighthI++;
    }
    else {
      usernameList.push("");
         } 
  }
  // Writes updated grade-level indexes to hidden spreadsheet.
  storeUsernameIndexes_(welcomeSpreadsheet, [kinderI, firstI, secondI, thirdI, fourthI, fifthI, sixthI, seventhI, eighthI]);
  
  
  // Create value array to write into Welcome sheet.
  var namesAndUsernamesSheet = welcomeSpreadsheet.getSheetByName(namesAndUsernamesSheetName);
  var returnRange = namesAndUsernamesSheet.getRange('A1:B');
  var returnValues = returnRange.getValues();
  
  // Sets Teacher Names in the first column.
  for (row = 1; row < teacherNamesValues.length; row++) {
    returnValues[row][0] = teacherNamesValues[row - 1][0];
  }
  // Sets Usernames in second column.
  for (i = 1; i < usernameList.length; i++) {
    returnValues[i][1] = usernameList[i - 1];
  }
  // Sets header values of Welcome sheet. Extra white-space is intentional for formatting purposes.
  returnValues[0][0] = ' Teacher Name ';
  returnValues[0][1] = ' UserName ';
  
  // Write returnValues into Welcome Sheet.
  returnRange.setValues(returnValues);
  
  // Format Welcome Sheet: Resize columns, freeze first row, apply Row Bandings to returnValues and add a border, bold first row and add a border.  
  namesAndUsernamesSheet.autoResizeColumns(1, 2);
  namesAndUsernamesSheet.setFrozenRows(1);
  var updatedValues = namesAndUsernamesSheet.getDataRange();
  updatedValues.setBorder(false, true, true, true, true, true, null, SpreadsheetApp.BorderStyle.SOLID).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREEN, true, false)
  var firstRow = namesAndUsernamesSheet.getRange('A1:B1');
  firstRow.setFontWeight('bold').setBorder(true, true, true, true, null, null, null, SpreadsheetApp.BorderStyle.SOLID_MEDIUM); 
}

/**
 * Wrapper function to get username values from a grade-specific range.
 *
 * @customfunction
 */
function getUsernamesByRange_(myRangeStr, usernameSheet) {
  var usernameRange = usernameSheet.getRange(myRangeStr);
  var usernameValues = usernameRange.getValues();
  
  return usernameValues;
}

/**
 * Checks if there is a hidden spreadsheet within the Welcome spreadsheet with username index values.
 * If it exists, returns a list of written index values.
 * If it does not exist, returns a list of default values.
 *
 * @customfunction
 */
function returnUsernameIndexes_(usernameIndexSheet) {  
  // If the hidden username index sheet does not exist, sets indexValues to an array of default values (2).
  if (usernameIndexSheet == null) {
      var indexValues = [2, 2, 2, 2, 2, 2, 2, 2, 2];
      }
  // If the sheet exists, it gets the single row of values and creates an array from them.
  else {
    var usernameRange = usernameIndexSheet.getDataRange();
    var usernameValues = usernameRange.getValues();
    var indexValues = [];
    for (i = 0; i < usernameValues.length; i++) {
      indexValues.push(usernameValues[0][i]);
    }
  }
  
  // Returns an array of indexValues.
  return indexValues;
}

/**
 * Creates a hidden spreadsheet within the Welcome spreadsheet if one does not already exist.
 * Stores index values for grade-level usernames.
 *
 * @customfunction
 */
function storeUsernameIndexes_(welcomeSpreadsheet, indexArray) {  
  var usernameIndexSheetName = 'Username Index Sheet';
  var usernameIndexSheet = welcomeSpreadsheet.getSheetByName(usernameIndexSheetName);
  
  if (usernameIndexSheet == null) {
    // If sheet does not exist, create the sheet and hide it.
    var spreadsheetNums = welcomeSpreadsheet.getNumSheets();
    usernameIndexSheet = welcomeSpreadsheet.insertSheet('Username Indexes', spreadsheetNums + 1);
    usernameIndexSheet.hideSheet();
  }
  // Creates a single-row value array to write to the sheet.
  var indexValues = [indexArray];
  
  // Writes values to hidden sheet.
  var usernameRange = usernameIndexSheet.getRange(1, 1, 1, 9);
  usernameRange.setValues(indexValues);
}


// resetUsernames.gs holds the following code.
/**
 * Deletes hidden spreadsheet to reset username index values.
 * Triggered at midnight.
 *
 * @customfunction
 */
function resetUsernames() {
  var welcomeSpreadsheetId = '1GD5UBfEcWwxopL3pS7t4MIjFWFzk_NsPXT24T1JxVa8';
  var usernameIndexSheetName = 'Username Indexes'
 
  var ss = SpreadsheetApp.openById(welcomeSpreadsheetId);
  var usernameIndexSheet = ss.getSheetByName(usernameIndexSheetName);
  if (usernameIndexSheet) {
    ss.deleteSheet(usernameIndexSheet);
  }
}


// deleteList.gs holds the following code.
/**
 * Deletes values from Welcome Sheet.
 * Triggered after 1 hr.
 *
 * @customfunction
 */
function deleteList() {
  var welcomeSpreadsheetId = '1GD5UBfEcWwxopL3pS7t4MIjFWFzk_NsPXT24T1JxVa8';
  var namesAndUsernamesSheetName = 'NamesAndUserNames';
  
  var welcomeSpreadsheet = SpreadsheetApp.openById(welcomeSpreadsheetId);
  // Clears all values and formatting from the sheet.
  var namesAndUsernamesSheet = welcomeSpreadsheet.getSheetByName(namesAndUsernamesSheetName);
  namesAndUsernamesSheet.clear();
  namesAndUsernamesSheet.getBandings().forEach(function (banding) {
    banding.remove();
  });
}

