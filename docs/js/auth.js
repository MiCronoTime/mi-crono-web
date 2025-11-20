// docs/js/auth.js — ES Module sin top-level await, sin comentarios HTML
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import {
  getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile
} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
import { getFirestore, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

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

let _initPromise = null;

function saveCtx(user){
  if(!user){
    localStorage.removeItem('mcw_uid');
    localStorage.removeItem('mcw_email');
    localStorage.removeItem('mcw_name');
  }else{
    localStorage.setItem('mcw_uid', user.uid);
    localStorage.setItem('mcw_email', user.email || '');
    localStorage.setItem('mcw_name', user.displayName || (user.email ? user.email.split('@')[0].toUpperCase() : 'USUARIO'));
  }
}

export function ensureAuthInit(){
  if(_initPromise) return _initPromise;
  _initPromise = (async ()=>{
    await setPersistence(auth, browserLocalPersistence);
    onAuthStateChanged(auth, saveCtx);
  })();
  return _initPromise;
}

export const getDb = ()=>db;
export const getAuthInstance = ()=>auth;
export const onUser = (cb)=> onAuthStateChanged(auth, cb);

export function currentCtx(){
  return {
    uid:   localStorage.getItem('mcw_uid'),
    email: localStorage.getItem('mcw_email'),
    name:  localStorage.getItem('mcw_name')
  };
}

export async function registerEmail(email, pass){
  await ensureAuthInit();
  const { user } = await createUserWithEmailAndPassword(auth, email, pass);
  const nick = (email||'').split('@')[0].toUpperCase();
  try{ await updateProfile(user, { displayName: nick }); }catch(_){}
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || nick,
    createdAt: serverTimestamp()
  }, { merge: true });
  return user;
}

export async function loginEmail(email, pass){
  await ensureAuthInit();
  const { user } = await signInWithEmailAndPassword(auth, email, pass);
  return user;
}

export async function logout(){
  await ensureAuthInit();
  await signOut(auth);
}

export async function requireAuth(redirectIfMissing='index.html'){
  await ensureAuthInit();
  return new Promise(resolve=>{
    const unsub = onAuthStateChanged(auth, user=>{
      unsub();
      if(!user){ if(redirectIfMissing) location.href = redirectIfMissing; else resolve(null); }
      else resolve(user);
    });
  });
}

export function mountUserBar(targetId='userBar'){
  const el = document.getElementById(targetId);
  if(!el) return;
  Object.assign(el.style,{
    display:'none', padding:'6px 10px', fontSize:'12px',
    background:'rgba(0,0,0,.35)', border:'1px solid #2b3240',
    borderRadius:'8px', margin:'6px 0'
  });
  onAuthStateChanged(auth, user=>{
    if(user){ el.textContent = `Conectado: ${user.email||user.uid}`; el.style.display='block'; }
    else { el.textContent=''; el.style.display='none'; }
  });
}
