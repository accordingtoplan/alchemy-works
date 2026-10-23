
(function(){
const tz='America/Los_Angeles';
function nowPT(){const p=new Intl.DateTimeFormat('en-US',{timeZone:tz,weekday:'short',hour:'numeric',minute:'2-digit',hour12:false}).formatToParts(new Date());const g=t=>p.find(x=>x.type===t).value;return{day:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),h:+g('hour')%24,m:+g('minute')}}
function fmt(h){return (h%12||12)+(h>=12?'pm':'am')}
window.awStatus=function(open){const t=nowPT();const [o,c]=open.split(',')[t.day].split('-').map(Number);const n=t.h+t.m/60;const on=n>=o&&n<c;return{open:on,text:on?'Open until '+fmt(c):'Opens '+fmt(o)}};
document.querySelectorAll('[data-open]').forEach(el=>{const s=awStatus(el.dataset.open);const t=el.querySelector('.status');if(t){t.textContent=s.text;t.className='status '+(s.open?'open':'closed')}});
const track=document.getElementById('track');
if(track){const items=['Free shipping on orders over $100','Pick up in store at all four locations','Dôen in residence at Harbor House','The Pink House is open in Carmel'];const seq=items.map(x=>'<span>'+x+'</span>').join('');track.innerHTML=seq+seq}
const hdr=document.querySelector('header');const mb=document.getElementById('menu-btn');
if(mb){mb.addEventListener('click',()=>{const o=hdr.classList.toggle('open');mb.setAttribute('aria-expanded',String(o));mb.textContent=o?'Close':'Menu'})}
addEventListener('scroll',()=>hdr.classList.toggle('scrolled',scrollY>80),{passive:true});
function fitMark(){const m=document.querySelector('.big-mark');if(!m)return;m.style.fontSize='100px';m.style.fontSize=Math.floor(100*m.clientWidth/m.scrollWidth*0.98)+'px'}
fitMark();addEventListener('resize',fitMark);document.fonts&&document.fonts.ready.then(fitMark);
const lf=document.getElementById('letter-form');if(lf)lf.addEventListener('submit',e=>{e.preventDefault();const ok=document.getElementById('ok');if(ok)ok.textContent='Sign-up opens with the new site.'});
const bag=[...document.querySelectorAll('header a')].find(a=>/^Bag/.test(a.textContent));
window.awAdd=function(){const n=+(bag.textContent.match(/\d+/)||[0])[0]+1;bag.textContent='Bag ('+n+')'};
})();
