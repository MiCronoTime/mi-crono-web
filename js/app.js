// Utilidades comunes
function getParam(key){
  const url = new URL(location.href);
  return url.searchParams.get(key);
}
function sanitizeCode(s){
  return (s||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,12);
}
async function copyToClipboard(text){
  try{ await navigator.clipboard.writeText(text); alert('Código copiado'); }
  catch{ alert('No se pudo copiar'); }
}
function tsToMillis(ts){
  if(!ts) return null;
  if(typeof ts === 'number') return ts;
  if(ts.seconds) return ts.seconds*1000 + Math.floor((ts.nanoseconds||0)/1e6);
  return null;
}
function two(n){ return String(n).padStart(2,'0'); }
function formatDuration(ms){
  const total = Math.max(0, Math.floor(ms));
  const m = Math.floor(total/60000);
  const s = Math.floor((total%60000)/1000);
  const cs = Math.floor((total%1000)/10); // centésimas
  return `${two(m)}:${two(s)}.${two(cs)}`;
}
function fmtTS(ms){
  if(!ms) return '—';
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit' });
}
function downloadCSV(rows, filename){
  const csv = rows.map(r=>r.map(cell=>`"${String(cell).replaceAll('"','""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  URL.revokeObjectURL(a.href);
}
window.getParam = getParam;
window.sanitizeCode = sanitizeCode;
window.copyToClipboard = copyToClipboard;
window.tsToMillis = tsToMillis;
window.two = two;
window.formatDuration = formatDuration;
window.fmtTS = fmtTS;
window.downloadCSV = downloadCSV;
