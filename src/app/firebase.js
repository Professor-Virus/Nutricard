import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

//TWO FIREBASE CONNECTIONS: PICK ACCORDINGLY

//AAYUSH'S FIREBASE CONNECTION BELOW
const firebaseConfig = {
    apiKey: "AIzaSyCoQCC1k-LGv8Kh6bCNMmB40taVLGXMVhI",
    authDomain: "nutricard-385d2.firebaseapp.com",
    projectId: "nutricard-385d2",
    storageBucket: "nutricard-385d2.appspot.com",
    messagingSenderId: "426424370116",
    appId: "1:426424370116:web:6b6a61176b96e4221b1a91",
    measurementId: "G-R5E9YMJD7Y"
  };


const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const firestore = getFirestore(app)

export { auth, firestore }