import { Notice, Plugin } from 'obsidian';

export default class MovingCheckbox extends Plugin {

	async onload() {
		console.log('Loading plugin Moving checkbox');

		new Notice("Hi, I'm the 'Moving Checkbox'plugin!")

		this.addCommand({
			id: "select_task",
			name: "Select current task",
			editorCallback(editor, ctx) {
				const lineNr = editor.getCursor().line
				const selection = editor.getLine(lineNr)
				const checkboxRe = /[-*]\s\[ ] (?!~|\[\^\d+])/g
				if (selection.match(checkboxRe)) {
					new Notice(selection)
				}
			},
		})
	}

	onunload() {
		console.log('Unloading plugin Moving checkbox');
		
	}
}