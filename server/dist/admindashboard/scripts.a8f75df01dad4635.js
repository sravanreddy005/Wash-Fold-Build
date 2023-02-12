!function(){"use strict";setTimeout(function(){const r=(m,n=!1)=>(m=m.trim(),n?[...document.querySelectorAll(m)]:document.querySelector(m)),a=(m,n,i,t=!1)=>{t?r(n,t).forEach(e=>e.addEventListener(m,i)):r(n,t).addEventListener(m,i)},d=(m,n)=>{m.addEventListener("scroll",n)};r(".toggle-sidebar-btn")&&a("click",".toggle-sidebar-btn",function(m){}),r(".search-bar-toggle")&&a("click",".search-bar-toggle",function(m){r(".search-bar").classList.toggle("search-bar-show")});let l=r("#navbar .scrollto",!0);const h=()=>{let m=window.scrollY+200;l.forEach(n=>{if(!n.hash)return;let i=r(n.hash);!i||(m>=i.offsetTop&&m<=i.offsetTop+i.offsetHeight?n.classList.add("active"):n.classList.remove("active"))})};window.addEventListener("load",h),d(document,h);let o=r("#header");if(o){const m=()=>{window.scrollY>100?o.classList.add("header-scrolled"):o.classList.remove("header-scrolled")};window.addEventListener("load",m),d(document,m)}let u=r(".back-to-top");if(u){const m=()=>{window.scrollY>100?u.classList.add("active"):u.classList.remove("active")};window.addEventListener("load",m),d(document,m)}[].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(function(m){return new bootstrap.Tooltip(m)}),r(".quill-editor-default")&&new Quill(".quill-editor-default",{theme:"snow"}),r(".quill-editor-bubble")&&new Quill(".quill-editor-bubble",{theme:"bubble"}),r(".quill-editor-full")&&new Quill(".quill-editor-full",{modules:{toolbar:[[{font:[]},{size:[]}],["bold","italic","underline","strike"],[{color:[]},{background:[]}],[{script:"super"},{script:"sub"}],[{list:"ordered"},{list:"bullet"},{indent:"-1"},{indent:"+1"}],["direction",{align:[]}],["link","image","video"],["clean"]]},theme:"snow"}),window.matchMedia("(prefers-color-scheme: dark)");var g=document.querySelectorAll(".needs-validation");Array.prototype.slice.call(g).forEach(function(m){m.addEventListener("submit",function(n){m.checkValidity()||(n.preventDefault(),n.stopPropagation()),m.classList.add("was-validated")},!1)}),r(".datatable",!0).forEach(m=>{new simpleDatatables.DataTable(m)})},1)}(),function(r,a){"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(d){return a(r,d)}):"object"==typeof module&&module.exports?module.exports=a(r,require("jquery")):r.jQueryBridget=a(r,r.jQuery)}(window,function(r,a){"use strict";function d(c,_,v){function g(m,n,i){var t,e="$()."+c+'("'+n+'")';return m.each(function(s,p){var y=v.data(p,c);if(y){var I=y[n];if(I&&"_"!=n.charAt(0)){var z=I.apply(y,i);t=void 0===t?z:t}else u(e+" is not a valid method")}else u(c+" not initialized. Cannot call methods, i.e. "+e)}),void 0!==t?t:m}function f(m,n){m.each(function(i,t){var e=v.data(t,c);e?(e.option(n),e._init()):(e=new _(t,n),v.data(t,c,e))})}(v=v||a||r.jQuery)&&(_.prototype.option||(_.prototype.option=function(m){v.isPlainObject(m)&&(this.options=v.extend(!0,this.options,m))}),v.fn[c]=function(m){if("string"==typeof m){var n=h.call(arguments,1);return g(this,m,n)}return f(this,m),this},l(v))}function l(c){!c||c&&c.bridget||(c.bridget=d)}var h=Array.prototype.slice,o=r.console,u=typeof o>"u"?function(){}:function(c){o.error(c)};return l(a||r.jQuery),d}),function(r,a){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",a):"object"==typeof module&&module.exports?module.exports=a():r.EvEmitter=a()}(typeof window<"u"?window:this,function(){function r(){}var a=r.prototype;return a.on=function(d,l){if(d&&l){var h=this._events=this._events||{},o=h[d]=h[d]||[];return-1==o.indexOf(l)&&o.push(l),this}},a.once=function(d,l){if(d&&l){this.on(d,l);var h=this._onceEvents=this._onceEvents||{};return(h[d]=h[d]||{})[l]=!0,this}},a.off=function(d,l){var h=this._events&&this._events[d];if(h&&h.length){var o=h.indexOf(l);return-1!=o&&h.splice(o,1),this}},a.emitEvent=function(d,l){var h=this._events&&this._events[d];if(h&&h.length){h=h.slice(0),l=l||[];for(var o=this._onceEvents&&this._onceEvents[d],u=0;u<h.length;u++){var c=h[u];o&&o[c]&&(this.off(d,c),delete o[c]),c.apply(this,l)}return this}},a.allOff=function(){delete this._events,delete this._onceEvents},r}),function(r,a){"function"==typeof define&&define.amd?define("get-size/get-size",a):"object"==typeof module&&module.exports?module.exports=a():r.getSize=a()}(window,function(){"use strict";function r(f){var m=parseFloat(f);return-1==f.indexOf("%")&&!isNaN(m)&&m}function l(f){var m=getComputedStyle(f);return m||c("Style returned "+m+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),m}var u,c=typeof console>"u"?function a(){}:function(f){console.error(f)},_=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],v=_.length,g=!1;return function o(f){if(function h(){if(!g){g=!0;var f=document.createElement("div");f.style.width="200px",f.style.padding="1px 2px 3px 4px",f.style.borderStyle="solid",f.style.borderWidth="1px 2px 3px 4px",f.style.boxSizing="border-box";var m=document.body||document.documentElement;m.appendChild(f);var n=l(f);u=200==Math.round(r(n.width)),o.isBoxSizeOuter=u,m.removeChild(f)}}(),"string"==typeof f&&(f=document.querySelector(f)),f&&"object"==typeof f&&f.nodeType){var m=l(f);if("none"==m.display)return function d(){for(var f={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},m=0;m<v;m++)f[_[m]]=0;return f}();var n={};n.width=f.offsetWidth,n.height=f.offsetHeight;for(var i=n.isBorderBox="border-box"==m.boxSizing,t=0;t<v;t++){var e=_[t],p=parseFloat(m[e]);n[e]=isNaN(p)?0:p}var y=n.paddingLeft+n.paddingRight,I=n.paddingTop+n.paddingBottom,z=n.marginLeft+n.marginRight,b=n.marginTop+n.marginBottom,E=n.borderLeftWidth+n.borderRightWidth,S=n.borderTopWidth+n.borderBottomWidth,x=i&&u,L=r(m.width);!1!==L&&(n.width=L+(x?0:y+E));var w=r(m.height);return!1!==w&&(n.height=w+(x?0:I+S)),n.innerWidth=n.width-(y+E),n.innerHeight=n.height-(I+S),n.outerWidth=n.width+z,n.outerHeight=n.height+b,n}}}),function(r,a){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",a):"object"==typeof module&&module.exports?module.exports=a():r.matchesSelector=a()}(window,function(){"use strict";var r=function(){var a=window.Element.prototype;if(a.matches)return"matches";if(a.matchesSelector)return"matchesSelector";for(var d=["webkit","moz","ms","o"],l=0;l<d.length;l++){var o=d[l]+"MatchesSelector";if(a[o])return o}}();return function(a,d){return a[r](d)}}),function(r,a){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(d){return a(r,d)}):"object"==typeof module&&module.exports?module.exports=a(r,require("desandro-matches-selector")):r.fizzyUIUtils=a(r,r.matchesSelector)}(window,function(r,a){var d={extend:function(o,u){for(var c in u)o[c]=u[c];return o},modulo:function(o,u){return(o%u+u)%u}},l=Array.prototype.slice;d.makeArray=function(o){return Array.isArray(o)?o:null==o?[]:"object"==typeof o&&"number"==typeof o.length?l.call(o):[o]},d.removeFrom=function(o,u){var c=o.indexOf(u);-1!=c&&o.splice(c,1)},d.getParent=function(o,u){for(;o.parentNode&&o!=document.body;)if(a(o=o.parentNode,u))return o},d.getQueryElement=function(o){return"string"==typeof o?document.querySelector(o):o},d.handleEvent=function(o){var u="on"+o.type;this[u]&&this[u](o)},d.filterFindElements=function(o,u){o=d.makeArray(o);var c=[];return o.forEach(function(_){if(_ instanceof HTMLElement){if(!u)return void c.push(_);a(_,u)&&c.push(_);for(var v=_.querySelectorAll(u),g=0;g<v.length;g++)c.push(v[g])}}),c},d.debounceMethod=function(o,u,c){c=c||100;var _=o.prototype[u],v=u+"Timeout";o.prototype[u]=function(){var g=this[v];clearTimeout(g);var f=arguments,m=this;this[v]=setTimeout(function(){_.apply(m,f),delete m[v]},c)}},d.docReady=function(o){var u=document.readyState;"complete"==u||"interactive"==u?setTimeout(o):document.addEventListener("DOMContentLoaded",o)},d.toDashed=function(o){return o.replace(/(.)([A-Z])/g,function(u,c,_){return c+"-"+_}).toLowerCase()};var h=r.console;return d.htmlInit=function(o,u){d.docReady(function(){var c=d.toDashed(u),_="data-"+c,v=document.querySelectorAll("["+_+"]"),g=document.querySelectorAll(".js-"+c),f=d.makeArray(v).concat(d.makeArray(g)),m=_+"-options",n=r.jQuery;f.forEach(function(i){var t,e=i.getAttribute(_)||i.getAttribute(m);try{t=e&&JSON.parse(e)}catch(p){return void(h&&h.error("Error parsing "+_+" on "+i.className+": "+p))}var s=new o(i,t);n&&n.data(i,u,s)})})},d}),function(r,a){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],a):"object"==typeof module&&module.exports?module.exports=a(require("ev-emitter"),require("get-size")):(r.Outlayer={},r.Outlayer.Item=a(r.EvEmitter,r.getSize))}(window,function(r,a){"use strict";function l(i,t){i&&(this.element=i,this.layout=t,this.position={x:0,y:0},this._create())}var o=document.documentElement.style,u="string"==typeof o.transition?"transition":"WebkitTransition",c="string"==typeof o.transform?"transform":"WebkitTransform",_={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[u],v={transform:c,transition:u,transitionDuration:u+"Duration",transitionProperty:u+"Property",transitionDelay:u+"Delay"},g=l.prototype=Object.create(r.prototype);g.constructor=l,g._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},g.handleEvent=function(i){var t="on"+i.type;this[t]&&this[t](i)},g.getSize=function(){this.size=a(this.element)},g.css=function(i){var t=this.element.style;for(var e in i)t[v[e]||e]=i[e]},g.getPosition=function(){var i=getComputedStyle(this.element),t=this.layout._getOption("originLeft"),e=this.layout._getOption("originTop"),s=i[t?"left":"right"],p=i[e?"top":"bottom"],y=parseFloat(s),I=parseFloat(p),z=this.layout.size;-1!=s.indexOf("%")&&(y=y/100*z.width),-1!=p.indexOf("%")&&(I=I/100*z.height),y=isNaN(y)?0:y,I=isNaN(I)?0:I,I-=e?z.paddingTop:z.paddingBottom,this.position.x=y-=t?z.paddingLeft:z.paddingRight,this.position.y=I},g.layoutPosition=function(){var i=this.layout.size,t={},e=this.layout._getOption("originLeft"),s=this.layout._getOption("originTop"),I=e?"right":"left";t[e?"left":"right"]=this.getXValue(this.position.x+i[e?"paddingLeft":"paddingRight"]),t[I]="";var S=s?"bottom":"top";t[s?"top":"bottom"]=this.getYValue(this.position.y+i[s?"paddingTop":"paddingBottom"]),t[S]="",this.css(t),this.emitEvent("layout",[this])},g.getXValue=function(i){var t=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!t?i/this.layout.size.width*100+"%":i+"px"},g.getYValue=function(i){var t=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&t?i/this.layout.size.height*100+"%":i+"px"},g._transitionTo=function(i,t){this.getPosition();var e=this.position.x,s=this.position.y,p=i==this.position.x&&t==this.position.y;if(this.setPosition(i,t),!p||this.isTransitioning){var z={};z.transform=this.getTranslate(i-e,t-s),this.transition({to:z,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})}else this.layoutPosition()},g.getTranslate=function(i,t){return"translate3d("+(i=this.layout._getOption("originLeft")?i:-i)+"px, "+(t=this.layout._getOption("originTop")?t:-t)+"px, 0)"},g.goTo=function(i,t){this.setPosition(i,t),this.layoutPosition()},g.moveTo=g._transitionTo,g.setPosition=function(i,t){this.position.x=parseFloat(i),this.position.y=parseFloat(t)},g._nonTransition=function(i){for(var t in this.css(i.to),i.isCleaning&&this._removeStyles(i.to),i.onTransitionEnd)i.onTransitionEnd[t].call(this)},g.transition=function(i){if(parseFloat(this.layout.options.transitionDuration)){var t=this._transn;for(var e in i.onTransitionEnd)t.onEnd[e]=i.onTransitionEnd[e];for(e in i.to)t.ingProperties[e]=!0,i.isCleaning&&(t.clean[e]=!0);i.from&&this.css(i.from),this.enableTransition(i.to),this.css(i.to),this.isTransitioning=!0}else this._nonTransition(i)};var f="opacity,"+function h(i){return i.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}(c);g.enableTransition=function(){if(!this.isTransitioning){var i=this.layout.options.transitionDuration;this.css({transitionProperty:f,transitionDuration:i="number"==typeof i?i+"ms":i,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(_,this,!1)}},g.onwebkitTransitionEnd=function(i){this.ontransitionend(i)},g.onotransitionend=function(i){this.ontransitionend(i)};var m={"-webkit-transform":"transform"};g.ontransitionend=function(i){if(i.target===this.element){var t=this._transn,e=m[i.propertyName]||i.propertyName;delete t.ingProperties[e],function d(i){for(var t in i)return!1;return!0}(t.ingProperties)&&this.disableTransition(),e in t.clean&&(this.element.style[i.propertyName]="",delete t.clean[e]),e in t.onEnd&&(t.onEnd[e].call(this),delete t.onEnd[e]),this.emitEvent("transitionEnd",[this])}},g.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(_,this,!1),this.isTransitioning=!1},g._removeStyles=function(i){var t={};for(var e in i)t[e]="";this.css(t)};var n={transitionProperty:"",transitionDuration:"",transitionDelay:""};return g.removeTransitionStyles=function(){this.css(n)},g.stagger=function(i){i=isNaN(i)?0:i,this.staggerDelay=i+"ms"},g.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},g.remove=function(){return u&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),void this.hide()):void this.removeElem()},g.reveal=function(){delete this.isHidden,this.css({display:""});var i=this.layout.options,t={};t[this.getHideRevealTransitionEndProperty("visibleStyle")]=this.onRevealTransitionEnd,this.transition({from:i.hiddenStyle,to:i.visibleStyle,isCleaning:!0,onTransitionEnd:t})},g.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},g.getHideRevealTransitionEndProperty=function(i){var t=this.layout.options[i];if(t.opacity)return"opacity";for(var e in t)return e},g.hide=function(){this.isHidden=!0,this.css({display:""});var i=this.layout.options,t={};t[this.getHideRevealTransitionEndProperty("hiddenStyle")]=this.onHideTransitionEnd,this.transition({from:i.visibleStyle,to:i.hiddenStyle,isCleaning:!0,onTransitionEnd:t})},g.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},g.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},l}),function(r,a){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(d,l,h,o){return a(r,d,l,h,o)}):"object"==typeof module&&module.exports?module.exports=a(r,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):r.Outlayer=a(r,r.EvEmitter,r.getSize,r.fizzyUIUtils,r.Outlayer.Item)}(window,function(r,a,d,l,h){"use strict";function o(t,e){var s=l.getQueryElement(t);if(s){this.element=s,v&&(this.$element=v(this.element)),this.options=l.extend({},this.constructor.defaults),this.option(e);var p=++f;this.element.outlayerGUID=p,m[p]=this,this._create(),this._getOption("initLayout")&&this.layout()}else _&&_.error("Bad element for "+this.constructor.namespace+": "+(s||t))}function u(t){function e(){t.apply(this,arguments)}return(e.prototype=Object.create(t.prototype)).constructor=e,e}var _=r.console,v=r.jQuery,g=function(){},f=0,m={};o.namespace="outlayer",o.Item=h,o.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var n=o.prototype;l.extend(n,a.prototype),n.option=function(t){l.extend(this.options,t)},n._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},o.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},n._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),l.extend(this.element.style,this.options.containerStyle),this._getOption("resize")&&this.bindResize()},n.reloadItems=function(){this.items=this._itemize(this.element.children)},n._itemize=function(t){for(var e=this._filterFindItemElements(t),s=this.constructor.Item,p=[],y=0;y<e.length;y++){var z=new s(e[y],this);p.push(z)}return p},n._filterFindItemElements=function(t){return l.filterFindElements(t,this.options.itemSelector)},n.getItemElements=function(){return this.items.map(function(t){return t.element})},n.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant");this.layoutItems(this.items,void 0!==t?t:!this._isLayoutInited),this._isLayoutInited=!0},n._init=n.layout,n._resetLayout=function(){this.getSize()},n.getSize=function(){this.size=d(this.element)},n._getMeasurement=function(t,e){var s,p=this.options[t];p?("string"==typeof p?s=this.element.querySelector(p):p instanceof HTMLElement&&(s=p),this[t]=s?d(s)[e]:p):this[t]=0},n.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},n._getItemsForLayout=function(t){return t.filter(function(e){return!e.isIgnored})},n._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){var s=[];t.forEach(function(p){var y=this._getItemLayoutPosition(p);y.item=p,y.isInstant=e||p.isLayoutInstant,s.push(y)},this),this._processLayoutQueue(s)}},n._getItemLayoutPosition=function(){return{x:0,y:0}},n._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(e,s){this._positionItem(e.item,e.x,e.y,e.isInstant,s)},this)},n.updateStagger=function(){var t=this.options.stagger;return null==t?void(this.stagger=0):(this.stagger=function c(t){if("number"==typeof t)return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),s=e&&e[1],p=e&&e[2];return s.length?(s=parseFloat(s))*(i[p]||1):0}(t),this.stagger)},n._positionItem=function(t,e,s,p,y){p?t.goTo(e,s):(t.stagger(y*this.stagger),t.moveTo(e,s))},n._postLayout=function(){this.resizeContainer()},n.resizeContainer=function(){if(this._getOption("resizeContainer")){var e=this._getContainerSize();e&&(this._setContainerMeasure(e.width,!0),this._setContainerMeasure(e.height,!1))}},n._getContainerSize=g,n._setContainerMeasure=function(t,e){if(void 0!==t){var s=this.size;s.isBorderBox&&(t+=e?s.paddingLeft+s.paddingRight+s.borderLeftWidth+s.borderRightWidth:s.paddingBottom+s.paddingTop+s.borderTopWidth+s.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},n._emitCompleteOnItems=function(t,e){function s(){y.dispatchEvent(t+"Complete",null,[e])}function p(){++z==I&&s()}var y=this,I=e.length;if(e&&I){var z=0;e.forEach(function(b){b.once(t,p)})}else s()},n.dispatchEvent=function(t,e,s){var p=e?[e].concat(s):s;if(this.emitEvent(t,p),v)if(this.$element=this.$element||v(this.element),e){var y=v.Event(e);y.type=t,this.$element.trigger(y,s)}else this.$element.trigger(t,s)},n.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},n.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},n.stamp=function(t){(t=this._find(t))&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},n.unstamp=function(t){(t=this._find(t))&&t.forEach(function(e){l.removeFrom(this.stamps,e),this.unignore(e)},this)},n._find=function(t){if(t)return"string"==typeof t&&(t=this.element.querySelectorAll(t)),l.makeArray(t)},n._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},n._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},n._manageStamp=g,n._getElementOffset=function(t){var e=t.getBoundingClientRect(),s=this._boundingRect,p=d(t);return{left:e.left-s.left-p.marginLeft,top:e.top-s.top-p.marginTop,right:s.right-e.right-p.marginRight,bottom:s.bottom-e.bottom-p.marginBottom}},n.handleEvent=l.handleEvent,n.bindResize=function(){r.addEventListener("resize",this),this.isResizeBound=!0},n.unbindResize=function(){r.removeEventListener("resize",this),this.isResizeBound=!1},n.onresize=function(){this.resize()},l.debounceMethod(o,"onresize",100),n.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},n.needsResizeLayout=function(){var t=d(this.element);return this.size&&t&&t.innerWidth!==this.size.innerWidth},n.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},n.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},n.prepended=function(t){var e=this._itemize(t);if(e.length){var s=this.items.slice(0);this.items=e.concat(s),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(s)}},n.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),t&&t.length){var e=this.updateStagger();t.forEach(function(s,p){s.stagger(p*e),s.reveal()})}},n.hide=function(t){if(this._emitCompleteOnItems("hide",t),t&&t.length){var e=this.updateStagger();t.forEach(function(s,p){s.stagger(p*e),s.hide()})}},n.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},n.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},n.getItem=function(t){for(var e=0;e<this.items.length;e++){var s=this.items[e];if(s.element==t)return s}},n.getItems=function(t){t=l.makeArray(t);var e=[];return t.forEach(function(s){var p=this.getItem(s);p&&e.push(p)},this),e},n.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(s){s.remove(),l.removeFrom(this.items,s)},this)},n.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(s){s.destroy()}),this.unbindResize(),delete m[this.element.outlayerGUID],delete this.element.outlayerGUID,v&&v.removeData(this.element,this.constructor.namespace)},o.data=function(t){var e=(t=l.getQueryElement(t))&&t.outlayerGUID;return e&&m[e]},o.create=function(t,e){var s=u(o);return s.defaults=l.extend({},o.defaults),l.extend(s.defaults,e),s.compatOptions=l.extend({},o.compatOptions),s.namespace=t,s.data=o.data,s.Item=u(h),l.htmlInit(s,t),v&&v.bridget&&v.bridget(t,s),s};var i={ms:1,s:1e3};return o.Item=h,o}),function(r,a){"function"==typeof define&&define.amd?define("isotope-layout/js/item",["outlayer/outlayer"],a):"object"==typeof module&&module.exports?module.exports=a(require("outlayer")):(r.Isotope=r.Isotope||{},r.Isotope.Item=a(r.Outlayer))}(window,function(r){"use strict";function a(){r.Item.apply(this,arguments)}var d=a.prototype=Object.create(r.Item.prototype),l=d._create;d._create=function(){this.id=this.layout.itemGUID++,l.call(this),this.sortData={}},d.updateSortData=function(){if(!this.isIgnored){this.sortData.id=this.id,this.sortData["original-order"]=this.id,this.sortData.random=Math.random();var o=this.layout.options.getSortData,u=this.layout._sorters;for(var c in o)this.sortData[c]=(0,u[c])(this.element,this)}};var h=d.destroy;return d.destroy=function(){h.apply(this,arguments),this.css({display:""})},a}),function(r,a){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-mode",["get-size/get-size","outlayer/outlayer"],a):"object"==typeof module&&module.exports?module.exports=a(require("get-size"),require("outlayer")):(r.Isotope=r.Isotope||{},r.Isotope.LayoutMode=a(r.getSize,r.Outlayer))}(window,function(r,a){"use strict";function d(o){this.isotope=o,o&&(this.options=o.options[this.namespace],this.element=o.element,this.items=o.filteredItems,this.size=o.size)}var l=d.prototype;return["_resetLayout","_getItemLayoutPosition","_manageStamp","_getContainerSize","_getElementOffset","needsResizeLayout","_getOption"].forEach(function(o){l[o]=function(){return a.prototype[o].apply(this.isotope,arguments)}}),l.needsVerticalResizeLayout=function(){var o=r(this.isotope.element);return this.isotope.size&&o&&o.innerHeight!=this.isotope.size.innerHeight},l._getMeasurement=function(){this.isotope._getMeasurement.apply(this,arguments)},l.getColumnWidth=function(){this.getSegmentSize("column","Width")},l.getRowHeight=function(){this.getSegmentSize("row","Height")},l.getSegmentSize=function(o,u){var c=o+u,_="outer"+u;if(this._getMeasurement(c,_),!this[c]){var v=this.getFirstItemSize();this[c]=v&&v[_]||this.isotope.size["inner"+u]}},l.getFirstItemSize=function(){var o=this.isotope.filteredItems[0];return o&&o.element&&r(o.element)},l.layout=function(){this.isotope.layout.apply(this.isotope,arguments)},l.getSize=function(){this.isotope.getSize(),this.size=this.isotope.size},d.modes={},d.create=function(o,u){function c(){d.apply(this,arguments)}return(c.prototype=Object.create(l)).constructor=c,u&&(c.options=u),c.prototype.namespace=o,d.modes[o]=c,c},d}),function(r,a){"function"==typeof define&&define.amd?define("masonry-layout/masonry",["outlayer/outlayer","get-size/get-size"],a):"object"==typeof module&&module.exports?module.exports=a(require("outlayer"),require("get-size")):r.Masonry=a(r.Outlayer,r.getSize)}(window,function(r,a){var d=r.create("masonry");d.compatOptions.fitWidth="isFitWidth";var l=d.prototype;return l._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var h=0;h<this.cols;h++)this.colYs.push(0);this.maxY=0,this.horizontalColIndex=0},l.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var h=this.items[0],o=h&&h.element;this.columnWidth=o&&a(o).outerWidth||this.containerWidth}var u=this.columnWidth+=this.gutter,c=this.containerWidth+this.gutter,_=c/u,v=u-c%u;_=Math[v&&v<1?"round":"floor"](_),this.cols=Math.max(_,1)},l.getContainerWidth=function(){var h=this._getOption("fitWidth"),u=a(h?this.element.parentNode:this.element);this.containerWidth=u&&u.innerWidth},l._getItemLayoutPosition=function(h){h.getSize();var o=h.size.outerWidth%this.columnWidth,c=Math[o&&o<1?"round":"ceil"](h.size.outerWidth/this.columnWidth);c=Math.min(c,this.cols);for(var v=this[this.options.horizontalOrder?"_getHorizontalColPosition":"_getTopColPosition"](c,h),g={x:this.columnWidth*v.col,y:v.y},f=v.y+h.size.outerHeight,m=c+v.col,n=v.col;n<m;n++)this.colYs[n]=f;return g},l._getTopColPosition=function(h){var o=this._getTopColGroup(h),u=Math.min.apply(Math,o);return{col:o.indexOf(u),y:u}},l._getTopColGroup=function(h){if(h<2)return this.colYs;for(var o=[],u=this.cols+1-h,c=0;c<u;c++)o[c]=this._getColGroupY(c,h);return o},l._getColGroupY=function(h,o){if(o<2)return this.colYs[h];var u=this.colYs.slice(h,h+o);return Math.max.apply(Math,u)},l._getHorizontalColPosition=function(h,o){var u=this.horizontalColIndex%this.cols;return u=h>1&&u+h>this.cols?0:u,this.horizontalColIndex=o.size.outerWidth&&o.size.outerHeight?u+h:this.horizontalColIndex,{col:u,y:this._getColGroupY(u,h)}},l._manageStamp=function(h){var o=a(h),u=this._getElementOffset(h),_=this._getOption("originLeft")?u.left:u.right,v=_+o.outerWidth,g=Math.floor(_/this.columnWidth);g=Math.max(0,g);var f=Math.floor(v/this.columnWidth);f-=v%this.columnWidth?0:1,f=Math.min(this.cols-1,f);for(var n=(this._getOption("originTop")?u.top:u.bottom)+o.outerHeight,i=g;i<=f;i++)this.colYs[i]=Math.max(n,this.colYs[i])},l._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var h={height:this.maxY};return this._getOption("fitWidth")&&(h.width=this._getContainerFitWidth()),h},l._getContainerFitWidth=function(){for(var h=0,o=this.cols;--o&&0===this.colYs[o];)h++;return(this.cols-h)*this.columnWidth-this.gutter},l.needsResizeLayout=function(){var h=this.containerWidth;return this.getContainerWidth(),h!=this.containerWidth},d}),function(r,a){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-modes/masonry",["../layout-mode","masonry-layout/masonry"],a):"object"==typeof module&&module.exports?module.exports=a(require("../layout-mode"),require("masonry-layout")):a(r.Isotope.LayoutMode,r.Masonry)}(window,function(r,a){"use strict";var d=r.create("masonry"),l=d.prototype,h={_getElementOffset:!0,layout:!0,_getMeasurement:!0};for(var o in a.prototype)h[o]||(l[o]=a.prototype[o]);var u=l.measureColumns;l.measureColumns=function(){this.items=this.isotope.filteredItems,u.call(this)};var c=l._getOption;return l._getOption=function(_){return"fitWidth"==_?void 0!==this.options.isFitWidth?this.options.isFitWidth:this.options.fitWidth:c.apply(this.isotope,arguments)},d}),function(r,a){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-modes/fit-rows",["../layout-mode"],a):"object"==typeof exports?module.exports=a(require("../layout-mode")):a(r.Isotope.LayoutMode)}(window,function(r){"use strict";var a=r.create("fitRows"),d=a.prototype;return d._resetLayout=function(){this.x=0,this.y=0,this.maxY=0,this._getMeasurement("gutter","outerWidth")},d._getItemLayoutPosition=function(l){l.getSize();var h=l.size.outerWidth+this.gutter;0!==this.x&&h+this.x>this.isotope.size.innerWidth+this.gutter&&(this.x=0,this.y=this.maxY);var u={x:this.x,y:this.y};return this.maxY=Math.max(this.maxY,this.y+l.size.outerHeight),this.x+=h,u},d._getContainerSize=function(){return{height:this.maxY}},a}),function(r,a){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-modes/vertical",["../layout-mode"],a):"object"==typeof module&&module.exports?module.exports=a(require("../layout-mode")):a(r.Isotope.LayoutMode)}(window,function(r){"use strict";var a=r.create("vertical",{horizontalAlignment:0}),d=a.prototype;return d._resetLayout=function(){this.y=0},d._getItemLayoutPosition=function(l){l.getSize();var h=(this.isotope.size.innerWidth-l.size.outerWidth)*this.options.horizontalAlignment,o=this.y;return this.y+=l.size.outerHeight,{x:h,y:o}},d._getContainerSize=function(){return{height:this.y}},a}),function(r,a){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","desandro-matches-selector/matches-selector","fizzy-ui-utils/utils","isotope-layout/js/item","isotope-layout/js/layout-mode","isotope-layout/js/layout-modes/masonry","isotope-layout/js/layout-modes/fit-rows","isotope-layout/js/layout-modes/vertical"],function(d,l,h,o,u,c){return a(r,d,0,h,o,u,c)}):"object"==typeof module&&module.exports?module.exports=a(r,require("outlayer"),require("get-size"),require("desandro-matches-selector"),require("fizzy-ui-utils"),require("isotope-layout/js/item"),require("isotope-layout/js/layout-mode"),require("isotope-layout/js/layout-modes/masonry"),require("isotope-layout/js/layout-modes/fit-rows"),require("isotope-layout/js/layout-modes/vertical")):r.Isotope=a(r,r.Outlayer,0,r.matchesSelector,r.fizzyUIUtils,r.Isotope.Item,r.Isotope.LayoutMode)}(window,function(r,a,d,l,h,o,u){var _=r.jQuery,v=String.prototype.trim?function(i){return i.trim()}:function(i){return i.replace(/^\s+|\s+$/g,"")},g=a.create("isotope",{layoutMode:"masonry",isJQueryFiltering:!0,sortAscending:!0});g.Item=o,g.LayoutMode=u;var f=g.prototype;f._create=function(){for(var i in this.itemGUID=0,this._sorters={},this._getSorters(),a.prototype._create.call(this),this.modes={},this.filteredItems=this.items,this.sortHistory=["original-order"],u.modes)this._initLayoutMode(i)},f.reloadItems=function(){this.itemGUID=0,a.prototype.reloadItems.call(this)},f._itemize=function(){for(var i=a.prototype._itemize.apply(this,arguments),t=0;t<i.length;t++){var e=i[t];e.id=this.itemGUID++}return this._updateItemsSortData(i),i},f._initLayoutMode=function(i){var t=u.modes[i],e=this.options[i]||{};this.options[i]=t.options?h.extend(t.options,e):e,this.modes[i]=new t(this)},f.layout=function(){return!this._isLayoutInited&&this._getOption("initLayout")?void this.arrange():void this._layout()},f._layout=function(){var i=this._getIsInstant();this._resetLayout(),this._manageStamps(),this.layoutItems(this.filteredItems,i),this._isLayoutInited=!0},f.arrange=function(i){this.option(i),this._getIsInstant();var t=this._filter(this.items);this.filteredItems=t.matches,this._bindArrangeComplete(),this._isInstant?this._noTransition(this._hideReveal,[t]):this._hideReveal(t),this._sort(),this._layout()},f._init=f.arrange,f._hideReveal=function(i){this.reveal(i.needReveal),this.hide(i.needHide)},f._getIsInstant=function(){var i=this._getOption("layoutInstant"),t=void 0!==i?i:!this._isLayoutInited;return this._isInstant=t,t},f._bindArrangeComplete=function(){function i(){t&&e&&s&&p.dispatchEvent("arrangeComplete",null,[p.filteredItems])}var t,e,s,p=this;this.once("layoutComplete",function(){t=!0,i()}),this.once("hideComplete",function(){e=!0,i()}),this.once("revealComplete",function(){s=!0,i()})},f._filter=function(i){for(var t=this.options.filter,e=[],s=[],p=[],y=this._getFilterTest(t=t||"*"),I=0;I<i.length;I++){var z=i[I];if(!z.isIgnored){var b=y(z);b&&e.push(z),b&&z.isHidden?s.push(z):b||z.isHidden||p.push(z)}}return{matches:e,needReveal:s,needHide:p}},f._getFilterTest=function(i){return _&&this.options.isJQueryFiltering?function(t){return _(t.element).is(i)}:"function"==typeof i?function(t){return i(t.element)}:function(t){return l(t.element,i)}},f.updateSortData=function(i){var t;i?(i=h.makeArray(i),t=this.getItems(i)):t=this.items,this._getSorters(),this._updateItemsSortData(t)},f._getSorters=function(){var i=this.options.getSortData;for(var t in i)this._sorters[t]=m(i[t])},f._updateItemsSortData=function(i){for(var t=i&&i.length,e=0;t&&e<t;e++)i[e].updateSortData()};var m=function i(e){if("string"!=typeof e)return e;var s=v(e).split(" "),p=s[0],y=p.match(/^\[(.+)\]$/),z=function t(e,s){return e?function(p){return p.getAttribute(e)}:function(p){var y=p.querySelector(s);return y&&y.textContent}}(y&&y[1],p),b=g.sortDataParsers[s[1]];return b?function(E){return E&&b(z(E))}:function(E){return E&&z(E)}};g.sortDataParsers={parseInt:function(i){return parseInt(i,10)},parseFloat:function(i){return parseFloat(i)}},f._sort=function(){if(this.options.sortBy){var i=h.makeArray(this.options.sortBy);this._getIsSameSortBy(i)||(this.sortHistory=i.concat(this.sortHistory));var t=function c(i,t){return function(e,s){for(var p=0;p<i.length;p++){var y=i[p],I=e.sortData[y],z=s.sortData[y];if(I>z||I<z)return(I>z?1:-1)*((void 0!==t[y]?t[y]:t)?1:-1)}return 0}}(this.sortHistory,this.options.sortAscending);this.filteredItems.sort(t)}},f._getIsSameSortBy=function(i){for(var t=0;t<i.length;t++)if(i[t]!=this.sortHistory[t])return!1;return!0},f._mode=function(){var i=this.options.layoutMode,t=this.modes[i];if(!t)throw new Error("No layout mode: "+i);return t.options=this.options[i],t},f._resetLayout=function(){a.prototype._resetLayout.call(this),this._mode()._resetLayout()},f._getItemLayoutPosition=function(i){return this._mode()._getItemLayoutPosition(i)},f._manageStamp=function(i){this._mode()._manageStamp(i)},f._getContainerSize=function(){return this._mode()._getContainerSize()},f.needsResizeLayout=function(){return this._mode().needsResizeLayout()},f.appended=function(i){var t=this.addItems(i);if(t.length){var e=this._filterRevealAdded(t);this.filteredItems=this.filteredItems.concat(e)}},f.prepended=function(i){var t=this._itemize(i);if(t.length){this._resetLayout(),this._manageStamps();var e=this._filterRevealAdded(t);this.layoutItems(this.filteredItems),this.filteredItems=e.concat(this.filteredItems),this.items=t.concat(this.items)}},f._filterRevealAdded=function(i){var t=this._filter(i);return this.hide(t.needHide),this.reveal(t.matches),this.layoutItems(t.matches,!0),t.matches},f.insert=function(i){var t=this.addItems(i);if(t.length){var e,p=t.length;for(e=0;e<p;e++)this.element.appendChild(t[e].element);var y=this._filter(t).matches;for(e=0;e<p;e++)t[e].isLayoutInstant=!0;for(this.arrange(),e=0;e<p;e++)delete t[e].isLayoutInstant;this.reveal(y)}};var n=f.remove;return f.remove=function(i){i=h.makeArray(i);var t=this.getItems(i);n.call(this,i);for(var e=t&&t.length,s=0;e&&s<e;s++)h.removeFrom(this.filteredItems,t[s])},f.shuffle=function(){for(var i=0;i<this.items.length;i++)this.items[i].sortData.random=Math.random();this.options.sortBy="random",this._sort(),this._layout()},f._noTransition=function(i,t){var e=this.options.transitionDuration;this.options.transitionDuration=0;var s=i.apply(this,t);return this.options.transitionDuration=e,s},f.getFilteredItemElements=function(){return this.filteredItems.map(function(i){return i.element})},g});