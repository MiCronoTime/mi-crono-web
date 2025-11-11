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
    const hasStart = !!d.startTS;
    const hasStop  = !!d.stopTS;
    tag.textContent = `Evento ${code} • ${hasStart?'Inicio OK':'Sin inicio'} • ${hasStop?'Fin OK':'Sin fin'}`;
  });

  // Cámara
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:'environment' }, audio:false });
    video.srcObject = stream;
    await video.play();
  }catch(e){
    alert('No se pudo acceder a la cámara. Revisa permisos / https.');
  }

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
    if(mode==='start'){
      await updateDoc(eventRef, { startTS: serverTimestamp(), stopTS: null });
    }else{
      await updateDoc(eventRef, { stopTS: serverTimestamp() });
    }
  }
  btnForce.onclick = triggerAction;
}
window.initCameraPage = initCameraPage;
