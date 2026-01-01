const publicVapidKey = 'BP9szhwHSBGWhcAMMp-GjNFjX5Tfe8s2O4gZhaUGm9xkRa3iMSJ0Xuh98tmYlqVDsGyEjMjMeR8u7gg9mXSM_bs';
const backendURL = 'https://notificador-backend.onrender.com/registrar';
const checkBackendAvailability = "https://notificador-backend.onrender.com/";

const btn = document.getElementById('btnNoti');
const statusTxt = document.getElementById('statusTxt');

/* =====================
   HEALTH CHECK BACKEND
===================== */
async function checkBackend() {
  try {
    const res = await fetch(checkBackendAvailability, { method: 'GET' });
    if (res.ok) {
      btn.disabled = false;
      btn.textContent = 'Activar notificaciones';
      statusTxt.textContent = 'Servidor disponible 🟢';
    } else {
      throw new Error('Backend no OK');
    }
  } catch (err) {
    btn.disabled = true;
    btn.textContent = 'Servidor no disponible';
    statusTxt.textContent = 'Backend fuera de línea 🔴';
  }
}

checkBackend();

/* =====================
   UTIL
===================== */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

/* =====================
   CLICK BOTÓN
===================== */
btn.addEventListener('click', async () => {
  const permiso = await Notification.requestPermission();
  if (permiso !== 'granted') {
    alert('Permiso denegado causa 😢');
    return;
  }

  if (!('serviceWorker' in navigator)) {
    alert('Tu navegador no soporta Service Workers');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('./sw.js');

    const reg = registration.active
      ? registration
      : await navigator.serviceWorker.ready;

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    const res = await fetch(backendURL, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) throw new Error('Error registrando suscripción');

    alert('Notificaciones activadas 😎🔥');
  } catch (err) {
    console.error(err);
    alert('Algo salió mal causa, revisa consola');
  }
});
