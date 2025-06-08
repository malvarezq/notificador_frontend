const publicVapidKey = 'BP9szhwHSBGWhcAMMp-GjNFjX5Tfe8s2O4gZhaUGm9xkRa3iMSJ0Xuh98tmYlqVDsGyEjMjMeR8u7gg9mXSM_bs';

document.getElementById('btnNoti').addEventListener('click', async () => {
  const permiso = await Notification.requestPermission();
  if (permiso === 'granted') {
    await registrarYSuscribir(publicVapidKey);
    alert('Notificaciones activadas, para cortes de agua y luz!');
  } else {
    alert('No se activaron las notificaciones');
  }
});

async function registrarYSuscribir(publicKey) {
  if (!('serviceWorker' in navigator)) {
    alert('Tu navegador no soporta Service Workers.');
    return;
  }

  try {
    const sw = await navigator.serviceWorker.register('/notificador-front/sw.js');
    const suscripcion = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    await fetch('https://notificador-backend.onrender.com/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(suscripcion)
    });
  } catch (err) {
    console.error('Error al registrar:', err);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}
