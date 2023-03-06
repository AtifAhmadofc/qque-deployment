'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "7cabcc2ac976af97834720cddf4b6a23",
"index.html": "8dd62c1d7da00dcef4c66e3dc9e25727",
"/": "8dd62c1d7da00dcef4c66e3dc9e25727",
"main.dart.js": "dcefea50d16633ffbd95b327bb865413",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"favicon.png": "9fc7103ba5237d6558e3894bdf1b8546",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "901d86fb8842ec0d66225a542131d689",
"assets/AssetManifest.json": "329cbbcbb74cce4bcdd3690380f19020",
"assets/NOTICES": "9fdf8ad3120b2b0d60772f7754af24b2",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "7d6c823d8b639cc17e998afee2db88bf",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/images/dashboard_image.png": "8ebc672349eceffe9c3333928d3e796a",
"assets/assets/images/oval-bg.png": "f0e1c3e90a6345280ec21a775227705d",
"assets/assets/images/profile_image.png": "8e91434a96883774cd53eadc40daba9c",
"assets/assets/images/Oval.png": "fa3d0bb3be130c2d576fd2f809f1df8e",
"assets/assets/images/logo.png": "9fc7103ba5237d6558e3894bdf1b8546",
"assets/assets/images/qr_code.png": "27a83849717508ccfdcc7fed9e85391a",
"assets/assets/images/teacher_analytics.png": "d6cc16c4d9a83a68256575ad32dca496",
"assets/assets/images/pathImage.png": "24263be0198cbb232d788eafeb65d14c",
"assets/assets/icons/administrator-solid.png": "8603d2b7f64e1d94f1311a10b873b3d6",
"assets/assets/icons/__TEMP__SVG__.png": "e8daeb2ef772f2e4863e60062330ca9e",
"assets/assets/icons/group-solid.png": "7af812da9346695b0c3b6844543b7f8a",
"assets/assets/icons/qrIcon.png": "e8daeb2ef772f2e4863e60062330ca9e",
"assets/assets/icons/bxs-dashboard.png": "4807551663bda6a6735e11dbd89e2092",
"assets/assets/icons/logout.png": "bf8b6648706615047c634be92505cead",
"assets/assets/icons/arrow.png": "4a67409b3f896ed7b58634eb789ed871",
"assets/assets/icons/shield-fill-check.png": "70559afc26d7be352fa19b67a32c6070",
"assets/assets/icons/user-solid-badged.png": "0666002d118de37903b9796d557b02e0",
"assets/assets/icons/administrator-line.png": "b15b0294d053d351857d5b457761d9b9",
"assets/assets/icons/profile.png": "ec1edbc68d63c48784dd8f08316bdd94",
"assets/assets/icons/user-solid-alerted.png": "9b69c96d5ef992c3f6c2256550766b27",
"assets/assets/icons/teacher_icon.png": "1ffc671c5224e8ba8e4505579380a2c4",
"assets/assets/icons/delete.png": "e1c567d6ba96381cbdca13c4768e12c0",
"assets/assets/icons/edit.png": "0ceebedfc56240c02482f3364d021a48",
"assets/assets/icons/administrator.png": "cb178fa32a21ed47daf6f1c2f6283e29",
"assets/assets/icons/bxs-error.png": "744b267b0ad2d58a7312e790757d003a",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
