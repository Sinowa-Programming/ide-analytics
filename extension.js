// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const Timer = require('./scripts/timer.js'); // Load the time


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


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

// var keyCounter = 0; 
// var backspaceCounter = 0;	// Not plausible atm



function activate(context) {

	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "ide-analytics" is now active!');


	// Fires whenever the focus changes on the window( like when the user clicks off )
	vscode.window.onDidChangeWindowState(newState => {
		if( vscode.window.activeTextEditor != currentEditor ) {	// Incase the IDE is started with an project already open
			currentEditor = vscode.window.activeTextEditor;
			collection_dict["currentLanguage"] = currentEditor.document.languageId;
			currentLineCnt = currentEditor.document.lineCount;
		}
		//console.log(`Focused: ${newState.focused}`);
		if( !newState.focused ) {
			//console.log(`Time spent in focus: ${(Timer.endTimer()/1000)} secs`)
			collection_dict["totalTimeInFocus"] += (Timer.endTimer()/1000);
			Timer.startTimer();
		} else {
			//console.log(`Time spent out of focus: ${(Timer.endTimer()/1000)} secs`)
			collection_dict["totalTimeOutFocus"] += (Timer.endTimer()/1000);
			Timer.startTimer();
		
		}
		console.log(`Collection dict(LA): ${collection_dict["linesRemoved"]} | Collection dict(LR): ${collection_dict["linesAdded"]}`,);
		
	});


	// Fires whenever the active text editor has been changed
	vscode.window.onDidChangeActiveTextEditor( textEditor => {
		if( textEditor != undefined ) {	// It can become undefined if the user clicks off
			currentLineCnt = textEditor.document.lineCount;
			currentEditor = textEditor;
			console.log(`Current editor set: ${currentEditor}`);
			//console.log(`New Text editor language: ${textEditor.document.languageId}`);
			collection_dict["currentLanguage"] = textEditor.document.languageId;
		};
		console.log(`Collection dict(LA): ${collection_dict["linesRemoved"]} | Collection dict(LR): ${collection_dict["linesAdded"]}`,);
	});
	
	// Listening for text document change
	vscode.workspace.onDidChangeTextDocument( textDocEvent => {
		if( currentEditor != undefined && (currentLineCnt != currentEditor.document.lineCount)) {	// current editor may be undefined when starting the extension
			let lineDiff = currentLineCnt - currentEditor.document.lineCount;
			console.log(`Line diff: ${lineDiff}`);
			if( lineDiff > 0 ) {	// line(s) was removed
				collection_dict["linesRemoved"] += Math.abs(lineDiff);
			} else {	// line(s) were added
				collection_dict["linesAdded"] += Math.abs(lineDiff);
			}
			currentLineCnt = currentEditor.document.lineCount;
		}
		//console.log("Text document changed!");
		//console.log(`Reason: ${textDocEvent.reason}`);
		//console.log(`Content Change: ${textDocEvent.contentChanges[0].text}`);
		collection_dict["keyPressHistory"] += textDocEvent.contentChanges[0].text
		// keyCounter += 1;
		collection_dict["keyCounter"] += 1;
		//console.log(`keyCounter: ${keyCounter}`);
		collection_dict["currentLanguage"] = textDocEvent.document.languageId;
		console.log(`Collection dict(LA): ${collection_dict["linesRemoved"]} | Collection dict(LR): ${collection_dict["linesAdded"]}`,);

	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ide-analytics.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		console.log(`Collection dict(LA): ${collection_dict["linesRemoved"]} | Collection dict(LR): ${collection_dict["linesAdded"]}`,);

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
