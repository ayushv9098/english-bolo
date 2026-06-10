// AngreziBolo service worker — Web Push notifications.

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "AngreziBolo", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "AngreziBolo";
  const options = {
    body: data.body || "Time for your daily English practice!",
    icon: "/icon.svg",
    badge: "/icon.svg",
    tag: data.tag || "daily-reminder",
    renotify: true,
    data: { url: data.url || "/home" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/home";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
