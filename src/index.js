import '../assets/styles/index.scss';
import * as uuid from 'uuid';

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
let setNotificaiton = (notificationCopy, notificationId) => {
    let notificationDOM = document.getElementById(notificationId) || document.createElement('SECTION');
    notificationDOM.id = notificationId
    notificationDOM.setAttribute('class', 'notification');
    let copy = document.createElement('p')
    copy.setAttribute('class', 'copy');
    copy.innerHTML = notificationCopy
    notificationDOM.appendChild(copy);
    notificationsDOM.appendChild(notificationDOM);
    notificationsModel[notificationId] = {copy: notificationCopy, time: Date.now()};
    return returnNotification(notificationId);
};
let returnNotification = (notificationId) => {
    let notificaction = notificationsModel[notificationId];
    (notificaction) ? notificaction.id = notificationId : '';
    return notificaction;
};
export let notificationManager = {
    create: (notificationCopy, notificationId) => {
        if (notificationId && returnNotification(notificationId)) {
            return {
                error: `notificaction already exists, did you mean to call update('${notificationCopy}', '${notificationId}')?`
            }
        } else if (!notificationCopy) {
            return 'create(notificationCopy, notificationId)';
        } else {
            return setNotificaiton(notificationCopy, notificationId || uuid.v4());
        }
    },
    list: () => notificationsModel,
    remove: (notificationId) => {
        let notification = document.getElementById(notificationId);
        if (notification && notification.remove && typeof notification.remove === 'function') {
            notification.remove();
        }
        (notificationsModel[id]) ? delete notificationsModel[id] : '';
    },
    update: (notificationCopy, notificationId) => {
        if (notificationsDOM[notificationId]) {
            return setNotificaiton(notificationCopy, notificationId);
        } else {
            return {
                error: `notificaction does not exists, did you mean to call create('${notificationCopy}', '${notificationId}')?`
            }            
        }
    }
}
window.notificationManager = notificationManager;
