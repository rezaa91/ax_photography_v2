export function parseNotifications() {
    const notificationJSON = document.querySelector('#dashboard').getAttribute('data-notifications');

    if (!notificationJSON) {
        return;
    }

    return JSON.parse(notificationJSON);
}
