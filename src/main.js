import {localized} from './i18n.js';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {renderStaticGlobe} from './globe-fallback.js';
const globeURL=new URL('./globe.js',document.currentScript.src).href;
gsap.registerPlugin(ScrollTrigger);
document.addEventListener('languagechange',()=>requestAnimationFrame(()=>ScrollTrigger.refresh()));
const motion=gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)',()=>{
 gsap.from('.hero-intro',{opacity:0,y:12,duration:1,delay:.1});
 gsap.from('.word',{opacity:0,y:30,filter:'blur(8px)',duration:1.15,stagger:.18,delay:.25,ease:'power3.out'});
 gsap.from('.hero-description, .hero-content .button',{opacity:0,y:18,duration:.9,stagger:.15,delay:1});
 document.querySelectorAll('.reveal').forEach(el=>gsap.from(el,{opacity:0,y:28,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
});
document.querySelectorAll('.card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${e.clientX-r.left}px`);card.style.setProperty('--my',`${e.clientY-r.top}px`)}));
const sections=document.querySelectorAll('main>section[id]');
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.hash===`#${entry.target.id}`))}},{rootMargin:'-20% 0px -55% 0px'});sections.forEach(s=>observer.observe(s));
document.querySelector('#year').textContent=new Date().getFullYear();
let toastTimer;
const toast=message=>{const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3500)};
document.querySelector('#copy-email').addEventListener('click',async()=>{try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText('pbr130922@gmail.com');else{const field=document.createElement('textarea');field.value='pbr130922@gmail.com';field.style.cssText='position:fixed;opacity:0';document.body.append(field);field.select();const ok=document.execCommand('copy');field.remove();if(!ok)throw new Error('copy failed')}toast(localized('邮箱已复制，期待与你交流。','Email copied. Let’s connect.'))}catch{toast(localized('请长按或选择邮箱复制：pbr130922@gmail.com','Select and copy: pbr130922@gmail.com'))}});

// Load the 3D engine only when its canvas approaches the visible area.
const canvas=document.querySelector('#globe');
const loadObserver=new IntersectionObserver(entries=>{if(!entries.some(entry=>entry.isIntersecting))return;loadObserver.disconnect();const script=document.createElement('script');script.src=globeURL;script.onerror=()=>renderStaticGlobe(canvas);document.head.append(script)},{rootMargin:'0px'});
loadObserver.observe(canvas);
