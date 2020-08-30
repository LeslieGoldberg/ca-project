/**
 * Creates a trigger for when a spreadsheet opens.
 * @customfunction
 */
function createSpreadsheetOpenTrigger() {
  var ss = SpreadsheetApp.openById('1GD5UBfEcWwxopL3pS7t4MIjFWFzk_NsPXT24T1JxVa8');
  ScriptApp.newTrigger('usernameGenerator')
      .forSpreadsheet(ss)
      .onOpen()
      .create();
}

/**
 * Creates a trigger to delete values at midnight.
 *
 * @customfunction
 */
function createTimeDrivenTriggers() {
  // Trigger at 00:00.
  ScriptApp.newTrigger('deleteList')
      .timeBased().everyDays(1)
      .atHour(0)
      .create();
}

/**
 * Creates an array of names and grade-specific usernames 
 * and writes them into a spreadsheet
 *
 * @customfunction
 */
function usernameGenerator() {
  
  // Gets Username values from Login Cards master spreadsheet.
  var usernameSpreadsheet = SpreadsheetApp.openById(
    '1Mdj3bOHrA9qq2D-N7Oj8tglEc8m90pYtfAA-V8fjd8o');
  var usernameSheet = usernameSpreadsheet.getSheetByName('Sheet2');
  
  var kinderUsernames = usernameSheet.getRange('A1:A').getValues();
  var firstUsernames = usernameSheet.getRange('B1:B').getValues();
  var secondUsernames = usernameSheet.getRange('C1:C').getValues();
  var thirdUsernames = usernameSheet.getRange('D1:D').getValues();
  var fourthUsernames = usernameSheet.getRange('E1:E').getValues();
  var fifthUsernames = usernameSheet.getRange('F1:F').getValues();
  var sixthUsernames = usernameSheet.getRange('G1:G').getValues();
  var seventhUsernames = usernameSheet.getRange('H1:H').getValues();
  var eighthUsernames = usernameSheet.getRange('I1:I').getValues();
  
 // Gets grade levels and names from Welcome spreadsheet.
  var welcomeSpreadsheet = SpreadsheetApp.openById(
    '1GD5UBfEcWwxopL3pS7t4MIjFWFzk_NsPXT24T1JxVa8');
  var welcomeSheet = welcomeSpreadsheet.getSheetByName('Form Responses 2');
  var gradeLevelsRange = welcomeSheet.getRange('B2:B');
  var gradeLevelsValues = gradeLevelsRange.getValues();
  var teacherNamesRange = welcomeSheet.getRange('C2:C');
  var teacherNamesValues = teacherNamesRange.getValues();
  
  // Create usernameList of grade-level-matched usernames.
  var usernameList = [];
  var kinderI = 2;
  var firstI = 2;
  var secondI = 2;
  var thirdI = 2;
  var fourthI = 2;
  var fifthI = 2;
  var sixthI = 2;
  var seventhI = 2;
  var eighthI = 2;
  
  // Iterates through each row of gradeLevelsValues.
  for (var row = 0; row < gradeLevelsValues.length; row++) {
    
    // Adds the next grade-matched username to usernameList.
    if (gradeLevelsValues[row] == 'Kindergarten') {
      usernameList.push(kinderUsernames[kinderI][0]);
      kinderI++;}
    else if (gradeLevelsValues[row] == 'Grade 1') {
      usernameList.push(firstUsernames[firstI][0]);
      firstI++;}
    else if (gradeLevelsValues[row] == 'Grade 2') {
      usernameList.push(secondUsernames[secondI][0]);
      secondI++;}
    else if (gradeLevelsValues[row] == 'Grade 3') {
      usernameList.push(thirdUsernames[thirdI][0]);
      thirdI++;}
    else if (gradeLevelsValues[row] == 'Grade 4') {
      usernameList.push(fourthUsernames[fourthI][0]);
      fourthI++;}
    else if (gradeLevelsValues[row] == 'Grade 5') {
      usernameList.push(fifthUsernames[fifthI][0]);
      fifthI++;}
    else if (gradeLevelsValues[row] == 'Grade 6') {
      usernameList.push(sixthUsernames[sixthI][0]);
      sixthI++;}
    else if (gradeLevelsValues[row] == 'Grade 7') {
      usernameList.push(seventhUsernames[seventhI][0]);
      seventhI++;}
    else if (gradeLevelsValues[row] == 'Grade 8') {
      usernameList.push(eighthUsernames[eighthI][0]);
      eighthI++;}
    else {usernameList.push("")}
  }
  
  // Create value array to write into Welcome sheet.
  var namesAndUsernamesSheet = welcomeSpreadsheet.getSheetByName('NamesAndUserNames').getRange('A1:B');
  var returnValues = namesAndUsernamesSheet.getValues();
  for (row = 1; row < teacherNamesValues.length; row++) {
    returnValues[row][0] = teacherNamesValues[row - 1][0];}
  for (i = 1; i < usernameList.length; i++) {
    returnValues[i][1] = usernameList[i - 1];}
  
  // Set header values of Welcome sheet.
  returnValues[0][0] = ' Teacher Name ';
  returnValues[0][1] = ' UserName ';
  
  // Write returnValues into Welcome Sheet.
  namesAndUsernamesSheet.setValues(returnValues);
  
  // Format Welcome Sheet: Resize columns, freeze first row, bold first row and add a border, apply Row Bandings to returnValues.
  var welcomeSheet = welcomeSpreadsheet.getSheetByName('NamesAndUserNames');
  welcomeSheet.autoResizeColumns(1, 2);
  welcomeSheet.setFrozenRows(1);
  var setData = welcomeSheet.getDataRange();
  setData.setBorder(false, true, true, true, true, true, null, SpreadsheetApp.BorderStyle.SOLID).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREEN, true, false)
  var firstRow = welcomeSheet.getRange('A1:B1');
  firstRow.setFontWeight('bold').setBorder(true, true, true, true, null, null, null, SpreadsheetApp.BorderStyle.SOLID_MEDIUM); 
}


/**
 * Deletes values from Welcome Sheet when triggered at midnight.
 *
 * @customfunction
 */
function deleteList() {
  var welcomeSpreadsheet = SpreadsheetApp.openById(
    '1GD5UBfEcWwxopL3pS7t4MIjFWFzk_NsPXT24T1JxVa8');
  // Clears all values and formatting from the sheet.
  var namesAndUsernamesSheet = welcomeSpreadsheet.getSheetByName('NamesAndUserNames');
  namesAndUsernamesSheet.clear();
  namesAndUsernamesSheet.getDataRange().applyRowBanding().remove();
}
  