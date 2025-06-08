self.addEventListener('push', event => {
  const data = event.data ? event.data.text() : 'Próximos cortes de servicios básicos';

  const options = {
    body: data,
    icon: 'icon.png', // opcional
    badge: 'badge.png' // opcional
  };

  event.waitUntil(
    self.registration.showNotification('Alerta de corte servicios 🛠️', options)
  );
});
