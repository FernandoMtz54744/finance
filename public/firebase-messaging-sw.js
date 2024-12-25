// importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// firebase.initializeApp({
//   apiKey: 'AIzaSyAQ9saHyIc0y2vCJC5XMN9dx9WugutkFMc',
//   authDomain: 'finance-b00a5.firebaseapp.com',
//   projectId: 'finance-b00a5',
//   storageBucket: 'finance-b00a5.firebasestorage.app',
//   messagingSenderId: '778303496274',
//   appId: '1:778303496274:web:36ba1c3604e70a02887f8b',
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     '[firebase-messaging-sw.js] Received background message ',
//     payload
//   );
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });