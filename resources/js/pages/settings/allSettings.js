import React, {Component} from 'react';
import settings from './singleton/settingsSingleton';

export default class AllSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stateSettings: props.settings
        }
    }

    /**
     * Update settings
     * @param {string} settingName e.g. theme
     * @param {any} value - new setting value
     */
    updateSetting = (settingName, value) => {
        const {...stateSettings} = this.state;
        const {resetResponseMessages} = this.props;

        // reset any feedback messages resulting from previous successful/failed settings save
        resetResponseMessages();
        
        stateSettings[name] = value;
        this.setState({stateSettings});

        settings.setSetting(settingName, value);
    }

    render() {
        return(
            <div>
                <div className="setting-option">
                    <span className="setting-title">Theme:</span>
                    <div className="setting-inputs">
                        <span>
                            <input checked={settings.getSetting('theme') === 0} type="radio" name="theme" value="0" onChange={() => this.updateSetting('theme', 0)} /> Default Theme
                        </span>
                        <span>
                            <input checked={settings.getSetting('theme') === 1} type="radio" name="theme" value="1" onChange={() => this.updateSetting('theme', 1)} /> Light Theme
                        </span>
                        <span>
                            <input checked={settings.getSetting('theme') === 2} type="radio" name="theme" value="2" onChange={() => this.updateSetting('theme', 2)} /> Dark Theme
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}