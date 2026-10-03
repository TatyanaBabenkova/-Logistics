'use strict';
const $=id=>document.getElementById(id),film=LogisticsFilm,canvas=$('film'),ctx=canvas.getContext('2d');
let assets={},time=0,playing=false,variant='buffer',last=0,ready=false,lastChapter=-1;
function update(){if(!ready)return;film.paint(ctx,assets,time,variant);$('seek').value=time;$('clock').textContent=`${Math.floor(time/60)}:${String(Math.floor(time%60)).padStart(2,'0')} / 2:16`;$('play').textContent=playing?'Ⅱ Пауза':time>=film.duration?'↺ Повторить':'▶ Смотреть';const ch=film.chapter(time);if(ch!==lastChapter){lastChapter=ch;$('scene-description').textContent=film.captions[ch];const buttons=[...document.querySelectorAll('[data-time]')];buttons.forEach((b,i)=>{const on=time>=Number(b.dataset.time)&&(i===buttons.length-1||time<Number(buttons[i+1].dataset.time));b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});}}
Promise.all(['yard','hall','truck','tug','forklift','robot','semiRed','semiBlue','receiving','warehouse'].map(name=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{assets[name]=im;resolve()};im.onerror=reject;im.src=`assets/${name}.webp`;}))).then(()=>{ready=true;$('play').disabled=false;update()}).catch(()=>{$('error').hidden=false;$('play').textContent='Ошибка загрузки';});
$('play').onclick=()=>{if(!ready)return;if(time>=film.duration)time=0;playing=!playing;update()};
$('restart').onclick=()=>{time=0;playing=false;update()};
$('seek').oninput=()=>{time=Number($('seek').value);playing=false;update()};
document.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>{time=Number(b.dataset.time)+(Number(b.dataset.time)>0?0.4:0);playing=false;update()});
document.querySelectorAll('[data-variant]').forEach(b=>b.onclick=()=>{variant=b.dataset.variant;time=0;playing=false;document.querySelectorAll('[data-variant]').forEach(x=>{const on=x===b;x.classList.toggle('selected',on);x.setAttribute('aria-pressed',String(on));});$('download').href=`media/logistics-${variant}-v03.mp4`;$('download').download=`v03_Мультфильм_${variant==='buffer'?'через_приёмку':'прямая_перегрузка'}_2026-10-03.mp4`;$('video').pause();$('video').src=$('download').href;$('video').load();update();});
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.player').requestFullscreen();}catch{$('fullscreen').textContent='Недоступно';}};
$('video').addEventListener('play',()=>{playing=false;update()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){playing=false;update()}});
function loop(now){if(playing&&ready){time=Math.min(film.duration,time+Math.min((now-last)/1000,.1)*Number($('speed').value));if(time>=film.duration)playing=false;update();}last=now;requestAnimationFrame(loop);}requestAnimationFrame(loop);
