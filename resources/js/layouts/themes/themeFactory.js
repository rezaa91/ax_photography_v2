import allSettings from '../../pages/settings/data/settingsData';
import {defaultTheme, lightTheme, darkTheme} from './themesList';

/**
 * get the theme value selected by the user from the settings and return the appropriate theme
 * @return {object} theme which relates to the setting selected by administrator
 */
export default function getSelectedTheme() {
    const {theme} = allSettings();

    switch(theme) {
        case 0:
            return defaultTheme;
        case 1:
            return lightTheme;
        case 2:
           return darkTheme;
        default:
            return defaultTheme;
    }
}

// IMPORTANT - if the above function is changed, ensure to change the unit tests as this function is completely mocked
