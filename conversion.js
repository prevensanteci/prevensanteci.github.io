(()=>{
const PHONE='2250712619655';
const params=new URLSearchParams(location.search);
const clean=v=>String(v||'').slice(0,120).replace(/[\r\n<>]/g,' ').trim();
const rawSource=clean(params.get('utm_source'));
const ref=(()=>{try{return document.referrer?new URL(document.referrer).hostname.replace(/^www\./,''):''}catch(_){return''}})();
let previous={};try{previous=JSON.parse(sessionStorage.getItem('psci_attribution')||'{}')}catch(_){}
const source=rawSource||previous.source||ref||'direct';
const attribution={source,campaign:clean(params.get('utm_campaign'))||previous.campaign||'',medium:clean(params.get('utm_medium'))||previous.medium||'',content:clean(params.get('utm_content'))||previous.content||''};
try{sessionStorage.setItem('psci_attribution',JSON.stringify(attribution))}catch(_){}
const sourceLabels={fr:{facebook:'Facebook',instagram:'Instagram',whatsapp_status:'WhatsApp Status',google:'Google',pharmacy_qr:'une pharmacie',hotel_qr:'un hôtel',flyer:'un flyer',company:'une entreprise'},en:{facebook:'Facebook',instagram:'Instagram',whatsapp_status:'WhatsApp Status',google:'Google',pharmacy_qr:'a pharmacy',hotel_qr:'a hotel',flyer:'a flyer',company:'a company'}};
const track=(event,extra={})=>{
  const item={event:String(event),source:attribution.source,ts:new Date().toISOString(),...extra};
  window.dispatchEvent(new CustomEvent('psci:conversion',{detail:item}));
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push(item);
  try{const key='psci_conversion_events';const list=JSON.parse(sessionStorage.getItem(key)||'[]').slice(-29);list.push(item);sessionStorage.setItem(key,JSON.stringify(list))}catch(_){}
};
window.psciTrack=track;
track('page_view');
if(location.pathname.endsWith('/confirmation.html')||location.pathname.endsWith('confirmation.html'))track('form_submit_success');
const inputMap={acquisitionSource:'source',acquisitionCampaign:'campaign',acquisitionMedium:'medium',acquisitionContent:'content'};
Object.entries(inputMap).forEach(([id,key])=>{const el=document.getElementById(id);if(el)el.value=attribution[key]||''});
const lang=()=>document.documentElement.lang==='en'?'en':'fr';
function sourceSentence(){
  if(attribution.source==='direct')return'';
  const lg=lang(); const label=sourceLabels[lg][attribution.source]||attribution.source;
  return lg==='fr'?` J’ai découvert PrévenSanté CI via ${label}.`:` I found PrévenSanté CI via ${label}.`;
}
function messageFor(context){
  const en=lang()==='en';
  const map=en?{
    consultation:'Hello PrévenSanté CI, I would like to book a home medical consultation in San Pedro.',
    appointment:'Hello PrévenSanté CI, I would like to book an appointment.',
    relative:'Hello PrévenSanté CI, I would like to organise care for a loved one in San Pedro.',
    business:'Hello PrévenSanté CI, I would like to discuss a workplace health service for my organisation.'
  }:{
    consultation:'Bonjour PrévenSanté CI, je souhaite prendre rendez-vous pour une consultation médicale à domicile à San Pedro.',
    appointment:'Bonjour PrévenSanté CI, je souhaite prendre rendez-vous.',
    relative:'Bonjour PrévenSanté CI, je souhaite organiser les soins d’un proche à San Pedro.',
    business:'Bonjour PrévenSanté CI, je souhaite échanger sur une intervention santé pour mon entreprise.'
  };
  return (map[context]||map.appointment)+sourceSentence();
}
function refreshWhatsapp(){
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a=>{
    const context=a.dataset.waContext||'appointment';
    a.href=`https://wa.me/${PHONE}?text=${encodeURIComponent(messageFor(context))}`;
    a.rel='noopener noreferrer';
  });
}
refreshWhatsapp();
new MutationObserver(()=>refreshWhatsapp()).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
document.addEventListener('click',e=>{
  const wa=e.target.closest('a[href^="https://wa.me/"]');
  if(wa){track('whatsapp_click',{context:wa.dataset.waContext||'appointment'});return}
  const tel=e.target.closest('a[href^="tel:"]');
  if(tel){track('phone_click');return}
  const pack=e.target.closest('[data-pack]');
  if(pack){track('pack_click',{pack:pack.dataset.pack});return}
  const open=e.target.closest('[data-open]');
  if(open){track('form_open',{service:open.dataset.open||'generic'});return}
  const cb=e.target.closest('[data-callback]');
  if(cb){track('callback_request');return}
});
const form=document.getElementById('rdvForm');
if(form){
  let started=false;
  form.addEventListener('input',()=>{if(!started){started=true;track('form_started')}},{passive:true});
  form.addEventListener('change',()=>{if(!started){started=true;track('form_started')}},{passive:true});
  form.addEventListener('submit',()=>track('form_submit_attempt'),{capture:true});
}
})();
