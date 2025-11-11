// Firebase SDK modular (v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// 1) Rellena con tu configuración desde Firebase Console (Proyecto → Configuración → Web → SDK)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
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
