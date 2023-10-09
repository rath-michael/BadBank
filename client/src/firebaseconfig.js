import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCyk5H_P-ubiNKQTK_9TPGHYq5LQ-yUvkw",
    authDomain: "badbank-66f9e.firebaseapp.com",
    projectId: "badbank-66f9e",
    storageBucket: "badbank-66f9e.appspot.com",
    messagingSenderId: "242379284777",
    appId: "1:242379284777:web:3bbf54ea086a3d37655738"
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();