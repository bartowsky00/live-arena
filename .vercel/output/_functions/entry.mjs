import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_C6Cjo3Gw.mjs';
import { manifest } from './manifest_MGUs9j27.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/contact.astro.mjs');
const _page2 = () => import('./pages/contatti.astro.mjs');
const _page3 = () => import('./pages/cookie-policy.astro.mjs');
const _page4 = () => import('./pages/eventi/_slug_.astro.mjs');
const _page5 = () => import('./pages/eventi.astro.mjs');
const _page6 = () => import('./pages/privacy.astro.mjs');
const _page7 = () => import('./pages/termini.astro.mjs');
const _page8 = () => import('./pages/venue.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/contact.ts", _page1],
    ["src/pages/contatti.astro", _page2],
    ["src/pages/cookie-policy.astro", _page3],
    ["src/pages/eventi/[slug].astro", _page4],
    ["src/pages/eventi.astro", _page5],
    ["src/pages/privacy.astro", _page6],
    ["src/pages/termini.astro", _page7],
    ["src/pages/venue.astro", _page8],
    ["src/pages/index.astro", _page9]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "a5fe408c-792c-4879-b447-2c25e7d0a4b4",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
