'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "f05bb0fc198566598132f931e44c8484",
"assets/AssetManifest.bin.json": "f97f716fde3aad37c41458a4bb62cfa9",
"assets/AssetManifest.json": "ced7a5066e6e4d4253013044f8e9e62c",
"assets/assets/basmalah.png": "18c4e81ec6ea43605dd2037c3e212e41",
"assets/assets/compass.png": "f7535eae4cc1a9bc236e450aeb7bb064",
"assets/assets/design.png": "90eccc1fbf9f39caea636474ad25d6db",
"assets/assets/email.jpeg": "d57950e3140647ce1a1382997f711426",
"assets/assets/facebook.jpeg": "74d742bc067d8b7f1d5aa801b6421c4f",
"assets/assets/github.jpeg": "0e9779aa903dddef4368f95dc5958b42",
"assets/assets/HafsSmart_08.ttf": "bd28a1b12834eee0203cf77b7eb03230",
"assets/assets/hafs_smart_v8.json": "e40e27fdcda9d245f6bae60a61ecd8ae",
"assets/assets/linkedin.jpeg": "495403a0df1e5b3342e3b4f472576fa7",
"assets/assets/me_quran.ttf": "a79b204e9c3055c77f0d81921bd881c2",
"assets/assets/PlayfairDisplay_Regular.ttf": "a96ecd13655587d30a21265c547cd8aa",
"assets/assets/qaaba.png": "cc889e1dc7b3b1a2f2963395dab1af89",
"assets/assets/quran_logo.png": "e256ae77e638aeef26d7faf17360cc64",
"assets/assets/safwan1.PNG": "79f3364e5bc843a9b96a534b830c4abe",
"assets/assets/telegram.jpeg": "e1fb2b8743bb93e02f231eb79fc8e7eb",
"assets/assets/web.jpeg": "413aa498af1e3671fc9b93546db6f5c9",
"assets/assets/web2.jpeg": "aa3c2f36fe2dabead460c70808cd4d66",
"assets/assets/whatsApp.jpeg": "2b1553912632645c9df270077bc02f94",
"assets/FontManifest.json": "1489919a83f9f50edf2a4e8fd7026eb3",
"assets/fonts/MaterialIcons-Regular.otf": "545f71efd13e26f1644823024e2c9805",
"assets/NOTICES": "2388303b9a03d593527ed31c431729f1",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "7e111ef15e2176bb59717d78664dc365",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"icons/Icon-192.png": "64c978a7416208c93776ba10414dd1e0",
"icons/Icon-512.png": "49e18ece6ac1621c63f13ad7e73d157f",
"icons/Icon-maskable-192.png": "64c978a7416208c93776ba10414dd1e0",
"icons/Icon-maskable-512.png": "49e18ece6ac1621c63f13ad7e73d157f",
"index.html": "f46d094b5ff84be88270d5b15f3d29ce",
"/": "f46d094b5ff84be88270d5b15f3d29ce",
"main.dart.js": "71e80b4321a4ce915335bf7fcf8b0d0e",
"manifest.json": "eb184862f00d6d21dbe3b5f766a47d6f",
"version.json": "d7d2dc67ea5b310b6e0ade8e6b5ee6d2"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
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
        // Claim client to enable caching on first launch
        self.clients.claim();
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
      // Claim client to enable caching on first launch
      self.clients.claim();
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
