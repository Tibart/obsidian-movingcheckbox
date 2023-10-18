import MovingCheckbox from "main"
import { App, Setting, PluginSettingTab } from "obsidian"

export interface MovingCheckboxSettings {
	skipWeekend: boolean
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
    }

    addSkipWeekend(): void {
        new Setting(this.containerEl)
            .setName('Skip weekends?')
            .addToggle(t => t
                .setValue(this.plugin.settings.skipWeekend)
                .onChange( async v => {
                    this.plugin.settings.skipWeekend = v
                    await this.plugin.saveSettings()
                })
            )
    }
}