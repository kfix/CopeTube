if(!self.define){let e,i={};const n=(n,c)=>(n=new URL(n+".js",c).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(c,s)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let r={};const d=e=>n(e,o),a={module:{uri:o},exports:r,require:d};i[o]=Promise.all(c.map((e=>a[e]||d(e)))).then((e=>(s(...e),r)))}}define(["./workbox-3625d7b0"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.14d79483.css",revision:null},{url:"assets/index.ee31b3e8.js",revision:null},{url:"css/demo.css",revision:"7a9248b0219ed37a2ad3a2c0bf8530a9"},{url:"css/fonts.css",revision:"e2d233511cb5f92fa9605839953424ed"},{url:"css/print.css",revision:"f2e53baf2f2858ddad670fe56b049ed4"},{url:"fonts/osifont-2022.ttf",revision:"04a92b3c75705cc27e81e3394ec87a36"},{url:"fonts/Y14.5M-2009.ttf",revision:"18f6aef2f835509c2ee629730542065c"},{url:"icons/icon.png",revision:"1ea4dc748a89ea3e199d1fa65e79df62"},{url:"icons/icon120.png",revision:"cb14d43bee857652b88021bc8b79bf05"},{url:"icons/icon144.png",revision:"c92a999eb03b53e70d3f7dc01e745485"},{url:"icons/icon152.png",revision:"2ca81c0ba8c86a571f93066759452186"},{url:"icons/icon192.png",revision:"ac1424d76ad9b45487c22d8545ea4130"},{url:"icons/icon512.png",revision:"faa9ab1d417990d3a691bf4bb68cc93c"},{url:"icons/icon76.png",revision:"d2b787046c7722d4f6a86e8254751e5c"},{url:"icons/icon96.png",revision:"f93b785adab4bb5ad63432cc4232dcbb"},{url:"index.html",revision:"773829dc4f516dd340f9cd6c19e53bd6"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"icons/icon96.png",revision:"f93b785adab4bb5ad63432cc4232dcbb"},{url:"icons/icon144.png",revision:"c92a999eb03b53e70d3f7dc01e745485"},{url:"icons/icon192.png",revision:"ac1424d76ad9b45487c22d8545ea4130"},{url:"icons/icon512.png",revision:"faa9ab1d417990d3a691bf4bb68cc93c"},{url:"manifest.webmanifest",revision:"09ed6b13a0e28e1bac646f5eb9dda9a7"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));