import '../assets/styles/index.scss';

let notificationsTemplate = `<section id='notifications'></section>`;
let notificationsModel = {};
let createNotifications = () => {
    let notificationsDOM = document.createElement('SECTION');
    notificationsDOM.id = 'notifications'
    document.body.appendChild(notificationsDOM);
    return notificationsDOM;
};
let notificationsDOM = document.getElementById('notifications') || createNotifications();
// let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
// indexedDB.open("Notifications", 1);

export let notificationManager = {
    add: (notificationId, notificationCopy) => {
        let notificationDOM = document.getElementById(notificationId) || document.createElement('SECTION');
        notificationDOM.id = notificationId
        notificationDOM.setAttribute('class', 'notification');
        let background = document.createElement('p')
        background.setAttribute('class', 'background');
        notificationDOM.appendChild(background);
        notificationDOM.setAttribute('class', 'notification');
        let copy = document.createElement('p')
        copy.setAttribute('class', 'copy');
        copy.innerHTML = notificationCopy
        notificationDOM.appendChild(copy);
        notificationsDOM.appendChild(notificationDOM);
        notificationsModel[notificationId] = {copy: notificationCopy, time: Date.now()};
    },
    remove: (id) => {
        let notification = document.getElementById(id);
        if (notification && notification.remove && typeof notification.remove === 'function') {
            notification.remove();
        }
        (notificationsModel[id]) ? delete notificationsModel[id] : '';
    },
    list: () => notificationsModel
};

window.notificationManager = notificationManager;