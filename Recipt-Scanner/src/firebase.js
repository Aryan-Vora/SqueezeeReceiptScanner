import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA4F0sPeOb2p5CR9HAQrK7KfcObYB3CyxQ",
  authDomain: "squeezee-df.firebaseapp.com",
  projectId: "squeezee-df",
  storageBucket: "squeezee-df.appspot.com",
  messagingSenderId: "613644771298",
  appId: "1:613644771298:web:2d795f5a9ba2895dc723bb",
  measurementId: "G-8BBBWS8DHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
