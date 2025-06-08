document.getElementById('btnNoti').addEventListener('click', async () => {
  const permiso = await Notification.requestPermission();
  if (permiso !== 'granted') {
    alert('No se activaron las notificaciones');
    return;
  }

  try {
    const registro = await navigator.serviceWorker.register('./sw.js');
    console.log('✅ Service Worker registrado');

    const suscripcion = await registro.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    await fetch('https://TU_BACKEND/render/registrar', {
      method: 'POST',
      body: JSON.stringify(suscripcion),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    alert('Notificaciones activadas, causa!');
  } catch (err) {
    console.error('Error al registrar notificación', err);
    alert('Falló el registro del Service Worker');
  }
});

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}
