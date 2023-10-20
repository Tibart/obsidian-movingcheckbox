import { Editor, Plugin, TFile, Workspace } from 'obsidian';
import { getAllDailyNotes, getDailyNote, createDailyNote, getDailyNoteSettings, getTemplateInfo } from 'obsidian-daily-notes-interface';
import { MovingCheckboxSettingTab, MovingCheckboxSettings } from 'MovingCheckboxSettingTab';
import moment from 'moment';
import { Context } from 'vm';



export default class MovingCheckbox extends Plugin {
	settings: MovingCheckboxSettings

	async loadSettings() {
		const DEFAULT_SETTINGS: MovingCheckboxSettings = {
			skipWeekend: true,
			movedSign: '>'
		}
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
	
	async onload() {
		await this.loadSettings()
		this.addSettingTab(new MovingCheckboxSettingTab(this.app, this))
		const settings = this.settings
		
		this.addCommand({
			id: "select_task",
			name: "Select current task",
			async editorCallback(editor, ctx) {
				await MoveCheckBox(editor, ctx)
			}
		})
		
		async function MoveCheckBox(editor: Editor, ctx: Context) {
			const cursor = editor.getCursor()
			const selection = editor.getLine(cursor.line)
			const checkboxRe = /[-*]\s\[ ] (?!~|\[\^\d+])/g

			if (selection.match(checkboxRe)) {
				const nextDay = moment().add(skipDays(), "d")
				let nextNote: TFile = getDailyNote(nextDay, getAllDailyNotes())
				if (!nextNote) {
					nextNote = await createDailyNote(nextDay)
				}

				// Copy task to next day
				let nextNoteContent = await ctx.app.vault.read(nextNote);
				
				// TODO: insert checkbox at the right position
				nextNoteContent = nextNoteContent + selection + '\n'
				ctx.app.vault.modify(nextNote, nextNoteContent)
				
				// Set existing task to completed
				editor.setLine(cursor.line, selection.replace('[ ]', '[' + settings.movedSign + ']'))

				//openNoteNewLeaf(ctx.app.workspace, nextNote)
			}
		}

		function skipDays() { 
			let days = 1

			if (settings.skipWeekend)
			{
				const dotw = moment().weekday(); 
				days = dotw >= 5 ? 8 - dotw : 1
			}

			return days
		}

		// TODO: move to separate file
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



}