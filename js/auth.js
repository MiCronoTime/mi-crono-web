// docs/js/auth.js  (ES Module, sin <script>)

// Firebase CDN (app + auth)
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signOut,
  signInWithEmailAndPassword, createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// 🔁 Tu configuración actual:
const firebaseConfig = {
  apiKey: "AIzaSyCt52Q6LEJ0fl0iKUIE6OKXlbp42fzOgBU",
  authDomain: "mi-crono-time-888b7.firebaseapp.com",
  projectId: "mi-crono-time-888b7",
  storageBucket: "mi-crono-time-888b7.appspot.com",
  messagingSenderId: "379025900327",
  appId: "1:379025900327:web:6f10f46ee086ca61f8df02"
};

const app  = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Pinta UI de login/registro/cerrar sesión en un contenedor con id="authBox"
 * y actualiza el texto con id="authStatus".
 * Opcionales:
 *  - onLogin(user)
 *  - onLogout()
 */
export function initAuthUI(options = {}) {
  const opts   = { boxId: 'authBox', statusId: 'authStatus', logoutId: 'btnLogout', ...options };
  const box    = document.getElementById(opts.boxId);
  const status = document.getElementById(opts.statusId);
  const logoutBtn = document.getElementById(opts.logoutId);

  if (!box || !status) return;

  // Botones del formulario
  const formEl   = box.querySelector('.auth-form');
  const emailEl  = box.querySelector('#email');
  const passEl   = box.querySelector('#pass');
  const btnLogin = box.querySelector('#btnLogin');
  const btnReg   = box.querySelector('#btnRegister');

  onAuthStateChanged(auth, (user)=>{
    if (user) {
      status.textContent = `Conectado: ${user.email || user.uid}`;
      formEl?.classList.add('hidden');
      box.querySelector('.auth-logout')?.classList.remove('hidden');
      if (typeof opts.onLogin === 'function') opts.onLogin(user);
    } else {
      status.textContent = 'No conectado';
      formEl?.classList.remove('hidden');
      box.querySelector('.auth-logout')?.classList.add('hidden');
      if (typeof opts.onLogout === 'function') opts.onLogout();
    }
  });

  btnLogin?.addEventListener('click', async (e)=>{
    e.preventDefault();
    const email = emailEl?.value?.trim();
    const pass  = passEl?.value?.trim();
    if (!email || !pass) return alert('Introduce email y contraseña.');
    try { await signInWithEmailAndPassword(auth, email, pass); }
    catch(err){ alert(err.message); }
  });

  btnReg?.addEventListener('click', async (e)=>{
    e.preventDefault();
    const email = emailEl?.value?.trim();
    const pass  = passEl?.value?.trim();
    if (!email || !pass) return alert('Introduce email y contraseña.');
    try { await createUserWithEmailAndPassword(auth, email, pass); }
    catch(err){ alert(err.message); }
  });

  logoutBtn?.addEventListener('click', async ()=>{
    await signOut(auth);
  });
}

export { auth };

