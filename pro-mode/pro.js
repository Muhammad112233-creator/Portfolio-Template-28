/* ============================================================
   NOVA.SYS — Pro Mode cockpit · pro.js
   Original work. Pseudo-3D engine on plain canvas — no libs.
   ============================================================ */
'use strict';
const $  = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- content (pro edition) ---------------- */
const I18N = {
en: {
  about:'ABOUT ME', projects:'PROJECTS', skills:'SKILLS', hobbies:'HOBBIES', contact:'CONTACT',
  'sub.about':'PROFILE', 'sub.projects':'6 FILES', 'sub.skills':'4 FIELDS', 'sub.hobbies':'OFFLINE', 'sub.contact':'UPLINK',
  'intro.sub':'COCKPIT LINK ESTABLISHED',
  'about.html':`<h3>WHO AM I</h3>
    <p class="lead">Hi — I’m <b>Ayaan Malik</b>, call sign <b>NOVA</b>. Computer Science student living on the boundary between artificial intelligence, small robots and the web.</p>
    <p>Most of my work starts as a silly question at 2 a.m. and ends as something people actually use. Curiosity is my main framework; shipping is my favourite feature.</p>
    <h3>EDUCATION & CERTIFICATES</h3>
    <ul>
      <li>UET Lahore — BSc Computer Science <i>(2023–2027)</i></li>
      <li>DeepLearning.AI — TensorFlow Developer <i>(2025)</i></li>
      <li>AWS Certified Cloud Practitioner <i>(2025)</i></li>
      <li>freeCodeCamp — JS Algorithms <i>(2024)</i></li>
    </ul>`,
  'projects.html':`<h3>PROJECT FILES</h3><ul>
    <li><b>NebulaChat</b> — RAG study assistant · Python, FastAPI</li>
    <li><b>OrbitDash</b> — live satellite tracker · JavaScript, Canvas</li>
    <li><b>PixelForge</b> — browser pixel-art editor · TypeScript, PWA</li>
    <li><b>SnapMenu</b> — menu photo translator · Flutter, OCR</li>
    <li><b>EchoKeys</b> — rhythm typing trainer · WebAudio</li>
    <li><b>TerraSense</b> — IoT plant monitor · ESP32, MQTT</li>
  </ul><p>Default mode holds the full case files — this cockpit keeps the short list on the glass.</p>`,
  'skills.html':`<h3>FIELDS</h3><ul>
    <li><b>AI / ML</b> — Python, PyTorch, scikit-learn, RAG tooling</li>
    <li><b>Web</b> — TypeScript, React, Node.js, CSS motion</li>
    <li><b>Embedded</b> — Arduino, ESP32, C++, sensors</li>
    <li><b>Design & 3D</b> — Figma, Blender, pixel art</li>
  </ul><p>Levels are honest, not heroic. They go up by building.</p>`,
  'hobbies.html':`<h3>WHEN I AM OFFLINE</h3>
    <p class="lead">Astronomy · Chess · Cycling · Photography · E-sports · Sci-fi novels</p>
    <p>Rest is also engineering. These keep my inputs noisy and my outputs weird.</p>`,
  'contact.html':`<h3>OPEN A CHANNEL</h3>
    <p class="lead">Collaboration offers, project ideas, a good chess trap — or just saying hi.</p>
    <ul>
      <li><b>EMAIL</b> — hello@ayaanmalik.dev</li>
      <li><b>GITHUB</b> — github.com/ayaanmalik</li>
      <li><b>LINKEDIN</b> — linkedin.com/in/ayaanmalik</li>
    </ul>
    <p>Average response time: <b>&lt; 24h</b>.</p>`
},
tr: {
  about:'HAKKIMDA', projects:'PROJELER', skills:'YETENEKLER', hobbies:'HOBİLER', contact:'İLETİŞİM',
  'sub.about':'PROFİL', 'sub.projects':'6 DOSYA', 'sub.skills':'4 ALAN', 'sub.hobbies':'ÇEVRİMDIŞI', 'sub.contact':'BAĞLANTI',
  'intro.sub':'KOKPİT BAĞLANTISI KURULDU',
  'about.html':`<h3>BEN KİMİM</h3>
    <p class="lead">Merhaba — ben <b>Ayaan Malik</b>, çağrı kodu <b>NOVA</b>. Yapay zeka, küçük robotlar ve web arasındaki çizgide yaşayan bir bilgisayar mühendisliği öğrencisiyim.</p>
    <p>İşlerimin çoğu gece ikide sorulan saçma bir soruyla başlar ve insanların gerçekten kullandığı bir şeyle biter.</p>
    <h3>EĞİTİM & SERTİFİKALAR</h3>
    <ul>
      <li>UET Lahore — Bilgisayar Müh. <i>(2023–2027)</i></li>
      <li>DeepLearning.AI — TensorFlow Geliştirici <i>(2025)</i></li>
      <li>AWS Certified Cloud Practitioner <i>(2025)</i></li>
      <li>freeCodeCamp — JS Algoritmaları <i>(2024)</i></li>
    </ul>`,
  'projects.html':`<h3>PROJE DOSYALARI</h3><ul>
    <li><b>NebulaChat</b> — RAG çalışma asistanı · Python, FastAPI</li>
    <li><b>OrbitDash</b> — canlı uydu takibi · JavaScript, Canvas</li>
    <li><b>PixelForge</b> — tarayıcı piksel-art editörü · TypeScript, PWA</li>
    <li><b>SnapMenu</b> — menü fotoğraf çevirmeni · Flutter, OCR</li>
    <li><b>EchoKeys</b> — ritimli yazı antrenörü · WebAudio</li>
    <li><b>TerraSense</b> — IoT bitki monitörü · ESP32, MQTT</li>
  </ul><p>Tam vaka dosyaları varsayılan modda — kokpit camında kısa liste tutulur.</p>`,
  'skills.html':`<h3>ALANLAR</h3><ul>
    <li><b>Yapay Zeka</b> — Python, PyTorch, scikit-learn, RAG</li>
    <li><b>Web</b> — TypeScript, React, Node.js, CSS motion</li>
    <li><b>Gömülü</b> — Arduino, ESP32, C++, sensörler</li>
    <li><b>Tasarım & 3D</b> — Figma, Blender, piksel art</li>
  </ul><p>Seviyeler dürüsttür, kahramanca değil.</p>`,
  'hobbies.html':`<h3>ÇEVRİMDIŞIYKEN</h3>
    <p class="lead">Astronomi · Satranç · Bisiklet · Fotoğraf · E-spor · Bilim kurgu</p>
    <p>Dinlenmek de mühendisliktir. Bunlar girdilerimi gürültülü, çıktılarımı tuhaf tutar.</p>`,
  'contact.html':`<h3>KANAL AÇ</h3>
    <p class="lead">İş birliği, proje fikirleri, iyi bir satranç tuzağı — ya da sadece merhaba.</p>
    <ul>
      <li><b>E-POSTA</b> — hello@ayaanmalik.dev</li>
      <li><b>GITHUB</b> — github.com/ayaanmalik</li>
      <li><b>LINKEDIN</b> — linkedin.com/in/ayaanmalik</li>
    </ul>
    <p>Ortalama yanıt süresi: <b>&lt; 24 saat</b>.</p>`
},
de: {
  about:'ÜBER MICH', projects:'PROJEKTE', skills:'SKILLS', hobbies:'HOBBIES', contact:'KONTAKT',
  'sub.about':'PROFIL', 'sub.projects':'6 DATEIEN', 'sub.skills':'4 FELDER', 'sub.hobbies':'OFFLINE', 'sub.contact':'UPLINK',
  'intro.sub':'COCKPIT-LINK HERGESTELLT',
  'about.html':`<h3>WER BIN ICH</h3>
    <p class="lead">Hi — ich bin <b>Ayaan Malik</b>, Rufzeichen <b>NOVA</b>. Informatikstudent, der genau auf der Grenze zwischen KI, kleinen Robotern und dem Web lebt.</p>
    <p>Die meisten meiner Arbeiten beginnen als absurde Frage um 2 Uhr nachts und enden als etwas, das Leute wirklich benutzen.</p>
    <h3>AUSBILDUNG & ZERTIFIKATE</h3>
    <ul>
      <li>UET Lahore — BSc Informatik <i>(2023–2027)</i></li>
      <li>DeepLearning.AI — TensorFlow Developer <i>(2025)</i></li>
      <li>AWS Certified Cloud Practitioner <i>(2025)</i></li>
      <li>freeCodeCamp — JS Algorithmen <i>(2024)</i></li>
    </ul>`,
  'projects.html':`<h3>PROJEKT-DATEIEN</h3><ul>
    <li><b>NebulaChat</b> — RAG-Lernassistent · Python, FastAPI</li>
    <li><b>OrbitDash</b> — Live-Satelliten-Tracker · JavaScript, Canvas</li>
    <li><b>PixelForge</b> — Pixel-Art-Editor im Browser · TypeScript, PWA</li>
    <li><b>SnapMenu</b> — Speisekarten-Übersetzer · Flutter, OCR</li>
    <li><b>EchoKeys</b> — Rhythmus-Tipptrainer · WebAudio</li>
    <li><b>TerraSense</b> — IoT-Pflanzenmonitor · ESP32, MQTT</li>
  </ul><p>Die vollen Akten liegen im Default-Modus — im Cockpit bleibt die Kurzliste auf dem Glas.</p>`,
  'skills.html':`<h3>FELDER</h3><ul>
    <li><b>KI / ML</b> — Python, PyTorch, scikit-learn, RAG-Tooling</li>
    <li><b>Web</b> — TypeScript, React, Node.js, CSS-Motion</li>
    <li><b>Embedded</b> — Arduino, ESP32, C++, Sensoren</li>
    <li><b>Design & 3D</b> — Figma, Blender, Pixel-Art</li>
  </ul><p>Level sind ehrlich, nicht heroisch.</p>`,
  'hobbies.html':`<h3>WENN ICH OFFLINE BIN</h3>
    <p class="lead">Astronomie · Schach · Radfahren · Fotografie · E-Sport · Sci-Fi</p>
    <p>Ruhe ist auch Ingenieurskunst. Das hält meine Eingaben verrauscht und meine Ausgaben seltsam.</p>`,
  'contact.html':`<h3>KANAL ÖFFNEN</h3>
    <p class="lead">Kooperationen, Projektideen, eine gute Schachfalle — oder einfach Hallo sagen.</p>
    <ul>
      <li><b>E-MAIL</b> — hello@ayaanmalik.dev</li>
      <li><b>GITHUB</b> — github.com/ayaanmalik</li>
      <li><b>LINKEDIN</b> — linkedin.com/in/ayaanmalik</li>
    </ul>
    <p>Ø Antwortzeit: <b>&lt; 24h</b>.</p>`
}};
let lang = store.get('nova-lang', 'en');
if (!I18N[lang]) lang = 'en';
const t = k => I18N[lang][k] ?? I18N.en[k] ?? k;

