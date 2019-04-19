import allSettings from '../data/settingsData';

class SettingsSingleton {
    settings = null;
    token = document.querySelector('meta[name="csrf-token"]').content;

    constructor(settings) {
        this.settings = settings;
    }

    /**
     * update default settings in database
     */
    async updateSettings() {
        try {
            await fetch(`api/updatesettings`, {
                method: 'POST',
                headers: {
                    "x-csrf-token": this.token,
                    Authorization: "Bearer " + document.querySelector('meta[name="api_token"]').content
                },
                body: JSON.stringify(this.getSettings())
            });

            return true;

        } catch (error) {
            return error;
        }
    }

    /**
     * update setting with new setting selected by user
     * @param {string} name 
     * @param {any} value 
     */
    setSetting(name, value) {
        this.settings[name] = value;
    }

    getSetting(name) {
        return this.settings[name];
    }

    /**
     * @return {object} - all settings with values
     */
    getSettings() {
        return this.settings;
    }
}

// export only one instance
export default new SettingsSingleton(allSettings());
