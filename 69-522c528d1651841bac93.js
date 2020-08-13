(window.webpackJsonp=window.webpackJsonp||[]).push([[69],{1019:function(e,r,n){"use strict";n.r(r);var t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")},o=function(){function e(e,r){for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(r,n,t){return n&&e(r.prototype,n),t&&e(r,t),r}}(),a=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var n=arguments[r];for(var t in n)Object.prototype.hasOwnProperty.call(n,t)&&(e[t]=n[t])}return e},d=function(){function e(r){var n=this;i(this,e),this.worker=r,this.listeners=[],this.nextId=0,this.worker.addEventListener("message",(function(e){var r=e.data.id,t=e.data.error,i=e.data.result;n.listeners[r](t,i),delete n.listeners[r]}))}return o(e,[{key:"render",value:function(e,r){var n=this;return new Promise((function(t,i){var o=n.nextId++;n.listeners[o]=function(e,r){e?i(new Error(e.message,e.fileName,e.lineNumber)):t(r)},n.worker.postMessage({id:o,src:e,options:r})}))}}]),e}(),s=function e(r,n){i(this,e);var t=r();this.render=function(e,r){return new Promise((function(i,o){try{i(n(t,e,r))}catch(e){o(e)}}))}};function u(e){return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,(function(e,r){return String.fromCharCode("0x"+r)})))}function l(){return"devicePixelRatio"in window&&window.devicePixelRatio>1?window.devicePixelRatio:1}function c(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.scale,t=void 0===n?l():n,i=r.mimeType,o=void 0===i?"image/png":i,a=r.quality,d=void 0===a?1:a;return new Promise((function(r,n){var i=new Image;i.onload=function(){var e=document.createElement("canvas");e.width=i.width*t,e.height=i.height*t,e.getContext("2d").drawImage(i,0,0,e.width,e.height),e.toBlob((function(e){var n=new Image;n.src=URL.createObjectURL(e),n.width=i.width,n.height=i.height,r(n)}),o,d)},i.onerror=function(e){var r;r="error"in e?e.error:new Error("Error loading SVG"),n(r)},i.src="data:image/svg+xml;base64,"+u(e)}))}function f(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.scale,t=void 0===n?l():n,i=r.mimeType,o=void 0===i?"image/png":i,a=r.quality,d=void 0===a?1:a,s=t,u=void 0;return"image/jpeg"==o?u="jpeg":"image/png"==o&&(u="png"),new Promise((function(r,n){fabric.loadSVGFromString(e,(function(e,t){0==e.length&&n(new Error("Error loading SVG with Fabric"));var i=document.createElement("canvas");i.width=t.width,i.height=t.height;var o=new fabric.Canvas(i,{enableRetinaScaling:!1}),a=fabric.util.groupSVGElements(e,t);o.add(a).renderAll();var l=new Image;l.src=o.toDataURL({format:u,multiplier:s,quality:d}),l.width=t.width,l.height=t.height,r(l)}))}))}var v=function(){function e(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=r.workerURL,t=r.worker,o=r.Module,a=r.render;if(i(this,e),void 0!==n)this.wrapper=new d(new Worker(n));else if(void 0!==t)this.wrapper=new d(t);else if(void 0!==o&&void 0!==a)this.wrapper=new s(o,a);else{if(void 0===e.Module||void 0===e.render)throw new Error("Must specify workerURL or worker option, Module and render options, or include one of full.render.js or lite.render.js after viz.js.");this.wrapper=new s(e.Module,e.render)}}return o(e,[{key:"renderString",value:function(e){for(var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.format,t=void 0===n?"svg":n,i=r.engine,o=void 0===i?"dot":i,a=r.files,d=void 0===a?[]:a,s=r.images,u=void 0===s?[]:s,l=r.yInvert,c=void 0!==l&&l,f=r.nop,v=void 0===f?0:f,h=0;h<u.length;h++)d.push({path:u[h].path,data:'<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg width="'+u[h].width+'" height="'+u[h].height+'"></svg>'});return this.wrapper.render(e,{format:t,engine:o,files:d,images:u,yInvert:c,nop:v})}},{key:"renderSVGElement",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.renderString(e,a({},r,{format:"svg"})).then((function(e){return(new DOMParser).parseFromString(e,"image/svg+xml").documentElement}))}},{key:"renderImageElement",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.scale,i=r.mimeType,o=r.quality;return this.renderString(e,a({},r,{format:"svg"})).then((function(e){return"object"===("undefined"==typeof fabric?"undefined":t(fabric))&&fabric.loadSVGFromString?f(e,{scale:n,mimeType:i,quality:o}):c(e,{scale:n,mimeType:i,quality:o})}))}},{key:"renderJSONObject",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.format;return"json"===n&&"json0"===n||(n="json"),this.renderString(e,a({},r,{format:n})).then((function(e){return JSON.parse(e)}))}}]),e}();r.default=v}}]);
//# sourceMappingURL=69-522c528d1651841bac93.js.map