/* ---------------- starfield canvas ---------------- */
const cv = $('#space'), cx = cv.getContext('2d');
let W = 0, H = 0, DPR = 1;
function resize(){
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  cx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
addEventListener('resize', resize); resize();

class Star{
  constructor(){ this.reset(true); }
  reset(init){
    this.x = (Math.random() - .5) * 2;
    this.y = (Math.random() - .5) * 2;
    this.z = init ? Math.random() : 1;
    this.pz = this.z;
  }
  step(speed){
    this.pz = this.z;
    this.z -= speed;
    if (this.z <= .02) this.reset(false);
  }
  draw(){
    const f = .5 / this.z, pf = .5 / this.pz;
    const x = W/2 + this.x * f * W/2, y = H/2 + this.y * f * H/2;
    const px = W/2 + this.x * pf * W/2, py = H/2 + this.y * pf * H/2;
    const a = clamp(1.2 - this.z, 0, 1);
    cx.strokeStyle = `rgba(255,246,200,${(a * .8).toFixed(3)})`;
    cx.lineWidth = clamp((1 - this.z) * 2.4, .4, 2.4);
    cx.beginPath(); cx.moveTo(px, py); cx.lineTo(x, y); cx.stroke();
  }
}
let stars = Array.from({ length: reduceMotion ? 120 : 320 }, () => new Star());
let warp = 3, warpTarget = 3;

/* occasional far planet */
let planet = null;
setInterval(() => {
  if (Math.random() < .5 && !planet){
    planet = { x: W * (0.15 + Math.random() * .7), y: H * (0.12 + Math.random() * .4), r: 26 + Math.random() * 46, hue: [190, 45, 150][Math.floor(Math.random()*3)], life: 0 };
    setTimeout(() => planet = null, 9000);
  }
}, 7000);

/* mouse parallax */
const cam = { x:0, y:0, tx:0, ty:0 };
addEventListener('mousemove', e => {
  cam.tx = (e.clientX / W - .5) * 2;
  cam.ty = (e.clientY / H - .5) * 2;
  const r = $('#reticle');
  r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
}, { passive:true });

/* ---------------- pods ---------------- */
const POD_DEFS = [
  { id:'about',    color:'#00f5ff', icon:'M0 -11 a11 11 0 1 0 0.01 0 M-15 14 q0 -12 15 -12 q15 0 15 12', pos:[-.62, -.28, .9] },
  { id:'projects', color:'#bf00ff', icon:'M0 -14 l12 7 v14 l-12 7 l-12 -7 v-14 z M0 -14 v28', pos:[.62, -.30, .9] },
  { id:'skills',   color:'#00ff88', icon:'M-9 -9 h18 v18 h-18 z M-4 -4 h8 v8 h-8 z', pos:[-.78, .26, 1.05] },
  { id:'hobbies',  color:'#ffee00', icon:'M0 -14 l3.6 8.4 h8.8 l-7 5.6 l2.6 8.6 l-8 -5.4 l-8 5.4 l2.6 -8.6 l-7 -5.6 h8.8 z', pos:[.78, .28, 1.05] },
  { id:'contact',  color:'#ff006e', icon:'M-14 -9 h28 v18 h-28 z M-14 -9 l14 10 l14 -10', pos:[0, .02, .62] }
];
const podLayer = $('#pod-layer');
let selected = 2;
const pods = POD_DEFS.map((def, i) => {
  const el = document.createElement('div');
  el.className = 'pod'; el.id = 'pod-' + def.id;
  el.style.setProperty('--pc', def.color);
  el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0');
  el.innerHTML = `
    <div class="pod-disc"><svg viewBox="-18 -18 36 36"><path d="${def.icon}"/></svg></div>
    <div class="pod-name"></div><div class="pod-sub"></div>`;
  el.addEventListener('click', () => { selected = i; syncSel(); Console.openFor(def.id); });
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); Console.openFor(def.id); } });
  podLayer.appendChild(el);
  return { def, el, nameEl: $('.pod-name', el), subEl: $('.pod-sub', el), bob: Math.random() * 6.28 };
});
function syncSel(){ pods.forEach((p, i) => p.el.classList.toggle('sel', i === selected)); }
function labelPods(){
  pods.forEach(p => {
    p.nameEl.textContent = t(p.def.id);
    p.subEl.textContent = t('sub.' + p.def.id);
    p.el.setAttribute('aria-label', t(p.def.id));
  });
}

