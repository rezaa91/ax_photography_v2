/**
 * @return {json|null} - return json|null depending on whether settings where successfully retrieved from container
 */
function getSettings() {
    const settingsContainer = document.querySelector('#allSettings');

    if (!settingsContainer) {
        return;
    }

    return settingsContainer.getAttribute('data-settings');
}

/**
 * @return {array} settings
 */
function convertJSONSettings() {
    const jsonSettings = getSettings();

    if (!jsonSettings) {
        return [];
    }

    return JSON.parse(jsonSettings);
}

export default function allSettings() {
    return convertJSONSettings();
}
