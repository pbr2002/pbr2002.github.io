import * as THREE from 'three';
import {renderStaticGlobe} from './globe-fallback.js';
const canvas=document.querySelector('#globe');
const continents=[ [[-168,70],[-140,70],[-125,58],[-120,49],[-125,40],[-115,30],[-100,20],[-88,16],[-81,10],[-77,8],[-85,22],[-80,28],[-81,35],[-68,46],[-60,53],[-78,65],[-100,75]], [[-73,60],[-48,59],[-22,72],[-30,83],[-60,82]], [[-81,12],[-65,11],[-50,0],[-35,-8],[-42,-23],[-55,-40],[-68,-55],[-76,-41],[-72,-20],[-80,-3]], [[-17,36],[5,37],[20,33],[34,30],[42,12],[51,10],[41,-8],[34,-26],[19,-35],[11,-22],[9,-5],[-7,4],[-17,16]], [[-10,36],[-9,44],[0,48],[5,59],[18,71],[35,70],[40,60],[60,65],[90,75],[130,72],[178,62],[160,48],[140,43],[128,32],[120,22],[106,5],[98,7],[100,22],[87,21],[80,7],[70,24],[53,27],[42,40],[28,40],[22,36],[15,42],[5,43]], [[112,-11],[130,-11],[141,-16],[153,-26],[151,-38],[133,-39],[115,-34]], [[47,-13],[50,-16],[47,-26],[44,-23]], [[138,34],[142,42],[146,44],[144,35]], [[166,-34],[178,-38],[174,-45],[166,-47]], [[-9,50],[-4,59],[1,54]], [[95,5],[110,0],[120,-5],[135,-5],[140,-9],[116,-9],[103,-5]], [[119,18],[125,18],[127,6],[121,5]] ];
const inside=(x,y,polygon)=>{let c=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const a=polygon[i],b=polygon[j];if(((a[1]>y)!==(b[1]>y))&&(x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]))c=!c}return c};
const point=(lat,lon,r=1)=>{const phi=(90-lat)*Math.PI/180,theta=(lon+180)*Math.PI/180;return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(theta))};
function initGlobe(){
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let reduced=preference.matches;
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.z=3.7;
 const globe=new THREE.Group();scene.add(globe);globe.rotation.z=-.18;globe.rotation.y=2.9;
 const sphere=new THREE.Mesh(new THREE.SphereGeometry(.984,40,40),new THREE.MeshBasicMaterial({color:0x080a20}));globe.add(sphere);
 const land=[],ocean=[];for(let lat=-76;lat<=80;lat+=2.2){const step=2.2/Math.max(.2,Math.cos(lat*Math.PI/180));for(let lon=-180;lon<180;lon+=step){const p=point(lat,lon);(continents.some(poly=>inside(lon,lat,poly))?land:ocean).push(p.x,p.y,p.z)}}
 const addPoints=(data,color,size,opacity)=>{const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(data,3));globe.add(new THREE.Points(geo,new THREE.PointsMaterial({color,size,transparent:true,opacity,sizeAttenuation:true})));};addPoints(land,0xc3a5f4,.012,.9);addPoints(ocean,0x686087,.006,.32);
 const wire=new THREE.Mesh(new THREE.SphereGeometry(1.005,24,14),new THREE.MeshBasicMaterial({color:0x8f71bf,wireframe:true,transparent:true,opacity:.055}));globe.add(wire);
 const addMarker=(lat,lon,color,size)=>{const place=point(lat,lon,1.018);const marker=new THREE.Mesh(new THREE.SphereGeometry(size,10,10),new THREE.MeshBasicMaterial({color}));marker.position.copy(place);globe.add(marker);const halo=new THREE.Mesh(new THREE.RingGeometry(.03,.036,32),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide,transparent:true,opacity:.8}));halo.position.copy(point(lat,lon,1.025));halo.lookAt(place.clone().multiplyScalar(2));globe.add(halo);return halo};
 // Approximate Yangling area marker; it does not pinpoint a campus address.
 const yanglingHalo=addMarker(34.30,108.08,0x9fd4ff,.016);const sydneyHalo=addMarker(-33.87,151.21,0xe9d4ff,.018);const halos=[{mesh:yanglingHalo,phase:.8},{mesh:sydneyHalo,phase:0}];
 let dragging=false,lastX=0,lastY=0,visible=false,frame=0,last=0;
 canvas.dataset.mode='webgl';
 canvas.tabIndex=0;
 function render(){renderer.render(scene,camera)}
 function animate(t){frame=0;if(!visible||document.hidden||reduced)return;const dt=last?Math.min((t-last)/1000,.04):0;last=t;if(!dragging)globe.rotation.y+=dt*.085;halos.forEach(({mesh,phase})=>mesh.scale.setScalar(1+Math.sin(t*.002+phase)*.18));render();frame=requestAnimationFrame(animate)}
 function sync(){cancelAnimationFrame(frame);frame=0;last=0;canvas.dataset.motion=reduced?'reduced':'animated';halos.forEach(({mesh})=>mesh.scale.setScalar(1));if(visible&&!document.hidden){render();if(!reduced)frame=requestAnimationFrame(animate)}}
 function resize(){const {width,height}=canvas.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();if(visible&&!document.hidden)render()}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);resize();
 canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener('pointermove',e=>{if(!dragging)return;globe.rotation.y+=(e.clientX-lastX)*.006;globe.rotation.x=THREE.MathUtils.clamp(globe.rotation.x+(e.clientY-lastY)*.003,-.6,.6);lastX=e.clientX;lastY=e.clientY;render()});
 const release=()=>dragging=false;canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();globe.rotation.y+=e.key==='ArrowLeft'?-.12:e.key==='ArrowRight'?.12:0;globe.rotation.x=THREE.MathUtils.clamp(globe.rotation.x+(e.key==='ArrowUp'?-.08:e.key==='ArrowDown'?.08:0),-.6,.6);render()});
 const visibilityObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()});visibilityObserver.observe(canvas);
 const onPreference=e=>{reduced=e.matches;sync()};preference.addEventListener('change',onPreference);document.addEventListener('visibilitychange',sync);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);visibilityObserver.disconnect();resizeObserver.disconnect();preference.removeEventListener('change',onPreference);document.removeEventListener('visibilitychange',sync);renderStaticGlobe(canvas)},{once:true});
}
try{initGlobe()}catch{renderStaticGlobe(canvas)}
