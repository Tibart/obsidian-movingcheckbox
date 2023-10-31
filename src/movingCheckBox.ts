import MovingCheckbox from "main"
import moment from "moment"
import { Editor, Notice, TFile, Workspace } from "obsidian"
import { createDailyNote, getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface"

export async function MoveCheckBox(plugin: MovingCheckbox, editor: Editor) {
    const dailyNotesPlugin = this.app.internalPlugins.plugins["daily-notes"];
    const dailyNotesEnabled = dailyNotesPlugin && dailyNotesPlugin.enabled;
    if (!dailyNotesEnabled)
    {
        return alert("You need the plugin 'Daily notes' enabled whe using this plugin!")
    }

    const cursor = editor.getCursor()
    const selection = editor.getLine(cursor.line)
    const checkboxRe = /[-*]\s\[ ] (?!~|\[\^\d+])/g
    const checkbox = selection.match(checkboxRe)
    if (dailyNotesEnabled && checkbox) {

        const nextDay = moment().add(skipDays(plugin.settings.skipWeekend), 'd')
        let nextNote: TFile = getDailyNote(nextDay, getAllDailyNotes())
        if (!nextNote) {
            nextNote = await createDailyNote(nextDay)
        }
        
        // TODO: when no header is selected put checkbox at the bottom or top, use setting!
        // TODO: make smarter! Check exists. 
        const nextCheckbox = `${plugin.settings.templateHeader}\n${selection}`
        let nextNoteContent = await this.app.vault.read(nextNote);
        let lines = nextNoteContent.split('\n')
        let i = lines.indexOf(plugin.settings.templateHeader)
        while (lines[i++].includes(checkbox)) {
            
        }
        lines.splice(i, 0, selection)
        nextNoteContent = nextNoteContent.replace(plugin.settings.templateHeader, nextCheckbox)
        
        // Copy checkbox to next day and set existing checkbox to completed
        this.app.vault.modify(nextNote, nextNoteContent)
        editor.setLine(cursor.line, selection.replace('[ ]', '[' + plugin.settings.movedSign + ']'))
        
        // TODO: add settings option to be verbose, or not. 
        new Notice('Moved checkbox: ' + selection.substring(checkbox.toString().length))
    }
}

function skipDays(skipWeekend: boolean) { 
    let days = 1

    if (skipWeekend)
    {
        const dotw = moment().weekday(); 
        days = dotw >= 5 ? 8 - dotw : 1
    }

    return days
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openNoteNewLeaf(workspace: Workspace, note: TFile, activate=false): void {
    let exists = false;
    workspace.iterateAllLeaves(l => {
        exists = exists ? exists : l.getDisplayText() === note.basename
    });

    if (!exists) {
        workspace.getLeaf("tab").openFile(note, { active: activate })
    }
}