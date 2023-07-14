//
// File Name:             Code.gs
// Date Last Modified:    07/13/2023
// Last Modfiied By:      Lauren Escobedo
//
// Program Description:   This AppsScript file is intended to be used with the project management sheet.
//                        The script handles notifications to team members on the project
//                        Please note:
//                          - A lot of the code is dependent on locations of columns and text in columns, 
//                            ctrl+f "dependent" to view all of these instances, they have been marked for clarity
//

// Returns todays date, not currently in use but can be useful 
function getDate() {
  var datetime = new Date();
  var today = (datetime.getMonth()+1) + "/" 
              + datetime.getDate() + "/" 
              + datetime.getFullYear();
  return today;
}

// Executes various code depending on which cell has been edited
function onEdit(e) {
  // Get the A1 format cell name [e.g. 'B2', G7']
  var notation = e.range.getA1Notation();
  // Isolate column letter with regex
  var column = notation.replace(/[0-9]/g, '');
  // Isolate row number with regex
  var row = notation.replace(/\D+/g, '');

  // !! All of the following code is dependent on the following, change as needed !!
  //      - Task title in:  column B
  //      - Assignee in:    column C
  //      - Reviewer in:    column D
  //      - Status in:      column E

  // Get title of task for the row edited
  var titleA1 = "B" + row; 
  var titleRange = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(titleA1);
  var taskTitle = titleRange.getDisplayValue();

  // When assignee changed, send notification email
  if (column == "C") {
    sendAssignedEmail(taskTitle);
    // Browser.msgBox("Email sent to assignee."); // Toggle this line to opt in/out of on screen notification when email is sent
  }
  // When reviewer changed, send notification email
  else if(column == "D") {
    sendReviewerAssigned(taskTitle);
    // Browser.msgBox("Email sent to reviewer"); // Toggle this line to opt in/out of on screen notification when email is sent
  }

  // When status changed, send appropriate notification email
  else if(column == 'E') {
    var taskStatus = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getCurrentCell().getDisplayValue();
    
    // !! This code is dependent on the text in cell in E column !!
    if (taskStatus == '3 - Resolved') {
      sendResolvedEmail(taskTitle);
      // Browser.msgBox("Email sent to reviewer"); // Toggle this line to opt in/out of on screen notification when email is sent
    } else if (taskStatus == '2 - Reopened') {
      sendReopenedEmail(taskTitle);
      // Browser.msgBox("Email sent to assignee") // Toggle this line to opt in/out of on screen notification when email is sent
    }
  }
}

/////////////////////////////
// EMAIL RELATED FUNCTIONS //
/////////////////////////////

// These functions use the MailApp class to send emails.
// Documentation can be reviewed here: https://developers.google.com/apps-script/reference/mail/mail-app

// Sends a notification email to the assignee, notifying them an assigned task was reopened; accepts a string parameter indicating tast name
function sendReopenedEmail(taskTitle) {
  // Get recipient name as a string from the sheet, starting from active cell... takes some manipulation :)
  var notation = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getActiveRange().getA1Notation();
  var row = notation.replace(/\D+/g, '');
  var assigneeA1 = "C" + row; 
  var assigneeRange = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(assigneeA1);
  var assignee = assigneeRange.getDisplayValue();

  // Set the "To" line
  var toLine = getEmail(assignee);

  // Set "Subject" line
  var subjectLine = "Reopened! - \"" + taskTitle + "\"";

  // Set "Body" text
  var body = "Task \"" + taskTitle + "\" has been reopened."

  // Send it off!
  MailApp.sendEmail(toLine, subjectLine, body);
}

// Sends a notification email to reviewer, notifying a task is ready for review; accepts a string parameter indicating tast name
function sendResolvedEmail(taskTitle) {
  // Get recipient name as a string from the sheet, starting from active cell... takes some manipulation :)
  var notation = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getActiveRange().getA1Notation();
  var row = notation.replace(/\D+/g, '');
  var reviewerA1 = "D" + row; 
  var reviewerRange = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(reviewerA1);
  var reviewer = reviewerRange.getDisplayValue();

  // Set the "To" line
  var toLine = getEmail(reviewer);

  // Set "Subject" line
  var subjectLine = "Ready for Review! - \"" + taskTitle + "\"";

  // Set "Body" text
  var body = "Task \"" + taskTitle + "\" is ready for review!"

  // Send it off!
  MailApp.sendEmail(toLine, subjectLine, body);
}

// Send a notification email to a new assignee; accepts a string parameter indicating tast name
function sendAssignedEmail(taskTitle) {
  // Get recipient name as string from active cell
  var assignee = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getCurrentCell().getDisplayValue();

  // Set the "To" line
  var toLine = getEmail(assignee);

  // Set "Subject" line
  var subjectLine = "New Task! - \"" + taskTitle + "\"";

  // Set "Body" text
  var body = "You have been assigned a new task, \"" + taskTitle + "\", on the Task Board";

  // Send it off!
  MailApp.sendEmail(toLine, subjectLine, body);
}

// Sends a notification email to the reviewer; accepts a string parameter indicating the task name
function sendReviewerAssigned(taskTitle) {
  // Get recipient name as string from active cell
  var assignee = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getCurrentCell().getDisplayValue();
  
  // Set the "To" line
  var toLine = getEmail(assignee);

  // Set "Subject" line
  var subjectLine = "New Reviewer Role: \"" + taskTitle + "\"";

  // Set "Body" text
  var body = "You have been assigned as a reviewer on the task \"" + taskTitle + "\" on the Task Board";

  // Send it off!
  MailApp.sendEmail(toLine, subjectLine, body);
}

// Gets the appropriate email based on string parameter
//    - Enter and email as 'testname@mail.stmarytx.edu',
//    - Or a list as 'testname1@mail.stmarytx.edu, testname2@stmarytx.edu'
//    - You can also look up email to cell conversions for text notifications instead
//    - !! This function is dependent on the string name text in the sheet, since recipient name pulled directly from sheet !!
function getEmail(emailTo) {
  switch(emailTo) {
    case 'Name1':
      return '';
    case 'Name2':
      return '';
    case 'Name3':
      return '';
    case 'Name4':
      return '';
    case 'Name3':
      return '';
    case 'Name6':
      return '';
    case 'Group Activity':
      return 'Group Activity';
    case 'UX Team':
      return ''
    case 'API Team':
      return ''
    case 'Security Team':
      return ''
    default:
      return 'Error in retrieving email.';
  }
}

// Returns the remaining daily email allowance amount for the free mailapp service
function remainingEmails() {
  console.log(MailApp.getRemainingDailyQuota());
}






















