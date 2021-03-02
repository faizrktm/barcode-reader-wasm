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
define(["./comlink-7c1c41f0"],(function(e){"use strict";function r(e){return function(e,r,t,n){function s(e,r,t){var n=t?WebAssembly.instantiateStreaming:WebAssembly.instantiate,s=t?WebAssembly.compileStreaming:WebAssembly.compile;return r?n(e,r):s(e)}var i=null,o="undefined"!=typeof process&&null!=process.versions&&null!=process.versions.node;if(r&&o){var a=require("fs"),l=require("path");return new Promise(((e,t)=>{a.readFile(l.resolve(__dirname,r),((r,i)=>{null!=r&&t(r),e(s(i,n,!1))}))}))}if(r)return s(fetch(r),n,!0);if(o)i=Buffer.from(t,"base64");else{var m=globalThis.atob(t),h=m.length;i=new Uint8Array(new ArrayBuffer(h));for(var c=0;c<h;c++)i[c]=m.charCodeAt(c)}if(e){var u=new WebAssembly.Module(i);return n?new WebAssembly.Instance(u,n):u}return s(i,n,!1)}(0,"9b9548ab3fffc187.wasm",null,e)}let t=new class{get code(){return this.result}constructor(){this.result,this.memoryFromWasm=null,this.handlePrintString=this.handlePrintString.bind(this),this.wasmLoader=null}async init(){this.wasmLoader||(this.wasmLoader=await r({env:{memory:new WebAssembly.Memory({initial:1}),STACKTOP:0,jsPrintString:this.handlePrintString},wasi_snapshot_preview1:{fd_write:console.log}}))}handlePrintString(e,r){const t=new Uint8Array(this.memoryFromWasm.buffer,e,r);let n="";for(let e=0;e<r;e++)n+=String.fromCharCode(t[e]);n.indexOf("error_decode")>-1?(console.log("ERROR DECODE",n),this.result=!1):this.result=n}translate(e){if(!this.wasmLoader)throw new Error("WASM not loaded");let r,t=null;try{const{instance:{exports:{memory:n,decode_qr_code:s,malloc:i,free:o}}}=this.wasmLoader;r=o,this.memoryFromWasm=n;const a=e.width*e.height*4;t=i(a);new Uint8ClampedArray(n.buffer,t,a).set(e.data),s(t,e.width,e.height),o(t)}catch(e){console.log("ERROR TRANSLATE",e),t&&r&&r(t),this.result=!1}}};e.expose(t)}));
//# sourceMappingURL=barcode-quirc-ff8d78c3.js.map
