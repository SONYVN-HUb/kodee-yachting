(function(){
const C=window.SITE_CONFIG||{};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG=typeof window.gsap!=='undefined';
document.documentElement.classList.remove('no-js');

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
const labels={zalo:'số Zalo',tel:'WhatsApp',wa:'WhatsApp',fb:'link Facebook',msg:'Messenger',mail:'email',yt:'kênh YouTube'};
$$('[data-contact]').forEach(a=>{
  const k=a.dataset.contact, url=links[k];
  if(url){a.href=url; if(/^https/.test(url)){a.target='_blank';a.rel='noopener'}}
  else{
    a.dataset.missing='1';
    if(a.closest('.sticky-cta,.fab,.socials,.header-actions')){a.hidden=true;return;}
    a.href='#lien-he';
    a.addEventListener('click',e=>{e.preventDefault();toast('Chủ trang chưa điền '+ (labels[k]||k) +' trong assets/js/config.js');});
  }
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
  el.innerHTML=v?v:'<span class="missing">Chưa cập nhật</span>';
});
$$('[data-brand]').forEach(el=>{ if(C.brand) el.textContent=C.brand; });

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
    const msg=`Chào ${C.brand||'bạn'}, mình muốn đặt du thuyền:\n• Du thuyền: ${d.yacht}\n• Ngày: ${d.date||'(chưa chọn)'}\n• Khung giờ: ${d.slot}\n• Số khách: ${d.guests}\n• Họ tên: ${d.name}\n• SĐT: ${d.phone}\n• Ghi chú: ${d.note||'-'}`;
    $('pre',modal).textContent=msg; modal.classList.add('open');
    const z=$('.m-zalo',modal); if(z){ if(links.zalo){z.href=links.zalo;z.target='_blank';z.style.display='';}else z.style.display='none'; }
    const w=$('.m-wa',modal); if(w){ if(links.wa){w.href=links.wa;w.target='_blank';w.style.display='';}else w.style.display='none'; }
    const m=$('.m-msg',modal); if(m){ if(links.msg){m.href=links.msg;m.target='_blank';m.style.display='';}else m.style.display='none'; }
    const warn=$('.m-warn',modal); if(warn) warn.style.display=(links.zalo||links.wa||links.msg)?'none':'block';
    navigator.clipboard&&navigator.clipboard.writeText(msg).then(()=>toast('Đã sao chép nội dung — dán vào WhatsApp/Zalo để gửi')).catch(()=>{});
  });
  $('.m-close',modal).onclick=()=>modal.classList.remove('open');
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
  $('.m-copy',modal).onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText($('pre',modal).textContent);toast('Đã sao chép');};
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
  const title=raw.replace(/^Phát video:\s*/,'');
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
})();
