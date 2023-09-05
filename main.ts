import { Notice, Plugin } from 'obsidian';
import { getAllDailyNotes, getDailyNote } from 'obsidian-daily-notes-interface';
import * as moment from 'moment'

export default class MovingCheckbox extends Plugin {

	async onload() {
		this.addCommand({
			id: "select_task",
			name: "Select current task",
			editorCallback(editor, ctx) {
				const lineNr = editor.getCursor().line
				const selection = editor.getLine(lineNr)
				const checkboxRe = /[-*]\s\[ ] (?!~|\[\^\d+])/g
				if (editor.somethingSelected() && selection.match(checkboxRe)) {
					// Find next day or create next day in daily calendar
					const tomorrow = moment().add(1, 'day')
					const note = getDailyNote(tomorrow, getAllDailyNotes())
					

					// Copy task to next day

					// Check settings what to do
					// Check settings skip weekend
					// Change Task to moved [>]

					new Notice(note.name)
				}
			},
		})
	}

	onunload() {
		console.log('Unloading plugin Moving checkbox');
		
	}
}