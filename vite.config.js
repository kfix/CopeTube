import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

const pwa_config = {
    workbox: {
        globPatterns: ['**/*.{js,css,html,png,ttf,woff2}'],
    },
    registerType: "autoUpdate",
    injectRegister: 'auto',
    manifest: {
        "background_color": "#ffffff",
        "theme_color": "#7E1F86",
        "start_url": "./index.html",
        "display": "standalone",
        "orientation": "portrait",
        "short_name": "CopeTube",
        "name": "CopeTube",
        "icons": [
            {
                "src": "icons/icon96.png",
                "sizes": "96x96",
                "type": "image/png",
                "density": "2.0"
            },
            {
                "src": "icons/icon144.png",
                "sizes": "144x144",
                "type": "image/png",
                "density": "3.0"
            },
            {
                "src": "icons/icon192.png",
                "sizes": "192x192",
                "type": "image/png",
                "density": "4.0"
            },
            {
                "src": "icons/icon512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    }
};

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    svelte(),
    VitePWA(pwa_config)
  ]
});
