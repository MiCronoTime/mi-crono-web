<!-- docs/js/auth.js -->
<script type="module">
// ===== Firebase inicialización + Auth helpers =====
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import {
  getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile
} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCt52Q6LEJ0fl0iKUIE6OKXlbp42fzOgBU",
  authDomain: "mi-crono-time-888b7.firebaseapp.com",
  projectId: "mi-crono-time-888b7",
  storageBucket: "mi-crono-time-888b7.appspot.com",
  messagingSenderId: "379025900327",
  appId: "1:379025900327:web:6f10f46ee086ca61f8df02"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
await setPersistence(auth, browserLocalPersistence);

// persistimos un mini contexto
const saveCtx = (user)=>{
  if(!user){ localStorage.removeItem('mcw_uid'); localStorage.removeItem('mcw_email'); return; }
  localStorage.setItem('mcw_uid', user.uid);
  localStorage.setItem('mcw_email', user.email || '');
};
onAuthStateChanged(auth, u => saveCtx(u));

// === API pública ===
export const getDb = () => db;
export const getAuthInstance = () => auth;
export const onUser = (cb) => onAuthStateChanged(auth, cb);

export async function registerEmail(email, pass){
  const { user } = await createUserWithEmailAndPassword(auth, email, pass);
  // opcional: poner displayName = parte antes de @
  const nick = (email||'').split('@')[0].toUpperCase();
  try{ await updateProfile(user,{ displayName:nick }); }catch(_){}
  return user;
}
export async function loginEmail(email, pass){
  const { user } = await signInWithEmailAndPassword(auth, email, pass);
  return user;
}
export async function logout(){ await signOut(auth); }

export async function requireAuth(redirectIfMissing = 'index.html'){
  return new Promise(resolve=>{
    const unsub = onAuthStateChanged(auth, user=>{
      unsub();
      if(!user){
        if(redirectIfMissing) location.href = redirectIfMissing;
        else resolve(null);
      }else{
        resolve(user);
      }
    });
  });
}

// helpers de contexto rápido
export function currentCtx(){
  return {
    uid:   localStorage.getItem('mcw_uid')   || null,
    email: localStorage.getItem('mcw_email') || null
  };
}

// pinta una barrita superior "Conectado: email"
export function mountUserBar(targetId='userBar'){
  const el = document.getElementById(targetId);
  if(!el) return;
  el.style.display='none';
  el.style.padding='6px 10px';
  el.style.fontSize='12px';
  el.style.background='rgba(0,0,0,.35)';
  el.style.border='1px solid #2b3240';
  el.style.borderRadius='8px';
  el.style.margin='6px 0';
  onAuthStateChanged(auth, user=>{
    if(user){ el.textContent = `Conectado: ${user.email||user.uid}`; el.style.display='block'; }
    else { el.textContent=''; el.style.display='none'; }
  });
}
</script>
