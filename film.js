/* Shared deterministic film renderer: browser playback and MP4 export. */
(function(root){
const duration=44,starts=[0,8,18,26,36];
const titles=['Груз готовят к поездке','Между зданиями — по улице','У цеха груз передают дальше','Внутри работает складской робот','Комплект доставлен к линии'];
const captions=['Приёмка, проверка и погрузка — отдельный этап.','Уличная машина перевозит груз по территории завода.','Уличная техника остаётся снаружи.','Робот везёт груз на транспортировочном столике.','Дальше коробки подаёт оператор или отдельная станция.'];
const crop={truck:[.085,.084,.826,.854],tug:[.014,.158,.975,.666],forklift:[.072,.107,.873,.825],robot:[.044,.025,.914,.949]};
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const ease=v=>{v=clamp(v);return v*v*(3-2*v)};
function chapter(t){let i=0;for(let n=1;n<starts.length;n++)if(t>=starts[n])i=n;return i;}
function rounded(c,x,y,w,h,r,fill){c.fillStyle=fill;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
function text(c,s,x,y,size,color='#fff',weight=500){c.fillStyle=color;c.font=`${weight} ${size}px "Segoe UI", Arial, sans-serif`;c.fillText(s,x,y);}
function shadow(c,x,y,w){c.save();c.fillStyle='rgba(32,39,31,.17)';c.beginPath();c.ellipse(x+w/2,y+2,w*.42,10,0,0,Math.PI*2);c.fill();c.restore();}
function sprite(c,assets,name,x,ground,w,flip=false,alpha=1){let img=assets[name],r=crop[name]||[0,0,1,1];const sx=r[0]*img.width,sy=r[1]*img.height,sw=r[2]*img.width,sh=r[3]*img.height,h=w*sh/sw;c.save();c.globalAlpha=alpha;shadow(c,x,ground,w);if(flip){c.translate(x+w,ground-h);c.scale(-1,1);c.drawImage(img,sx,sy,sw,sh,0,0,w,h);}else c.drawImage(img,sx,sy,sw,sh,x,ground-h,w,h);c.restore();return h;}
function pallet(c,x,y,w=100){c.save();c.translate(x,y);c.strokeStyle='#715b3b';c.lineWidth=2;rounded(c,0,-54,w,54,3,'#c89b61');c.strokeRect(0,-54,w,54);c.fillStyle='#e1b980';c.fillRect(w*.43,-54,w*.12,54);c.fillStyle='#f5e4bd';c.fillRect(8,-40,21,16);c.fillStyle='#6b6754';for(let i=0;i<6;i++)c.fillRect(11+i*2.5,-38,1,12);c.fillStyle='#957047';c.fillRect(-5,1,w+10,7);c.fillRect(0,8,10,7);c.fillRect(w-10,8,10,7);c.restore();}
function badge(c,label,x,y){c.font='600 16px "Segoe UI", Arial';const w=c.measureText(label).width+30;rounded(c,x,y,w,32,9,'rgba(255,253,241,.93)');text(c,label,x+15,y+22,16,'#425441',600);}
function paint(c,assets,t,variant='truck'){
 t=clamp(t,0,duration);const ch=chapter(t),q=t-starts[ch],tug=variant==='tug';c.clearRect(0,0,1280,720);
 c.drawImage(ch<3?assets.yard:assets.hall,0,0,1280,720);
 // Each shot uses the same geography. Scene cuts separate handling operations.
 if(ch===0){
  badge(c,'Приёмка',140,318);
  const vx=tug?570:620,vw=tug?560:400;sprite(c,assets,variant,vx,573,vw);
  const fx=-220+530*ease(q/5.8);sprite(c,assets,'forklift',fx,600,280);pallet(c,fx+194,579,88);
  if(q>5.7)badge(c,'Груз проверен',fx+100,345);
 }else if(ch===1){
  const w=tug?660:450,x=120+650*ease(q/8.5);sprite(c,assets,variant,x,574,w);
  badge(c,'Склад',565,308);badge(c,'Цех',1050,308);
 }else if(ch===2){
  badge(c,'Площадка передачи у цеха',770,320);
  sprite(c,assets,variant,tug?540:745,553,tug?650:410);
  // Cut-in: a pallet has been unloaded. Forklift brings it to the transfer point.
  const fx=530-300*ease(q/6);sprite(c,assets,'forklift',fx,609,300,true);pallet(c,fx+7,586,93);
  if(q>5.1)badge(c,'Передача подтверждена',300,365);
 }else if(ch===3){
  const x=-300+910*ease(q/8.2);sprite(c,assets,'robot',x,568,320);
  badge(c,'Внутренний маршрут',360,280);
 }else{
  sprite(c,assets,'robot',610,568,320);
  badge(c,'Буфер у линии',620,285);
  // Subtle ready indicator, no fictional autonomous unloading.
  c.fillStyle='#91bd83';c.beginPath();c.arc(954,326,7+Math.sin(q*2)*1.2,0,Math.PI*2);c.fill();
  if(q>2){rounded(c,60,440,410,90,16,'rgba(253,250,237,.94)');text(c,'Доставка завершена',84,476,25,'#365540',600);text(c,'Партия сохранена в учёте',84,508,18,'#6d7e66',400);}
 }
 // Soft cuts keep loading and unloading montage explicit instead of inventing mechanics.
 let fade=0;for(const at of starts.slice(1))fade=Math.max(fade,clamp(1-Math.abs(t-at)/.38));
 if(fade>0){c.fillStyle=`rgba(244,242,227,${fade})`;c.fillRect(0,0,1280,630);}
 const g=c.createLinearGradient(0,0,0,130);g.addColorStop(0,'rgba(32,44,35,.62)');g.addColorStop(1,'rgba(32,44,35,0)');c.fillStyle=g;c.fillRect(0,0,1280,130);
 text(c,'ОТ ПРИЁМКИ ДО ЦЕХА',32,40,16,'#fff8e7',600);text(c,tug?'ТЯГАЧ С ТЕЛЕЖКАМИ':'КРЫТЫЙ ГРУЗОВИК',32,69,13,'#f0eddc',500);
 rounded(c,1138,23,109,38,19,'rgba(255,250,230,.88)');text(c,`${ch+1} / 5`,1171,49,19,'#3e513c',600);
 c.fillStyle='rgba(36,49,39,.94)';c.fillRect(0,630,1280,90);
 text(c,titles[ch],32,663,26,'#fff8e9',600);text(c,captions[ch],32,694,18,'#d3dfc9',400);
 c.fillStyle='#bc995e';c.fillRect(0,716,1280*t/duration,4);
}
const api={paint,chapter,duration,starts,titles,captions};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LogisticsFilm=api;
})(typeof globalThis!=='undefined'?globalThis:this);
