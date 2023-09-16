// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { exec } from 'child_process';
import * as vscode from 'vscode';
const path = require('path');

// Create a relative path to data.txt

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "browseride" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable1 = vscode.commands.registerCommand('browseride.start', () => {
		// The code you place here will be executed every time your command is executed
		// exec('npm start');


		exec('npm run start', { cwd: __dirname }, (error, stdout, stderr) => {
			// Handle the result here
			console.log(stdout, stderr);
		});
		
    // serverProcess.stderr.on('data', (data: any) => {
    //   console.error(data.toString());
    // });

		// Display a message box to the user
		vscode.window.showInformationMessage('BrowserIDE server has started.');
	});

	// let disposable2 = vscode.commands.registerCommand('extension.openFile', async (uri) => {
	// 	if (uri) {
	// 		const workspaceFolder = vscode.workspace?.workspaceFolders;
	// 		if (workspaceFolder) {
	// 			const filePath = path.join(workspaceFolder[0].uri.fsPath, uri);
	// 			const doc = await vscode.workspace.openTextDocument(filePath);
	// 			await vscode.window.showTextDocument(doc);
	// 		}
  //   }
  // });

	context.subscriptions.push(disposable1);
}

// This method is called when your extension is deactivated
export function deactivate() {}
