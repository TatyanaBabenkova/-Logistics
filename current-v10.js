'use strict';
// Illustrative capacity: five arrivals, one active unloading crew, one admitted truck.
// These counts explain the constraint; they are not measured factory data.
const current10=()=>state.tab==='process'&&activeScene().id==='current';
const oldMap10=map,oldMove10=moveVehicle,oldDuration10=duration;
const stops10=[{x:600,y:260,name:'Склад № 1'},{x:875,y:260,name:'Склад № 2'},{x:875,y:510,name:'Склад № 3'}];
const clamp10=x=>Math.max(0,Math.min(1,x));
function route10(i){const p=stops10[i];return `M260 365H475H${p.x}V${p.y+55}`}
function sprite10(id,asset,w=100,h=65){return `<g id="${id}"><image href="${asset}" x="${-w/2}" y="${-h+14}" width="${w}" height="${h}"/></g>`}
map=function(){if(!current10()){oldMap10();return}
 $('map-host').innerHTML=`<svg viewBox="0 0 1100 650" role="group" aria-label="Очередь перед въездом и одна разгрузочная бригада на три склада"><defs><linearGradient id="ground10" x2="0" y2="1"><stop stop-color="#dce2cb"/><stop offset="1" stop-color="#bdc8ae"/></linearGradient></defs><rect width="1100" height="650" fill="url(#ground10)"/><rect x="20" y="70" width="300" height="545" rx="20" fill="#d5d4bf"/><text x="40" y="104" font-size="18" fill="#425c4a" font-weight="650">Ожидание перед въездом</text><text id="queue-count10" x="40" y="134" font-size="18" fill="#6d7058"/><path d="M325 65V332M325 398V620" stroke="#74846d" stroke-width="6" stroke-dasharray="5 5"/><text x="390" y="86" font-size="20" letter-spacing="2" fill="#526d57">ТЕРРИТОРИЯ ПРЕДПРИЯТИЯ</text><path d="M50 365H1000M475 365V575H1000M600 365V240M875 240V535" fill="none" stroke="#e9e0c8" stroke-width="48" stroke-linejoin="round"/><path d="M50 365H1000M475 365V575H1000M600 365V240M875 240V535" fill="none" stroke="#77817b" stroke-width="36" stroke-linejoin="round"/><path d="M50 365H1000M475 365V575H1000" fill="none" stroke="#f9efd3" stroke-width="2" stroke-dasharray="13 12"/>
 ${stops10.map((p,i)=>`<g class="site-object" data-object="warehouse${i+1}" tabindex="0" role="button" aria-label="${p.name}"><rect class="halo" x="${p.x-115}" y="${p.y-155}" width="230" height="195" rx="10"/><rect x="${p.x-110}" y="${p.y-40}" width="220" height="83" rx="10" fill="#aeb5a8" stroke="#e9dfc7" stroke-width="3"/><image href="assets/buildings/${i===1?'warehouse-metal':'warehouse'}-map.webp" x="${p.x-118}" y="${p.y-160}" width="236" height="155"/><rect x="${p.x-87}" y="${p.y-6}" width="174" height="27" rx="7" fill="#fff8e9"/><text x="${p.x}" y="${p.y+14}" text-anchor="middle" font-size="19" font-weight="650" fill="#355849">${p.name}</text><rect x="${p.x-118}" y="${p.y+80}" width="236" height="25" rx="5" fill="#f5f1de"/><text id="dock-status10-${i}" x="${p.x}" y="${p.y+98}" text-anchor="middle" font-size="16" fill="#556347"/></g>`).join('')}
 <image href="assets/greenery-v09.webp" x="370" y="120" width="115" height="100"/><image href="assets/greenery-v09.webp" x="360" y="440" width="100" height="95"/><image href="assets/greenery-v09.webp" x="975" y="405" width="110" height="100"/>
 ${stops10.map((_,i)=>`<path id="truck-route10-${i}" d="${route10(i)}" fill="none" stroke="none"/>`).join('')}
 <path id="crew-route10" fill="none" stroke="none"/>
 ${Array.from({length:5},(_,i)=>sprite10('queue10-'+i,i%2?'assets/semiBlue.webp':'assets/buildings/truck-red-map.webp',126,76)).join('')}
 ${sprite10('truck10','assets/semiRed.webp',132,76)}
 <g id="crew10"><image href="assets/crew-v10.webp" x="-63" y="-83" width="96" height="92"/><image href="assets/forklift.webp" x="17" y="-59" width="80" height="66"/></g>
 <g id="cargo10"><rect x="-13" y="-25" width="26" height="25" fill="#bb8b52" stroke="#7e623e" stroke-width="2"/><path d="M-6-23V-2M6-23V-2" stroke="#e0b471" stroke-width="3"/></g>
 <rect x="318" y="326" width="14" height="18" fill="#697961"/><path id="barrier10" d="M326 336V392" stroke="#fff7df" stroke-width="8"/><path id="barrier-stripe10" d="M326 336V392" stroke="#b75f49" stroke-width="8" stroke-dasharray="9 9"/><circle id="gate-light10" cx="347" cy="323" r="9" fill="#b95c45"/>
 <rect x="360" y="10" width="718" height="46" rx="12" fill="#fff8e9"/><text id="phase10" x="380" y="40" font-size="21" font-weight="650" fill="#385644"/>
 <text x="40" y="635" font-size="15" fill="#52664d">Пример: 5 фур · 1 бригада · допуск по одной. Численность и время условны.</text></svg>`;moveVehicle();};
