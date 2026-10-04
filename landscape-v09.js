'use strict';
// Keep guidance beside navigation so the stage occupies the full available height.
const sideTools=document.createElement('div');sideTools.className='side-tools';
$('chapters').after(sideTools);
for(const id of ['choices','tour-controls','next-cue','map-legend'])sideTools.append($(id));
$('navigation').append(document.querySelector('.bottom-bar'));
const archive=document.createElement('details');archive.innerHTML='<summary>О проекте и предыдущие версии</summary>';const sb=document.querySelector('.sidebar-bottom');sb.before(archive);archive.append(sb);
const originalMap9=map;
const svgNS='http://www.w3.org/2000/svg';
function svgFragment(markup){const g=document.createElementNS(svgNS,'g');g.innerHTML=markup;return g}
map=function(){originalMap9();const svg=$('map-host').querySelector('svg');if(!svg)return;
 svg.setAttribute('viewBox','25 55 975 560');
 if(!svg.querySelector('#fleet-path-2'))svg.querySelector('#fleet-vehicle-2')?.remove();
 // A paved apron anchors every illustration to the same terrain and road network.
 const road=svg.querySelector('g[stroke="#c2c5bb"]');
 const yards=locations.filter(o=>o.roadY!==null&&(activeScene().id!=='current'||o.id!=='receiving')).map(o=>{const p=dock(o.id);return `<rect x="${o.x+5}" y="${o.y+o.height-32}" width="${o.width-10}" height="85" rx="12" fill="#b8bbb0" stroke="#e1dfce" stroke-width="3"/><path d="M${o.x+22} ${o.y+o.height+43}h${o.width-44}" stroke="#f7efd7" stroke-width="2" stroke-dasharray="13 8"/>`}).join('');
 road.before(svgFragment(`<defs><linearGradient id="land9" x2=".7" y2="1"><stop stop-color="#bfc8ad"/><stop offset="1" stop-color="#d4d7bb"/></linearGradient><pattern id="grain9" width="11" height="13" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".7" fill="#69785b" opacity=".17"/><circle cx="8" cy="10" r=".5" fill="#fff" opacity=".4"/></pattern></defs><rect x="35" y="55" width="960" height="560" rx="22" fill="url(#land9)"/><rect x="35" y="55" width="960" height="560" rx="22" fill="url(#grain9)"/><path d="M205 80H985V610H205V335 M205 305V80" fill="none" stroke="#77856b" stroke-width="2" stroke-dasharray="3 5"/><path d="${SITE_LAYOUT.mainRoad}" fill="none" stroke="#e5dfc9" stroke-width="43" stroke-linejoin="round"/>${yards}`));
 road.setAttribute('stroke','#737c78');road.setAttribute('stroke-width','31');
 // Replace flat circles with a light, reusable painted landscape asset.
 const oldTrees=svg.querySelector('g[fill="#bdcfaf"]');if(oldTrees)oldTrees.remove();
 const first=svg.querySelector('.painted-building');
 first.before(svgFragment([[43,405,145],[39,490,125],[250,67,110],[520,120,96],[570,355,90],[805,65,150],[370,485,90]].map(([x,y,w])=>`<image href="assets/greenery-v09.webp" x="${x}" y="${y}" width="${w}" height="${w*.77}"/>`).join('')));
 if(activeScene().id==='current'){
   const future=svg.querySelector('[data-object="receiving"]');if(future)future.style.display='none';
 }
 if(activeScene().id==='reserve'){$('moving-vehicle').querySelector('image').setAttribute('href','assets/buildings/truck-red-map.webp')}
 if(activeScene().id==='reserve')svg.append(svgFragment('<g><rect x="270" y="92" width="430" height="36" rx="10" fill="#fff8e6"/><text x="485" y="116" text-anchor="middle" font-size="17" fill="#536c58">А-01 · объезд · исполнитель: водитель</text><circle cx="745" cy="395" r="18" fill="#af5942" stroke="#fff5dd" stroke-width="3"/><path d="M735 395h20" stroke="white" stroke-width="5"/><text x="715" y="432" text-anchor="end" font-size="16" fill="#7e3f30">Участок закрыт</text></g>'));
 if(activeScene().id==='quality')qualityScene(svg);
 if(activeScene().id==='handoff')handoffScene(svg);
 moveVehicle();
};
function qualityScene(svg){svg.innerHTML=`<defs><linearGradient id="floor9" x2="0" y2="1"><stop stop-color="#e2e4d4"/><stop offset="1" stop-color="#bbc4b3"/></linearGradient></defs><rect x="25" y="55" width="975" height="560" fill="url(#floor9)"/><image href="assets/buildings/warehouse-map.webp" x="590" y="95" width="340" height="250"/><path d="M70 500H945" stroke="#939e94" stroke-width="100"/><path d="M70 500H945" stroke="#ede5ca" stroke-width="2" stroke-dasharray="15 12"/><image id="quality-forklift" href="assets/forklift.webp" x="110" y="294" width="230" height="160"/><g id="quality-cargo"><rect x="325" y="365" width="115" height="74" rx="3" fill="#bd9160" stroke="#806044" stroke-width="3"/><path d="M330 382h104m-80-15v70m55-70v70" stroke="#e1ba80" stroke-width="5"/><rect x="367" y="389" width="35" height="24" fill="#faf6e4"/><text x="385" y="405" text-anchor="middle" font-size="13" fill="#334d41">А-01</text><path d="M315 445h137" stroke="#826744" stroke-width="10"/></g><text x="85" y="120" font-size="27" font-weight="650" fill="#304e43">Одна партия — одна история</text><text id="quality-status" x="85" y="166" font-size="20" fill="#6e704c">Приёмка и маркировка</text><g fill="#fffdf2" stroke="#9aa98f"><rect x="85" y="200" width="225" height="48" rx="9"/><rect x="340" y="200" width="225" height="48" rx="9"/></g><text x="198" y="231" text-anchor="middle" font-size="17">А-01 · тяжёлый ящик</text><text id="quality-badge" x="453" y="231" text-anchor="middle" font-size="17">Ожидает допуска</text><text x="80" y="581" font-size="16" fill="#465c4e">Маркировка → контроль качества → разрешение → адрес хранения</text>`}
function handoffScene(svg){svg.innerHTML=`<rect x="25" y="55" width="975" height="560" fill="#d6ddca"/><image href="assets/buildings/workshop-concrete-map.webp" x="600" y="70" width="350" height="320"/><path d="M50 495H950" stroke="#7c8780" stroke-width="110"/><path d="M50 520H950" stroke="#f4eacd" stroke-width="2" stroke-dasharray="17 14"/><image href="assets/truck.webp" x="90" y="290" width="310" height="190"/><rect x="655" y="371" width="300" height="78" fill="#90968a"/><path d="M655 371h300" stroke="#f3d175" stroke-width="8"/><path d="M513 450l90-35m-90 0l90 35" stroke="#697d70" stroke-width="8"/><rect id="lift9" x="495" y="415" width="130" height="12" rx="3" fill="#c59642"/><g id="lift-cargo9"><rect x="530" y="356" width="66" height="58" fill="#b78b59" stroke="#795b3c" stroke-width="3"/><path d="M546 358v53m35-53v53" stroke="#e4bc80" stroke-width="6"/></g><text x="85" y="120" font-size="27" font-weight="650" fill="#304e43">Машину и станцию выбирают вместе</text><text x="85" y="165" font-size="19" fill="#5e7160">Пример: низкая платформа + подъёмный стол</text><text x="805" y="415" text-anchor="middle" font-size="18" fill="#fffdf2">Высокий пол цеха</text><text x="80" y="581" font-size="16" fill="#465c4e">Альтернатива — кузов подходящей высоты и существующий док</text>`}
const originalMove9=moveVehicle;
moveVehicle=function(){originalMove9();const t=state.elapsed;
 if($('quality-cargo')){const admitted=t>=8;$('quality-status').textContent=t<4?'Приёмка: фиксируем партию и грузовое место':t<8?'Контроль: партия ожидает решения':'Допуск получен: назначаем место хранения';$('quality-badge').textContent=admitted?'Допущена · адрес С1-04':'Ожидает допуска';const x=Math.min(Math.max(t-9,0)/4,1)*270;$('quality-cargo').setAttribute('transform',`translate(${x} 0)`);$('quality-forklift').setAttribute('transform',`translate(${x} 0)`)}
 if($('lift9')){const y=-Math.min(Math.max(t-5,0)/5,1)*44;$('lift9').setAttribute('transform',`translate(0 ${y})`);$('lift-cargo9').setAttribute('transform',`translate(${Math.min(Math.max(t-11,0)/4,1)*170} ${y})`)}
};
render();$('welcome-map').innerHTML=$('map-host').innerHTML.replaceAll('tabindex="0"','').replaceAll('id="','data-preview-id="');
