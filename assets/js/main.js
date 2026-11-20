(function(){
const C=window.SITE_CONFIG||{};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG=typeof window.gsap!=='undefined';
document.documentElement.classList.remove('no-js');

/* ---------- i18n ---------- */
const LANG=((document.documentElement.lang||'vi').slice(0,2).toLowerCase());
const I18N={
 vi:{loc:'vi-VN',copied:'Đã sao chép',copiedSend:'Đã sao chép nội dung — dán vào WhatsApp để gửi',
  msg:d=>`Chào ${C.brand||'bạn'}, mình muốn đặt du thuyền:\n• Du thuyền: ${d.yacht}\n• Ngày: ${d.date||'(chưa chọn)'}\n• Khung giờ: ${d.slot}\n• Số khách: ${d.guests}\n• Họ tên: ${d.name}\n• SĐT: ${d.phone}\n• Ghi chú: ${d.note||'-'}`,
  wxLoading:'Đang tải thời tiết…',wxFail:'Chưa tải được thời tiết lúc này. Nhắn WhatsApp để tụi mình check giúp nhé!',
  feels:'cảm giác',kmh:'km/h',wind:'Gió',gust:'giật',rain:'Mưa',today:'Hôm nay',
  hintGood:'🟢 Gợi ý: gió nhẹ, ít mưa — vibe đẹp để ra khơi!',hintOk:'🟡 Gợi ý: có gió hoặc khả năng mưa — vẫn đi được, nên hỏi trước giờ chạy.',hintBad:'🔴 Gợi ý: gió mạnh / mưa dông — nên hỏi lại lịch tàu trước khi đi.',
  hintNote:'Chỉ là gợi ý tự động, không phải cam kết — thuyền trưởng quyết định theo điều kiện thực tế.',
  wmo:{0:'Trời quang',1:'Nắng nhẹ',2:'Mây rải rác',3:'Nhiều mây',45:'Sương mù',48:'Sương mù',51:'Mưa phùn',53:'Mưa phùn',55:'Mưa phùn',61:'Mưa nhỏ',63:'Mưa vừa',65:'Mưa to',80:'Mưa rào',81:'Mưa rào',82:'Mưa rào lớn',95:'Dông',96:'Dông kèm mưa đá',99:'Dông kèm mưa đá'}},
 en:{loc:'en-GB',copied:'Copied',copiedSend:'Copied — paste it into WhatsApp to send',
  msg:d=>`Hi ${C.brand||'there'}, I'd like to book a yacht:\n• Yacht: ${d.yacht}\n• Date: ${d.date||'(not chosen)'}\n• Time slot: ${d.slot}\n• Guests: ${d.guests}\n• Name: ${d.name}\n• Phone/WhatsApp: ${d.phone}\n• Notes: ${d.note||'-'}`,
  wxLoading:'Loading weather…',wxFail:"Couldn't load the weather right now. Ping us on WhatsApp and we'll check for you!",
  feels:'feels like',kmh:'km/h',wind:'Wind',gust:'gusts',rain:'Rain',today:'Today',
  hintGood:'🟢 Hint: light wind, low rain chance — great vibe for a boat day!',hintOk:'🟡 Hint: some wind or rain possible — usually fine, but check with us before departure.',hintBad:'🔴 Hint: strong wind / storms — please re-check the schedule with us before you go.',
  hintNote:'Automatic hint only, not a guarantee — the captain decides based on real conditions.',
  wmo:{0:'Clear sky',1:'Mostly sunny',2:'Partly cloudy',3:'Cloudy',45:'Fog',48:'Fog',51:'Drizzle',53:'Drizzle',55:'Drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',80:'Showers',81:'Showers',82:'Heavy showers',95:'Thunderstorm',96:'Thunderstorm & hail',99:'Thunderstorm & hail'}},
 ru:{loc:'ru-RU',copied:'Скопировано',copiedSend:'Скопировано — вставьте текст в WhatsApp и отправьте',
  msg:d=>`Здравствуйте, ${C.brand||''}! Хочу забронировать яхту:\n• Яхта: ${d.yacht}\n• Дата: ${d.date||'(не выбрана)'}\n• Время: ${d.slot}\n• Гостей: ${d.guests}\n• Имя: ${d.name}\n• Телефон/WhatsApp: ${d.phone}\n• Комментарий: ${d.note||'-'}`,
  wxLoading:'Загружаем погоду…',wxFail:'Не удалось загрузить погоду. Напишите нам в WhatsApp — подскажем!',
  feels:'ощущается как',kmh:'км/ч',wind:'Ветер',gust:'порывы',rain:'Дождь',today:'Сегодня',
  hintGood:'🟢 Подсказка: слабый ветер, мало осадков — отличный день для яхты!',hintOk:'🟡 Подсказка: возможен ветер или дождь — обычно выходим, но уточните у нас перед поездкой.',hintBad:'🔴 Подсказка: сильный ветер / гроза — уточните расписание перед выездом.',
  hintNote:'Это автоматическая подсказка, а не гарантия — решение принимает капитан по фактической погоде.',
  wmo:{0:'Ясно',1:'Солнечно',2:'Переменная облачность',3:'Облачно',45:'Туман',48:'Туман',51:'Морось',53:'Морось',55:'Морось',61:'Небольшой дождь',63:'Дождь',65:'Сильный дождь',80:'Ливень',81:'Ливень',82:'Сильный ливень',95:'Гроза',96:'Гроза с градом',99:'Гроза с градом'}}
};
const T=I18N[LANG]||I18N.vi;

/* ---------- contact wiring ---------- */
const digits=s=>(s||'').replace(/[^0-9+]/g,'');
const links={
  zalo: C.zaloPhone?('https://zalo.me/'+digits(C.zaloPhone).replace(/^\+84/,'0')):'',
  tel: C.whatsappUrl||(C.hotline?('tel:'+digits(C.hotline)):''),
  wa: C.whatsappUrl||'',
  fb: C.facebookUrl||'',
  msg: C.messengerUser?('https://m.me/'+C.messengerUser):'',
  mail: C.email?('mailto:'+C.email):'',
  yt: C.youtubeUrl||''
};
$$('[data-contact]').forEach(a=>{
  const k=a.dataset.contact, url=links[k];
  if(url){a.href=url; if(/^https/.test(url)){a.target='_blank';a.rel='noopener'}}
  else{ a.dataset.missing='1'; a.hidden=true; a.style.display='none'; }
});
$$('[data-contact-text]').forEach(el=>{
  const k=el.dataset.contactText;
  const v={
    zalo:C.zaloPhone,
    tel:C.whatsappName||C.whatsappUrl||C.hotline,
    wa:C.whatsappName||C.whatsappUrl,
    fb:C.facebookLabel||C.facebookUrl,
    mail:C.email,
    yt:C.youtubeChannelName||C.youtubeUrl
  }[k];
  if(v){el.textContent=v;}
  else{const row=el.closest('[data-contact-row]'); if(row){row.hidden=true;row.style.display='none';} el.textContent='';}
});
$$('[data-brand]').forEach(el=>{ if(C.brand) el.textContent=C.brand; });
$$('[data-year]').forEach(el=>{ el.textContent=new Date().toLocaleString('en-US',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric'}); });

function toast(msg){
  let t=$('#toast'); if(!t){t=document.createElement('div');t.id='toast';t.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#08151f;color:#efe6d6;padding:12px 20px;border-radius:999px;z-index:400;font-size:.9rem;box-shadow:0 10px 30px rgba(0,0,0,.3);transition:opacity .4s;max-width:90vw;text-align:center';document.body.appendChild(t)}
  t.textContent=msg;t.style.opacity=1;clearTimeout(t._h);t._h=setTimeout(()=>t.style.opacity=0,3200);
}

/* ---------- header / menu / progress ---------- */
const header=$('.header'); let lastY=0;
const prog=$('.progress'), totop=$('.totop'), sticky=$('.sticky-cta');
function onScroll(){
  const y=window.scrollY, h=document.documentElement.scrollHeight-innerHeight;
  header&&header.classList.toggle('scrolled',y>40);
  header&&header.classList.toggle('hide',y>lastY&&y>500&&!document.body.classList.contains('menu-open'));
  lastY=y;
  if(prog) prog.style.transform='scaleX('+(h>0?y/h:0)+')';
  totop&&totop.classList.toggle('show',y>900);
  sticky&&sticky.classList.toggle('show',y>innerHeight*.6);
}
addEventListener('scroll',onScroll,{passive:true}); onScroll();
totop&&totop.addEventListener('click',()=>lenis?lenis.scrollTo(0):scrollTo({top:0,behavior:'smooth'}));
$('.burger')&&$('.burger').addEventListener('click',()=>document.body.classList.toggle('menu-open'));
$$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));

/* ---------- smooth scroll (Lenis) ---------- */
let lenis=null;
if(!reduce && window.Lenis){
  lenis=new Lenis({duration:1.15,smoothWheel:true});
  if(hasG&&window.ScrollTrigger){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}
  else{const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf);}
}
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const id=a.getAttribute('href'); if(id.length<2||a.dataset.missing) return; const t=$(id); if(!t) return;
  e.preventDefault(); lenis?lenis.scrollTo(t,{offset:-70}):t.scrollIntoView({behavior:'smooth'});
}));

