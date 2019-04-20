export function parseNotifications() {
    const notificationContainer = document.querySelector('#dashboard');

    if (!notificationContainer) {
        return;
    }

    const notificationJSON = notificationContainer.getAttribute('data-notifications');

    if (!notificationJSON) {
        return;
    }

    return JSON.parse(notificationJSON);
}
