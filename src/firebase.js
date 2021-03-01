import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage'; 

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyA8vfxUkryL__zrg3Y28fO1vazjsnCoizQ",
    authDomain: "react-firebase-chat-app-3b302.firebaseapp.com",
    projectId: "react-firebase-chat-app-3b302",
    storageBucket: "react-firebase-chat-app-3b302.appspot.com",
    messagingSenderId: "92224441362",
    appId: "1:92224441362:web:9cbd8d0e05ab6849de1ccb",
    measurementId: "G-P0DD6WGTJ5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();

  export default firebase;