/* ---------- custom cursor ---------- */
const cur=$('.cursor');
if(cur && matchMedia('(hover:hover)').matches){
  let x=0,y=0,cx=0,cy=0;
  addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;cur.style.opacity=1});
  (function loop(){cx+=(x-cx)*.18;cy+=(y-cy)*.18;cur.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(loop)})();
  $$('a,button,.card').forEach(el=>{el.addEventListener('mouseenter',()=>cur.classList.add('is-hover'));el.addEventListener('mouseleave',()=>cur.classList.remove('is-hover'))});
}

/* ---------- hero slideshow (Ken Burns) ---------- */
const slides=$$('.hero-slide'), dots=$$('.hero-dots button'); let si=0, st;
function go(i){ slides.forEach((s,k)=>s.classList.toggle('active',k===i)); dots.forEach((d,k)=>{d.classList.remove('active');void d.offsetWidth; if(k===i)d.classList.add('active')}); si=i; clearTimeout(st); st=setTimeout(()=>go((si+1)%slides.length),6500); }
if(slides.length){ dots.forEach((d,k)=>d.addEventListener('click',()=>go(k))); go(0); }

/* ---------- filters ---------- */
$$('.filters button').forEach(b=>b.addEventListener('click',()=>{
  $$('.filters button').forEach(x=>x.classList.remove('active')); b.classList.add('active');
  const f=b.dataset.filter;
  $$('.fleet .card').forEach(c=>{const show=f==='all'||c.dataset.loc===f||(f==='small'&&+c.dataset.cap<=15)||(f==='big'&&+c.dataset.cap>15);
    if(show){c.classList.remove('hidden'); hasG&&gsap.fromTo(c,{opacity:0,y:30,scale:.97},{opacity:1,y:0,scale:1,duration:.7,ease:'expo.out'});} else c.classList.add('hidden');});
  window.ScrollTrigger&&ScrollTrigger.refresh();
}));

