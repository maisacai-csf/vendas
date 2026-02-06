import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcL7ZHc4470P0_DRJB6bTBOzjocz5JKtc",
  authDomain: "vendas-8bdec.firebaseapp.com",
  projectId: "vendas-8bdec",
  storageBucket: "vendas-8bdec.firebasestorage.app",
  messagingSenderId: "506252133539",
  appId: "1:506252133539:web:ac15699d0282d00ea9ab16"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


