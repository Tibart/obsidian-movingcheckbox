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
  
        let nextNoteContent = await this.app.vault.read(nextNote);
        const nextNoteLines = nextNoteContent.split('\n')
        let insertIdx = nextNoteLines.indexOf(plugin.settings.templateHeader) + 1

        // TODO: Check if exists in checked state
        const exists = nextNoteLines.indexOf(selection, insertIdx) >= 0
        
        if (!exists) {
            if (!plugin.settings.addToTop) {
                while (nextNoteLines[++insertIdx].match(checkboxRe)) { null }
            }
            nextNoteLines.splice(insertIdx, 0, selection)
            nextNoteContent = nextNoteLines.join('\n')
        
            this.app.vault.modify(nextNote, nextNoteContent)
        }
        
        editor.setLine(cursor.line, selection.replace('[ ]', '[' + plugin.settings.movedSign + ']'))
        
        if (exists) {
            new Notice('Checkbox already exists!')
        } else {
            new Notice('Moved checkbox: ' + selection.substring(checkbox.toString().length))
        }
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