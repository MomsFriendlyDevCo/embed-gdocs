function a(s,n){let e={id:"embed-"+Math.floor(9999999*Math.random()),cssSelector:null,keepStyle:!0,fixContentTrim:!0,fixWidth:!0,fixTableWidth:!0,fixPadding:!0,fixLinkTargets:!0,fixLinkShorten:!0,fixImageTitleAsLink:!0,createElement(t){return document.createElement(t)},onLoad:t=>t,onMount:t=>null,...n};e.cssSelector||(e.cssSelector="#"+e.id);let l=[],r=e.createElement("div");r.innerHTML=s;let i=e.fixContentTrim&&r.querySelector(".doc-content")||r;if(e.keepStyle){let t=r.querySelector('style[type="text/css"]');i.prepend(t)}if((e.fixWidth||e.fixPadding)&&i.setAttribute("style",[e.fixWidth&&"max-width: none",e.fixPadding&&"padding: 0 20px"].filter(Boolean).join(`;
`)),e.fixTableWidth&&l.push(`${e.cssSelector} table { max-width: none !important; padding: 1.5rem 0 }`,`${e.cssSelector} table td:last-child { width: auto !important }`),e.fixParaMargins&&l.push(`${e.cssSelector} p { margin-bottom: 1rem }`),(e.fixLinkTargets||e.fixLinkShorten)&&Array.from(i.querySelectorAll("a")).filter(t=>/^https?:\/\//.test(t.getAttribute("href"))).forEach(t=>{e.fixLinkTargets&&t.setAttribute("target","_blank"),e.fixLinkShorten&&t.setAttribute("href",t.getAttribute("href").replace(/^https:\/\/www\.google\.com\/url\?q=(.*?)&.*$/,"$1").replace(/^https:\/\/www\.google\.com\/url\?q=/,"").replace(/^(.+)$/,o=>unescape(o)))}),e.fixImageTitleAsLink&&Array.from(i.querySelectorAll("img[title]")).filter(t=>/^https?:\/\//.test(t.getAttribute("title"))).forEach(t=>{let o=e.createElement("a");o.setAttribute("href",t.getAttribute("title")),e.fixLinkTargets&&o.setAttribute("target","_blank"),t.replaceWith(o),o.replaceChildren(t)}),l.length>0){let t=e.createElement("style");t.setAttribute("type","text/css"),t.innerHTML=`/* Impored Styles */
`+l.join(`
`),i.prepend(t)}return e.onMount(i),i}function c(s){let n={selector:null,url:null,urlOptions:{cache:"default",headers:{Accept:"text/html"}},fetcher(r){return fetch(r.url,r.options).then(i=>i.text())},keepStyle:!0,fixContentTrim:!0,fixWidth:!0,fixTableWidth:!0,fixPadding:!0,fixLinkTargets:!0,fixLinkShorten:!0,fixImageTitleAsLink:!0,onLoad:r=>r,onMount:r=>null,...s},e=(r,i)=>r.setHTML?r.setHTML(i):r.innerHTML=i;if(!n.selector)throw new Error("Selector must be specified");if(!n.url)throw new Error("URL must be specified");let l=typeof n.selector=="string"?document.querySelector(n.selector):n.selector;if(!l)throw new Error(`Cannot find selector "${n.selector} to embed GDoc`);return Promise.resolve().then(()=>n.fetcher(n)).then(r=>n.onLoad(r)).then(r=>a(r,s)).then(r=>l.replaceChildren(r))}export{c as default};
//# sourceMappingURL=embed-gdocs.js.map
