// ক্যাশ এবং সার্ভিস ওয়ার্কার নিজে থেকে মুছে যাওয়ার স্ক্রিপ্ট
self.addEventListener('install', function(e) {
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  self.registration.unregister()
    .then(function() {
      return self.clients.matchAll();
    })
    .then(function(clients) {
      clients.forEach(client => client.navigate(client.url))
    });
});
