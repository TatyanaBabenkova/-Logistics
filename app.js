'use strict';
const $=id=>document.getElementById(id);
const variants={
 truck:{title:'Крытый автономный грузовик',description:'Отдельные рейсы с паллетами или контейнерами. Защита груза от осадков; температурный режим уточняется под конкретный материал.',handoff:'Погрузчик загружает кузов. У здания — выгрузка под навесом и передача внутренней технике.',executor:'Автономный уличный грузовик',shape:'#truck-icon'},
 tug:{title:'Уличный тягач с тележками',description:'Несколько грузовых мест за рейс. Подходит для повторяемого маршрута; нужны широкие повороты и совместимые тележки.',handoff:'Тягач доставляет состав к посту. Согласованная сцепка и обработка тележек — отдельные операции.',executor:'Уличный тягач с тележками',shape:'#tug-icon'},
 mixed:{title:'Водитель снаружи, робот внутри',description:'Первый этап для сложной территории. Существующая машина ездит по электронным заданиям, складской робот работает на подготовленном полу.',handoff:'Оператор подтверждает передачу сканированием. Во всех звеньях сохраняется один идентификатор партии.',executor:'Уличная машина с водителем',shape:'#truck-icon'}
};
const stages=[
 {name:'Приёмка и маркировка',short:'Приёмка',description:'Фура разгружается у въезда. Груз проверяют и регистрируют как партию П-001. До допуска качества он остаётся в зоне контроля.',location:'Приёмочный буфер',accounting:'П-001 создана · ожидает допуска',executor:'Оператор приёмки',route:[[90,266],[160,266]],cargo:[[90,210],[160,210]]},
 {name:'Подготовка к уличному рейсу',short:'Погрузка',description:'Допуск получен. Погрузчик передаёт паллету уличной машине; проверяются крепление, защита груза и свободное место на складе.',location:'Пост погрузки у приёмки',accounting:'П-001 допущена · назначен склад',executor:'Погрузчик и оператор',route:[[160,266],[160,266]],cargo:[[160,210],[160,266]]},
 {name:'Перевозка по территории',short:'Улица',description:'Уличная машина движется к складу по согласованной дороге. Переходы, перекрёстки, покрытие и погода входят в условия допуска маршрута.',location:'Улица · приёмка → склад',accounting:'П-001 в пути · доставка не завершена',route:[[160,266],[441,266]],onVehicle:true},
 {name:'Передача на склад',short:'Склад',description:'Машина останавливается у площадки передачи. Груз выгружают и сканируют. Внутренний робот забирает паллету и размещает её по адресу; уличная машина остаётся снаружи.',location:'Склад · площадка передачи → адрес',accounting:'П-001 принята · адрес С-01',executor:'Погрузчик → внутренний робот',route:[[441,266],[441,266]],cargo:[[441,266],[441,210],[520,210],[520,182]],robot:[[520,210],[520,182]]},
 {name:'Комплектование и рейс к цеху',short:'К цеху',description:'Производство запросило комплект. Склад выбирает разрешённую партию с нужным сроком годности. После погрузки уличная машина везёт П-001 к прицеховому буферу.',location:'Склад → уличный маршрут → цех',accounting:'П-001 зарезервирована для линии',route:[[441,266],[747,266]],onVehicle:true},
 {name:'Внутренняя подача на линию',short:'Линия',description:'На входе цеха подтверждают партию. Внутренний робот подаёт паллету; оператор или подходящий манипулятор снимает коробки только при готовности линии.',location:'Цех · буфер → вход линии',accounting:'П-001 принята производством',executor:'Внутренний робот и оператор линии',route:[[747,266],[747,266]],cargo:[[747,266],[747,210],[865,210],[865,182]],robot:[[800,210],[865,210],[865,182]]},
 {name:'Готовая продукция',short:'Отгрузка',description:'После производства и допуска качества возникает новая партия ГП-001, связанная с компонентами П-001. Её перевозят к складу готовой продукции и далее к отгрузке.',location:'Цех → склад готовой продукции',accounting:'ГП-001 учтена · связь с П-001 сохранена',route:[[747,266],[829,266],[865,282],[882,319],[882,432],[865,470],[829,485],[350,485]],onVehicle:true},
 {name:'Возврат тары и завершение',short:'Возврат',description:'Готовая продукция передана на склад. Пустая тара возвращается отдельным заданием; история партии и подтверждения операций остаются в учёте.',location:'Возврат пустой тары к приёмке',accounting:'ГП-001 на складе · рейс завершён',route:[[350,485],[130,485],[92,468],[76,432],[76,319],[92,283],[130,266],[160,266]],onVehicle:true}
];
let variant='truck',time=0,playing=false,last=0,mode='normal',shownStage=-1;
const stageDuration=7,total=stages.length*stageDuration;
const timeline=$('timeline');
stages.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String(i+1);b.title=s.name;b.setAttribute('aria-label',`Этап ${i+1}: ${s.name}`);b.onclick=()=>{time=i*stageDuration;playing=false;mode='normal';shownStage=-1;render();};timeline.append(b);});
function pointAt(points,t){const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));let remaining=lengths.reduce((a,b)=>a+b,0)*Math.max(0,Math.min(1,t));if(!remaining&&lengths.every(x=>x===0))return [...points[0],0];for(let i=0;i<lengths.length;i++){if(remaining<=lengths[i]||i===lengths.length-1){const fraction=lengths[i]?remaining/lengths[i]:0;const a=points[i],b=points[i+1];return [a[0]+(b[0]-a[0])*fraction,a[1]+(b[1]-a[1])*fraction,Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI];}remaining-=lengths[i];}return [...points[0],0];}
function move(id,p,rotate=false){$(id).setAttribute('transform',`translate(${p[0]} ${p[1]})${rotate?` rotate(${p[2]||0})`:''}`);}
function render(){
 const index=Math.min(stages.length-1,Math.floor(time/stageDuration));const f=Math.min(1,(time-index*stageDuration)/stageDuration);const stage=stages[index],v=variants[variant];
 const vehicle=pointAt(stage.route,f);move('vehicle',vehicle,true);
 const cargo=stage.onVehicle?vehicle:pointAt(stage.cargo||stage.route,f);move('cargo',cargo);
 const cargoText=$('cargo').querySelector('text');cargoText.textContent=index>=6?(index===7?'ТАРА':'ГП-001'):'П-001';
 $('cargo').style.opacity=index===7?'.55':'1';
 $('vehicle-shape').setAttribute('href',mode==='manual'?'#truck-icon':v.shape);
 $('vehicle').style.color=(variant==='mixed'||mode==='manual')?'#c67b34':'#228872';
 $('indoor').setAttribute('visibility',stage.robot?'visible':'hidden');if(stage.robot)move('indoor',pointAt(stage.robot,f));
 $('active-route').setAttribute('d','M'+stage.route.map(p=>p.join(' ')).join('L'));
 $('stopped').setAttribute('visibility',mode==='stopped'?'visible':'hidden');move('stopped',[vehicle[0],vehicle[1]-48]);
 $('manual-route').setAttribute('visibility',mode==='manual'||variant==='mixed'?'visible':'hidden');
 $('play').textContent=playing?'Ⅱ Пауза':time>=total?'↺ Повторить':'▶ Запустить';$('play').disabled=mode==='stopped';
 $('failure').hidden=mode!=='normal';$('takeover').hidden=mode!=='stopped';$('restore').hidden=mode==='normal';
 $('status').textContent=mode==='stopped'?'Безопасная остановка':mode==='manual'?'Ручной подхват':variant==='mixed'?'Смешанная схема':'Штатный режим';$('status').className='status '+(mode==='normal'?'normal':'alert');
 $('progress-text').textContent=`Этап ${index+1} из ${stages.length}`;
 $('location').textContent=mode==='stopped'?'Улица · машина остановлена':stage.location;
 $('accounting').textContent=mode==='stopped'?'П-001 сохранена · задание заблокировано':stage.accounting;
 $('executor').textContent=mode==='stopped'?'Диспетчер ожидает подтверждения':stage.executor||(mode==='manual'?'Резервная машина с водителем':v.executor);
 $('recovery-note').textContent=mode==='stopped'?'Движение остановлено. Диспетчер подтверждает положение груза и блокирует исходное задание. Передача резервной машине выполняется в допустимом месте.':mode==='manual'?'Ручной исполнитель принял задание П-001 после подтверждения передачи. Старое автоматическое задание заблокировано; повторной доставки нет.':variant==='mixed'?'На улице уже работает водитель. Остановка уличного автопилота доступна в вариантах А и Б.':'Ручной поток работает ежедневно. Этот сценарий показывает отказ уличного автопилота и передачу задания резервной машине.';
 if(shownStage!==index){shownStage=index;Array.from(timeline.children).forEach((b,i)=>{b.className=i===index?'current':i<index?'done':'';b.setAttribute('aria-pressed',String(i===index));});}
 $('stage-title').textContent=mode==='stopped'?'Остановка и подтверждение передачи':stage.name;
 $('stage-description').textContent=mode==='stopped'?'Для демонстрации остановлен автоматический уличный рейс с партией П-001. Груз не исчезает из учёта. Нажмите «Передать ручной машине»: после разрешённой передачи резервная машина продолжит доставку к тому же складу.':stage.description;
}
function selectVariant(key){variant=key;mode='normal';time=0;playing=false;shownStage=-1;const v=variants[key];$('variant-title').textContent=v.title;$('variant-description').textContent=v.description;$('handoff-description').textContent=v.handoff;document.querySelectorAll('.variant').forEach(b=>{const on=b.dataset.variant===key;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));});$('failure').disabled=key==='mixed';$('failure').textContent=key==='mixed'?'Ручной уличный режим уже активен':'Показать остановку';render();}
document.querySelectorAll('.variant').forEach(b=>b.onclick=()=>selectVariant(b.dataset.variant));
$('play').onclick=()=>{if(time>=total)time=0;playing=!playing;render();};
$('restart').onclick=()=>{time=0;playing=false;mode='normal';shownStage=-1;render();};
$('failure').onclick=()=>{time=stageDuration*2.55;playing=false;mode='stopped';shownStage=-1;render();};
$('takeover').onclick=()=>{mode='manual';playing=true;render();};
$('restore').onclick=()=>{mode='normal';time=0;playing=false;shownStage=-1;render();};
function tick(now){if(last&&playing){time=Math.min(total,time+Math.min((now-last)/1000,.12)*Number($('speed').value));if(time>=total)playing=false;}last=now;render();requestAnimationFrame(tick);}
document.addEventListener('visibilitychange',()=>{if(document.hidden){playing=false;render();}});
selectVariant('truck');requestAnimationFrame(tick);
