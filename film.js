/* Shared deterministic film renderer: browser playback and MP4 export. */
(function(root){
const duration=136,starts=[0,12,22,36,46,60,72,84,94,106,116,126];
const titles=['Фуры поставщиков приезжают на завод','Ожидание и вызов на разгрузку','Разгрузка фуры у въезда','Приёмка и учёт партии','Два способа передать груз дальше','Внутренняя машина едет на склад','Размещение на складе','Склад собирает заказ для цеха','Со склада в цех — по улице','Передача у входа в цех','Робот доставляет комплект к линии','Весь путь партии прослеживается'];
const captions=['Внешняя доставка: фуры с кабинами в стилистике КАМАЗа.','Машины ждут на площадке; диспетчер назначает свободный пост.','Погрузчик забирает паллеты. Фура остаётся в зоне приёмки.','Проверяют количество и состояние, фиксируют партию и срок годности.','Выбранный сценарий определяет, нужен ли промежуточный запас.','Крытый грузовик развозит принятые партии по складам завода.','Паллету принимают на складе и присваивают место хранения.','По заявке производства подбирают нужную партию и количество.','Тягач с тележками везёт подготовленный комплект к цеху.','Груз передают на внутренний транспорт в оборудованной зоне.','Внутри здания работает отдельный складской робот.','Фура → приёмка → склад → цех → производственная линия.'];
const crop={semiRed:[.017,.065,.973,.88],semiBlue:[.015,.08,.978,.82],truck:[.085,.084,.826,.854],tug:[.014,.158,.975,.666],forklift:[.072,.107,.873,.825],robot:[.044,.025,.914,.949]};
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const ease=v=>{v=clamp(v);return v*v*(3-2*v)};
function chapter(t){let i=0;for(let n=1;n<starts.length;n++)if(t>=starts[n])i=n;return i;}
function rounded(c,x,y,w,h,r,fill){c.fillStyle=fill;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
function text(c,s,x,y,size,color='#fff',weight=500){c.fillStyle=color;c.font=`${weight} ${size}px "Segoe UI", Arial, sans-serif`;c.fillText(s,x,y);}
function shadow(c,x,y,w){c.save();c.fillStyle='rgba(32,39,31,.17)';c.beginPath();c.ellipse(x+w/2,y+2,w*.42,10,0,0,Math.PI*2);c.fill();c.restore();}
function sprite(c,assets,name,x,ground,w,flip=false,alpha=1){let img=assets[name],r=crop[name]||[0,0,1,1];const sx=r[0]*img.width,sy=r[1]*img.height,sw=r[2]*img.width,sh=r[3]*img.height,h=w*sh/sw;c.save();c.globalAlpha=alpha;shadow(c,x,ground,w);if(flip){c.translate(x+w,ground-h);c.scale(-1,1);c.drawImage(img,sx,sy,sw,sh,0,0,w,h);}else c.drawImage(img,sx,sy,sw,sh,x,ground-h,w,h);c.restore();return h;}
function pallet(c,x,y,w=100){c.save();c.translate(x,y);c.strokeStyle='#715b3b';c.lineWidth=2;rounded(c,0,-54,w,54,3,'#c89b61');c.strokeRect(0,-54,w,54);c.fillStyle='#e1b980';c.fillRect(w*.43,-54,w*.12,54);c.fillStyle='#f5e4bd';c.fillRect(8,-40,21,16);c.fillStyle='#6b6754';for(let i=0;i<6;i++)c.fillRect(11+i*2.5,-38,1,12);c.fillStyle='#957047';c.fillRect(-5,1,w+10,7);c.fillRect(0,8,10,7);c.fillRect(w-10,8,10,7);c.restore();}
function badge(c,label,x,y){c.font='600 16px "Segoe UI", Arial';const w=c.measureText(label).width+30;rounded(c,x,y,w,32,9,'rgba(255,253,241,.93)');text(c,label,x+15,y+22,16,'#425441',600);}
function forklift(c,a,x,y,flip=false,load=true){sprite(c,a,'forklift',x,y,270,flip);if(load)pallet(c,x+(flip?5:189),y-22,80);}
function batch(c,x,y,w=85){pallet(c,x,y,w);badge(c,'Партия А',x,y-65);}
function paint(c,a,t,variant='buffer'){
 t=clamp(t,0,duration);const ch=chapter(t),q=t-starts[ch],direct=variant==='direct';c.clearRect(0,0,1280,720);
 const bg=ch<5?'receiving':ch===6||ch===7?'warehouse':ch>=10?'hall':'yard';
 c.drawImage(a[bg],0,0,1280,720);
 if(ch===0){
  badge(c,'Въезд на предприятие',55,290);
  sprite(c,a,'semiBlue',-480+590*ease(q/10),458,490);
  sprite(c,a,'semiRed',-730+1060*ease(q/10),595,820);
 }else if(ch===1){
  sprite(c,a,'semiBlue',65,458,490);sprite(c,a,'semiRed',330+560*ease((q-5)/5),595,820);
  badge(c,'Площадка ожидания',70,260);badge(c,q<5?'Пост готовится':'Вызов на свободный пост',740,260);
 }else if(ch===2){
  sprite(c,a,'semiRed',180,478,880);
  // Open side curtain is drawn as a native animation element; cargo is visible inside.
  rounded(c,240,285,335,129,2,'#554e42');
  for(let i=0;i<3;i++)if(i>0||q<4)pallet(c,260+i*100,393,80);
  const x=270+400*ease((q-3)/8);forklift(c,a,x,600,false,q>=3);
  if(q>=11)badge(c,'На контроль приёмки',820,450);
 }else if(ch===3){
  batch(c,500,545,145);forklift(c,a,170,580,false,false);
  const checks=['Количество и состояние','Партия и срок годности','Маркировка и назначение'];
  checks.forEach((v,i)=>{if(q>i*2)badge(c,'✓ '+v,750,350+i*48)});
  if(q>7)badge(c,'Принято • склад № 1',480,335);
 }else if(ch===4){
  if(!direct){
   badge(c,'Промежуточный пункт приёмки',390,275);
   for(let i=0;i<3;i++)batch(c,390+i*135,440,85);
   sprite(c,a,'truck',850,588,350);
   const x=250+350*ease(q/10);forklift(c,a,x,602,false,true);
   badge(c,'Фура освобождена',60,355);
  }else{
   sprite(c,a,'semiRed',45,465,690);sprite(c,a,'truck',850,585,350);
   const x=250+350*ease(q/10);forklift(c,a,x,602,false,true);
   badge(c,'Из фуры — во внутреннюю машину',340,255);
   badge(c,'Обе машины готовы одновременно',390,302);
  }
 }else if(ch===5){
  badge(c,'Приёмка',90,315);badge(c,'Склад № 1',590,315);badge(c,'Склад № 2',1010,315);
  sprite(c,a,'truck',-380+970*ease(q/10),584,440);
 }else if(ch===6){
  const x=-240+800*ease(q/9);forklift(c,a,x,580,false,q<9);
  if(q>=9)batch(c,760,558,90);
  badge(c,'Склад № 1 • место А-03',710,280);
  if(q>8)badge(c,'Партия А принята на хранение',620,345);
 }else if(ch===7){
  badge(c,'Заявка цеха • комплект к линии',420,250);
  const x=550-700*ease((q-2)/8);forklift(c,a,x,580,true,true);
  badge(c,'Отбор с учётом срока годности',640,340);
 }else if(ch===8){
  badge(c,'Склад',110,310);badge(c,'Производственный цех',865,310);
  sprite(c,a,'tug',-550+1120*ease(q/10),580,650);
 }else if(ch===9){
  badge(c,'Передача у цеха',730,285);sprite(c,a,'tug',480,508,660);
  const x=520-340*ease(q/8);forklift(c,a,x,604,true,true);
  if(q>7)badge(c,'Груз подготовлен для робота',180,360);
 }else if(ch===10){
  sprite(c,a,'robot',-310+970*ease(q/9),575,320);badge(c,'Внутри цеха',400,290);
 }else{
  sprite(c,a,'robot',660,575,320);badge(c,'Буфер производственной линии',630,270);
  rounded(c,50,360,510,180,16,'rgba(253,250,237,.95)');
  text(c,'Партия А доставлена',76,404,28,'#365540',600);
  text(c,'Внешняя фура разгружена у въезда',76,447,21,'#55674e');
  text(c,'Склад и цех подтвердили передачу',76,484,21,'#55674e');
  text(c,'Оператор подаёт материал на линию',76,518,20,'#55674e');
 }
 let fade=0;for(const at of starts.slice(1))fade=Math.max(fade,clamp(1-Math.abs(t-at)/.3));
 if(fade>0){c.fillStyle=`rgba(244,242,227,${fade})`;c.fillRect(0,0,1280,630);}
 const g=c.createLinearGradient(0,0,0,135);g.addColorStop(0,'rgba(32,44,35,.7)');g.addColorStop(1,'rgba(32,44,35,0)');c.fillStyle=g;c.fillRect(0,0,1280,135);
 text(c,'ОТ ФУРЫ ПОСТАВЩИКА ДО ЛИНИИ',32,40,21,'#fff8e7',600);
 text(c,direct?'ПРЯМАЯ ПЕРЕГРУЗКА ПОСЛЕ ПРОВЕРКИ':'ЧЕРЕЗ ПРОМЕЖУТОЧНЫЙ ПУНКТ ПРИЁМКИ',32,73,15,'#f0eddc');
 rounded(c,1120,23,126,38,19,'rgba(255,250,230,.9)');text(c,`${ch+1} / 12`,1146,49,19,'#3e513c',600);
 c.fillStyle='rgba(36,49,39,.96)';c.fillRect(0,630,1280,90);
 text(c,ch===4?(direct?'Сразу во внутреннюю машину':'Сначала — в промежуточный запас'):titles[ch],32,663,26,'#fff8e9',600);
 const caption=ch===4?(direct?'После проверки груз перегружают без промежуточного хранения.':'Груз ожидает своего рейса под навесом; фура может уехать.'):captions[ch];
 text(c,caption,32,694,18,'#d3dfc9',400);c.fillStyle='#bc995e';c.fillRect(0,716,1280*t/duration,4);
}
const api={paint,chapter,duration,starts,titles,captions};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LogisticsFilm=api;
})(typeof globalThis!=='undefined'?globalThis:this);
