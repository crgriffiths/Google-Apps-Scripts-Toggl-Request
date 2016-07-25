function togglHours() {
 
  // Date Functions required in Toggl Request
	var today = new Date();
	var yearNow = today.getFullYear();
	var monthNow = today.getMonth();
	var dayNow = today.getDate();
  
  //Format dates properly for request
	if (dayNow < 10) {
		dayNow = "0" + (dayNow);
	}
	if (monthNow < 10) {
		monthNow = "0" + (monthNow + 1);
	}

  //Creating variable for request of todays date, one year in the past (maximum allowable range in Toggl is one year)
	var togglDate = (yearNow - 1) + "-" + monthNow + "-" + dayNow; 

	Logger.log(togglDate); //Log the date to ensure it is correct

  
  //Creating variable for request object
	var appDetails = {
		togglAPIKey: '1234567890abcdefghijklmnopqrstuv',  //Find by going to "My Profile" after logging in to Toggl
		togglWorkspaceID: '123456',  //6-digit numeric identifier found in your URL 
		user_agent: 'example@example.com' //Your email account associated with your Toggl account
	};
    var base64token = Utilities.base64Encode(appDetails.togglAPIKey + ":api_token"); //API Key requires base64 encoding. Use Google Apps Scripts built in method
    Logger.log(base64token);
	var authStr = 'Basic ' + base64token; //Complete authentication string
    Logger.log(authStr);
    

	var reqObj = {
		"method": 'get',
        "contentType": 'application/JSON',
        "headers": {
          Authorization: authStr,
          grouping: "projects", // Grouping is optional, See the Toggl API docs for additional request object variables
          subgrouping: "tasks"
        }
	};
  
  Logger.log(reqObj);
  var togglUrl = "https://toggl.com/reports/api/v2/summary?user_agent=" + appDetails.user_agent + "&workspace_id=" + appDetails.togglWorkspaceID + "&since=" + togglDate + "&subgrouping=tasks"; // Properly formated Toggl Request URL. See Toggl API Docs for further information. 
	var togglxhr = UrlFetchApp.fetch(togglUrl, reqObj);
	var togglJson = togglxhr.getContentText();
	var togglData = JSON.parse(togglJson);
  var jsonLength = togglData.data.length; //Get number of projects in data. 

  
  //Testing first returned value for accuracy
  Logger.log(togglData.data[0].title.project);
  Logger.log(togglData.data[0].time / (1000*60*60));



  //Establish connection to spreadsheet to import the data to. 

  var ss = SpreadsheetApp.openById("1234567890abcdefghijklmnopqrstuvwxyz12345678"); //Open spreadsheet by ID number found in the URL for your document
  var activeSs = SpreadsheetApp.setActiveSpreadsheet(ss);
  var timeSheet = SpreadsheetApp.setActiveSheet(ss.getSheetByName("Time Entries")); //If using multiple sheets, find the correct sheet
  var activeCell = timeSheet.setActiveRange(timeSheet.getRange("A2")); //Set active range below the column headers
  
  //*OPTIONAL* Clear current contents (done because this script was using an hourly trigger to update the contents) to ensure no potential for error or duplicate data.
  var currDataRange = timeSheet.getRange("A2:B" + timeSheet.getLastRow());
  currDataRange.clear();
  
  //Loop through Toggl data and write to active sheet 
  for (var i = 0; i < jsonLength; i++) {
    var rowNum = i + 2;
    var project = togglData.data[i].title.project;
    var time = togglData.data[i].time / (1000*60*60); //Convert to hours (default is milliseconds)

    var projectCell = timeSheet.setActiveRange(timeSheet.setActiveRange(timeSheet.getRange("A" + rowNum))); //Get cell to write project title to
    var timeCell = timeSheet.setActiveRange(timeSheet.setActiveRange(timeSheet.getRange("B" + rowNum)));  //Get cell to write project hours to
    
    projectCell.setValue(project); //Write project names
    timeCell.setValue(time); //Write project hours
 };  
}

