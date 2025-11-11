const debugDocEl = document.getElementById('debugDoc');
const lastErrorEl = document.getElementById('lastError');
async function initCameraPage(){
  const code = (getParam('code')||'').toUpperCase();
  const mode = (getParam('mode')||'start'); // start | finish
  const title = document.getElementById('title');
  const tag = document.getElementById('tag');
  const btnForce = document.getElementById('btnForce');
  const btnResult = document.getElementById('btnResult');
  const overlay = document.getElementById('overlay');
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d',{willReadFrequently:true});

  title.textContent = `Modo ${mode==='start'?'SALIDA':'META'}`;
  tag.textContent = `Evento ${code}`;
  btnResult.href = `result.html?code=${encodeURIComponent(code)}`;

  const eventRef = getEventDocRef(code);

  // Crear doc si no existe
  const snap = await getDoc(eventRef);
  if(!snap.exists()){
    await setDoc(eventRef, { code, createdAt: serverTimestamp(), startTS: null, stopTS: null });
  }

  // Estado conexión
onSnapshot(eventRef, (s)=>{
  const d = s.data()||{};
  const hasStart = !!d.startTS || !!d.startClientMS;
  const hasStop  = !!d.stopTS  || !!d.stopClientMS;
  tag.textContent = `Evento ${code} • ${hasStart?'Inicio OK':'Sin inicio'} • ${hasStop?'Fin OK':'Sin fin'}`;
  // Debug
  debugDocEl.textContent = 'Doc: ' + JSON.stringify(d);
}, (err)=>{
  lastErrorEl.textContent = 'Error snapshot: ' + (err && (err.code || err.message || err));
});

  // Cámara
  const btnEnableCam = document.getElementById('btnEnableCam');

  async function startCamera(){
    // Ajustes recomendados para iOS
    const constraintsList = [
      { video: { facingMode: { ideal: 'environment' }}, audio:false },
      { video: { facingMode: 'environment' }, audio:false },
      { video: true, audio:false }
    ];

    let stream = null;
    for (const c of constraintsList) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(c);
        if (stream) break;
      } catch (e) {
        // Intenta el siguiente constraint
      }
    }

    if (!stream) {
      alert('No se pudo acceder a la cámara. Revisa que Safari tenga permiso de Cámara para este sitio en Ajustes > Safari > Cámara (Permitir) y vuelve a abrir la página en Safari con HTTPS.');
      return;
    }

    video.setAttribute('playsinline', 'true'); // iOS
    video.muted = true; // iOS requiere muted para autoplay del preview
    video.srcObject = stream;
    await video.play();

    // Oculta el botón al tener cámara
    btnEnableCam.style.display = 'none';
  }

  btnEnableCam.onclick = startCamera;

  // Detección simple por diferencia de frames
  let prev = null;
  let coolDown = false;

  function detectMovement(){
    if(video.readyState < 2) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if(!w || !h) return;
    canvas.width = w; canvas.height = h;
    ctx.drawImage(video, 0, 0, w, h);
    const frame = ctx.getImageData(0,0,w,h);

    let moved = false;
    if(prev){
      const step = 4*8;
      let diffCount = 0, sample = 0;
      for(let i=0; i<frame.data.length; i+=step){
        const d = Math.abs(frame.data[i]-prev.data[i]) +
                  Math.abs(frame.data[i+1]-prev.data[i+1]) +
                  Math.abs(frame.data[i+2]-prev.data[i+2]);
        if(d>60) diffCount++;
        sample++;
      }
      const ratio = diffCount / Math.max(1,sample);
      moved = ratio > 0.12;
    }
    prev = frame;

    if(moved && !coolDown){
      overlay.style.display = 'block';
      triggerAction();
      coolDown = true;
      setTimeout(()=>{ overlay.style.display='none'; coolDown=false; }, 1200);
    }
  }

  setInterval(detectMovement, 120);

async function triggerAction(){
  if(!code){
    alert('Código de evento vacío.');
    return;
  }
  try{
    // marcadores de cliente por si el serverTimestamp tarda
    const now = Date.now();
    if(mode==='start'){
      await setDoc(eventRef, {
        startTS: serverTimestamp(),
        startClientMS: now,
        stopTS: null,
        stopClientMS: null
      }, { merge: true });
      alert('Inicio marcado (enviado a Firestore).');
    }else{
      await setDoc(eventRef, {
        stopTS: serverTimestamp(),
        stopClientMS: now
      }, { merge: true });
      alert('Fin marcado (enviado a Firestore).');
    }
    lastErrorEl.textContent = ''; // limpiamos el error si todo fue ok
  }catch(e){
    console.error(e);
    lastErrorEl.textContent = 'Error Firestore: ' + (e && (e.code || e.message || e));
    alert('No se pudo escribir en Firestore. Revisa firebaseConfig y Reglas.\n' + (e && (e.code || e.message || e)));
  }
}
