const STEP_NAMES = ['Names','Photo','Design','Pay','Share'];
let currentStep = 1;
let photoDataUrl = null;
let relation = 'Brother';
let selectedTemplate = 'gold';
let paid = false;
let verifiedPayment = null; // { orderId, paymentId }

function buildStepper(){
  const knots = document.getElementById('knots');
  const labels = document.getElementById('stepLabels');
  knots.innerHTML=''; labels.innerHTML='';
  STEP_NAMES.forEach((name,i)=>{
    const n=i+1;
    const k=document.createElement('div');
    k.className='knot'; k.id='knot-'+n;
    k.innerHTML='<span>'+n+'</span>';
    knots.appendChild(k);
    const l=document.createElement('span');
    l.id='label-'+n; l.textContent=name;
    labels.appendChild(l);
  });
}

function buildTemplates(){
  const wrap = document.getElementById('templates');
  wrap.innerHTML='';
  Object.entries(TEMPLATES).forEach(([key,t])=>{
    const div=document.createElement('div');
    div.className='tpl'+(key===selectedTemplate?' sel':'');
    div.id='tpl-'+key;
    div.onclick=()=>{selectedTemplate=key; buildTemplates();};
    div.innerHTML=`<div class="tpl-swatch" style="background:${t.swatch}"><div class="dot" style="background:${t.accent}"></div></div><div class="tpl-name">${t.label}</div>`;
    wrap.appendChild(div);
  });
}

function updateStepper(){
  for(let n=1;n<=5;n++){
    const k=document.getElementById('knot-'+n);
    const l=document.getElementById('label-'+n);
    k.classList.remove('active','done'); l.classList.remove('active');
    if(n<currentStep) k.classList.add('done');
    else if(n===currentStep){k.classList.add('active'); l.classList.add('active');}
  }
  const pct = ((currentStep-1)/4)*100;
  document.getElementById('threadFill').style.width = pct+'%';
}

function gotoStep(step){
  if(step > currentStep){
    if(currentStep===1 && !validateNames()) return;
    if(currentStep===2 && !photoDataUrl){ showErr(2); return; }
    if(currentStep===3 && !selectedTemplate){ showErr(3); return; }
    if(currentStep===4 && !paid){ showErr(4,'Please complete payment to continue.'); return; }
  }
  document.getElementById('panel-'+currentStep).style.display='none';
  currentStep = step;
  document.getElementById('panel-'+currentStep).style.display='block';
  updateStepper();
  if(currentStep===5) renderFinalCard();
}

function showErr(n, msg){
  const el = document.getElementById('err-'+n);
  if(msg) el.textContent = msg;
  el.style.display='block';
}
function hideErr(n){ document.getElementById('err-'+n).style.display='none'; }

function validateNames(){
  const s=document.getElementById('senderName').value.trim();
  const r=document.getElementById('siblingName').value.trim();
  if(!s || !r){ showErr(1); return false; }
  hideErr(1); return true;
}

document.getElementById('contestOptIn').addEventListener('change', (e)=>{
  document.getElementById('contestStory').style.display = e.target.checked ? 'block' : 'none';
});

fetch('/api/stats').then(r=>r.json()).then(d=>{
  if(d && typeof d.totalEntries === 'number' && d.totalEntries > 0){
    document.getElementById('statsLine').textContent = `🧵 ${d.totalEntries}+ people have already tied their thread this Rakhi`;
  }
}).catch(()=>{ /* stats are a nice-to-have, fail silently */ });

document.querySelectorAll('.relation-toggle button').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('.relation-toggle button').forEach(b=>b.classList.remove('sel'));
    btn.classList.add('sel');
    relation = btn.dataset.rel;
  };
});

document.getElementById('photoInput').addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  if(!file.type.startsWith('image/')){
    showErr(2,'Please choose an image file.'); return;
  }
  if(file.size > 8*1024*1024){
    showErr(2,'Image is too large — please choose one under 8MB.'); return;
  }
  const reader = new FileReader();
  reader.onload = (ev)=>{
    photoDataUrl = ev.target.result;
    document.getElementById('previewImg').src = photoDataUrl;
    document.getElementById('previewWrap').style.display='flex';
    hideErr(2);
  };
  reader.onerror = ()=>{ showErr(2,'Could not read that photo — please try again.'); };
  reader.readAsDataURL(file);
  e.target.value = '';
});

