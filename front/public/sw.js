// src/sw.js
import { precacheAndRoute } from 'workbox-precaching';
import { CacheFirst } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';

// Auto-precache assets from Vite build (injected by the plugin)
precacheAndRoute(self.__WB_MANIFEST);

// Add runtime caching for dynamic routes
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-cache').then((cache) => {
      return cache.addAll([
        cache.addAll([
          '/node_modules/.vite/deps/chunk-RLJ2RCJQ.js?v=057d098d',
          '/node_modules/.vite/deps/chunk-DC5AMYBS.js?v=057d098d',
          '/node_modules/.vite/deps/chunk-KDCVS43I.js?v=057d098d',
          '/@vite/client',
          '/src/main.jsx',
          '/node_modules/.vite/deps/react-quill.js?v=057d098d',
          '/@react-refresh',
          '/node_modules/.vite/deps/react.js?v=057d098d',
          '/src/App.jsx',
          '/src/index.scss',
          '/src/App.scss',
          '/src/components/Notes/NotesApp.jsx',
          '/node_modules/.vite/deps/react-router-dom.js?v=057d098d',
          '/src/assets/Img6.png?import',
          '/src/components/Notes/Sidebar.jsx',
          '/src/components/Notes/Editor.jsx',
          '/src/components/Notes/UserProfile.jsx',
          '/src/components/Notes/styles/NotesApp.scss',
          '/src/components/Notes/styles/Sidebar.scss',
          '/node_modules/.vite/deps/react-quill.js?v=057d098d',
          '/node_modules/react-quill/dist/quill.snow.css,',
          '/src/components/Notes/styles/Editor.scss',
          '/src/components/Notes/styles/UserProfile.scss',
          '/index.html',
          '/',
          '/dashboard'
        ])
      ]);
    })
  );
});

// Example: Cache-first strategy for scripts/styles
registerRoute(
  ({ request }) => request.destination === 'script',
  new CacheFirst({ cacheName: 'scripts' })
);

// let cacheData = "NotesApp";
// this.addEventListener("install",(event)=>{
//   event.waitUntil(
//     caches.open(cacheData).then((cache)=>{
//       cache.addAll([
//         '/node_modules/.vite/deps/chunk-RLJ2RCJQ.js?v=057d098d',
//         '/node_modules/.vite/deps/chunk-DC5AMYBS.js?v=057d098d',
//         '/node_modules/.vite/deps/chunk-KDCVS43I.js?v=057d098d',
//         '/@vite/client',
//         '/src/main.jsx',
//         '/node_modules/.vite/deps/react-quill.js?v=057d098d',
//         '/@react-refresh',
//         '/node_modules/.vite/deps/react.js?v=057d098d',
//         '/src/App.jsx',
//         '/src/index.scss',
//         '/src/App.scss',
//         '/src/components/Notes/NotesApp.jsx',
//         '/node_modules/.vite/deps/react-router-dom.js?v=057d098d',
//         '/src/assets/Img6.png?import',
//         '/src/components/Notes/Sidebar.jsx',
//         '/src/components/Notes/Editor.jsx',
//         '/src/components/Notes/UserProfile.jsx',
//         '/src/components/Notes/styles/NotesApp.scss',
//         '/src/components/Notes/styles/Sidebar.scss',
//         '/node_modules/.vite/deps/react-quill.js?v=057d098d',
//         '/node_modules/react-quill/dist/quill.snow.css,',
//         '/src/components/Notes/styles/Editor.scss',
//         '/src/components/Notes/styles/UserProfile.scss',
//         '/index.html',
//         '/',
//         '/dashboard'
//       ])
//     })
//   )
// })