duration=function(){return current10()&&!state.selected?Math.max(66,oldDuration10()):oldDuration10()};
moveVehicle=function(){if(!current10()||!$('truck10')){oldMove10();return}const t=Math.min(state.elapsed,65.99),cycle=Math.min(2,Math.floor(t/22)),u=t-cycle*22,p=stops10[cycle];
 const stage=u<3?0:u<7?1:u<11?2:u<16?3:4;
 $('phase10').textContent=[`Очередь ждёт: готовим ${p.name.toLowerCase()}`,`Разрешение на въезд → ${p.name}`,`Бригада направляется к месту разгрузки`,`Разгрузка · остальные фуры ждут`,`Фура выезжает · затем пропустят следующую`][stage];
 const released=cycle+(u>=3?1:0);$('queue-count10').textContent=`Перед воротами: ${5-released} · внутри: ${u>=3&&u<21?1:0}`;
 for(let i=0;i<5;i++){const q=$('queue10-'+i);q.style.display=i<released?'none':'';const k=i-released;const x=k%2?220:92,y=210+Math.floor(k/2)*78;q.setAttribute('transform',`translate(${x} ${y})`)}
 const truck=$('truck10');truck.style.display=u<3||u>=21?'none':'';const path=$('truck-route10-'+cycle),length=path.getTotalLength();const f=u<7?clamp10((u-3)/4):u<16?1:1-clamp10((u-16)/5);const pos=path.getPointAtLength(f*length);truck.setAttribute('transform',`translate(${pos.x} ${pos.y}) scale(${u>=16?-1:1} 1)`);
 const prev=cycle?stops10[cycle-1]:{x:470,y:535};const cp=$('crew-route10');cp.setAttribute('d',`M${prev.x-85} ${prev.y+55}V365H${p.x-85}V${p.y+55}`);const c=cp.getPointAtLength(clamp10((u-7)/4)*cp.getTotalLength());$('crew10').setAttribute('transform',`translate(${c.x} ${c.y})`);
 const unloading=u>=11&&u<16,pass=(u-11)%1.25/1.25;$('cargo10').style.display=unloading?'':'none';$('cargo10').setAttribute('transform',`translate(${p.x-12-pass*55} ${p.y+20-pass*24})`);
 for(let i=0;i<3;i++)$('dock-status10-'+i).textContent=i===cycle?(stage<2?'Ожидает фуру':stage===2?'Ожидает бригаду':stage===3?'Идёт разгрузка':'Разгрузка завершена'):i<cycle?'Фура обслужена':'Бригада на другом складе';
 const open=u>=3&&u<7||u>=16&&u<21;for(const id of ['barrier10','barrier-stripe10'])$(id).setAttribute('d',open?'M326 336L350 291':'M326 336V392');$('gate-light10').setAttribute('fill',open?'#64905a':'#b95c45');
};
const currentContent10=D.process.find(x=>x.id==='current');Object.assign(currentContent10,{title:'Фур много — бригада одна',lead:'Перед въездом образуется очередь. Допуск на территорию ограничен: следующую фуру направляют к складу после освобождения места.',points:['Фуры поставщиков едут только к складам.','Бригада с погрузчиком обслуживает точки по очереди.','Ожидание возникает и у ворот, и у склада.','Переезд бригады тоже занимает время.'],note:'Здесь показаны 5 фур и 1 бригада для объяснения. Фактический лимит въезда, число бригад и порядок допуска нужно уточнить.'});
render();
