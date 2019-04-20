import {parseNotifications} from '../data/notificationData';

test('expect to parse JSON from div element', () => {
    document.body.innerHTML = `<div id="dashboard" data-notifications='{"id": 1, "type": "like"}'></div>`;

    expect(parseNotifications()).toEqual({
        id: 1,
        type: "like"
    })
})

test('expect parseNotifications to return undefined if data-notifications attribute does not exist.', () => {
    document.body.innerHTML = `<div id="dashboard"></div>`;
    
    expect(parseNotifications()).toBeUndefined();
})

test('expect parseNotifications to return undefined if id does not exist', () => {
    document.body.innerHTML = `<div></div>`;

    expect(parseNotifications()).toBeUndefined();
})

