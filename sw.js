// Service Worker Version
const CACHE_VERSION = 'v1';
const CACHE_NAME = `portfolio-cache-${CACHE_VERSION}`;

// Assets to cache - using actual file paths
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',  // Note: it's styles.css, not style.css
    './script.js',
    './offline.html',
    './me1 (1).jpg',  // Profile image
    // Add other assets as they become available
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                // Cache each asset individually to handle failures gracefully
                return Promise.allSettled(
                    ASSETS_TO_CACHE.map(url => 
                        fetch(url)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
                                }
                                console.log(`Successfully fetched: ${url}`);
                                return cache.put(url, response);
                            })
                            .catch(error => {
                                console.warn(`Failed to cache ${url}:`, error);
                                // Continue with other assets even if one fails
                                return Promise.resolve();
                            })
                    )
                );
            })
            .then(results => {
                // Log results of cache operations
                const successful = results.filter(r => r.status === 'fulfilled').length;
                const failed = results.filter(r => r.status === 'rejected').length;
                console.log(`Cache operation complete. Successfully cached: ${successful}, Failed: ${failed}`);
                
                results.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        console.log(`Successfully cached: ${ASSETS_TO_CACHE[index]}`);
                    } else {
                        console.warn(`Failed to cache: ${ASSETS_TO_CACHE[index]}`, result.reason);
                    }
                });
            })
            .catch(error => {
                console.error('Cache installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    (response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Only cache GET requests
                        if (event.request.method === 'GET') {
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                })
                                .catch(error => {
                                    console.warn('Failed to cache response:', error);
                                });
                        }

                        return response;
                    }
                ).catch(() => {
                    // If both cache and network fail, show offline page
                    if (event.request.mode === 'navigate') {
                        return caches.match('./offline.html');
                    }
                    // For other requests, return a custom offline response
                    return new Response('Offline content not available', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/plain'
                        })
                    });
                });
            })
    );
}); 
