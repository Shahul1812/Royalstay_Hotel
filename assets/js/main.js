document.addEventListener("DOMContentLoaded",()=>{
 const pre=document.querySelector(".preloader");
 const finish=()=>{document.body.classList.remove("is-loading");if(pre)pre.classList.add("hide")};
 window.addEventListener("load",()=>setTimeout(finish,180),{once:true});
 setTimeout(finish,1600);

 // Reliable image handling: try alternate Unsplash delivery, then local fallback.
 document.querySelectorAll("img[data-fallback]").forEach(img=>{
   img.addEventListener("error",()=>{
     const stage=Number(img.dataset.fallbackStage||0);
     const alternatives=(img.dataset.alternates||"").split("|").filter(Boolean);
     if(stage<alternatives.length){img.dataset.fallbackStage=String(stage+1);img.src=alternatives[stage];}
     else {img.onerror=null;img.src="assets/images/image-fallback.svg";}
   });
 });
 // CSS background photos need their own error handler too (img.onerror cannot catch them).
 const localFallback = "url('assets/images/image-fallback.svg')";
 const checkBackground = (selector, remoteUrl, gradient) => {
   const element = document.querySelector(selector);
   if (!element) return;
   const probe = new Image();
   probe.onload = () => {};
   probe.onerror = () => { element.style.backgroundImage = gradient + ", " + localFallback; };
   probe.src = remoteUrl;
 };
 checkBackground(".hero-bg",
   "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=2200&q=85",
   "linear-gradient(90deg,rgba(11,9,9,.85),rgba(11,9,9,.25))");
 checkBackground(".page-hero",
   "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85",
   "linear-gradient(90deg,rgba(12,10,9,.85),rgba(12,10,9,.35))");

 const nav=document.querySelector(".navbar");
 const scrollNav=()=>nav&&nav.classList.toggle("scrolled",window.scrollY>25);
 scrollNav();window.addEventListener("scroll",scrollNav,{passive:true});
 const menu=document.querySelector(".menu-btn"),links=document.querySelector(".nav-links");
 if(menu&&links)menu.addEventListener("click",()=>{links.classList.toggle("open");menu.setAttribute("aria-expanded",links.classList.contains("open")?"true":"false");menu.textContent=links.classList.contains("open")?"×":"☰"});
 document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>links&&links.classList.remove("open")));

 const revealEls=document.querySelectorAll(".reveal");
 if("IntersectionObserver" in window){
   const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");io.unobserve(entry.target)}}),{threshold:.12});
   revealEls.forEach(el=>io.observe(el));
 }else revealEls.forEach(el=>el.classList.add("visible"));

 document.querySelectorAll("[data-room]").forEach(a=>a.addEventListener("click",()=>{
   const select=document.querySelector("#room");if(select)select.value=a.dataset.room;
 }));
 const ci=document.querySelector("#checkin"),co=document.querySelector("#checkout");
 if(ci&&co){const today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());const value=today.toISOString().slice(0,10);ci.min=value;co.min=value;ci.addEventListener("change",()=>{co.min=ci.value;if(co.value&&co.value<=ci.value)co.value=""})}
 const form=document.querySelector("#bookingForm");
 if(form)form.addEventListener("submit",e=>{e.preventDefault();const name=document.querySelector("#name")?.value.trim()||"Guest";const room=document.querySelector("#room")?.value||"your selected room";const msg=document.querySelector("#formMessage");if(msg)msg.textContent=`Thank you, ${name}. Your enquiry for the ${room} has been received. Our reservations team will contact you shortly.`});
});