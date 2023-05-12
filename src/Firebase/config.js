
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";


const firebaseConfig = {
    //Paste Your firebase config here
   
    apiKey: "AIzaSyChF5CrhAoeaMxtbKHIl0XhC_VmsShAOFk",
    authDomain: "rohit-e514f.firebaseapp.com",
    projectId: "rohit-e514f",
    storageBucket: "rohit-e514f.appspot.com",
    messagingSenderId: "856356707026",
    appId: "1:856356707026:web:7fe1d6988d1b708075eb0b"
    
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase }