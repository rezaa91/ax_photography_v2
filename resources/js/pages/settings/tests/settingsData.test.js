import allSettings from '../data/settingsData';

test('expect empty array if dom element does not exist', () => {
    document.body.innerHTML = `<div></div>`;

    expect(allSettings()).toEqual([]);
});

test('expect empty array if dom element exists but data attribute does not', () => {
    document.body.innerHTML = `<div id="allSettings"></div>`;

    expect(allSettings()).toEqual([]);
})

test('expect parsed json if expected dom element exists', () => {
    document.body.innerHTML = `<div id="allSettings" data-settings='[{"name": "theme", "value": 0}]'></div>`;
    
    expect(allSettings()).toEqual([{
        name: 'theme',
        value: 0
    }]);
})

test('expect multiple objects if multiple settings to be returned', () => {
    document.body.innerHTML = `<div id="allSettings" data-settings='[{"name": "theme", "value": 0}, {"name": "display", "value": true}]'></div>`;
    
    expect(allSettings()).toEqual([
        {
            name: 'theme',
            value: 0
        },
        {
            name: 'display',
            value: true
        }
    ])
})

