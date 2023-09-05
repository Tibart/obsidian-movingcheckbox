import { Notice, Plugin } from 'obsidian';

export default class MovingCheckbox extends Plugin {

	async onload() {
		this.addCommand({
			id: "select_task",
			name: "Select current task",
			editorCallback(editor, ctx) {
				const lineNr = editor.getCursor().line
				const selection = editor.getLine(lineNr)
				const checkboxRe = /[-*]\s\[ ] (?!~|\[\^\d+])/g
				if (selection.match(checkboxRe)) {
					// Find next day or create next day in daily calendar

					// Copy task to next day

					// Check settings what to do
					// Change Task to moved [>]

					new Notice(selection)
				}
			},
		})
	}

	onunload() {
		console.log('Unloading plugin Moving checkbox');
		
	}
}