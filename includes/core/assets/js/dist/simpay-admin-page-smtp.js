!function(t){var e={};function s(a){if(e[a])return e[a].exports;var n=e[a]={i:a,l:!1,exports:{}};return t[a].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=t,s.c=e,s.d=function(t,e,a){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(s.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)s.d(a,n,function(e){return t[e]}.bind(null,n));return a},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=46)}({46:function(t,e,s){"use strict";(function(t){(window.SimPaySMTP||function(t,e,s){var a={},n={init:function(){s(n.ready)},ready:function(){n.initVars(),n.events()},initVars:function(){a={$stepInstall:s("section.step-install"),$stepInstallNum:s("section.step-install .num img"),$stepSetup:s("section.step-setup"),$stepSetupNum:s("section.step-setup .num img")}},events:function(){a.$stepInstall.on("click","button",n.stepInstallClick),a.$stepSetup.on("click","button",n.gotoURL)},stepInstallClick:function(t){t.preventDefault();var i=s(this),r=i.attr("data-action"),l=i.attr("data-plugin"),p=i.text(),u="";if(!i.hasClass("disabled")){switch(r){case"activate":u="simpay_activate_plugin",i.text(simpay_smtp.activating);break;case"install":u="simpay_install_plugin",i.text(simpay_smtp.installing);break;case"goto-url":return void(e.location.href=i.attr("data-url"));default:return}i.addClass("disabled"),n.showSpinner(a.$stepInstallNum);var o={action:u,nonce:simpay_smtp.nonce,plugin:l};s.post(simpay_smtp.ajax_url,o).done((function(t){n.stepInstallDone(t,i,r)})).fail((function(){i.removeClass("disabled"),i.text(p)})).always((function(){n.hideSpinner(a.$stepInstallNum)}))}},stepInstallDone:function(t,e,s){if("install"===s?t.success&&t.data.is_activated:t.success)return a.$stepInstallNum.attr("src",a.$stepInstallNum.attr("src").replace("step-1.","step-complete.")),e.addClass("grey").removeClass("button-primary").text(simpay_smtp.activated),void n.stepInstallPluginStatus();var i="install"===s&&t.success&&!t.data.is_activated||"activate"===s,r=i?simpay_smtp.manual_activate_url:simpay_smtp.manual_install_url,l=i?simpay_smtp.error_could_not_activate:simpay_smtp.error_could_not_install,p=i?simpay_smtp.plugins_page:simpay_smtp.download_now;e.removeClass("grey disabled").text(p).attr("data-action","goto-url").attr("data-url",r),e.after('<p class="error">'+l+"</p>")},stepInstallPluginStatus:function(){var t={action:"simpay_smtp_page_check_plugin_status",nonce:simpay_smtp.nonce};s.post(simpay_smtp.ajax_url,t).done(n.stepInstallPluginStatusDone)},stepInstallPluginStatusDone:function(t){if(t.success){if(a.$stepSetup.removeClass("grey"),a.$stepSetupBtn=a.$stepSetup.find("button"),a.$stepSetupBtn.removeClass("grey disabled").addClass("button-primary"),t.data.setup_status>0)return a.$stepSetupNum.attr("src",a.$stepSetupNum.attr("src").replace("step-2.svg","step-complete.svg")),void a.$stepSetupBtn.attr("data-url",simpay_smtp.smtp_settings_url).text(simpay_smtp.smtp_settings);a.$stepSetupBtn.attr("data-url",simpay_smtp.smtp_wizard_url).text(simpay_smtp.smtp_wizard)}},gotoURL:function(){var t=s(this);t.hasClass("disabled")||(e.location.href=t.attr("data-url"))},showSpinner:function(t){t.siblings(".loader").removeClass("hidden")},hideSpinner:function(t){t.siblings(".loader").addClass("hidden")}};return n}(document,window,t)).init()}).call(this,s(7))},7:function(t,e){t.exports=jQuery}});