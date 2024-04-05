// FIREBASE SETUP START----------------------------------------------


const { initializeApp } = require('firebase/app');

const { getDatabase, ref, set } = require("firebase/database");

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// The app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCFyDc88KX70VqY7BYx2TlNt6le0xHfwpc",
	authDomain: "ide-analytics.firebaseapp.com",
	databaseURL: "https://ide-analytics-default-rtdb.firebaseio.com/",
	projectId: "ide-analytics",
	storageBucket: "ide-analytics.appspot.com",
	messagingSenderId: "242405334050",
	appId: "1:242405334050:web:c3528d0ce2534fb585be7b",
	measurementId: "G-9KCDZRQ9C6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)


// Exports the data from the collection_dict
function sendData(userId, data ) {
	set(ref(database, 'users/' + userId), {
		keyCounter: data["keyCounter"], 
		keyPressHistory : data["keyPressHistory"],
		totalTimeInFocus : data["totalTimeInFocus"],
		totalTimeOutFocus : data["totalTimeOutFocus"],
		currentLanguage : data["currentLanguage"],
		linesAdded : data["linesAdded"],
		linesRemoved : data["linesRemoved"],
	});
}

// FIREBASE SETUP END----------------------------------------------

// DATA COLLECTION SETUP START-------------------------------------
const vscode = require('vscode');
const Timer = require('./scripts/timer.js'); // Load the timer


var CALL_TIME = 1000 * 30	// 30 seconds

var currentLineCnt = undefined;
var currentEditor = undefined;
// Collect all of the data to export to the server
let collection_dict={ 
	"keyCounter":0, 
	"keyPressHistory" : "",
	"totalTimeInFocus" : 0,
	"totalTimeOutFocus" : 0,
	"currentLanguage" : "null",
	"linesAdded" : 0,
	"linesRemoved" : 0,
};

// DATA COLLECTION SETUP END-------------------------------------

// MAIN START----------------------------------------------------
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */



function activate(context) {

	console.log("Extension started");

	// Calls the function every x ms.
	function setCallInterval() {
		sendData( "rando", collection_dict );
		setInterval(setCallInterval, CALL_TIME);	  
	}

	// Fires whenever the focus changes on the window( like when the user clicks off )
	vscode.window.onDidChangeWindowState(newState => {
		if( vscode.window.activeTextEditor != currentEditor ) {	// Incase the IDE is started with an project already open
			currentEditor = vscode.window.activeTextEditor;
			collection_dict["currentLanguage"] = currentEditor.document.languageId;
			currentLineCnt = currentEditor.document.lineCount;
		}
		if( !newState.focused ) {
			collection_dict["totalTimeInFocus"] += (Timer.endTimer()/1000);
			Timer.startTimer();
		} else {
			collection_dict["totalTimeOutFocus"] += (Timer.endTimer()/1000);
			Timer.startTimer();
		
		}		
	});


	// Fires whenever the active text editor has been changed
	vscode.window.onDidChangeActiveTextEditor( textEditor => {
		if( textEditor != undefined ) {	// It can become undefined if the user clicks off
			currentLineCnt = textEditor.document.lineCount;
			currentEditor = textEditor;
			collection_dict["currentLanguage"] = textEditor.document.languageId;
		};
	});
	
	// Listening for text document change
	vscode.workspace.onDidChangeTextDocument( textDocEvent => {
		if( currentEditor != undefined && (currentLineCnt != currentEditor.document.lineCount)) {	// current editor may be undefined when starting the extension
			let lineDiff = currentLineCnt - currentEditor.document.lineCount;
			if( lineDiff > 0 ) {	// line(s) was removed
				collection_dict["linesRemoved"] += Math.abs(lineDiff);
			} else {	// line(s) were added
				collection_dict["linesAdded"] += Math.abs(lineDiff);
			}
			currentLineCnt = currentEditor.document.lineCount;
		}
		collection_dict["keyPressHistory"] += textDocEvent.contentChanges[0].text
		collection_dict["keyCounter"] += 1;
		collection_dict["currentLanguage"] = textDocEvent.document.languageId;
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ide-analytics.helloWorld', function () {
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from IDE Analytics!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}


// MAIN END----------------------------------------------------
