const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];


const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
//    authorize(JSON.parse(content), listMajors);
    authorize(JSON.parse(content), Listwrite);
});


function authorize(credentials, callback) {
  const {
    client_secret,
    client_id,
    redirect_uris
  } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);


  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}



function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    approval_prompt: 'force',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see スプレッドシートurl
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
  const sheets = google.sheets({
    version: 'v4',
    auth
  });
  sheets.spreadsheets.values.get({
    spreadsheetId: '19Z3nQt9lY1SMw3drTR0ly-rRsLRkTjEUJjV9_vl9d18',
    range: 'sheet1',
  }, (err, res) => {
    if (err) return console.log('The API1 returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      rows.map((row) => {
        console.log('Name, Major:' + `${row[0]}`);
      });
    } else {
      console.log('No data found.');
    }
  });
}

function Listwrite(spreadsheetId, range, valueInputOption, _values) {
    let values = [
      [
        1
      ],
       // Additional rows ...
    ];
    values = _values;
    let resource = {
      values,
    };
    const sheets = google.sheets({
      version: 'v4', 
    });
    sheets.spreadsheets.values.append({
      auth: 'auth',
      spreadsheetId: 'スプレッドシートID',
      range: 'sheet1',
      valueInputOption: 'RAW',
      resource: "hello world",
    }, (err, result) => {
      if (err) return console.log(err);
      cconsole.log(`${result.updates.updatedCells} cells appended.` + 'OK');
      resolve(result);
    });
}
