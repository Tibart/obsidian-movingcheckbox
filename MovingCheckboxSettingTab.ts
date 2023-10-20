import MovingCheckbox from "main"
import { App, Setting, PluginSettingTab } from "obsidian"

export interface MovingCheckboxSettings {
	skipWeekend: boolean,
    movedSign: string,
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
    }

    addSkipWeekend(): void {
        new Setting(this.containerEl)
            .setName('Skip weekends?')
            .addToggle(t => t
                .setValue(this.plugin.settings.skipWeekend)
                .onChange( async v => {
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
                .onChange( async v => {
                    this.plugin.settings.movedSign = v
                    await this.plugin.saveSettings()
                }))
    }
}