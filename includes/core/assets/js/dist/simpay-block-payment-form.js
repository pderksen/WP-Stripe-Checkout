!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=82)}({0:function(e,t){e.exports=window.wp.element},17:function(e,t){e.exports=window.wp.data},2:function(e,t){e.exports=window.wp.i18n},20:function(e,t){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n},e.exports.__esModule=!0,e.exports.default=e.exports},21:function(e,t,r){var n=r(20);e.exports=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}},e.exports.__esModule=!0,e.exports.default=e.exports},26:function(e,t){e.exports=function(e){if(Array.isArray(e))return e},e.exports.__esModule=!0,e.exports.default=e.exports},27:function(e,t){e.exports=function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,i,c,a=[],l=!0,s=!1;try{if(i=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;l=!1}else for(;!(l=(n=i.call(r)).done)&&(a.push(n.value),a.length!==t);l=!0);}catch(e){s=!0,o=e}finally{try{if(!l&&null!=r.return&&(c=r.return(),Object(c)!==c))return}finally{if(s)throw o}}return a}},e.exports.__esModule=!0,e.exports.default=e.exports},28:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.__esModule=!0,e.exports.default=e.exports},29:function(e,t,r){var n=r(34),o=r(35),i=r(21),c=r(36);e.exports=function(e){return n(e)||o(e)||i(e)||c()},e.exports.__esModule=!0,e.exports.default=e.exports},3:function(e,t){e.exports=window.wp.components},34:function(e,t,r){var n=r(20);e.exports=function(e){if(Array.isArray(e))return n(e)},e.exports.__esModule=!0,e.exports.default=e.exports},35:function(e,t){e.exports=function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)},e.exports.__esModule=!0,e.exports.default=e.exports},36:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.__esModule=!0,e.exports.default=e.exports},40:function(e,t){e.exports=window.wp.blockEditor},42:function(e){e.exports=JSON.parse('{"c":"simpay/payment-form","d":"WP Simple Pay - Payment Form","a":"widgets","b":"Display a WP Simple Pay payment form."}')},47:function(e,t,r){"use strict";(function(e){r.d(t,"a",(function(){return a}));var n=r(6),o=r.n(n),i=r(0),c=r(17);function a(t){var r=t.formId,n=Object(i.useState)(!1),a=o()(n,2),l=a[0],s=a[1],u=Object(c.useSelect)((function(e){return e("core/block-editor").getClientIdsWithDescendants()}),[]);return Object(i.useEffect)((function(){l||u.forEach((function(t){var n=Object(c.select)("core/block-editor").getBlock(t);if(n){var o=n.attributes.formId;if("simpay/payment-form"===n.name&&o&&o===r){var i="1"===simpayBlockPaymentForm.isUpe;return setTimeout((function(){var r="#block-".concat(t," #simpay-block-payment-form-").concat(o),n=i?document.querySelector(r):e(r),c=i?JSON.parse(n.dataset.formVars):n.data("form-vars");window.wpsp.initPaymentForm(n,c),s(!0)}),1500)}}}))}),[u,t,l]),Object(i.useEffect)((function(){s(!1)}),[t]),[l,s]}}).call(this,r(66))},53:function(e,t){e.exports=window.wp.blocks},54:function(e,t){e.exports=window.wp.serverSideRender},6:function(e,t,r){var n=r(26),o=r(27),i=r(21),c=r(28);e.exports=function(e,t){return n(e)||o(e,t)||i(e,t)||c()},e.exports.__esModule=!0,e.exports.default=e.exports},66:function(e,t){e.exports=jQuery},82:function(e,t,r){"use strict";r.r(t);var n=r(53),o=r(29),i=r.n(o),c=r(6),a=r.n(c),l=r(0),s=r(54),u=r.n(s),p=r(2),f=r(3),m=r(40),d=r(9),y=Object(l.createElement)(d.SVG,{width:"256",height:"256",fill:"none",xmlns:"http://www.w3.org/2000/svg",viewBox:" 0 0 256 256"},Object(l.createElement)(d.Path,{fillRule:"evenodd",clipRule:"evenodd",d:"M16.2016 47c-5.2739 0-9.54928 4.1406-9.54928 9.2482V181.099c0 5.108 4.27538 9.249 9.54928 9.249H133.18c3.956 0 7.162-3.106 7.162-6.937 0-3.83-3.206-6.936-7.162-6.936H28.1382c-3.9554 0-7.1619-3.105-7.1619-6.936v-69.362c0-3.8304 3.2065-6.9359 7.1619-6.9359H207.187c5.274 0 9.55-4.1405 9.55-9.2482V56.2482c0-5.1076-4.276-9.2482-9.55-9.2482H16.2016ZM240.61 145.262h-5.969v-8.092c0-16.6-13.894-30.057-31.035-30.057-17.14 0-31.035 13.457-31.035 30.057v8.092h-8.355c-5.274 0-9.55 4.141-9.55 9.249v46.241c0 5.107 4.276 9.248 9.55 9.248h76.394c5.274 0 9.549-4.141 9.549-9.248v-46.241c0-5.108-4.275-9.249-9.549-9.249Zm-20.292-8.092v8.092h-33.423v-8.092c0-8.938 7.482-16.184 16.711-16.184 9.23 0 16.712 7.246 16.712 16.184Zm-180.2429-6.936c0-2.554 2.1377-4.624 4.7747-4.624h76.3942c2.637 0 4.775 2.07 4.775 4.624s-2.138 4.624-4.775 4.624H44.8498c-2.637 0-4.7747-2.07-4.7747-4.624Zm0 20.808c0-2.553 2.1377-4.624 4.7747-4.624h28.6479c2.6369 0 4.7746 2.071 4.7746 4.624 0 2.554-2.1377 4.625-4.7746 4.625H44.8498c-2.637 0-4.7747-2.071-4.7747-4.625ZM166.603 198.44v-41.617h71.62v41.617h-71.62Z",fill:"#428BCA"})),b=r(47),v=r(17),x=[],w=simpayBlockPaymentForm,h=w.isLite,_=w.previews,j=_.lite,O=_.pro,g=r(42);Object(n.registerBlockType)(g.c,{edit:function(e){var t=e.attributes,r=e.setAttributes,n=t.formId,o=t.showTitle,c=t.showDescription,s=t.preview,d=Object(b.a)(t),w=a()(d,1)[0],_=Object(v.useSelect)((function(e){var t=e("core"),r=t.getEntityRecords,n=t.isResolving,o=["postType","stripe",{per_page:-1}],i=r.apply(void 0,o),c=n("getEntityRecords",o);return{paymentForms:i||x,isLoading:c,hasPaymentForms:!(null==i||!i.length)}}),[]),g=_.paymentForms,S=_.isLoading,P=_.hasPaymentForms;if(s)return Object(l.createElement)("img",{src:"1"===h?j:O,alt:Object(p.__)("Payment Form Preview","simpay"),style:{maxWidth:"100%"}});var E=[{label:Object(p.__)("Select a form","stripe"),value:0}].concat(i()(g.map((function(e){var t=e.id;return{label:e.payment_form_title,value:t}})))),M=Object(l.createElement)(f.SelectControl,{label:Object(p.__)("Select a payment form","stripe"),value:n,onChange:function(e){return r({formId:parseInt(e)})},options:E});return n?Object(l.createElement)(f.Disabled,null,Object(l.createElement)(m.InspectorControls,null,Object(l.createElement)(f.PanelBody,{title:Object(p.__)("Form Settings","stripe")},M,Object(l.createElement)(f.ToggleControl,{label:Object(p.__)("Show Title","stripe"),checked:o,onChange:function(){return r({showTitle:!o})}}),Object(l.createElement)(f.ToggleControl,{label:Object(p.__)("Show Description","stripe"),checked:c,onChange:function(){return r({showDescription:!c})}}))),Object(l.createElement)("div",{className:w?"":"is-loading"},Object(l.createElement)(u.a,{block:"simpay/payment-form",attributes:t}))):Object(l.createElement)(f.Placeholder,{icon:y,label:Object(p.__)("WP Simple Pay - Payment Form","stripe")},S&&Object(l.createElement)(f.Spinner,null),!S&&!P&&Object(p.__)("No payment forms found.","stripe"),!S&&P&&M)},title:g.d,description:g.b,category:g.a,icon:y,transforms:{from:[{type:"shortcode",tag:"simpay",attributes:{formId:{type:"string",shortcode:function(e){return e.named.id||0}}}}]},save:function(){return null}})},9:function(e,t){e.exports=window.wp.primitives}});