/* project pods through pseudo-3D */
function placePods(tm){
  const cxp = W / 2 - cam.x * 30, cyp = H / 2 - cam.y * 22 - H * .02;
  const fl = Math.min(W, H) * .62;
  pods.forEach((p, i) => {
    const [px, py, pz] = p.def.pos;
    const bob = Math.sin(tm / 1400 + p.bob) * 10;
    const f = fl / (fl + pz * 300);
    const x = cxp + px * W * .42 * f + cam.x * (pz * -18);
    const y = cyp + py * H * .42 * f + cam.y * (pz * -10) + bob;
    const s = (.55 + f * .6) * (i === selected ? 1.12 : 1);
    p.el.style.transform = `translate(${x}px,${y}px) scale(${s})`;
    p.el.style.zIndex = Math.round(100 - pz * 10);
    p.el.style.opacity = .75 + f * .3;
  });
}

/* ---------------- console overlay ---------------- */
const Console = {
  isOpen:false,
  openFor(id){
    const holo = $('#console');
    $('#console-title').textContent = t(id);
    $('#console-tag').textContent = t('sub.' + id);
    let html = t(id + '.html');
    if (id === 'projects'){
      const img = ['nebulachat','orbitdash','pixelforge','snapmenu','echokeys','terrasense'][0];
      html = `<img class="cimg" src="../assets/proj-${img}.jpg" alt="Project artwork">` + html;
    }
    $('#console-body').innerHTML = html;
    holo.classList.add('open');
    holo.setAttribute('aria-hidden', 'false');
    $('#console-close').focus({ preventScroll:true });
    this.isOpen = true; blip(660, .12);
  },
  close(){
    $('#console').classList.remove('open');
    $('#console').setAttribute('aria-hidden', 'true');
    this.isOpen = false; blip(340, .1);
  }
};
$('#console-close').addEventListener('click', () => Console.close());
$('#console').addEventListener('click', e => { if (e.target.id === 'console') Console.close(); });

/* keyboard nav */
addEventListener('keydown', e => {
  if (e.key === 'Escape'){ if (Console.isOpen) Console.close(); else location.href = '../'; return; }
  if (Console.isOpen) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown'){ selected = (selected + 1) % pods.length; syncSel(); blip(520, .06); e.preventDefault(); }
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')  { selected = (selected - 1 + pods.length) % pods.length; syncSel(); blip(440, .06); e.preventDefault(); }
  if (e.key === 'Enter'){ Console.openFor(pods[selected].def.id); e.preventDefault(); }
});

/* tiny ui blips (WebAudio, no files) */
let actx = null;
function blip(freq, dur){
  try{
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'triangle'; o.frequency.value = freq;
    g.gain.setValueAtTime(.08, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + dur);
    o.connect(g); g.connect(actx.destination);
    o.start(); o.stop(actx.currentTime + dur + .02);
  }catch(e){}
}
addEventListener('pointerdown', () => { if (!actx) blip(1, .001); }, { once:true });

/* ---------------- HUD wiring ---------------- */
$('#warp').addEventListener('input', e => { warpTarget = +e.target.value; blip(300 + warpTarget * 40, .05); });
$('#pro-fs').addEventListener('click', () => {
  blip(500, .07);
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
});
$$('.p-lang').forEach(b => b.addEventListener('click', () => {
  lang = b.dataset.lang; store.set('nova-lang', lang);
  document.documentElement.lang = lang;
  $$('.p-lang').forEach(x => x.classList.toggle('active', x === b));
  labelPods();
  $('#pro-intro-sub').textContent = t('intro.sub');
  if (Console.isOpen) Console.close();
  blip(560, .07);
}));
setInterval(() => {
  const d = new Date(), p = n => String(n).padStart(2, '0');
  const el = $('#cockpit-clock'); if (el) el.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}, 1000);

/* log ticker in cockpit frame */
const LOG_LINES = {
  en:['LINK ESTABLISHED','SCANNING SECTOR 7G','SHIELDS: NOMINAL','POD ARRAY: 5 ONLINE','COFFEE LEVELS: CRITICAL'],
  tr:['BAĞLANTI KURULDU','SEKTÖR 7G TARANIYOR','KALKANLAR: NORMAL','POD DİZİSİ: 5 ÇEVRİMİÇİ','KAHVE SEVİYESİ: KRİTİK'],
  de:['LINK HERGESTELLT','SEKTOR 7G WIRD GESCANNT','SCHILDE: NOMINAL','POD-ARRAY: 5 ONLINE','KAFFEELEVEL: KRITISCH']
};
let logIdx = 0;
setInterval(() => {
  const el = $('#sys-log-line'); if (!el) return;
  logIdx = (logIdx + 1) % LOG_LINES.en.length;
  el.textContent = (LOG_LINES[lang] || LOG_LINES.en)[logIdx];
}, 3800);

/* ---------------- render loop ---------------- */
function planetDraw(){
  if (!planet) return;
  planet.life += .01;
  const { x, y, r, hue } = planet;
  const a = clamp(Math.sin(Math.min(planet.life, 3.14)) * .8, 0, .8);
  const g = cx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r);
  g.addColorStop(0, `hsla(${hue},80%,60%,${a})`);
  g.addColorStop(1, `hsla(${hue},70%,16%,${a * .8})`);
  cx.fillStyle = g;
  cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.fill();
  cx.strokeStyle = `hsla(${hue},90%,70%,${a * .5})`;
  cx.beginPath(); cx.ellipse(x, y, r * 1.6, r * .34, -.5, 0, 7); cx.stroke();
}

function loop(tm){
  warp = lerp(warp, warpTarget, .04);
  cam.x = lerp(cam.x, cam.tx, .05);
  cam.y = lerp(cam.y, cam.ty, .05);
  cx.clearRect(0, 0, W, H);
  /* deep gradient */
  const g = cx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * .7);
  g.addColorStop(0, '#05070d'); g.addColorStop(1, '#020408');
  cx.fillStyle = g; cx.fillRect(0, 0, W, H);
  const speed = (reduceMotion ? .0006 : .0016) * (warp / 3 + .2) * (warp >= 8 ? 2.2 : 1);
  for (const s of stars){ s.step(speed); s.draw(); }
  planetDraw();
  /* speed glow at high warp */
  if (warp > 6){
    const gg = cx.createRadialGradient(W/2, H/2, H * .2, W/2, H/2, H * .75);
    gg.addColorStop(0, 'rgba(255,238,0,0)'); gg.addColorStop(1, `rgba(255,238,0,${(warp - 6) * .02})`);
    cx.fillStyle = gg; cx.fillRect(0, 0, W, H);
  }
  placePods(tm || 0);
  requestAnimationFrame(loop);
}

/* ---------------- init ---------------- */
function init(){
  document.documentElement.lang = lang;
  $$('.p-lang').forEach(x => x.classList.toggle('active', x.dataset.lang === lang));
  $('#pro-intro-sub').textContent = t('intro.sub');
  labelPods(); syncSel();
  requestAnimationFrame(loop);
  setTimeout(() => $('#pro-intro').classList.add('gone'), reduceMotion ? 250 : 1750);
}
init();
