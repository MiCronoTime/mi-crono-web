// Firebase SDK modular (v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// 1) Rellena con tu configuración desde Firebase Console (Proyecto → Configuración → Web → SDK)
const firebaseConfig = {
  apiKey: "AIzaSyB41JQSLE33w8yLQCNBypNVIh5QRs6suKk",
  authDomain: "mi-crono-web.firebaseapp.com",
  projectId: "mi-crono-web",
  storageBucket: "mi-crono-web.firebasestorage.app",
  messagingSenderId: "803218040641",
  appId: "1:803218040641:web:684f0c7c5622bd12ce63c0",
  measurementId: "G-Z2Q6WQX450"
};

// 2) Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3) Helpers Firestore accesibles globalmente
window.getEventDocRef = (code) => doc(db, "events", (code||"").toUpperCase());
window.getDoc = getDoc;
window.setDoc = setDoc;
window.updateDoc = updateDoc;
window.onSnapshot = onSnapshot;
window.serverTimestamp = serverTimestamp;
