# Google Apps Scripts Toggl Request

This is a simple script that can be used in Google Apps Scripts to connect to Toggl, request the summary data and write that data to a Google Sheets spreadsheet. This is extensible to write any of the data contained in the JSON object returned by the object. 

##Usage

You will need a few things to complete the request. You will need a Toggl API Key (found by signing in to Toggl and navigating to "My Profile"), your Toggl Workspace ID, and the email address associated with your account. To write to the spreadsheet you will need the spreadsheet ID, or adjust the code to create a new spreadsheet. 

##Useful Links

<a href="https://developers.google.com/apps-script/" target="_blank">Google Apps Scripts Documentation</a>
<a href="https://github.com/toggl/toggl_api_docs/blob/master/reports.md" target="_blank">Toggl Reports API v2</a>
