// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const Timer = require('./scripts/timer.js'); // Load the time



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

var keyCounter = 0; 
var backspaceCounter = 0;

function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ide-analytics" is now active!');
	
	// Fires whenever the focus changes on the window( like when the user clicks off )
	vscode.window.onDidChangeWindowState(newState => {
		console.log(`Focused: ${newState.focused}`);
		if( !newState.focused ) {
			console.log(`Time spent in focus: ${(Timer.endTimer()/1000)} secs`)
			Timer.startTimer();
		} else {
			console.log(`Time spent out of focus: ${(Timer.endTimer()/1000)} secs`)
			Timer.startTimer();
		
		}
	});


	// Fires whenever the active text editor has been changed
	vscode.window.onDidChangeActiveTextEditor( textEditor => {
		if( textEditor != undefined ) {	// It can become undefined if the user clicks off
			console.log(`New Text editor language: ${textEditor.document.languageId}`);
		};
	});
	
	// Listening for text document change
	vscode.workspace.onDidChangeTextDocument( textDocEvent => {
	
		console.log("Text document changed!");
		console.log(`Reason: ${textDocEvent.reason}`);
		console.log(`Content Change: ${textDocEvent.contentChanges[0].text}`);
		keyCounter += 1;
		console.log(`keyCounter: ${keyCounter}`);
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ide-analytics.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		
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
