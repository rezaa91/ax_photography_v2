const darkTheme = {
    selector: '.test',
    styles: {
        color: 'white',
        backgroundColor: 'black'
    },
    selector: '#testId',
    styles: {
        padding: '10px',
        borderColor: 'red'
    }
}

const defaultTheme = {

}

test('expect the allSettings function to be called within the getSelectedTheme function', () => {
    const allSettings = jest.fn(() => ({theme: 0}));

    const getSelectedTheme = jest.fn(() => {
        const {theme} = allSettings();

        switch(theme) {
            case 0:
                return darkTheme;
            default:
                return defaultTheme;
        }
    })
    
    expect(getSelectedTheme()).toEqual(darkTheme);
    expect(allSettings).toHaveBeenCalledTimes(1);
})

test('expect incorrect data type/value to result in the default theme being selected', () => {
    const allSettings = jest.fn(() => ({theme: 'stringy'}));

    const getSelectedTheme = jest.fn(() => {
        const {theme} = allSettings();

        switch(theme) {
            case 0:
                return darkTheme;
            default:
                return defaultTheme;
        }
    })

    expect(getSelectedTheme()).toEqual(defaultTheme);
})

test('expect default theme to be selected if allSettings function returns invalid result', () => {
    const allSettings = jest.fn(() => (1)); // would normally expect an object to be returned with the theme property

    const getSelectedTheme = jest.fn(() => {
        const {theme} = allSettings();

        switch(theme) {
            case 0:
                return darkTheme;
            default:
                return defaultTheme;
        }
    })

    expect(getSelectedTheme()).toEqual(defaultTheme);
})

