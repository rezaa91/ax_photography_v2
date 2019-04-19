import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import AllSettings from './allSettings';
import Btn from '../../global_components/btn';
import settings from './singleton/settingsSingleton';

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: '',
            success: ''
        }
    }

    /**
     * Call the method which calls the ajax response which in turn saves the new settings in the database
     */
    saveSettings = async () => {
        try {
            const response = await settings.updateSettings();

            if (!response) {
                throw new Error('Unable to save settings, please try again.');
            }

            this.setState({success: 'Your settings have been saved. Refresh the page for your changes to be applied'});
        } catch (error) {
            this.setState({error});
        }
    }

    /**
     * reset any recent success/failed ajax setting update saves
     */
    resetResponseMessages = () => {
        this.setState({error: ''});
        this.setState({success: ''});
    }

    render() {
        return(
            <div>
                <h2 className="title">Default Settings</h2>
                <AllSettings settings={settings.getSettings} resetResponseMessages={this.resetResponseMessages} />

                <div className="submit-wrapper">
                    <Btn onClick={this.saveSettings} text="SAVE" classes="btn-green" />
                </div>

                <div className="error">{this.state.error}</div>
                <div className="success">{this.state.success}</div>
            </div>
        );
    }
}

if (document.getElementById('settings')) {
    ReactDOM.render(<Settings settings={settings.getSettings()} />, document.getElementById('settings'));
}
