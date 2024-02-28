// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {getFirestore, doc, getDoc, collection, getDocs} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5-K2NfFGhYHCMmtJW7-zYFW9UmFx0So8",
  authDomain: "locus-d1a9c.firebaseapp.com",
  projectId: "locus-d1a9c",
  storageBucket: "locus-d1a9c.appspot.com",
  messagingSenderId: "348030119877",
  appId: "1:348030119877:web:7d2c4f0d4e4c76f04fe5ac",
  measurementId: "G-ZXVR4YF7VL"
};

// Initialize Firebase
let app;
let analytics;

let db;


export function initializeFirebase(){
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);

    db = getFirestore(app);

    console.log(db);
}

export async function testDB(){
    const docRef = collection(db, "books");
    const docsSnap = await getDocs(docRef);

    console.log("sdlkhsdkhfksjdhfksdjhfkjsdhfkjdsf");
    
    docsSnap.forEach( doc => {
        console.log(doc.id, " => ", doc.data());
    })
}