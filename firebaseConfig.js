  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

  // Configuração correta do Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyAljmzp_jDVyU183XlSV_eCsIB4Xw7hb-I",
    authDomain: "projeto-60b82.firebaseapp.com",
    databaseURL: "https://projeto-60b82-default-rtdb.firebaseio.com",
    projectId: "projeto-60b82",
    storageBucket: "projeto-60b82.firebasestorage.app",
    messagingSenderId: "223606873768",
    appId: "1:223606873768:web:56f69f428c3ce7443c2c9d",
    measurementId: "G-3D174TVX87"
  };

  // Inicializa o app
  const app = initializeApp(firebaseConfig);

  // Inicializa e exporta o Firestore
  const db = getFirestore(app);
  export { db, app };