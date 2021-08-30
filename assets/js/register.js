document.addEventListener('DOMContentLoaded', init, false);

function init() {
    if ('serviceWorker' in navigator && navigator.onLine) {
        navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => {
            console.log('Service Worker registration success!', reg);
        }, (err) => {
            console.error('Service Worker registration failed!', err);
        });
    }
}