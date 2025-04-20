// Cache name with version - update this to force cache refresh when making significant changes
const CACHE_NAME = 'dmx-tab-cache-v1.0.4'; // Increment version to force update

// App Shell - essential files that make the app work offline
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './img/Wallpaper-1.jpg',
  './img/Wallpaper-2.jpg',
  './img/Wallpaper-3.jpg',
  './img/Wallpaper-4.jpg'
];

// External resources to cache
const EXTERNAL_RESOURCES = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2'
];

// Combined resources to cache
const CACHED_RESOURCES = [...APP_SHELL, ...EXTERNAL_RESOURCES];

// Install event - cache app shell and core resources
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell and resources');
        // Cache all resources but don't wait for non-essential ones
        const essentialCaching = cache.addAll(APP_SHELL);
        
        // External resources can fail but we still want to proceed with installation
        EXTERNAL_RESOURCES.forEach(resource => {
          cache.add(resource).catch(error => {
            console.warn('[Service Worker] Failed to cache external resource:', resource, error);
            // Continue regardless of errors for external resources
          });
        });
        
        // Only wait for essential resources to complete
        return essentialCaching;
      })
      .then(() => {
        console.log('[Service Worker] Installation completed!');
        return self.skipWaiting(); // Activate immediately
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches (including the old favicon cache if it exists)
          if (cacheName !== CACHE_NAME) { // Keep only the current core asset cache
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activated and old caches cleaned');
      return self.clients.claim(); // Take control of uncontrolled clients
    })
  );
});

// Fetch event - serve from cache or network with different strategies
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  
  // Skip API requests that shouldn't be cached
  if (event.request.url.includes('weatherapi.com') || 
      event.request.url.includes('rss2json.com') || 
      event.request.url.includes('allorigins.win') ||
      event.request.url.includes('jsonp.io')) {
    return; // Don't handle - let browser handle as usual
  }
  
  // HTML and App Shell resources use a Network-First strategy for freshness
  if (requestUrl.origin === location.origin && 
      (APP_SHELL.includes(requestUrl.pathname) || 
       requestUrl.pathname.endsWith('.html'))) {
    
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response since we're going to consume it
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        })
        .catch(() => {
          // If network fails, try the cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // If the request is for the main page and it's not in cache, return the offline page
              if (requestUrl.pathname === '/' || requestUrl.pathname === '/index.html') {
                return caches.match('./index.html');
              }
            });
        })
    );
    return;
  }
  
  // For all other assets use a Cache-First strategy for performance
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached response immediately
          return cachedResponse;
        }
        
        // Not in cache, get from network
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Add to cache for future requests
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.error('[Service Worker] Fetch failed:', error);
            
            // Return a simple offline response for image requests
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
              return new Response('<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="50%" font-family="sans-serif" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="#999">Offline</text></svg>', { 
                headers: {'Content-Type': 'image/svg+xml'} 
              });
            }
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  console.log('[Service Worker] Received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Add ability to check online status
  if (event.data && event.data.type === 'CHECK_ONLINE_STATUS') {
    // Respond with the result of trying to fetch a tiny online resource
    fetch('https://www.google.com/favicon.ico', { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store'
    })
    .then(() => {
      // Successfully fetched resource, we're online
      event.ports[0].postMessage({ online: true });
    })
    .catch(() => {
      // Failed to fetch resource, we're offline
      event.ports[0].postMessage({ online: false });
    });
  }
});

// Periodic background sync once permission is granted
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-cached-content') {
    event.waitUntil(updateCachedContent());
  }
});

// Function to update all cached content (used by periodic sync)
async function updateCachedContent() {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    // Update all app shell resources
    for (const url of APP_SHELL) {
      try {
        await cache.add(url);
      } catch (error) {
        console.error('[Service Worker] Failed to update cache for:', url, error);
      }
    }
    
    // Try to update external resources too
    for (const url of EXTERNAL_RESOURCES) {
      try {
        await cache.add(url);
      } catch (error) {
        console.warn('[Service Worker] Failed to update external resource:', url, error);
      }
    }
    
    console.log('[Service Worker] Updated cache contents');
  } catch (error) {
    console.error('[Service Worker] Failed to update cached content:', error);
  }
}
