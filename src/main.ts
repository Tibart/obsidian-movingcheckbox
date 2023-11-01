/* eslint-disable @typescript-eslint/no-unused-vars */
import { Editor, Menu, Notice, Plugin, TFile, Workspace, setIcon } from 'obsidian';
import { getAllDailyNotes, getDailyNote, createDailyNote } from 'obsidian-daily-notes-interface';
import { MovingCheckboxSettingTab, MovingCheckboxSettings } from 'movingCheckboxSettingTab';
import moment from 'moment';
import { MoveCheckBox } from 'movingCheckBox';

export default class MovingCheckbox extends Plugin {
	settings: MovingCheckboxSettings;
	
	async onload() {
		await this.loadSettings()

		this.addSettingTab(new MovingCheckboxSettingTab(this.app, this))
		
		this.addCommand({
			id: "select_task",
			name: "Select current task",
			editorCallback: async (editor: Editor) =>  {		
				await MoveCheckBox(this, editor)
			}
		})
	}

	onunload() {
		// console.log('Unloading plugin Moving checkbox');
	}

	async loadSettings() {
		const DEFAULT_SETTINGS: MovingCheckboxSettings = {
			skipWeekend: true,
			movedSign: '>',
			templateHeader: 'none',
			addToTop: false,
		}
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

}