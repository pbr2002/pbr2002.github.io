// A useful static alternative when the 3D engine or WebGL is unavailable.
export function renderStaticGlobe(canvas){
 if(!canvas.isConnected)return;
 const ns='http://www.w3.org/2000/svg';
 const svg=document.createElementNS(ns,'svg');
 svg.id='globe';svg.dataset.mode='fallback';svg.setAttribute('viewBox','0 0 600 600');svg.setAttribute('role','img');
 svg.style.cssText='width:100%;height:100%';
 svg.innerHTML='<circle cx="300" cy="300" r="210" fill="#080a20" stroke="#77608f"/><ellipse cx="300" cy="300" rx="210" ry="75" fill="none" stroke="#77608f"/><ellipse cx="300" cy="300" rx="100" ry="210" fill="none" stroke="#77608f"/>';
 for(const [lat,lon,color,name] of [[34.30,108.08,'#9fd4ff','Yangling'],[-33.87,151.21,'#e9d4ff','Sydney']]){
  const x=300+210*Math.cos(lat*Math.PI/180)*Math.sin((lon-130)*Math.PI/180),y=300-210*Math.sin(lat*Math.PI/180);
  const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r','6');dot.setAttribute('fill',color);svg.append(dot);
  const label=document.createElementNS(ns,'text');label.setAttribute('x',x+13);label.setAttribute('y',y+5);label.setAttribute('fill',color);label.setAttribute('font-size','17');label.textContent=name;svg.append(label);
 }
 canvas.replaceWith(svg);
 const hint=document.querySelector('.globe-hint');
 // Replace the node so the original i18n text-node registry cannot restore the drag hint.
 const newHint=hint.cloneNode(false);hint.replaceWith(newHint);
 function translate(){const en=document.documentElement.lang==='en';svg.setAttribute('aria-label',en?'Static study locations: Yangling and Sydney':'静态学习地点示意图：杨凌与悉尼');newHint.textContent=en?'Static view · Yangling and Sydney':'静态视图 · 杨凌与悉尼';svg.querySelectorAll('text').forEach((label,index)=>label.textContent=(en?['Yangling','Sydney']:['杨凌','悉尼'])[index])}
 translate();document.addEventListener('languagechange',translate);
}
