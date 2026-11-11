(function(){
 const header=document.querySelector('header.nav'),menu=header&&header.querySelector('.links'),toggle=header&&header.querySelector('.mobile-menu-toggle');
 if(!header||!menu||!toggle)return;
 const mobile=window.matchMedia('(max-width:1050px)');let previousOverflow='';
 const groups=[...menu.querySelectorAll('.nav-group')];
 const page=[...document.querySelectorAll('body>main,body>footer')];
 function closeGroups(){groups.forEach(g=>{g.classList.remove('is-open');g.querySelector('.nav-toggle').setAttribute('aria-expanded','false')})}
 function setOpen(open,restore){
  header.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
  if(open){header.style.setProperty('--mobile-nav-top',Math.ceil(header.getBoundingClientRect().bottom)+'px');previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';page.forEach(el=>el.inert=true)}
  else{document.body.style.overflow=previousOverflow;page.forEach(el=>el.inert=false);closeGroups();if(restore)toggle.focus()}
 }
 toggle.addEventListener('click',()=>setOpen(!header.classList.contains('menu-open'),false));
 groups.forEach(g=>{const btn=g.querySelector('.nav-toggle');btn.addEventListener('click',()=>{const open=!g.classList.contains('is-open');closeGroups();g.classList.toggle('is-open',open);btn.setAttribute('aria-expanded',String(open))})});
 menu.addEventListener('click',e=>{if(mobile.matches&&e.target.closest('a'))setOpen(false,false)});
 document.addEventListener('click',e=>{if(!header.contains(e.target)&&!mobile.matches)closeGroups()});
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(header.classList.contains('menu-open'))setOpen(false,true);else closeGroups()}
  if(e.key==='Tab'&&header.classList.contains('menu-open')){
   const focus=[...header.querySelectorAll('a[href],button')].filter(el=>el.getClientRects().length&&!el.disabled);
   const first=focus[0],last=focus[focus.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
 });
 mobile.addEventListener('change',()=>{if(header.classList.contains('menu-open'))setOpen(false,false);else closeGroups()});
 window.addEventListener('resize',()=>{if(header.classList.contains('menu-open'))header.style.setProperty('--mobile-nav-top',Math.ceil(header.getBoundingClientRect().bottom)+'px')});
})();