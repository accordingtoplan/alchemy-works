
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
const bag=document.querySelector('header .bag-link');
const KEY='aw-cart';const money=v=>'$'+v.toLocaleString('en-US',{minimumFractionDigits:v%1?2:0,maximumFractionDigits:2});
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let mem=[];
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return mem}}
function save(c){mem=c;try{localStorage.setItem(KEY,JSON.stringify(c))}catch(e){}render()}
function count(c){return c.reduce((n,i)=>n+i.qty,0)}
function total(c){return c.reduce((n,i)=>n+i.qty*i.price,0)}
function rows(c){return c.map((i,k)=>'<li class="ci"><a href="/products/'+esc(i.slug)+'/"><img src="'+esc(i.img)+'" alt=""></a><div class="ci-t"><span class="cap muted">'+esc(i.brand)+'</span><a href="/products/'+esc(i.slug)+'/">'+esc(i.title)+'</a><span class="muted">'+[i.color,i.size&&('Size '+i.size)].filter(Boolean).map(esc).join(' · ')+'</span><span class="ci-q"><button type="button" data-q="-1" data-k="'+k+'" aria-label="One fewer">−</button><span class="mono">'+i.qty+'</span><button type="button" data-q="1" data-k="'+k+'" aria-label="One more">+</button><button type="button" class="ci-x" data-x="'+k+'">Remove</button></span></div><span class="mono">'+money(i.qty*i.price)+'</span></li>').join('')}
const drawer=document.createElement('aside');drawer.className='cart-drawer';drawer.setAttribute('aria-label','Your bag');drawer.hidden=true;
drawer.innerHTML='<div class="cd-in"><div class="cd-h"><span class="cap">Your bag</span><button type="button" class="cd-close cap">Close</button></div><ul class="cl"></ul><p class="cd-empty muted">Your bag is empty.</p><div class="cd-f"><div class="cd-sum"><span class="cap">Subtotal</span><span class="mono cd-tot"></span></div><a class="btn-black" href="/cart/">View bag and check out</a></div></div>';
document.body.appendChild(drawer);
function openDrawer(){drawer.hidden=false;requestAnimationFrame(()=>drawer.classList.add('on'));drawer.querySelector('.cd-close').focus()}
function closeDrawer(){drawer.classList.remove('on');setTimeout(()=>{drawer.hidden=true},250)}
drawer.addEventListener('click',e=>{if(e.target===drawer||e.target.closest('.cd-close'))closeDrawer()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden)closeDrawer()});
function act(e){const q=e.target.closest('[data-q]'),x=e.target.closest('[data-x]');if(!q&&!x)return;const c=load();if(q){const i=c[+q.dataset.k];i.qty=Math.max(0,i.qty+ +q.dataset.q);if(!i.qty)c.splice(+q.dataset.k,1)}else c.splice(+x.dataset.x,1);save(c)}
drawer.addEventListener('click',act);
const pg=document.getElementById('cart-page');
function render(){const c=load();const n=count(c);
if(bag){bag.querySelector('.bag-n').textContent=n;bag.setAttribute('aria-label','Bag, '+n+(n===1?' item':' items'))}
drawer.querySelector('.cl').innerHTML=rows(c);drawer.querySelector('.cd-empty').hidden=!!c.length;drawer.querySelector('.cd-f').hidden=!c.length;drawer.querySelector('.cd-tot').textContent=money(total(c));
if(pg){pg.querySelector('.cl').innerHTML=rows(c);pg.querySelector('.cart-empty').hidden=!!c.length;pg.querySelector('.cart-full').hidden=!c.length;const t=total(c);pg.querySelector('.cp-sub').textContent=money(t);const ship=pg.querySelector('input[name=ful]:checked').value==='ship';pg.querySelector('.cp-ship').textContent=ship?(t>=100?'Free':'Calculated at checkout'):'Free, ready in two hours';pg.querySelector('.cp-tot').textContent=money(t)}}
window.awCart={add(item){const c=load();const same=c.find(i=>i.slug===item.slug&&i.size===item.size&&i.color===item.color);if(same)same.qty+=1;else c.push(item);save(c);openDrawer()}};
window.awAdd=function(){};
if(bag)bag.addEventListener('click',e=>{if(pg)return;e.preventDefault();render();openDrawer()});
if(pg){pg.addEventListener('click',act);pg.querySelectorAll('input[name=ful]').forEach(r=>r.addEventListener('change',()=>{pg.querySelector('.cp-store').hidden=pg.querySelector('input[name=ful]:checked').value!=='pick';render()}));pg.querySelector('#checkout').addEventListener('click',()=>{pg.querySelector('#co-msg').hidden=false})}
render();
})();