// ---------- Payment (Razorpay: server creates order, server verifies signature) ----------
async function startPayment(){
  hideErr(4);
  const btn = document.getElementById('payBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Preparing…';

  try{
    const configRes = await fetch('/api/config');
    if(!configRes.ok) throw new Error('config');
    const { keyId } = await configRes.json();

    const orderRes = await fetch('/api/create-order', { method:'POST' });
    if(!orderRes.ok) throw new Error('order');
    const order = await orderRes.json();

    const sender = document.getElementById('senderName').value.trim() || 'Customer';

    const rzp = new Razorpay({
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Rakhi Memory',
      description: 'Personalised Rakhi Card',
      order_id: order.id,
      prefill: { name: sender },
      theme: { color: '#B23A2E' },
      handler: async function(response){
        btn.innerHTML = '<span class="spinner"></span> Verifying…';
        try{
          const verifyRes = await fetch('/api/verify-payment', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const result = await verifyRes.json();
          if(result.valid){
            paid = true;
            verifiedPayment = { orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id };
            btn.innerHTML = '✓ Payment verified';
            setTimeout(()=>gotoStep(5), 500);
          } else {
            btn.disabled = false;
            btn.innerHTML = 'Pay ₹10 securely';
            showErr(4,'Payment could not be verified. If money was deducted, it will be auto-refunded — please try again.');
          }
        }catch(e){
          btn.disabled = false;
          btn.innerHTML = 'Pay ₹10 securely';
          showErr(4,'Could not verify payment right now. Please try again.');
        }
      },
      modal: {
        ondismiss: function(){
          btn.disabled = false;
          btn.innerHTML = 'Pay ₹10 securely';
        }
      }
    });
    rzp.on('payment.failed', function(){
      btn.disabled = false;
      btn.innerHTML = 'Pay ₹10 securely';
      showErr(4,'Payment failed. Please try again.');
    });
    btn.disabled = false;
    btn.innerHTML = 'Pay ₹10 securely';
    rzp.open();
  }catch(e){
    btn.disabled = false;
    btn.innerHTML = 'Pay ₹10 securely';
    showErr(4,'Could not start payment. Please check your connection and try again.');
  }
}

// ---------- Result ----------
async function renderFinalCard(){
  const canvas = document.getElementById('cardCanvas');
  const sender = document.getElementById('senderName').value.trim();
  const sibling = document.getElementById('siblingName').value.trim();
  await renderRakhiCard(canvas, {
    templateKey: selectedTemplate,
    sender, sibling, relation, photoDataUrl
  });
  submitEntry(sender, sibling);
}

// Logs the entry server-side, bumps the real counter, and gets a pre-filled
// wa.me link back so it reaches your WhatsApp (6309579202) with one tap.
async function submitEntry(sender, sibling){
  const notice = document.getElementById('entryNotice');
  try{
    const res = await fetch('/api/entry', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        sender, sibling, relation,
        phone: document.getElementById('phoneNumber').value.trim(),
        contestOptIn: document.getElementById('contestOptIn').checked,
        story: document.getElementById('contestStory').value.trim(),
        paymentId: verifiedPayment ? verifiedPayment.paymentId : null,
      })
    });
    const data = await res.json();
    if(data.waLink){
      const popup = window.open(data.waLink, '_blank');
      notice.style.display = 'block';
      if(popup){
        notice.textContent = "✓ Your details are on their way to WhatsApp — just hit send in the tab that opened.";
      } else {
        notice.innerHTML = `Your browser blocked the auto-open. <a href="${data.waLink}" target="_blank" style="color:#256b42;font-weight:700;">Tap here to send your entry on WhatsApp</a>.`;
      }
    }
  }catch(e){
    // Entry logging/notification is best-effort — never blocks the card itself.
  }
}

function downloadCard(){
  const canvas = document.getElementById('cardCanvas');
  const link = document.createElement('a');
  link.download = 'rakhi-memory.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function shareWhatsApp(){
  const canvas = document.getElementById('cardCanvas');
  const sender = document.getElementById('senderName').value.trim() || 'Someone';
  const sibling = document.getElementById('siblingName').value.trim() || 'you';
  const text = `🧵 ${sender} tied a Rakhi Memory for ${sibling}! Happy Raksha Bandhan 🎊`;

  canvas.toBlob(async (blob)=>{
    const file = new File([blob], 'rakhi-memory.png', {type:'image/png'});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      try{
        await navigator.share({files:[file], title:'Rakhi Memory', text});
        return;
      }catch(e){ /* fall through */ }
    }
    downloadCard();
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, 'image/png');
}

buildStepper();
buildTemplates();
updateStepper();
