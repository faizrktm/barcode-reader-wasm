/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : location.href);
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(["require"],(function(t){"use strict";function n(){}function e(t){return t()}function o(){return Object.create(null)}function r(t){t.forEach(e)}function c(t){return"function"==typeof t}function u(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function i(t,n,e,o){return t[1]&&o?function(t,n){for(const e in n)t[e]=n[e];return t}(e.ctx.slice(),t[1](o(n))):e.ctx}function s(t,n,e,o,r,c,u){const s=function(t,n,e,o){if(t[2]&&o){const r=t[2](o(e));if(void 0===n.dirty)return r;if("object"==typeof r){const t=[],e=Math.max(n.dirty.length,r.length);for(let o=0;o<e;o+=1)t[o]=n.dirty[o]|r[o];return t}return n.dirty|r}return n.dirty}(n,o,r,c);if(s){const r=i(n,e,o,u);t.p(r,s)}}function l(t,n){t.appendChild(n)}function a(t,n,e){t.insertBefore(n,e||null)}function f(t){t.parentNode.removeChild(t)}function d(t){return document.createElement(t)}function p(t){return document.createTextNode(t)}function $(){return p(" ")}function m(){return p("")}function h(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function g(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function y(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}let b;function v(t){b=t}function x(){if(!b)throw new Error("Function called outside component initialization");return b}function _(t){x().$$.on_mount.push(t)}function w(t){x().$$.on_destroy.push(t)}const k=[],j=[],q=[],E=[],S=Promise.resolve();let N=!1;function A(t){q.push(t)}let C=!1;const L=new Set;function M(){if(!C){C=!0;do{for(let t=0;t<k.length;t+=1){const n=k[t];v(n),T(n.$$)}for(v(null),k.length=0;j.length;)j.pop()();for(let t=0;t<q.length;t+=1){const n=q[t];L.has(n)||(L.add(n),n())}q.length=0}while(k.length);for(;E.length;)E.pop()();N=!1,C=!1,L.clear()}}function T(t){if(null!==t.fragment){t.update(),r(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(A)}}const z=new Set;let I;function O(){I={r:0,c:[],p:I}}function B(){I.r||r(I.c),I=I.p}function H(t,n){t&&t.i&&(z.delete(t),t.i(n))}function Q(t,n,e,o){if(t&&t.o){if(z.has(t))return;z.add(t),I.c.push((()=>{z.delete(t),o&&(e&&t.d(1),o())})),t.o(n)}}function V(t){t&&t.c()}function F(t,n,o,u){const{fragment:i,on_mount:s,on_destroy:l,after_update:a}=t.$$;i&&i.m(n,o),u||A((()=>{const n=s.map(e).filter(c);l?l.push(...n):r(n),t.$$.on_mount=[]})),a.forEach(A)}function J(t,n){const e=t.$$;null!==e.fragment&&(r(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function P(t,n){-1===t.$$.dirty[0]&&(k.push(t),N||(N=!0,S.then(M)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function R(t,e,c,u,i,s,l=[-1]){const a=b;v(t);const d=t.$$={fragment:null,ctx:null,props:s,update:n,not_equal:i,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:o(),dirty:l,skip_bound:!1};let p=!1;if(d.ctx=c?c(t,e.props||{},((n,e,...o)=>{const r=o.length?o[0]:e;return d.ctx&&i(d.ctx[n],d.ctx[n]=r)&&(!d.skip_bound&&d.bound[n]&&d.bound[n](r),p&&P(t,n)),e})):[],d.update(),p=!0,r(d.before_update),d.fragment=!!u&&u(d.ctx),e.target){if(e.hydrate){const t=function(t){return Array.from(t.childNodes)}(e.target);d.fragment&&d.fragment.l(t),t.forEach(f)}else d.fragment&&d.fragment.c();e.intro&&H(t.$$.fragment),F(t,e.target,e.anchor,e.customElement),M()}v(a)}class D{$destroy(){J(this,1),this.$destroy=n}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function G(t){let n,e;const o=t[1].default,r=function(t,n,e,o){if(t){const r=i(t,n,e,o);return t[0](r)}}(o,t,t[0],null);return{c(){n=d("span"),r&&r.c(),g(n,"class","text svelte-va5zyz")},m(t,o){a(t,n,o),r&&r.m(n,null),e=!0},p(t,[n]){r&&r.p&&1&n&&s(r,o,t,t[0],n,null,null)},i(t){e||(H(r,t),e=!0)},o(t){Q(r,t),e=!1},d(t){t&&f(n),r&&r.d(t)}}}function K(t,n,e){let{$$slots:o={},$$scope:r}=n;return t.$$set=t=>{"$$scope"in t&&e(0,r=t.$$scope)},[r,o]}class U extends D{constructor(t){super(),R(this,t,K,G,u,{})}}function W(t){let n,e;return n=new U({props:{$$slots:{default:[X]},$$scope:{ctx:t}}}),{c(){V(n.$$.fragment)},m(t,o){F(n,t,o),e=!0},p(t,e){const o={};68&e&&(o.$$scope={dirty:e,ctx:t}),n.$set(o)},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){Q(n.$$.fragment,t),e=!1},d(t){J(n,t)}}}function X(t){let n;return{c(){n=p(t[2])},m(t,e){a(t,n,e)},p(t,e){4&e&&y(n,t[2])},d(t){t&&f(n)}}}function Y(t){let n,e,o,r,c,u,i=t[2]&&W(t);return{c(){n=d("video"),n.innerHTML='<track kind="captions"/>\n  Video stream not available.',e=$(),o=d("canvas"),r=$(),i&&i.c(),c=m(),n.autoplay=!0,n.playsInline=!0,g(o,"class","svelte-g447h4")},m(s,l){a(s,n,l),t[3](n),a(s,e,l),a(s,o,l),t[4](o),a(s,r,l),i&&i.m(s,l),a(s,c,l),u=!0},p(t,[n]){t[2]?i?(i.p(t,n),4&n&&H(i,1)):(i=W(t),i.c(),H(i,1),i.m(c.parentNode,c)):i&&(O(),Q(i,1,1,(()=>{i=null})),B())},i(t){u||(H(i),u=!0)},o(t){Q(i),u=!1},d(u){u&&f(n),t[3](null),u&&f(e),u&&f(o),t[4](null),u&&f(r),i&&i.d(u),u&&f(c)}}}function Z(n,e,o){let r,c,u,i;return _((()=>{console.log("mounting quirc"),async function(){u=await t("./barcode-procesor-0be20b1a").then((({default:t})=>new t(r,c,{type:"quirc",onSuccess:t=>{o(2,i=t)}}))),u.init()}()})),w((()=>{console.log("ondestroy quirc"),u&&u.destroy()})),[r,c,i,function(t){j[t?"unshift":"push"]((()=>{r=t,o(0,r)}))},function(t){j[t?"unshift":"push"]((()=>{c=t,o(1,c)}))}]}class tt extends D{constructor(t){super(),R(this,t,Z,Y,u,{})}}function nt(t){let n,e;return n=new U({props:{$$slots:{default:[et]},$$scope:{ctx:t}}}),{c(){V(n.$$.fragment)},m(t,o){F(n,t,o),e=!0},p(t,e){const o={};68&e&&(o.$$scope={dirty:e,ctx:t}),n.$set(o)},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){Q(n.$$.fragment,t),e=!1},d(t){J(n,t)}}}function et(t){let n;return{c(){n=p(t[2])},m(t,e){a(t,n,e)},p(t,e){4&e&&y(n,t[2])},d(t){t&&f(n)}}}function ot(t){let n,e,o,r,c,u,i=t[2]&&nt(t);return{c(){n=d("video"),n.innerHTML='<track kind="captions"/>\n  Video stream not available.',e=$(),o=d("canvas"),r=$(),i&&i.c(),c=m(),n.autoplay=!0,n.playsInline=!0,g(o,"class","svelte-g447h4")},m(s,l){a(s,n,l),t[3](n),a(s,e,l),a(s,o,l),t[4](o),a(s,r,l),i&&i.m(s,l),a(s,c,l),u=!0},p(t,[n]){t[2]?i?(i.p(t,n),4&n&&H(i,1)):(i=nt(t),i.c(),H(i,1),i.m(c.parentNode,c)):i&&(O(),Q(i,1,1,(()=>{i=null})),B())},i(t){u||(H(i),u=!0)},o(t){Q(i),u=!1},d(u){u&&f(n),t[3](null),u&&f(e),u&&f(o),t[4](null),u&&f(r),i&&i.d(u),u&&f(c)}}}function rt(n,e,o){let r,c,u,i;return _((()=>{console.log("mounting jsqr"),async function(){u=await t("./barcode-procesor-0be20b1a").then((({default:t})=>new t(r,c,{type:"jsqr",onSuccess:t=>{o(2,i=t)}}))),u.init()}()})),w((()=>{console.log("ondestroy jsqr"),u&&u.destroy()})),[r,c,i,function(t){j[t?"unshift":"push"]((()=>{r=t,o(0,r)}))},function(t){j[t?"unshift":"push"]((()=>{c=t,o(1,c)}))}]}class ct extends D{constructor(t){super(),R(this,t,rt,ot,u,{})}}function ut(t){let n,e;return n=new ct({}),{c(){V(n.$$.fragment)},m(t,o){F(n,t,o),e=!0},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){Q(n.$$.fragment,t),e=!1},d(t){J(n,t)}}}function it(t){let n,e;return n=new tt({}),{c(){V(n.$$.fragment)},m(t,o){F(n,t,o),e=!0},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){Q(n.$$.fragment,t),e=!1},d(t){J(n,t)}}}function st(t){let n,e,o,c,u,i,s,p,m,y,b;const v=[it,ut],x=[];function _(t,n){return"quirc"===t[0]?0:"jsqr"===t[0]?1:-1}return~(s=_(t))&&(p=x[s]=v[s](t)),{c(){n=d("div"),e=d("div"),o=d("button"),o.textContent="Scan with Quirc",c=$(),u=d("button"),u.textContent="Scan with JSQR",i=$(),p&&p.c(),g(o,"class","svelte-njtegv"),g(u,"class","svelte-njtegv"),g(e,"class","button-wrapper svelte-njtegv"),g(n,"class","container svelte-njtegv")},m(r,f){a(r,n,f),l(n,e),l(e,o),l(e,c),l(e,u),l(n,i),~s&&x[s].m(n,null),m=!0,y||(b=[h(o,"click",t[2]),h(u,"click",t[3])],y=!0)},p(t,[e]){let o=s;s=_(t),s!==o&&(p&&(O(),Q(x[o],1,1,(()=>{x[o]=null})),B()),~s?(p=x[s],p||(p=x[s]=v[s](t),p.c()),H(p,1),p.m(n,null)):p=null)},i(t){m||(H(p),m=!0)},o(t){Q(p),m=!1},d(t){t&&f(n),~s&&x[s].d(),y=!1,r(b)}}}function lt(t,n,e){let o;function r(t){e(0,o=t)}w((()=>{barcoder&&barcoder.destroy()}));return[o,r,()=>r("quirc"),()=>r("jsqr")]}return new class extends D{constructor(t){super(),R(this,t,lt,st,u,{})}}({target:document.getElementById("root")})}));
//# sourceMappingURL=index.js.map
