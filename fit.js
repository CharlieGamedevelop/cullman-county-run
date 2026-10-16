/* fit.js: full-screen fitting helpers shared by the Cullman County games. Load before the game script. */
(function(){
var probe=document.createElement('div');
probe.style.cssText='position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top);padding-right:env(safe-area-inset-right);padding-bottom:env(safe-area-inset-bottom);padding-left:env(safe-area-inset-left)';
function px(v){var n=parseFloat(v);return isNaN(n)?0:n;}
var fit={w:0,h:0,safe:{t:0,r:0,b:0,l:0}};window.__fit=fit;
function measure(){try{if(!probe.parentNode&&document.body)document.body.appendChild(probe);}catch(e){}
 var vv=window.visualViewport;var w=vv?vv.width:0,h=vv?vv.height:0;
 if(!w||!h){w=window.innerWidth||document.documentElement.clientWidth;h=window.innerHeight||document.documentElement.clientHeight;}
 fit.w=Math.max(1,Math.round(w));fit.h=Math.max(1,Math.round(h));
 try{var cs=getComputedStyle(probe);fit.safe={t:px(cs.paddingTop),r:px(cs.paddingRight),b:px(cs.paddingBottom),l:px(cs.paddingLeft)};}catch(e){}
 document.documentElement.style.setProperty('--app-h',fit.h+'px');document.documentElement.style.setProperty('--app-w',fit.w+'px');}
window.__fitMeasure=measure;measure();
['resize','orientationchange','load','pageshow'].forEach(function(ev){window.addEventListener(ev,function(){measure();setTimeout(measure,300);});});
if(window.visualViewport){visualViewport.addEventListener('resize',measure);visualViewport.addEventListener('scroll',function(){window.scrollTo(0,0)});}
// block zoom, double tap zoom, pull to refresh, long press menu, selection
function no(e){if(e.cancelable)e.preventDefault();}
document.addEventListener('gesturestart',no,{passive:false});document.addEventListener('gesturechange',no,{passive:false});
document.addEventListener('dblclick',no,{passive:false});document.addEventListener('contextmenu',no);
document.addEventListener('selectstart',no);
document.addEventListener('touchmove',function(e){if(e.touches&&e.touches.length>1)no(e);else if(e.target&&e.target.id==='c')no(e);},{passive:false});
var lastEnd=0;document.addEventListener('touchend',function(e){var t=Date.now();if(t-lastEnd<300&&e.target&&e.target.tagName!=='BUTTON')no(e);lastEnd=t;},{passive:false});
// optional fullscreen button: only where the API really works (not iPhone), never automatic
function addFS(){try{var d=document.documentElement;var req=d.requestFullscreen||d.webkitRequestFullscreen;var en=document.fullscreenEnabled||document.webkitFullscreenEnabled;
 var iOS=/iP(hone|od)/.test(navigator.userAgent);var standalone=(window.matchMedia&&matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches)||navigator.standalone;
 if(!req||!en||iOS||standalone)return;var b=document.createElement('button');b.id='fsbtn';b.setAttribute('aria-label','Fullscreen');b.textContent='⛶';document.body.appendChild(b);
 b.addEventListener('click',function(e){e.stopPropagation();try{var fe=document.fullscreenElement||document.webkitFullscreenElement;
  if(fe){var x=document.exitFullscreen||document.webkitExitFullscreen;if(x){var p=x.call(document);if(p&&p.catch)p.catch(function(){})}}
  else{var p2=req.call(d);if(p2&&p2.catch)p2.catch(function(){});}}catch(err){}});}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addFS);else addFS();
})();
