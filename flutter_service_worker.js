'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "01246a0e9983896f6007451b9f5b478f",
"assets/assets/images/EAFLogo2.jpg": "b3f53c7d512745667389eee4050f2925",
"assets/assets/images/EAF_off.png": "0459905735873cb704803a4deeda2f5e",
"assets/assets/images/imgProfil.jpg": "49f974e8a023bd1bcebffc5f3bb2e08f",
"assets/assets/images/model/Ex_(1).jpg": "3416038b9fd88042db29dda4e41b75d7",
"assets/assets/images/model/Ex_(10).jpg": "1b4a8e7bf2bb683f7bdf30a713d10082",
"assets/assets/images/model/Ex_(11).jpg": "6e6b22727d139b2944fc39e45c4763c1",
"assets/assets/images/model/Ex_(12).jpg": "45da6949d66fce77e362769a854807d1",
"assets/assets/images/model/Ex_(13).jpg": "5c5b0a0c15132198c16856c9245fdc46",
"assets/assets/images/model/Ex_(14).jpg": "aa501e4b567b17122dd0352ac2dcda7d",
"assets/assets/images/model/Ex_(15).jpg": "d4bd46aa5d52d0714566c45a644a2099",
"assets/assets/images/model/Ex_(17).png": "555c5a2fc9c2154a50665cf4965757e2",
"assets/assets/images/model/Ex_(18).png": "5171f82088c5313ea63be7671af7ce3a",
"assets/assets/images/model/Ex_(19).png": "fec09424b1d951107703f28fa4b0d7f7",
"assets/assets/images/model/Ex_(2).jpg": "6a1b3444bb233d952d17d661b570de63",
"assets/assets/images/model/Ex_(3).jpg": "2093894f9406670671e763c113c6b980",
"assets/assets/images/model/Ex_(4).jpg": "ebbc9ad5aac73f935d7f5403c2404c69",
"assets/assets/images/model/Ex_(5).jpg": "75904af4b97cd344d21ee03b6ed2b398",
"assets/assets/images/model/Ex_(6).jpg": "caba98d00a622a532133ede89bba8581",
"assets/assets/images/model/Ex_(7).jpg": "0e166d29ae42ca3d18c19dc92e2ce840",
"assets/assets/images/model/Ex_(8).jpg": "1630d6c68952ad34dd4857c85560bda4",
"assets/assets/images/model/Ex_(9).jpg": "566588af140e2615604ae4687e19b54f",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "322ee21b8215a46941b1e5dea0872eaf",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "b00363533ebe0bfdb95f3694d7647f6d",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "0a94bab8e306520dc6ae14c2573972ad",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "9cda082bd7cc5642096b56fa8db15b45",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"favicon.png": "f5578a3e038d61b932dc64c5cd31172e",
"flutter.js": "1cfe996e845b3a8a33f57607e8b09ee4",
"icons/Icon-192.png": "45ce05f9fe9408b3b95f1a53ff66e787",
"icons/Icon-512.png": "41f38334e55cae0cdbf400f10e320855",
"icons/Icon-maskable-192.png": "45ce05f9fe9408b3b95f1a53ff66e787",
"icons/Icon-maskable-512.png": "41f38334e55cae0cdbf400f10e320855",
"index.html": "799182946e8fb62a233a65d09c628f52",
"/": "799182946e8fb62a233a65d09c628f52",
"main.dart.js": "3fb58cf9d0ea518002f918750c7e0d5c",
"manifest.json": "5d51f321ed37dabf93d04c1dca68a1f7",
"version.json": "009c9e65172e010890f7f65fde438006"
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
