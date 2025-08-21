// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhKMFMm1zKbeWBnjsAyKe0ybOc43ZiybY",
  authDomain: "chat-global-74cdf.firebaseapp.com",
  projectId: "chat-global-74cdf",
  storageBucket: "chat-global-74cdf.appspot.com",
  messagingSenderId: "980925830481",
  appId: "1:980925830481:web:a19be163cff16dacc42f70",
  measurementId: "G-8MEB5XMGKV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
