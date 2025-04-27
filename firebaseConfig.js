import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 


const firebaseConfig = {
  apiKey: "AIzaSyAljmzp_jDVyU183XlSV_eCsIB4Xw7hb-I",
  authDomain: "projeto-60b82.firebaseapp.com",
  projectId: "projeto-60b82",
  storageBucket: "projeto-60b82.firebasestorage.app",
  messagingSenderId: "223606873768",
  appId: "1:223606873768:web:56f69f428c3ce7443c2c9d",
  measurementId: "G-3D174TVX87"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };