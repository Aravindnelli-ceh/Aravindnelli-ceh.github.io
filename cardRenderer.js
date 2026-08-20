// Shared Rakhi-card canvas renderer — used by app.html (real card) and gallery.html (sample previews)

const TEMPLATES = {
  gold: {
    label:'Golden Bond',
    bg:'#FBF1E0', ring:'#E8A23C', accent:'#7C1F3B', text:'#2B1B12', swatch:'linear-gradient(135deg,#FBF1E0,#E8A23C)'
  },
  maroon: {
    label:'Royal Maroon',
    bg:'#5C1129', ring:'#E8A23C', accent:'#F4D58D', text:'#FBF1E0', swatch:'linear-gradient(135deg,#5C1129,#B23A2E)'
  },
  ivory: {
    label:'Modern Ivory',
    bg:'#FFFDF8', ring:'#B23A2E', accent:'#5C1129', text:'#2B1B12', swatch:'linear-gradient(135deg,#FFFDF8,#F4D58D)'
  }
};

async function ensureFonts(){
  try{
    await Promise.all([
      document.fonts.load('600 40px Fraunces'),
      document.fonts.load('italic 500 30px Fraunces'),
      document.fonts.load('700 20px Karla'),
      document.fonts.load('400 18px Karla'),
    ]);
  }catch(e){}
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  const words = text.split(' ');
  let line = '';
  let curY = y;
  ctx.textAlign = 'center';
  words.forEach((word)=>{
    const test = line + word + ' ';
    if(ctx.measureText(test).width > maxWidth && line !== ''){
      ctx.fillText(line, x, curY);
      line = word + ' ';
      curY += lineHeight;
    } else {
      line = test;
    }
  });
  ctx.fillText(line, x, curY);
}

/**
 * Draws a Rakhi memory card onto the given canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {Object} opts
 * @param {string} opts.templateKey - 'gold' | 'maroon' | 'ivory'
 * @param {string} opts.sender
 * @param {string} opts.sibling
 * @param {string} opts.relation - 'Brother' | 'Sister'
 * @param {string|null} opts.photoDataUrl
 */
async function renderRakhiCard(canvas, opts){
  await ensureFonts();
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const t = TEMPLATES[opts.templateKey] || TEMPLATES.gold;
  const sender = (opts.sender || 'Someone').trim() || 'Someone';
  const sibling = (opts.sibling || 'You').trim() || 'You';
  const relation = opts.relation || 'Brother';

  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = t.bg;
  ctx.fillRect(0,0,W,H);

  ctx.font = '54px serif';
  ctx.globalAlpha = 0.5;
  ctx.fillText('🪔', 60, 110);
  ctx.fillText('🪔', W-140, 110);
  ctx.globalAlpha = 1;

  ctx.strokeStyle = t.ring;
  ctx.lineWidth = 6;
  ctx.strokeRect(40,40,W-80,H-80);
  ctx.strokeStyle = t.accent;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(54,54,W-108,H-108);

  ctx.fillStyle = t.accent;
  ctx.font = '700 24px Karla';
  ctx.textAlign = 'center';
  ctx.fillText('R A K S H A   B A N D H A N', W/2, 175);

  const cx = W/2, cy = 430, r = 190;
  if(opts.photoDataUrl){
    await new Promise((resolve)=>{
      const img = new Image();
      img.onload = ()=>{
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx,cy,r,0,Math.PI*2);
        ctx.closePath();
        ctx.clip();
        const scale = Math.max((r*2)/img.width, (r*2)/img.height);
        const iw = img.width*scale, ih = img.height*scale;
        ctx.drawImage(img, cx-iw/2, cy-ih/2, iw, ih);
        ctx.restore();
        resolve();
      };
      img.onerror = resolve;
      img.src = opts.photoDataUrl;
    });
  } else {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fillStyle = t.ring + '33';
    ctx.fill();
    ctx.font = '90px serif';
    ctx.fillStyle = t.accent;
    ctx.fillText('🧵', cx, cy+30);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.lineWidth = 10;
  ctx.strokeStyle = t.ring;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx,cy,r+16,0,Math.PI*2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = t.accent;
  ctx.stroke();

  ctx.font = '46px serif';
  ctx.fillText('🧵🪢', cx, cy+r+80);

  ctx.fillStyle = t.text;
  ctx.font = "600 64px 'Fraunces', serif";
  ctx.fillText('Happy Raksha Bandhan', cx, 800);

  ctx.font = "italic 500 40px 'Fraunces', serif";
  ctx.fillStyle = t.accent;
  const relWord = relation === 'Brother' ? 'brother' : 'sister';
  ctx.fillText(`To my dearest ${relWord}, ${sibling}`, cx, 880);

  ctx.font = "400 30px Karla";
  ctx.fillStyle = t.text;
  wrapText(ctx, 'Distance may keep us apart, but this thread ties our bond closer than ever.', cx, 940, 760, 42);

  ctx.font = "700 32px Karla";
  ctx.fillStyle = t.accent;
  ctx.fillText(`— with love, ${sender}`, cx, 1180);

  ctx.font = "400 20px Karla";
  ctx.fillStyle = t.text;
  ctx.globalAlpha = 0.55;
  ctx.fillText('Made with Create Your Rakhi Memory', cx, H-70);
  ctx.globalAlpha = 1;
}