/* ---------- 3D tilt ---------- */
if(matchMedia('(hover:hover)').matches && !reduce){
  $$('[data-tilt]').forEach(el=>{
    el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${px*6}deg) rotateX(${-py*6}deg) translateY(-6px)`});
    el.addEventListener('mouseleave',()=>el.style.transform='');
  });
}

/* ---------- FAQ ---------- */
$$('.faq-item').forEach(it=>{
  const q=$('.faq-q',it), a=$('.faq-a',it);
  q.addEventListener('click',()=>{
    const open=it.classList.toggle('open'); q.setAttribute('aria-expanded',open);
    a.style.height=open?a.scrollHeight+'px':'0px';
    setTimeout(()=>window.ScrollTrigger&&ScrollTrigger.refresh(),600);
  });
});

/* ---------- lightbox ---------- */
const lb=$('.lb');
if(lb){
  const img=$('img',lb), cnt=$('.count',lb), cap=$('.cap',lb); let group=[], idx=0, sx=0;
  function show(i){ idx=(i+group.length)%group.length; img.style.opacity=0; const g=group[idx];
    const n=new Image(); n.onload=()=>{img.src=g.href; img.alt=g.alt; img.style.opacity=1;}; n.src=g.href;
    cnt.textContent=(idx+1)+' / '+group.length; cap.textContent=g.alt||''; }
  function open(list,i){group=list;lb.classList.add('open');requestAnimationFrame(()=>lb.classList.add('show'));show(i);lenis&&lenis.stop();document.body.style.overflow='hidden';}
  function close(){lb.classList.remove('show');setTimeout(()=>lb.classList.remove('open'),400);lenis&&lenis.start();document.body.style.overflow='';}
  $$('[data-lightbox]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const name=a.dataset.lightbox;const list=$$(`[data-lightbox="${name}"]`).map(x=>({href:x.getAttribute('href'),alt:($('img',x)||{}).alt||''}));open(list,$$(`[data-lightbox="${name}"]`).indexOf(a));}));
  $('.prev',lb).onclick=()=>show(idx-1); $('.next',lb).onclick=()=>show(idx+1); $('.close',lb).onclick=close;
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1);});
  lb.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
  lb.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(idx+(dx<0?1:-1));});
}
$$('.gallery-more button').forEach(b=>b.addEventListener('click',()=>{$$('.gallery a[hidden]').forEach(a=>a.hidden=false);b.parentNode.remove();window.ScrollTrigger&&ScrollTrigger.refresh();}));

/* ---------- booking form -> message ---------- */
const form=$('#booking-form'), modal=$('.modal');
if(form){
  const sel=$('select[name=yacht]',form), pre=new URLSearchParams(location.search).get('du-thuyen');
  if(pre&&sel) sel.value=pre;
  form.addEventListener('submit',e=>{
    e.preventDefault(); const d=Object.fromEntries(new FormData(form));
    const msg=T.msg(d);
    $('pre',modal).textContent=msg; modal.classList.add('open');
    const z=$('.m-zalo',modal); if(z){ if(links.zalo){z.href=links.zalo;z.target='_blank';z.style.display='';}else z.style.display='none'; }
    const w=$('.m-wa',modal); if(w){ if(links.wa){w.href=links.wa;w.target='_blank';w.style.display='';}else w.style.display='none'; }
    const m=$('.m-msg',modal); if(m){ if(links.msg){m.href=links.msg;m.target='_blank';m.style.display='';}else m.style.display='none'; }
    const warn=$('.m-warn',modal); if(warn) warn.style.display=(links.zalo||links.wa||links.msg)?'none':'block';
    navigator.clipboard&&navigator.clipboard.writeText(msg).then(()=>toast(T.copiedSend)).catch(()=>{});
  });
  $('.m-close',modal).onclick=()=>modal.classList.remove('open');
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
  $('.m-copy',modal).onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText($('pre',modal).textContent);toast(T.copied);};
}
$$('[data-book]').forEach(b=>b.addEventListener('click',e=>{const sel=$('#booking-form select[name=yacht]');if(sel){e.preventDefault();sel.value=b.dataset.book;const t=$('#lien-he');lenis?lenis.scrollTo(t,{offset:-70}):t.scrollIntoView({behavior:'smooth'});}}));

/* ---------- page transition ---------- */
const wipe=$('.page-wipe');
$$('a[href]').forEach(a=>{
  const h=a.getAttribute('href'); if(!h||h.startsWith('#')||a.target==='_blank'||/^(tel|mailto|https?):/.test(h)||a.dataset.lightbox!==undefined) return;
  a.addEventListener('click',e=>{ if(e.metaKey||e.ctrlKey||!hasG||reduce) return; e.preventDefault();
    gsap.to(wipe,{scaleY:1,transformOrigin:'bottom',duration:.55,ease:'expo.inOut',onComplete:()=>location.href=h}); });
});
addEventListener('pageshow',e=>{if(e.persisted&&wipe)wipe.style.transform='scaleY(0)'});

/* ---------- GSAP motion ---------- */
function intro(){
  let pl=$('.preloader');
  try{ if(pl&&sessionStorage.getItem('kseen')){pl.remove();pl=null;} sessionStorage.setItem('kseen','1'); }catch(e){}
  if(!hasG||reduce){pl&&pl.remove();return;}
  gsap.registerPlugin(ScrollTrigger);
  const tl=gsap.timeline();
  if(pl){
    tl.from('.pl-word span',{yPercent:110,stagger:.05,duration:.8,ease:'expo.out'})
      .to('.pl-line i',{scaleX:1,duration:.7,ease:'power2.inOut'},'-=.3')
      .to(pl,{clipPath:'inset(0 0 100% 0)',duration:.9,ease:'expo.inOut'})
      .add(()=>pl.remove());
  } else if(wipe){ gsap.set(wipe,{scaleY:1,transformOrigin:'top'}); tl.to(wipe,{scaleY:0,duration:.7,ease:'expo.inOut'}); }
  // hero heading
  if($('.hero h1, .d-hero h1, .a-hero h1')){
    tl.from('.hero h1 .line>span, .d-hero h1, .a-hero h1',{yPercent:110,opacity:0,duration:1.2,stagger:.12,ease:'expo.out'},pl?'-=.45':'-=.2')
      .from('.hero p, .hero-actions>*, .crumb, .d-badges span, .a-meta, .hero-meta, .scroll-ind',{y:30,opacity:0,duration:.9,stagger:.07,ease:'expo.out'},'-=.8');
  }
  // hero parallax
  if($('.hero')){
    gsap.to('.hero-content',{yPercent:30,opacity:.1,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.hero-slides',{yPercent:18,scale:1.08,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  }
  $$('.d-hero>img, .a-hero>img').forEach(im=>gsap.to(im,{yPercent:14,ease:'none',scrollTrigger:{trigger:im.parentNode,start:'top top',end:'bottom top',scrub:true}}));
  // reveals
  $$('[data-reveal]').forEach(el=>gsap.from(el,{y:60,opacity:0,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
  $$('[data-stagger]').forEach(g=>gsap.from(g.children,{y:70,opacity:0,duration:1.1,stagger:.09,ease:'expo.out',scrollTrigger:{trigger:g,start:'top 85%'}}));
  $$('[data-split]').forEach(el=>{
    const words=el.innerHTML.split(/(\s+|<[^>]+>)/).map(w=>(/^\s+$/.test(w)||/^</.test(w)||!w)?w:`<span style="display:inline-block;overflow:hidden;vertical-align:top"><span class="w" style="display:inline-block">${w}</span></span>`).join('');
    el.innerHTML=words; gsap.from($$('.w',el),{yPercent:110,duration:1.1,stagger:.035,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 88%'}});
  });
  $$('[data-img-reveal]').forEach(w=>{
    gsap.fromTo(w,{clipPath:'inset(18% 18% 18% 18% round 22px)'},{clipPath:'inset(0% 0% 0% 0% round 22px)',duration:1.5,ease:'expo.out',scrollTrigger:{trigger:w,start:'top 85%'}});
    const im=$('img',w); im&&gsap.fromTo(im,{scale:1.35},{scale:1,duration:1.8,ease:'expo.out',scrollTrigger:{trigger:w,start:'top 85%'}});
  });
  $$('[data-parallax]').forEach(im=>gsap.fromTo(im,{yPercent:-parseFloat(im.dataset.parallax||10)},{yPercent:parseFloat(im.dataset.parallax||10),ease:'none',scrollTrigger:{trigger:im.parentNode,start:'top bottom',end:'bottom top',scrub:true}}));
  $$('[data-count]').forEach(el=>{const to=+el.dataset.count;const o={v:0};gsap.to(o,{v:to,duration:2,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%'},onUpdate:()=>el.textContent=Math.round(o.v)})});
  // horizontal day section
  const track=$('.day-track');
  if(track){
    ScrollTrigger.matchMedia({
      '(min-width: 861px)':()=>{
        const dist=()=>track.scrollWidth-innerWidth+innerWidth*.04;
        gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'.day-pin',start:'top top',end:()=>'+='+dist(),pin:true,scrub:1,invalidateOnRefresh:true}});
        $$('.day-card .img img').forEach(im=>gsap.to(im,{scale:1,ease:'none',scrollTrigger:{trigger:'.day-pin',start:'top top',end:()=>'+='+dist(),scrub:true}}));
      },
      '(max-width: 860px)':()=>{ $$('.day-card').forEach(c=>gsap.from(c,{y:60,opacity:0,duration:1,ease:'expo.out',scrollTrigger:{trigger:c,start:'top 88%'}})); }
    });
  }
  // marquee speed on scroll
  const mq=$('.marquee-track');
  if(mq){ScrollTrigger.create({onUpdate:s=>{mq.style.animationDuration=Math.max(10,38-Math.abs(s.getVelocity())/120)+'s'}});}
  addEventListener('load',()=>ScrollTrigger.refresh());
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',intro); else intro();

/* ---------- YouTube click-to-play (no autoplay until click) ---------- */
function playYt(btn){
  const id=btn.dataset.yt;
  if(!id||btn.dataset.playing) return;
  btn.dataset.playing='1';
  const raw=btn.getAttribute('aria-label')||'';
  const title=raw.replace(/^[^:]{2,30}:\s*/,'');
  const iframe=document.createElement('iframe');
  iframe.src='https://www.youtube.com/embed/'+encodeURIComponent(id)+'?autoplay=1&rel=0&playsinline=1';
  iframe.title=title;
  iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.setAttribute('allowfullscreen','');
  iframe.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
  const frame=btn.closest('.video-frame')||btn.parentNode;
  frame.classList.add('is-playing');
  btn.replaceWith(iframe);
}
document.addEventListener('click',e=>{
  const btn=e.target.closest('.yt-poster[data-yt]');
  if(btn) playYt(btn);
});
document.addEventListener('keydown',e=>{
  if(e.key!=='Enter'&&e.key!==' ') return;
  const btn=e.target.closest&&e.target.closest('.yt-poster[data-yt]');
  if(!btn) return;
  e.preventDefault();
  playYt(btn);
});

/* ---------- live Phú Quốc clock (Asia/Ho_Chi_Minh) ---------- */
const TZ='Asia/Ho_Chi_Minh';
const fT=new Intl.DateTimeFormat(T.loc,{timeZone:TZ,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
const fS=new Intl.DateTimeFormat(T.loc,{timeZone:TZ,hour:'2-digit',minute:'2-digit',hour12:false});
const fD=new Intl.DateTimeFormat(T.loc,{timeZone:TZ,weekday:'long',day:'numeric',month:'long',year:'numeric'});
const clocks=$$('[data-clock]'); const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
function tick(){const n=new Date();clocks.forEach(el=>{const k=el.dataset.clock;el.textContent=k==='date'?cap(fD.format(n)):k==='short'?fS.format(n):fT.format(n);});}
if(clocks.length){tick();setInterval(tick,1000);}

/* ---------- live weather (Open-Meteo, no key) ---------- */
const WX_ICON={
 sun:'<svg viewBox="0 0 64 64" class="wxi wxi-sun"><g class="rays" stroke="#f4b740" stroke-width="3" stroke-linecap="round"><path d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M12 52l6-6M46 18l6-6"/></g><circle cx="32" cy="32" r="12" fill="#f4b740"/></svg>',
 moon:'<svg viewBox="0 0 64 64" class="wxi wxi-moon"><path d="M40 10a22 22 0 1 0 14 34A18 18 0 0 1 40 10z" fill="#e9d9a6"/></svg>',
 partly:'<svg viewBox="0 0 64 64" class="wxi wxi-partly"><g class="sunp"><g stroke="#f4b740" stroke-width="3" stroke-linecap="round"><path d="M24 4v6M6 22h6M11 9l4 4M37 9l-4 4"/></g><circle cx="24" cy="22" r="9" fill="#f4b740"/></g><path class="cl" d="M20 50h28a10 10 0 0 0 0-20 14 14 0 0 0-27 4A8 8 0 0 0 20 50z" fill="#e8eef2" stroke="#c5d0d8" stroke-width="1.5"/></svg>',
 cloud:'<svg viewBox="0 0 64 64" class="wxi wxi-cloud"><path class="cl" d="M16 48h32a11 11 0 0 0 0-22 15 15 0 0 0-29 4A9 9 0 0 0 16 48z" fill="#dfe6eb" stroke="#b7c3cc" stroke-width="1.5"/></svg>',
 fog:'<svg viewBox="0 0 64 64" class="wxi wxi-fog"><path d="M16 36h32a10 10 0 0 0 0-20 14 14 0 0 0-27 4A8 8 0 0 0 16 36z" fill="#dfe6eb"/><g stroke="#b7c3cc" stroke-width="3" stroke-linecap="round" class="fg"><path d="M10 44h44M16 52h32"/></g></svg>',
 rain:'<svg viewBox="0 0 64 64" class="wxi wxi-rain"><path class="cl" d="M16 38h32a10 10 0 0 0 0-20 14 14 0 0 0-27 4A8 8 0 0 0 16 38z" fill="#cfd9e0" stroke="#a9b7c1" stroke-width="1.5"/><g stroke="#3d8fd6" stroke-width="3" stroke-linecap="round"><path class="d d1" d="M22 44l-3 7"/><path class="d d2" d="M33 44l-3 7"/><path class="d d3" d="M44 44l-3 7"/></g></svg>',
 storm:'<svg viewBox="0 0 64 64" class="wxi wxi-storm"><path class="cl" d="M16 36h32a10 10 0 0 0 0-20 14 14 0 0 0-27 4A8 8 0 0 0 16 36z" fill="#9fafbb" stroke="#7f909c" stroke-width="1.5"/><path class="bolt" d="M34 38l-8 12h7l-3 10 11-14h-7l4-8z" fill="#f4b740"/><g stroke="#3d8fd6" stroke-width="3" stroke-linecap="round"><path class="d d1" d="M20 42l-3 7"/><path class="d d3" d="M48 42l-3 7"/></g></svg>'
};
function wxKind(c,day){ if(c<=1) return day===0?'moon':'sun'; if(c===2) return 'partly'; if(c===3) return 'cloud'; if(c===45||c===48) return 'fog'; if(c>=95) return 'storm'; if((c>=51&&c<=67)||(c>=80&&c<=82)) return 'rain'; return 'cloud'; }
function wxText(c){ const m=T.wmo; if(m[c]) return m[c]; if(c>=56&&c<=67) return m[63]; if(c>=71&&c<=86) return m[3]; return m[3]; }
const wxBox=$('[data-weather]'), wxChip=$$('[data-wx-chip]');
if(wxBox||wxChip.length){
  const url='https://api.open-meteo.com/v1/forecast?latitude=10.2899&longitude=103.984&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FHo_Chi_Minh&forecast_days=4&wind_speed_unit=kmh';
  const fail=()=>{ if(wxBox){ $('[data-wx-cond]',wxBox).textContent=T.wxFail; $('[data-wx-icon]',wxBox).innerHTML=WX_ICON.partly; $('[data-wx-temp]',wxBox).textContent='—'; wxBox.classList.add('wx-failed'); } };
  const ctl=('AbortController' in window)?new AbortController():null; const to=setTimeout(()=>ctl&&ctl.abort(),9000);
  fetch(url,ctl?{signal:ctl.signal}:{}).then(r=>{if(!r.ok) throw 0; return r.json();}).then(w=>{
    clearTimeout(to);
    const c=w.current, d=w.daily; const code=c.weather_code; const temp=Math.round(c.temperature_2m);
    wxChip.forEach(el=>el.textContent=' · '+temp+'°C');
    if(!wxBox) return;
    $('[data-wx-icon]',wxBox).innerHTML=WX_ICON[wxKind(code,c.is_day)];
    $('[data-wx-temp]',wxBox).textContent=temp+'°C';
    $('[data-wx-cond]',wxBox).textContent=wxText(code);
    $('[data-wx-meta]',wxBox).textContent=`${T.feels} ${Math.round(c.apparent_temperature)}°C · ${T.wind} ${Math.round(c.wind_speed_10m)} ${T.kmh} (${T.gust} ${Math.round(c.wind_gusts_10m)})`+(d.precipitation_probability_max&&d.precipitation_probability_max[0]!=null?` · ${T.rain} ${d.precipitation_probability_max[0]}%`:'');
    const fd=new Intl.DateTimeFormat(T.loc,{weekday:'short',day:'numeric',month:'numeric',timeZone:'UTC'});
    let html='';
    for(let i=1;i<Math.min(4,d.time.length);i++){
      const [y,m,dd]=d.time[i].split('-').map(Number); const lab=fd.format(new Date(Date.UTC(y,m-1,dd,12)));
      html+=`<div class="wx-day"><span class="wd">${cap(lab)}</span>${WX_ICON[wxKind(d.weather_code[i],1)]}<b>${Math.round(d.temperature_2m_max[i])}° <small>${Math.round(d.temperature_2m_min[i])}°</small></b><span class="wr">💧 ${d.precipitation_probability_max[i]??'–'}% · 💨 ${Math.round(d.wind_speed_10m_max[i])} ${T.kmh}</span><span class="wc">${wxText(d.weather_code[i])}</span></div>`;
    }
    $('[data-wx-days]',wxBox).innerHTML=html;
    const wind=c.wind_speed_10m, gust=c.wind_gusts_10m, pr=(d.precipitation_probability_max||[0])[0]||0;
    let h=T.hintGood, cls='good';
    if(code>=95||wind>=30||gust>=45||pr>=80){h=T.hintBad;cls='bad';}
    else if(wind>=20||gust>=35||pr>=50||(code>=61&&code<=82)){h=T.hintOk;cls='ok';}
    const hint=$('[data-wx-hint]',wxBox); hint.innerHTML=`<b>${h}</b><br><small>${T.hintNote}</small>`; hint.className='wx-hint '+cls;
  }).catch(()=>{clearTimeout(to);fail();});
}
})();
