import { Plugin, TFile, Workspace } from 'obsidian';
import { getAllDailyNotes, getDailyNote, createDailyNote } from 'obsidian-daily-notes-interface';
import moment from 'moment';

export default class MovingCheckbox extends Plugin {

	async onload() {
		this.addCommand({
			id: "select_task",
			name: "Select current task",
			async editorCallback(editor, ctx) {
				const lineNr = editor.getCursor().line
				const selection = editor.getLine(lineNr)
				const checkboxRe = /[-*]\s\[ ] (?!~|\[\^\d+])/g
				if (selection.match(checkboxRe)) {

					// Find next day or create next day in daily calendar
					const tomorrow = moment().add(1, "d")
					let nextNote: TFile = getDailyNote(tomorrow, getAllDailyNotes())
					if (!nextNote) {
						nextNote = await createDailyNote(tomorrow)
					}	
					
					// Copy task to next day
					
					
					// Check settings what to do
					// Check settings skip weekend
					// Change Task to moved [>]
					
					openNoteNewLeaf(ctx.app.workspace, nextNote)

					//new Notice(note.name)
				}
			},
		})

		// TODO: move to seperate file
		function openNoteNewLeaf(workspace: Workspace, note: TFile): void {
			let exists = false;
			workspace.iterateAllLeaves(l => { 
				exists = exists ? exists : l.getDisplayText() === note.basename 
			});
	
			if (!exists) {
				workspace.getLeaf("tab").openFile(note, { active: false })
			}
		}
	}

	onunload() {
		//console.log('Unloading plugin Moving checkbox');
		
	}

	async test(): Promise<void> {
		console.log("Test");
		
	}
}