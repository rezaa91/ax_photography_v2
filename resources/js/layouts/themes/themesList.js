import {darkGrey, white, green, black, darkGreen, lightGreen} from '../../constants/colors';

export const defaultTheme = {
    // left blank as default theme is the default css
}

export const darkTheme = {
    navigation: {
        selector: '.navigation-wrapper',
        styles: {
            backgroundColor: darkGrey
        }
    },
    navigationTitle: {
        selector: '.nav-title a',
        styles: {
            color: white
        }
    },
    navigationLinks: {
        selector: '.main-link',
        styles: {
            color: lightGreen
        }
    },
    homepageMainBtn: {
        selector: '.mainBtn',
        styles: {
            backgroundColor: black,
            color: lightGreen 
        }
    },
    homepageHeader: {
        selector: '.homepage-header h1',
        styles: {
            color: black
        }
    },
    albumTitle: {
        selector: '.inline',
        styles: {
            color: black,
        }
    },
    headers: {
        selector: 'h1',
        styles: {
            color: black
        }
    },
    submitBtn: {
        selector: '.form-section input[type="submit"]',
        styles: {
            backgroundColor: darkGrey,
        }
    },
    buttons: {
        selector: '.btn-component',
        styles: {
            backgroundColor: darkGrey
        }
    }
}

export const lightTheme = {
    navigation: {
        selector: '.navigation-wrapper',
        styles: {
            backgroundColor: white
        }
    },
    navigationTitle: {
        selector: '.nav-title a',
        styles: {
            color: green
        }
    },
    navigationLinks: {
        selector: '.main-link',
        styles: {
            color: darkGrey
        }
    },
    homepageMainBtn: {
        selector: '.mainBtn',
        styles: {
            backgroundColor: white,
            color: green 
        }
    },
    albumTitle: {
        selector: '.inline',
        styles: {
            color: green,
        }
    },
    headers: {
        selector: 'h1',
        styles: {
            color: lightGreen
        }
    },
    submitBtn: {
        selector: '.form-section input[type="submit"]',
        styles: {
            backgroundColor: lightGreen,
            color: darkGrey
        }
    },
    buttons: {
        selector: '.btn-component',
        styles: {
            backgroundColor: white,
            color: darkGreen,
            borderColor: lightGreen
        }
    }
}
