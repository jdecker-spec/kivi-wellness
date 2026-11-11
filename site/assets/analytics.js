(function(){
 'use strict';
 const ID='G-F1CY7Q12V8',KEY='kivi-analytics-consent-v1';
 if(!['kiviwellness.com','www.kiviwellness.com'].includes(location.hostname))return;
 let active=false,choice=null;
 try{const stored=JSON.parse(localStorage.getItem(KEY)||'null');if(stored&&Date.now()-stored.at<180*86400000)choice=stored.allow;}catch(e){}
 function cleanUrl(value){try{const u=new URL(value);return u.origin+u.pathname}catch(e){return ''}}
 function event(name,extra){if(active)window.gtag('event',name,Object.assign({page_location:cleanUrl(location.href)},extra||{}))}
 function pendingLead(){
  try{const pending=Number(sessionStorage.getItem('kivi-lead-pending'));if(location.pathname==='/thank-you/'&&pending&&Date.now()-pending<3600000){event('generate_lead',{method:'website_inquiry'});sessionStorage.removeItem('kivi-lead-pending')}}catch(e){}
 }
 function start(){
  if(active)return;active=true;window['ga-disable-'+ID]=false;
  window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
  gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  gtag('consent','update',{analytics_storage:'granted'});gtag('js',new Date());
  gtag('config',ID,{page_location:cleanUrl(location.href),page_referrer:cleanUrl(document.referrer),allow_google_signals:false,allow_ad_personalization_signals:false,cookie_flags:'SameSite=Lax;Secure'});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+ID;document.head.appendChild(script);
  pendingLead();
 }
 const panel=document.createElement('section');panel.id='analytics-choice';panel.setAttribute('aria-label','Analytics preferences');panel.hidden=true;
 panel.innerHTML='<div><strong>Help us improve Kivi.</strong><p>Allow optional analytics to help us understand visits and interest in Kivi. We do not send inquiry field values to Google. <a href="/contact/privacy-policy/">Privacy policy</a></p></div><div class="analytics-choice-actions"><button type="button" data-choice="no">Essential only</button><button type="button" data-choice="yes">Allow analytics</button></div>';
 document.body.appendChild(panel);
 function choose(allow){choice=allow;try{localStorage.setItem(KEY,JSON.stringify({allow:allow,at:Date.now()}))}catch(e){}panel.hidden=true;
  if(allow)start();else{window['ga-disable-'+ID]=true;if(active){gtag('consent','update',{analytics_storage:'denied'});active=false}document.cookie.split(';').forEach(item=>{const name=item.split('=')[0].trim();if(name==='_ga'||name.startsWith('_ga_')){for(const domain of [location.hostname,'.kiviwellness.com','kiviwellness.com'])document.cookie=name+'=;Max-Age=0;path=/;domain='+domain+';SameSite=Lax;Secure';document.cookie=name+'=;Max-Age=0;path=/;SameSite=Lax;Secure'}})}
 }
 panel.querySelector('[data-choice=yes]').addEventListener('click',()=>choose(true));panel.querySelector('[data-choice=no]').addEventListener('click',()=>choose(false));
 document.querySelectorAll('[data-analytics-settings]').forEach(button=>button.addEventListener('click',()=>{panel.hidden=false;panel.querySelector('button').focus()}));
 document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;let u;try{u=new URL(a.href)}catch(err){return}
  if(u.hostname==='calendly.com')event('discovery_call_click',{link_domain:'calendly.com'});
  if(u.protocol==='mailto:')event('contact_email_click');
 });
 const form=document.getElementById('lead-form');if(form)form.addEventListener('submit',()=>{try{sessionStorage.setItem('kivi-lead-pending',String(Date.now()))}catch(e){}});
 if(choice===true)start();else if(choice===null)panel.hidden=false;
})();