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

    // Get checkbox
    const cursor = editor.getCursor()
    const selection = editor.getLine(cursor.line)
    const checkboxRe = plugin.settings.onlyMoveUnchecked
        ? /[-*]\s\[ ] (?!~|\[\^\d+])/g
        : /[-*]\s\[[xX*<>\-+#@=!?qQ ]] (?!~|\[\^\d+])/g 
    const checkbox = selection.match(checkboxRe)
    if (dailyNotesEnabled && checkbox) {
        // Find or create target daily note
        const nextDay = moment().add(skipDays(plugin.settings.skipWeekend), 'd')
        let nextNote: TFile = getDailyNote(nextDay, getAllDailyNotes())
        if (!nextNote) {
            nextNote = await createDailyNote(nextDay)
        }
  
        // Load next note and check if checkbox can be moved
        let nextNoteContent = await this.app.vault.read(nextNote);
        const nextNoteLines = nextNoteContent.split('\n')
        let insertIdx = nextNoteLines.indexOf(plugin.settings.templateHeader)

        // Check if already exists
        const checkboxText = selection.substring(checkbox.toString().length)
        const uncheckedSelection = '- [ ] ' + checkboxText
        const exists = nextNoteLines.indexOf(uncheckedSelection, insertIdx + 1) >= 0
        if (exists) {
            return new Notice('Checkbox already exists!')
        }
    
        // Move checkbox
        if (!plugin.settings.addToTop) {
            while (nextNoteLines[insertIdx].match(checkboxRe)) { insertIdx += 1 }
        }
        nextNoteLines.splice(insertIdx + 1, 0, uncheckedSelection)
        nextNoteContent = nextNoteLines.join('\n')
        this.app.vault.modify(nextNote, nextNoteContent)

        // Check selected checkbox
        editor.setLine(cursor.line, selection.replace('[ ]', '[' + plugin.settings.movedSign + ']'))
        new Notice('Moved checkbox: ' + checkboxText)
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