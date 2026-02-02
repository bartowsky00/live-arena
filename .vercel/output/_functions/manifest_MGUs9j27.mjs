import 'piccolore';
import { q as decodeKey } from './chunks/astro/server_BTgz9LB2.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_B0K04SM0.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/giuseppe/Downloads/Live%20Arena/site/","cacheDir":"file:///Users/giuseppe/Downloads/Live%20Arena/site/node_modules/.astro/","outDir":"file:///Users/giuseppe/Downloads/Live%20Arena/site/dist/","srcDir":"file:///Users/giuseppe/Downloads/Live%20Arena/site/src/","publicDir":"file:///Users/giuseppe/Downloads/Live%20Arena/site/public/","buildClientDir":"file:///Users/giuseppe/Downloads/Live%20Arena/site/dist/client/","buildServerDir":"file:///Users/giuseppe/Downloads/Live%20Arena/site/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"contatti/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contatti","isIndex":false,"type":"page","pattern":"^\\/contatti\\/?$","segments":[[{"content":"contatti","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contatti.astro","pathname":"/contatti","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"cookie-policy/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/cookie-policy","isIndex":false,"type":"page","pattern":"^\\/cookie-policy\\/?$","segments":[[{"content":"cookie-policy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/cookie-policy.astro","pathname":"/cookie-policy","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"eventi/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/eventi","isIndex":false,"type":"page","pattern":"^\\/eventi\\/?$","segments":[[{"content":"eventi","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/eventi.astro","pathname":"/eventi","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"privacy/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.astro","pathname":"/privacy","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"termini/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/termini","isIndex":false,"type":"page","pattern":"^\\/termini\\/?$","segments":[[{"content":"termini","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/termini.astro","pathname":"/termini","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"venue/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/venue","isIndex":false,"type":"page","pattern":"^\\/venue\\/?$","segments":[[{"content":"venue","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/venue.astro","pathname":"/venue","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/contact","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/contact\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/contact.ts","pathname":"/api/contact","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/giuseppe/Downloads/Live Arena/site/src/pages/contatti.astro",{"propagation":"none","containsHead":true}],["/Users/giuseppe/Downloads/Live Arena/site/src/pages/cookie-policy.astro",{"propagation":"none","containsHead":true}],["/Users/giuseppe/Downloads/Live Arena/site/src/pages/eventi.astro",{"propagation":"none","containsHead":true}],["/Users/giuseppe/Downloads/Live Arena/site/src/pages/eventi/[slug].astro",{"propagation":"none","containsHead":true}],["/Users/giuseppe/Downloads/Live Arena/site/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/giuseppe/Downloads/Live Arena/site/src/pages/privacy.astro",{"propagation":"none","containsHead":true}],["/Users/giuseppe/Downloads/Live Arena/site/src/pages/termini.astro",{"propagation":"none","containsHead":true}],["/Users/giuseppe/Downloads/Live Arena/site/src/pages/venue.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/api/contact@_@ts":"pages/api/contact.astro.mjs","\u0000@astro-page:src/pages/contatti@_@astro":"pages/contatti.astro.mjs","\u0000@astro-page:src/pages/cookie-policy@_@astro":"pages/cookie-policy.astro.mjs","\u0000@astro-page:src/pages/eventi/[slug]@_@astro":"pages/eventi/_slug_.astro.mjs","\u0000@astro-page:src/pages/eventi@_@astro":"pages/eventi.astro.mjs","\u0000@astro-page:src/pages/privacy@_@astro":"pages/privacy.astro.mjs","\u0000@astro-page:src/pages/termini@_@astro":"pages/termini.astro.mjs","\u0000@astro-page:src/pages/venue@_@astro":"pages/venue.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_MGUs9j27.mjs","/Users/giuseppe/Downloads/Live Arena/site/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BazX7J3q.mjs","/Users/giuseppe/Downloads/Live Arena/site/src/pages/contatti.astro?astro&type=script&index=0&lang.ts":"_astro/contatti.astro_astro_type_script_index_0_lang.BgzFkDL4.js","/Users/giuseppe/Downloads/Live Arena/site/src/pages/eventi.astro?astro&type=script&index=0&lang.ts":"_astro/eventi.astro_astro_type_script_index_0_lang.CBkhztS7.js","/Users/giuseppe/Downloads/Live Arena/site/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.KmpD7YGd.js","/Users/giuseppe/Downloads/Live Arena/site/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.lPg2ozYK.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/giuseppe/Downloads/Live Arena/site/src/pages/contatti.astro?astro&type=script&index=0&lang.ts","const t=document.getElementById(\"contact-form\"),r=document.getElementById(\"success-message\"),s=document.createElement(\"div\");s.id=\"error-message\";s.className=\"hidden mt-8 p-6 bg-red-900/20 border border-red-500/30\";s.innerHTML=`\n    <div class=\"flex items-center gap-3 text-red-400\">\n      <svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 18L18 6M6 6l12 12\"></path>\n      </svg>\n      <span class=\"font-medium\">Errore durante l'invio</span>\n    </div>\n    <p class=\"text-red-400/70 mt-2\">Riprova più tardi o contattaci sui social.</p>\n  `;t?.parentNode?.insertBefore(s,r?.nextSibling||null);t?.addEventListener(\"submit\",async o=>{o.preventDefault();const e=t.querySelector('button[type=\"submit\"]'),a=e?.innerHTML;e&&(e.innerHTML=\"<span>Invio in corso...</span>\",e.disabled=!0),s.classList.add(\"hidden\");const n=new FormData(t),i={name:n.get(\"name\"),email:n.get(\"email\"),subject:n.get(\"subject\"),message:n.get(\"message\")};try{if((await fetch(\"/api/contact\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(i)})).ok)t.classList.add(\"hidden\"),r?.classList.remove(\"hidden\");else throw new Error(\"Errore invio\")}catch{s.classList.remove(\"hidden\"),e&&(e.innerHTML=a||\"Invia Messaggio\",e.disabled=!1)}});"],["/Users/giuseppe/Downloads/Live Arena/site/src/pages/eventi.astro?astro&type=script&index=0&lang.ts","const t=document.querySelectorAll(\".tab-btn\"),s=document.getElementById(\"upcoming-events\"),c=document.getElementById(\"past-events\");t.forEach(e=>{e.addEventListener(\"click\",()=>{t.forEach(a=>a.classList.remove(\"active\")),e.classList.add(\"active\"),e.getAttribute(\"data-tab\")===\"upcoming\"?(s?.classList.remove(\"hidden\"),c?.classList.add(\"hidden\")):(s?.classList.add(\"hidden\"),c?.classList.remove(\"hidden\"))})});"],["/Users/giuseppe/Downloads/Live Arena/site/src/pages/index.astro?astro&type=script&index=0&lang.ts","const n=document.getElementById(\"newsletter-form\"),o=document.getElementById(\"newsletter-email\"),s=document.getElementById(\"newsletter-btn\"),t=document.getElementById(\"newsletter-success\"),r=document.getElementById(\"newsletter-error\");n?.addEventListener(\"submit\",async i=>{i.preventDefault();const d=o.value.trim();if(d){s.textContent=\"Invio...\",s.disabled=!0,t?.classList.add(\"hidden\"),r?.classList.add(\"hidden\");try{const e=await fetch(\"https://emailoctopus.com/api/1.6/lists/77c0c066-ff68-11f0-9e75-6de7a11dbc02/contacts\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({api_key:\"eo_a05824f95a07d86c527b2f28afb61e1d2dc9562d26b0d9c31b37c0963e53ad6d\",email_address:d,status:\"SUBSCRIBED\"})});if(e.ok||e.status===200||e.status===201)n.classList.add(\"hidden\"),t?.classList.remove(\"hidden\");else{const a=await e.json();if(a.error?.code===\"MEMBER_EXISTS_WITH_EMAIL_ADDRESS\")n.classList.add(\"hidden\"),t?.classList.remove(\"hidden\"),t&&(t.textContent=\"Sei già iscritto alla newsletter!\");else throw new Error(a.error?.message||\"Errore\")}}catch{r?.classList.remove(\"hidden\"),s.textContent=\"Iscriviti\",s.disabled=!1}}});"],["/Users/giuseppe/Downloads/Live Arena/site/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts","const t=document.getElementById(\"navbar\");window.addEventListener(\"scroll\",()=>{window.scrollY>50?t?.classList.add(\"bg-arena-black/95\",\"backdrop-blur-md\",\"shadow-lg\",\"shadow-black/20\"):t?.classList.remove(\"bg-arena-black/95\",\"backdrop-blur-md\",\"shadow-lg\",\"shadow-black/20\")});const a=document.getElementById(\"mobile-menu-btn\"),o=document.getElementById(\"mobile-menu\"),i=document.getElementById(\"mobile-menu-close\");a?.addEventListener(\"click\",()=>{o?.classList.remove(\"hidden\"),document.body.style.overflow=\"hidden\"});i?.addEventListener(\"click\",()=>{o?.classList.add(\"hidden\"),document.body.style.overflow=\"\"});const r=document.querySelectorAll(\".reveal\"),n=()=>{r.forEach(e=>{const d=e.getBoundingClientRect().top,s=window.innerHeight;d<s-100&&e.classList.add(\"visible\")})};window.addEventListener(\"scroll\",n);window.addEventListener(\"load\",n);const c=document.getElementById(\"cookie-banner\"),m=document.getElementById(\"cookie-accept\"),u=document.getElementById(\"cookie-reject\"),b=localStorage.getItem(\"cookie_consent\");b||setTimeout(()=>{c?.classList.remove(\"translate-y-full\")},1e3);function l(){c?.classList.add(\"translate-y-full\")}m?.addEventListener(\"click\",()=>{localStorage.setItem(\"cookie_consent\",\"accepted\"),l()});u?.addEventListener(\"click\",()=>{localStorage.setItem(\"cookie_consent\",\"rejected\"),l()});"]],"assets":["/_astro/contatti.Ub89I1bL.css","/favicon.ico","/favicon.svg","/images/baglioni-2026.jpg","/images/concert-1.jpg","/images/concert-2.jpg","/images/concert-3.jpg","/images/event-crowd.jpg","/images/logo-black.webp","/images/logo-white.webp","/videos/crowd-singing.mp4","/videos/festival-recap.mp4","/videos/fiorella-mannoia.mp4","/contatti/index.html","/cookie-policy/index.html","/eventi/index.html","/privacy/index.html","/termini/index.html","/venue/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"A/+UvAOO0izEJgn04ZDxyPn2k1yDJ8YMY8De0kamGD8="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
