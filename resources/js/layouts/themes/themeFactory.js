import allSettings from '../../pages/settings/data/settingsData';
import themes from './themesList';

/**
 * get the theme value selected by the user from the settings and return the appropriate theme
 * @return {object} theme which relates to the setting selected by administrator
 */
export default function getSelectedTheme() {
    const {theme} = allSettings();

    switch(theme) {
        case 0:
            return themes().defaultTheme;
        case 1:
            return themes().lightTheme;
        case 2:
           return themes().darkTheme;
    }
}
