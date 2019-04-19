import getSelectedTheme from './themes/themeFactory';

/**
 * Apply the chosen theme by the user
 */
export function applyTheme() {
    const theme = getSelectedTheme();

    if(!theme) {
        return;
    }

    // Loop through the section applying the associated styles
    // The inner loop, loops through the css properties of the chosen selector and applies styles
    Object.keys(theme).forEach(section => {
        const selector = theme[section].selector; // e.g. .navigation-wrapper
        const styles = theme[section].styles; // e.g. {color: white, backgroundColor: black}

        if (!selector || !styles) {
            return;
        }

        Object.keys(styles).forEach(styling => {
            const domElements = document.querySelectorAll(selector); // return node list as may be multiple elements with same class

            if (!domElements) {
                return;
            }

            domElements.forEach(domElement => {
                domElement.style[styling] = styles[styling]; // e.g. domElement.style[color] = white
            })
        })
    });
}
