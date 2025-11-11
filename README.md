# Mi Crono Web
Cronometraje gratis con dos móviles (Salida/Meta) desde el navegador. Hosting 0 € en **GitHub Pages** y sincronización en **Firebase (Spark gratis)**.

## Publicar (rápido)
1) Crea proyecto en Firebase → Firestore → copia el `firebaseConfig` de la app Web.
2) Pega tu `firebaseConfig` dentro de `js/firebase.js`.
3) En Firestore → Reglas: pega `firestore.rules` (demo) y Publica.
4) Sube todo este proyecto a un repo público en GitHub.
5) En Settings → Pages: “Deploy from a branch” (main / root).

Abre la URL de Pages en 2 móviles, usa el mismo código y prueba **Salida**/**Meta**.

## Archivos
- `index.html`, `join.html`, `camera.html`, `result.html`
- `styles.css`, `js/app.js`, `js/firebase.js`, `js/camera.js`
- `firestore.rules`, `assets/icon-flag.svg`

## Notas
- HTTPS obligatorio para cámara (GitHub Pages lo cumple).
- Si la detección no se dispara, usa **Forzar acción**.
- Reglas incluidas son solo para **demo**.
