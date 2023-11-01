import MovingCheckbox from "main"
import { App, Setting, PluginSettingTab, TFile } from "obsidian"
import { getDailyNoteSettings } from "obsidian-daily-notes-interface"

export interface MovingCheckboxSettings {
    skipWeekend: boolean,
    movedSign: string,
    templateHeader: string,
    addToTop: boolean,
    onlyMoveUnchecked: boolean,
}

export class MovingCheckboxSettingTab extends PluginSettingTab {
    plugin: MovingCheckbox

    constructor(app: App, plugin: MovingCheckbox) {
        super(app, plugin)
        this.plugin = plugin
    }

    display(): void {
        this.containerEl.empty();

        this.containerEl.createEl('h3', { text: 'Moving checkbox settings' })

        this.addSkipWeekend()
        this.addMovedSign()
        this.addTemplateHeading()
        this.addAddToTop()
        this.addOnlyMoveUnchecked();
    }

    addSkipWeekend(): void {
        new Setting(this.containerEl)
            .setName('Skip weekends?')
            .addToggle(t => t
                .setValue(this.plugin.settings.skipWeekend)
                .onChange(async v => {
                    this.plugin.settings.skipWeekend = v
                    await this.plugin.saveSettings()
                }))
    }

    addMovedSign(): void {
        new Setting(this.containerEl)
            .setName('Moved marked sign')
            .setDesc("What marked sign should the checkbox have when it is moved. Traditionally is is marked with a 'x' what causes the checkbox to strikeout. Default for this plugin is '>'. This does not strikeout the checkbox and indicated a movement to the next day according to some bullet journal conventions.")
            .addText(t => t
                .setValue(this.plugin.settings.movedSign)
                .onChange(async v => {
                    this.plugin.settings.movedSign = v
                    await this.plugin.saveSettings()
                }))
    }

    async addTemplateHeading() {
        const templateHeaders = await this.getTemplateHeaders()

        new Setting(this.containerEl)
            .setName('Template header')
            .setDesc('Under what template header should the checkbox be moved? You need to have the core plugin Daily notes enabled and selected a default template.')
            .addDropdown(d => d
                .setDisabled(Object.keys(templateHeaders).length === 0 ? true : false)
                .addOption('none', "No header")
                .addOptions(templateHeaders)
                .setValue(this.plugin.settings.templateHeader)
                .onChange(async v => {
                    this.plugin.settings.templateHeader = v
                    await this.plugin.saveSettings()
                }))
    }
    
    addAddToTop() {
        new Setting(this.containerEl)
            .setName("Add to top of list?")
            .setDesc("Add the moved check box to the top or the bottom of the existing list?")
            .addToggle(t => t
                .setValue(this.plugin.settings.addToTop)
                .onChange(async v => {
                    this.plugin.settings.addToTop = v
                    await this.plugin.saveSettings()
                }))
    }

    addOnlyMoveUnchecked() {
        new Setting(this.containerEl)
            .setName("Only move unchecked?")
            .addToggle(t => t
                .setValue(this.plugin.settings.onlyMoveUnchecked)
                .onChange(async v => {
                    this.plugin.settings.onlyMoveUnchecked = v
                    await this.plugin.saveSettings()
                }))
    }
    
    async getTemplateHeaders(): Promise<Record<string, string>> {
        const path = getDailyNoteSettings().template
        if (!path) return {}

        const file = this.app.vault.getAbstractFileByPath(path + ".md") as TFile
        if (file === null) return {}

        const content = await this.app.vault.read(file)
        const headers: Record<string, string> = {}
        for (const header of Array.from(content.matchAll(/#{1,} .*/g)).map(h => h.toString())) {
            headers[header] = header
        }

        return headers
    }

}