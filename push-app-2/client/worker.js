console.log('Service Worker Loaded');

self.addEventListener('activate', async () => {
    try {
        console.log('Activate!');
    } catch (e) {
        
    }
});

self.addEventListener('push', e => {
   const data = e.data.json();
   console.log('Push Recieved...');
   self.registration.showNotification(data.title, {
       body: 'Notified by Çağla Şikel!',
       icon: 'https://yt3.ggpht.com/a/AGF-l7_rnQC_y6AJ47Zmp1wCEzoAoArz2aearv3ptQ=s176-c-k-c0x00ffffff-no-rj-mo'
   })
});
