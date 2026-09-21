import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD2GALqO68A2wUOLZP6an49rhwBKHSy39w",
  authDomain: "campusconnect-7ba41.firebaseapp.com",
  projectId: "campusconnect-7ba41",
  storageBucket: "campusconnect-7ba41.firebasestorage.app",
  messagingSenderId: "657699266935",
  appId: "1:657699266935:web:3db30aa5bfb1aecea04172",
  measurementId: "G-84H03JMF5R"
};

const app = initializeApp(firebaseConfig);
export default app