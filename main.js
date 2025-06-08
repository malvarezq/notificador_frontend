const publicVapidKey = 'BP9szhwHSBGWhcAMMp-GjNFjX5Tfe8s2O4gZhaUGm9xkRa3iMSJ0Xuh98tmYlqVDsGyEjMjMeR8u7gg9mXSM_bs';
const backendURL = 'https://notificador-backend.onrender.com/registrar';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

document.getElementById('btnNoti').addEventListener('click', async () => {
  const permiso = await Notification.requestPermission();
  if (permiso !== 'granted') {
    alert('Permiso denegado');
    return;
  }

  if (!('serviceWorker' in navigator)) {
    alert('Tu navegador no soporta Service Workers');
    return;
  }

  navigator.serviceWorker.register('./sw.js').then(async (registration) => {
    console.log('SW registrado:', registration);

    // Esperamos hasta que esté activo
    if (registration.active) {
      try {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        console.log('Subscripción exitosa:', subscription);

        await fetch(backendURL, {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json'
          },
        });

        alert('Notificaciones activadas, causa 😎');
      } catch (err) {
        console.error('Error al suscribirse:', err);
      }
    } else {
      // Esperamos activación si aún no está activo
      navigator.serviceWorker.ready.then(async (reg) => {
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        await fetch(backendURL, {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json'
          },
        });

        alert('Notificaciones activadas 🥳');
      });
    }
  }).catch((err) => {
    console.error('Error al registrar SW:', err);
  });
});
