<!-- docs/js/force_upper.js -->
<script type="module">
/**
 * Fuerza MAYÚSCULAS en cualquier input con clase .pname
 * - Mientras escribes (sin mover el cursor)
 * - Y ofrece utilidades para normalizar al guardar
 */

// Mientras escribe → MAYÚSCULAS
document.addEventListener('input', (e) => {
  if (!(e.target instanceof HTMLInputElement)) return;
  if (!e.target.matches('.pname')) return;
  const el = e.target;
  const start = el.selectionStart;
  const end   = el.selectionEnd;
  const up    = (el.value || '').toUpperCase();
  if (el.value !== up) {
    el.value = up;
    try { el.setSelectionRange(start, end); } catch(_) {}
  }
});

// Exporta un helper global para normalizar arrays al guardar
window.__forceUpper = {
  mapNamesUpper(list) {
    // list: Array<{name:string, order?:number, ...}>
    return (list || [])
      .map((p, i) => ({
        ...p,
        order: p.order ?? (i + 1),
        name : (p.name || '').toUpperCase().trim()
      }))
      .filter(p => p.name !== '');
  }
};
</script>
