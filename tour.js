'use strict';
const tourStops=['overview','gate','admin','warehouse1','warehouse2','warehouse3','receiving','workshop1','workshop2','finish'];
const tour={index:0,time:0,manual:false,done:false,audioKey:null,audioFailed:false};
function overviewTour(){return state.tab==='process'&&state.chapter===0}
function clipKey(){if(state.selected)return state.selected;return overviewTour()?tourStops[tour.index]:null}
function clipDuration(){return Math.max(tour.index===0?14:11,(TOUR_AUDIO.duration[clipKey()]||9)+1.5)}
function setClip(){const key=clipKey();if(tour.audioKey!==key){narration.pause();tour.audioKey=key;tour.audioFailed=false;if(key){narration.src='audio/v08/'+key+'.mp3';narration.load()}else{narration.removeAttribute('src')}}}
playAudio=function(){setClip();if(voiceEnabled&&clipKey())narration.play().catch(()=>{tour.audioFailed=true;pause();status('Не удалось включить звук. Можно продолжить без голоса.')})};
const baseControls=updateControls;
updateControls=function(){baseControls();$('narration').hidden=!clipKey();$('narration').textContent=voiceEnabled?'🔊 Выключить звук':'🔇 Включить рассказ';$('narration').setAttribute('aria-pressed',voiceEnabled);$('tour-controls').hidden=!overviewTour();if(!overviewTour())return;
 const label=tourStops[tour.index],title=label==='overview'?'Проезд по территории':label==='finish'?'Куда перейти дальше':D.objects[label].title;
 const html=`<button data-tour-prev ${tour.index===0?'disabled':''} aria-label="Предыдущее здание">←</button><span class="tour-step">${tour.index+1} / ${tourStops.length} · ${title}</span><button data-tour-next ${tour.index===tourStops.length-1?'disabled':''} aria-label="Следующее здание">Дальше →</button>${tour.manual?'<button data-tour-resume>Продолжить автообзор</button>':'<span>Автообзор · можно нажать на любое здание</span>'}`;if(tour.controlHtml!==html){$('tour-controls').innerHTML=html;tour.controlHtml=html}
 $('play').textContent=state.playing?'Ⅱ Пауза':tour.done?'↺ Повторить обзор':tour.manual?(voiceEnabled?'▶ Рассказать об объекте':'▶ Продолжить обзор'):'▶ Смотреть обзор';
 $('progress').style.width=((tour.index+Math.min(tour.time/clipDuration(),1))/tourStops.length*100)+'%';
};
function highlightTour(){document.querySelectorAll('#map-host [data-object]').forEach(el=>el.classList.toggle('tour-selected',el.dataset.object===state.selected));}
function goStop(index,play=true){narration.pause();tour.index=Math.max(0,Math.min(tourStops.length-1,index));tour.time=0;tour.manual=false;tour.done=false;const id=tourStops[tour.index];state.selected=D.objects[id]?id:null;if(tour.index>0)state.elapsed=Math.max(state.elapsed,12);state.playing=play;render();highlightTour();setClip();narration.currentTime=0;if(id==='finish'){$('info-content').innerHTML=infoBody({title:'Обзор завершён',lead:'Мы посмотрели въезд, склады и производственные корпуса.',note:'Выберите слева «Как работает сейчас», чтобы посмотреть путь прибывающего груза.'})}if(play)playAudio();status('Автообзор: '+(D.objects[id]?.title||'Предприятие целиком'));}
const baseStart=startEpisode;
startEpisode=function(){if(!overviewTour()){baseStart();return}state.elapsed=0;goStop(0,true)};
const baseSwitch=switchTab;
switchTab=function(tab){baseSwitch(tab);if(overviewTour()){tour.index=0;tour.time=0;tour.manual=false;tour.done=false;render()}};
function tourTick(dt){if(tour.manual){if(voiceEnabled&&narration.ended)pause();return}tour.time+=dt;let ended=tour.time>=clipDuration();if(voiceEnabled&&!tour.audioFailed)ended=ended&&narration.ended;if(ended){if(tour.index<tourStops.length-1)goStop(tour.index+1,true);else{tour.done=true;pause();status('Обзор завершён · выберите слева «Как работает сейчас»');$('next-cue').textContent='Дальше: выберите слева «Как работает сейчас»'}}}
const basePlay=$('play').onclick;
$('play').onclick=()=>{if(!overviewTour()){basePlay();return}if(state.playing){pause();return}if(tour.done){startEpisode();return}if(tour.manual&&!voiceEnabled){tour.manual=false;goStop(tour.index,true);return}state.playing=true;if(narration.ended){narration.currentTime=0;tour.time=0}playAudio();updateControls()};
$('narration').onclick=()=>{voiceEnabled=!voiceEnabled;if(!voiceEnabled){narration.pause();updateControls();return}setClip();narration.currentTime=0;tour.time=0;state.playing=true;playAudio();updateControls()};
document.addEventListener('click',e=>{const b=e.target.closest('button,[data-object]');if(!b)return;
 if(b.dataset.object){tour.manual=true;tour.done=false;const i=tourStops.indexOf(b.dataset.object);if(i>=0)tour.index=i;tour.time=0;setClip();narration.currentTime=0;highlightTour();if(voiceEnabled){state.playing=true;playAudio()}updateControls()}
 if(b.hasAttribute('data-tour-next'))goStop(tour.index+1,true);
 if(b.hasAttribute('data-tour-prev'))goStop(tour.index-1,true);
 if(b.hasAttribute('data-tour-resume'))goStop(tour.index,true);
 if(b.dataset.enlarge)pause();
});
narration.addEventListener('error',()=>{if(voiceEnabled&&clipKey()){tour.audioFailed=true;pause();status('Звук недоступен. Отключите звук и продолжите обзор.')}});
updateControls();

