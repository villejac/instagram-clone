import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDESLnpuULqR63iTJbDyzRZvDE0SLdnr8M",
    authDomain: "instagram-clone-react-c36d6.firebaseapp.com",
    projectId: "instagram-clone-react-c36d6",
    storageBucket: "instagram-clone-react-c36d6.appspot.com",
    messagingSenderId: "10542527105",
    appId: "1:10542527105:web:9dad3137fd850f4f4cd380",
    measurementId: "G-7SJFMR2QFD"
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, db, storage };
