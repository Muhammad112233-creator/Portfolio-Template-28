/* ============================================================
   NOVA.SYS — HUD Portfolio · script.js
   Original work. Vanilla JS, zero dependencies.
   ============================================================ */
'use strict';

/* ---------------- utils ---------------- */
const $  = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;

/* ============================================================
   I18N + CONTENT DATA
   ============================================================ */
const I18N = {
en: {
  'a11y.skip': 'Skip to summary',
  'ui.pro': 'PRO MODE', 'ui.back': '◄ GO BACK', 'ui.root': 'MAIN TREE',
  'boot.calib': 'AUDIO CALIBRATION', 'boot.test': '▶ TEST VOLUME',
  'boot.hint': 'Adjust volume here — or drag the waveform while testing',
  'boot.enter': 'ENTER INTERFACE', 'boot.pro': '◉ START IN PRO MODE', 'boot.skip': 'SKIP ▸',
  'tagline': 'AI · ROBOTICS · WEB ENGINEERING',
  'hero.sub': 'AI and robotics enthusiast',
  'node.about': 'ABOUT ME', 'node.projects': 'PROJECTS', 'node.skills': 'SKILLS & INTERESTS',
  'node.hobbies': 'HOBBIES', 'node.contact': 'CONTACT',
  'sub.projects': '6 FILES', 'sub.skills': '4 FIELDS', 'sub.about': 'PROFILE',
  'sub.hobbies': 'OFFLINE', 'sub.contact': 'UPLINK',
  'panel.tag.profile': 'PROFILE', 'panel.tag.file': 'FILE', 'panel.tag.field': 'FIELD',
  'panel.tag.sys': 'SYSTEM', 'panel.tag.link': 'UPLINK',
  'about.h.edu': 'EDUCATION & CERTIFICATES', 'about.h.who': 'WHO AM I',
  'about.p1': 'Hi — I’m <b>Ayaan Malik</b>, call sign <b>NOVA</b>. I’m a Computer Science student who lives on the boundary between <b>artificial intelligence</b>, small robots and the web. I learn something new every single day and turn it into a project before it goes cold.',
  'about.p2': 'Most of my work starts as a silly question at 2 a.m. — <i>“could a browser do this?”</i> — and ends as something people actually use. Curiosity is my main framework; shipping is my favourite feature.',
  'about.p3': 'Away from the keyboard I chase dark skies with a small telescope, play aggressive chess openings, and take far too many photos of the moon.',
  'about.quote': '“Build the weird thing. Then make it useful.”',
  'edu.1': 'UET Lahore — BSc Computer Science', 'edu.1y': '2023–2027',
  'edu.2': 'DeepLearning.AI — TensorFlow Developer Certificate', 'edu.2y': '2025',
  'edu.3': 'AWS Certified Cloud Practitioner', 'edu.3y': '2025',
  'edu.4': 'freeCodeCamp — JavaScript Algorithms & Data Structures', 'edu.4y': '2024',
  'edu.note': 'Still a student — the experience section grows as I do.',
  'skills.h.levels': 'PROFICIENCY LEVELS',
  'skills.ai': 'AI / MACHINE LEARNING', 'skills.web': 'WEB ENGINEERING',
  'skills.emb': 'EMBEDDED / ROBOTICS', 'skills.des': 'DESIGN & 3D',
  'hobbies.h': 'WHEN I AM OFFLINE',
  'hobbies.note': 'Rest is also engineering. These keep my inputs noisy and my outputs weird.',
  'hob.1': 'Astronomy', 'hob.2': 'Chess', 'hob.3': 'Cycling', 'hob.4': 'Photography',
  'hob.5': 'E-sports', 'hob.6': 'Sci-fi novels',
  'contact.h': 'OPEN A CHANNEL',
  'contact.p': 'Collaboration offers, project ideas, a good chess trap — or just saying hi. My inbox is always listening.',
  'contact.mail': 'SEND EMAIL', 'contact.note': 'Average response time: <b>&lt; 24h</b>. Encrypted pigeons welcome.',
  'proj.visit': 'VISIT PROJECT', 'proj.overview': 'SELECT A FILE FROM THE TREE — OR PICK ONE BELOW',
  'skills.note': 'Levels are honest, not heroic. They go up by building, not by wishing.'
},
tr: {
  'a11y.skip': 'Özete atla',
  'ui.pro': 'PRO MODE', 'ui.back': '◄ GERİ DÖN', 'ui.root': 'ANA AĞAÇ',
  'boot.calib': 'SES KALİBRASYONU', 'boot.test': '▶ SESİ TEST ET',
  'boot.hint': 'Sesi buradan ayarla — test ederken dalga formunu sürükle',
  'boot.enter': 'ARAYÜZE GİR', 'boot.pro': '◉ PRO MODE İLE BAŞLA', 'boot.skip': 'ATLA ▸',
  'tagline': 'YAPAY ZEKA · ROBOTİK · WEB MÜHENDİSLİĞİ',
  'hero.sub': 'yapay zeka ve robotik meraklısı',
  'node.about': 'HAKKIMDA', 'node.projects': 'PROJELER', 'node.skills': 'YETENEKLER & İLGİLER',
  'node.hobbies': 'HOBİLER', 'node.contact': 'İLETİŞİM',
  'sub.projects': '6 DOSYA', 'sub.skills': '4 ALAN', 'sub.about': 'PROFİL',
  'sub.hobbies': 'ÇEVRİMDIŞI', 'sub.contact': 'BAĞLANTI',
  'panel.tag.profile': 'PROFİL', 'panel.tag.file': 'DOSYA', 'panel.tag.field': 'ALAN',
  'panel.tag.sys': 'SİSTEM', 'panel.tag.link': 'BAĞLANTI',
  'about.h.edu': 'EĞİTİM & SERTİFİKALAR', 'about.h.who': 'BEN KİMİM',
  'about.p1': 'Merhaba — ben <b>Ayaan Malik</b>, çağrı kodu <b>NOVA</b>. Yapay zeka, küçük robotlar ve web arasındaki çizgide yaşayan bir bilgisayar mühendisliği öğrencisiyim. Her gün yeni bir şey öğrenir, soğumadan projeye dönüştürürüm.',
  'about.p2': 'İşlerimin çoğu gece ikide sorulan saçma bir soruyla başlar — <i>“tarayıcı bunu yapabilir mi?”</i> — ve insanların gerçekten kullandığı bir şeyle biter. Merak ana çatım, yayınlamak en sevdiğim özellik.',
  'about.p3': 'Klavyeden uzaktayken küçük teleskobumla karanlık gökyüzünü kovalar, agresif satranç açılışları oynar ve ayın gereğinden fazla fotoğrafını çekerim.',
  'about.quote': '“Tuhaf şeyi yap. Sonra onu kullanışlı hale getir.”',
  'edu.1': 'UET Lahore — Bilgisayar Mühendisliği Lisans', 'edu.1y': '2023–2027',
  'edu.2': 'DeepLearning.AI — TensorFlow Geliştirici Sertifikası', 'edu.2y': '2025',
  'edu.3': 'AWS Certified Cloud Practitioner', 'edu.3y': '2025',
  'edu.4': 'freeCodeCamp — JavaScript Algoritmaları', 'edu.4y': '2024',
  'edu.note': 'Hâlâ öğrenciyim — deneyim bölümü benimle birlikte büyür.',
  'skills.h.levels': 'YETKİNLİK SEVİYELERİ',
  'skills.ai': 'YAPAY ZEKA / ML', 'skills.web': 'WEB MÜHENDİSLİĞİ',
  'skills.emb': 'GÖMÜLÜ / ROBOTİK', 'skills.des': 'TASARIM & 3D',
  'hobbies.h': 'ÇEVRİMDIŞIYKEN',
  'hobbies.note': 'Dinlenmek de mühendisliktir. Bunlar girdilerimi gürültülü, çıktılarımı tuhaf tutar.',
  'hob.1': 'Astronomi', 'hob.2': 'Satranç', 'hob.3': 'Bisiklet', 'hob.4': 'Fotoğrafçılık',
  'hob.5': 'E-spor', 'hob.6': 'Bilim kurgu',
  'contact.h': 'KANAL AÇ',
  'contact.p': 'İş birliği teklifleri, proje fikirleri, iyi bir satranç tuzağı — ya da sadece merhaba. Gelen kutum her zaman dinlemede.',
  'contact.mail': 'E-POSTA GÖNDER', 'contact.note': 'Ortalama yanıt süresi: <b>&lt; 24 saat</b>. Şifreli güvercinler kabul edilir.',
  'proj.visit': 'PROJEYİ AÇ', 'proj.overview': 'AĞAÇTAN BİR DOSYA SEÇ — YA DA AŞAĞIDAN',
  'skills.note': 'Seviyeler dürüsttür, kahramanca değil. Dileyerek değil, inşa ederek yükselirler.'
},
de: {
  'a11y.skip': 'Zur Übersicht springen',
  'ui.pro': 'PRO MODE', 'ui.back': '◄ ZURÜCK', 'ui.root': 'HAUPTBAUM',
  'boot.calib': 'AUDIO-KALIBRIERUNG', 'boot.test': '▶ LAUTSTÄRKE TESTEN',
  'boot.hint': 'Lautstärke hier einstellen — während des Tests die Wellenform ziehen',
  'boot.enter': 'INTERFACE BETRETEN', 'boot.pro': '◉ IM PRO MODE STARTEN', 'boot.skip': 'SKIP ▸',
  'tagline': 'KI · ROBOTIK · WEB-ENGINEERING',
  'hero.sub': 'KI- und Robotik-Enthusiast',
  'node.about': 'ÜBER MICH', 'node.projects': 'PROJEKTE', 'node.skills': 'SKILLS & INTERESSEN',
  'node.hobbies': 'HOBBIES', 'node.contact': 'KONTAKT',
  'sub.projects': '6 DATEIEN', 'sub.skills': '4 FELDER', 'sub.about': 'PROFIL',
  'sub.hobbies': 'OFFLINE', 'sub.contact': 'UPLINK',
  'panel.tag.profile': 'PROFIL', 'panel.tag.file': 'DATEI', 'panel.tag.field': 'FELD',
  'panel.tag.sys': 'SYSTEM', 'panel.tag.link': 'UPLINK',
  'about.h.edu': 'AUSBILDUNG & ZERTIFIKATE', 'about.h.who': 'WER BIN ICH',
  'about.p1': 'Hi — ich bin <b>Ayaan Malik</b>, Rufzeichen <b>NOVA</b>. Ich studiere Informatik und lebe genau auf der Grenze zwischen <b>künstlicher Intelligenz</b>, kleinen Robotern und dem Web. Ich lerne jeden Tag etwas Neues und baue es in ein Projekt, bevor es kalt wird.',
  'about.p2': 'Die meisten meiner Arbeiten beginnen als absurde Frage um 2 Uhr nachts — <i>„könnte ein Browser das?“</i> — und enden als etwas, das Leute wirklich benutzen. Neugier ist mein Haupt-Framework; Ausliefern mein Lieblingsfeature.',
  'about.p3': 'Abseits der Tastatur jage ich mit einem kleinen Teleskop dunklen Himmeln hinterher, spiele aggressive Schacheröffnungen und mache viel zu viele Fotos vom Mond.',
  'about.quote': '„Bau das seltsame Ding. Dann mach es nützlich.“',
  'edu.1': 'UET Lahore — BSc Informatik', 'edu.1y': '2023–2027',
  'edu.2': 'DeepLearning.AI — TensorFlow Developer Zertifikat', 'edu.2y': '2025',
  'edu.3': 'AWS Certified Cloud Practitioner', 'edu.3y': '2025',
  'edu.4': 'freeCodeCamp — JavaScript Algorithmen', 'edu.4y': '2024',
  'edu.note': 'Noch Student — der Erfahrungsbereich wächst mit mir.',
  'skills.h.levels': 'KENNTNISSTUFEN',
  'skills.ai': 'KI / MACHINE LEARNING', 'skills.web': 'WEB-ENGINEERING',
  'skills.emb': 'EMBEDDED / ROBOTIK', 'skills.des': 'DESIGN & 3D',
  'hobbies.h': 'WENN ICH OFFLINE BIN',
  'hobbies.note': 'Ruhe ist auch Ingenieurskunst. Das hält meine Eingaben verrauscht und meine Ausgaben seltsam.',
  'hob.1': 'Astronomie', 'hob.2': 'Schach', 'hob.3': 'Radfahren', 'hob.4': 'Fotografie',
  'hob.5': 'E-Sport', 'hob.6': 'Sci-Fi-Romane',
  'contact.h': 'KANAL ÖFFNEN',
  'contact.p': 'Kooperationen, Projektideen, eine gute Schachfalle — oder einfach Hallo sagen. Mein Posteingang hört immer zu.',
  'contact.mail': 'E-MAIL SENDEN', 'contact.note': 'Ø Antwortzeit: <b>&lt; 24h</b>. Verschlüsselte Tauben willkommen.',
  'proj.visit': 'PROJEKT ÖFFNEN', 'proj.overview': 'DATEI IM BAUM WÄHLEN — ODER HIER UNTEN',
  'skills.note': 'Level sind ehrlich, nicht heroisch. Sie steigen durch Bauen, nicht durch Wünschen.'
}};

/* projects + skill levels — language-independent fields */
const PROJECTS = [
  { id:'nebulachat', title:'NebulaChat', img:'assets/proj-nebulachat.jpg', link:'#',
    tags:['Python','RAG','FastAPI'],
    desc:{ en:'A study assistant that answers questions from your own PDFs and lecture notes, with sources highlighted page-by-page. Built for my exam season; stayed for my friends’ exam seasons.',
           tr:'Kendi PDF’lerinden ve ders notlarından, kaynağı sayfa sayfa göstererek soru yanıtlayan bir çalışma asistanı. Sınav dönemim için yaptım; arkadaşlarımın sınav dönemleri için kaldı.',
           de:'Ein Lern-Assistent, der Fragen aus eigenen PDFs und Mitschriften beantwortet — mit Quellen Seite für Seite. Für meine Prüfungsphase gebaut; für die meiner Freunde geblieben.' } },
  { id:'orbitdash', title:'OrbitDash', img:'assets/proj-orbitdash.jpg', link:'#',
    tags:['JavaScript','REST API','Canvas'],
    desc:{ en:'A live dashboard that tracks the ISS and 40+ bright satellites over your house, draws ground tracks on a hand-rolled canvas map, and pings you when something worth seeing flies by.',
           tr:'ISS ve 40’tan fazla parlak uydunun evinizin üzerinden geçişini izleyen, elle yazılmış canvas haritada yer izleri çizen ve görülmeye değer bir şey geçerken haber veren canlı bir panel.',
           de:'Ein Live-Dashboard, das die ISS und 40+ helle Satelliten über dem eigenen Haus verfolgt, Bodenspuren auf einer selbstgebauten Canvas-Karte zeichnet und bei sehenswerten Überflügen bescheid gibt.' } },
  { id:'pixelforge', title:'PixelForge', img:'assets/proj-pixelforge.jpg', link:'#',
    tags:['TypeScript','Canvas','PWA'],
    desc:{ en:'A tiny pixel-art editor that runs entirely in the browser — layers, onion-skinning, palette lock and one-click sprite-sheet export. Works offline, installs like an app, ships pure nostalgia.',
           tr:'Tamamen tarayıcıda çalışan küçük bir piksel-art editörü — katmanlar, onion-skin, palet kilidi ve tek tıkla sprite-sheet dışa aktarımı. Çevrimdışı çalışır, uygulama gibi kurulur.',
           de:'Ein winziger Pixel-Art-Editor komplett im Browser — Ebenen, Onion-Skinning, Paletten-Lock und Sprite-Sheet-Export per Klick. Läuft offline, installiert sich wie eine App.' } },
  { id:'snapmenu', title:'SnapMenu', img:'assets/proj-snapmenu.jpg', link:'#',
    tags:['Flutter','OCR','ML Kit'],
    desc:{ en:'Point your camera at a menu abroad and get a translated overlay in real time, with allergen warnings and a “what is this dish actually” button powered by a compact on-device model.',
           tr:'Kameranı yurtdışında bir menüye tut, gerçek zamanlı çeviri katmanı al; alerjen uyarıları ve cihaz üzerinde küçük bir modelle çalışan “bu yemek aslında ne” butonu dahil.',
           de:'Kamera auf eine Speisekarte im Ausland richten und in Echtzeit eine übersetzte Überlagerung bekommen — mit Allergen-Warnungen und einem „was ist das eigentlich“-Button.' } },
  { id:'echokeys', title:'EchoKeys', img:'assets/proj-echokeys.jpg', link:'#',
    tags:['WebAudio','Game','Vanilla JS'],
    desc:{ en:'A rhythm typing trainer: words fall as notes and every keystroke is a sampled piano hit. Miss the beat and the chord sounds as wrong as it feels. Zero frameworks, 60 fps, pure rhythm.',
           tr:'Ritimli bir yazı antrenörü: kelimeler nota gibi düşer, her tuş örneklenmiş bir piyano sesi çıkarır. Ritmi kaçır, akor da hissettirdiği kadar yanlış duyulsun. Sıfır framework, 60 fps.',
           de:'Ein Rhythmus-Tipptrainer: Wörter fallen wie Noten, jeder Tastenschlag ist ein gesampelter Piano-Anschlag. Wer den Beat verpasst, hört es sofort. Kein Framework, 60 fps.' } },
  { id:'terrasense', title:'TerraSense', img:'assets/proj-terrasense.jpg', link:'#',
    tags:['ESP32','MQTT','PWA'],
    desc:{ en:'A plant monitor that texts you before your basil dies: moisture and light sensors on an ESP32 stream to a tiny PWA with charts, thresholds and dramatically passive-aggressive notifications.',
           tr:'Fesleğeniniz ölmeden önce size mesaj atan bir bitki monitörü: ESP32’deki nem ve ışık sensörleri grafikler ve dramatik derecede pasif-agresif bildirimleri olan minik bir PWA’ya akar.',
           de:'Ein Pflanzenmonitor, der schreibt, bevor das Basilikum stirbt: Feuchte- und Lichtsensoren auf einem ESP32 streamen in eine kleine PWA mit Charts und passiv-aggressiven Benachrichtigungen.' } }
];
const SKILL_FIELDS = [
  { id:'ai',  color:'#00ff88', items:[['Python',90],['PyTorch',78],['scikit-learn',82],['pandas / numpy',88],['LLM tooling (RAG)',80]] },
  { id:'web', color:'#00f5ff', items:[['TypeScript',85],['React',80],['Node.js',76],['CSS / motion design',88],['Accessibility',72]] },
  { id:'emb', color:'#ffee00', items:[['Arduino / ESP32',84],['C / C++',70],['MQTT / sensors',78],['Soldering & repair',66]] },
  { id:'des', color:'#bf00ff', items:[['Figma',82],['Blender',62],['Pixel art',74],['Motion graphics',58]] }
];

/* ---------------- state ---------------- */
let lang = store.get('nova-lang', 'en');
if (!I18N[lang]) lang = 'en';
const t = k => (I18N[lang][k] ?? I18N.en[k] ?? k);
let booted = false;
let trailOn = store.get('nova-trail', true);
let gridOn  = store.get('nova-grid', true);

/* ============================================================
   AUDIO ENGINE  (WebAudio — generated, no files)
   ============================================================ */
const AudioBus = {
  ctx:null, master:null, music:null, sfx:null, delay:null,
  volume: store.get('nova-vol', 70),
  init(){
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.volume / 100;
    this.master.connect(this.ctx.destination);
    this.sfx = this.ctx.createGain(); this.sfx.gain.value = .9; this.sfx.connect(this.master);
    this.music = this.ctx.createGain(); this.music.gain.value = .5; this.music.connect(this.master);
    this.delay = this.ctx.createDelay(1); this.delay.delayTime.value = .36;
    const fb = this.ctx.createGain(); fb.gain.value = .34;
    const wet = this.ctx.createGain(); wet.gain.value = .3;
    this.delay.connect(fb); fb.connect(this.delay); this.delay.connect(wet); wet.connect(this.music);
  },
  resume(){ this.init(); if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },
  setVolume(v){ this.volume = clamp(Math.round(v), 0, 100); store.set('nova-vol', this.volume);
    if (this.master) this.master.gain.setTargetAtTime(this.volume/100, this.ctx.currentTime, .05); },
  /* -- tiny SFX synths -- */
  blip(freq=1600, dur=.05, type='square', g=.12, slide=0){
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime, o = this.ctx.createOscillator(), gn = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
    gn.gain.setValueAtTime(g, t0); gn.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    o.connect(gn); gn.connect(this.sfx); o.start(t0); o.stop(t0 + dur + .02);
  },
  tick(){ this.blip(1800, .04, 'square', .05); },
  hover(){ this.blip(1200 + Math.random()*300, .03, 'square', .025); },
  confirm(){ this.blip(880, .09, 'triangle', .12); setTimeout(()=>this.blip(1320, .12, 'triangle', .12), 70); },
  open(){ this.blip(320, .22, 'sawtooth', .06, 1400); },
  close(){ this.blip(1200, .18, 'sawtooth', .05, -900); },
  nav(){ this.blip(520, .08, 'triangle', .1, 120); },
  sweep(){
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime, o = this.ctx.createOscillator(), gn = this.ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(220, t0);
    o.frequency.exponentialRampToValueAtTime(880, t0 + .5);
    o.frequency.exponentialRampToValueAtTime(220, t0 + 1);
    gn.gain.setValueAtTime(.0001, t0); gn.gain.exponentialRampToValueAtTime(.25, t0 + .08);
    gn.gain.exponentialRampToValueAtTime(.0001, t0 + 1.05);
    o.connect(gn); gn.connect(this.sfx); o.start(t0); o.stop(t0 + 1.1);
  }
};

/* -------- generative mini-player -------- */
const TRACKS = [
  { name:'DEEP FIELD',   root:110.00, chords:[[0,3,7,10],[0,5,8,12],[0,3,7,14],[0,7,10,15]], bpm:60 },
  { name:'ION RAIN',     root:130.81, chords:[[0,7,12,16],[0,5,12,17],[0,3,10,14],[0,8,12,15]], bpm:72 },
  { name:'PULSAR DRIFT', root:98.00,  chords:[[0,5,10,14],[0,3,12,15],[0,7,12,17],[0,5,8,15]],  bpm:66 }
];
const TRACK_LEN = 96;
const Player = {
  idx: store.get('nova-track', 0) % TRACKS.length,
  playing:false, t0:0, offset:0, timer:null, step:0, nextNote:0,
  st(idx){ const s = Math.pow(2, idx/12); return TRACKS[this.idx].root * s; },
  play(){
    AudioBus.resume(); if (!AudioBus.ctx) return;
    if (this.playing) return;
    this.playing = true;
    this.t0 = AudioBus.ctx.currentTime;
    this.nextNote = this.t0; this.step = 0;
    this.timer = setInterval(() => this.schedule(), 90);
    PlayerUI.sync();
  },
  pause(){
    if (!this.playing) return;
    this.offset = this.pos(); this.playing = false;
    clearInterval(this.timer); PlayerUI.sync();
  },
  toggle(){ this.playing ? this.pause() : this.play(); AudioBus.confirm(); },
  pos(){
    if (!AudioBus.ctx) return this.offset;
    const p = this.playing ? (AudioBus.ctx.currentTime - this.t0 + this.offset) : this.offset;
    return p % TRACK_LEN;
  },
  seek(frac){
    this.offset = frac * TRACK_LEN;
    if (this.playing){ this.t0 = AudioBus.ctx.currentTime; this.step = Math.floor(this.offset / (60/TRACKS[this.idx].bpm/2)); }
  },
  switch(d){
    this.idx = (this.idx + d + TRACKS.length) % TRACKS.length;
    store.set('nova-track', this.idx);
    this.step = 0;
    if (this.playing){ this.offset = 0; this.t0 = AudioBus.ctx.currentTime; this.nextNote = this.t0; }
    AudioBus.nav(); PlayerUI.sync();
  },
  schedule(){
    const ct = AudioBus.ctx, beat = 60 / TRACKS[this.idx].bpm, tr = TRACKS[this.idx];
    while (this.nextNote < ct + .25){
      const bar = Math.floor(this.step / 8) % tr.chords.length;
      const chord = tr.chords[bar];
      if (this.step % 8 === 0) this.pad(chord, this.nextNote, beat * 8);
      if (this.step % 2 === 0) this.arp(chord, this.nextNote, beat);
      this.step++; this.nextNote += beat / 2;
    }
  },
  pad(chord, when, dur){
    chord.slice(0, 3).forEach((n, i) => {
      const o = AudioBus.ctx.createOscillator(), g = AudioBus.ctx.createGain(), f = AudioBus.ctx.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = this.st(n); o.detune.value = (i - 1) * 9;
      f.type = 'lowpass'; f.frequency.value = 480;
      g.gain.setValueAtTime(.0001, when);
      g.gain.linearRampToValueAtTime(.05, when + dur * .3);
      g.gain.linearRampToValueAtTime(.0001, when + dur);
      o.connect(f); f.connect(g); g.connect(AudioBus.music); g.connect(AudioBus.delay);
      o.start(when); o.stop(when + dur + .1);
    });
    const sub = AudioBus.ctx.createOscillator(), sg = AudioBus.ctx.createGain();
    sub.type = 'sine'; sub.frequency.value = this.st(chord[0]) / 2;
    sg.gain.setValueAtTime(.0001, when);
    sg.gain.linearRampToValueAtTime(.09, when + dur * .25);
    sg.gain.linearRampToValueAtTime(.0001, when + dur);
    sub.connect(sg); sg.connect(AudioBus.music); sub.start(when); sub.stop(when + dur + .1);
  },
  arp(chord, when, beat){
    const n = chord[(this.step / 2 | 0) % chord.length];
    const o = AudioBus.ctx.createOscillator(), g = AudioBus.ctx.createGain();
    o.type = 'triangle'; o.frequency.value = this.st(n) * 2;
    g.gain.setValueAtTime(.055, when); g.gain.exponentialRampToValueAtTime(.0001, when + beat * .9);
    o.connect(g); g.connect(AudioBus.music); g.connect(AudioBus.delay);
    o.start(when); o.stop(when + beat);
  }
};
const PlayerUI = {
  el:null, fill:null, cur:null, dur:null, track:null, playIco:null, pauseIco:null,
  init(){
    this.el = $('#mini-player'); this.fill = $('#mp-progress-fill');
    this.cur = $('#mp-cur'); this.dur = $('#mp-dur'); this.track = $('#mp-track');
    this.playIco = $('.mp-ico-play'); this.pauseIco = $('.mp-ico-pause');
    const fmt = s => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
    this.fmt = fmt; this.dur.textContent = fmt(TRACK_LEN);
    this.sync();
    $('#mp-play').addEventListener('click', () => Player.toggle());
    $('#mp-prev').addEventListener('click', () => Player.switch(-1));
    $('#mp-next').addEventListener('click', () => Player.switch(1));
    $('#mp-seek').addEventListener('input', e => { Player.seek(e.target.value / 1000); });
  },
  sync(){
    this.track.textContent = TRACKS[Player.idx].name;
    this.el.classList.toggle('playing', Player.playing);
    this.playIco.style.display  = Player.playing ? 'none' : '';
    this.pauseIco.style.display = Player.playing ? '' : 'none';
  },
  frame(){
    if (!Player.playing) return;
    const p = Player.pos();
    this.fill.style.width = (p / TRACK_LEN * 100) + '%';
    this.cur.textContent = this.fmt(p);
    const sk = $('#mp-seek'); if (document.activeElement !== sk) sk.value = Math.round(p / TRACK_LEN * 1000);
  }
};

/* -------- volume block widgets -------- */
function buildVolBlocks(container, aria){
  const setAria = v => aria && aria.setAttribute('aria-valuenow', v);
  for (let i = 0; i < 10; i++){
    const b = document.createElement('span');
    b.className = 'vol-b'; b.dataset.i = i;
    b.style.height = (8 + i * 1.6) + 'px';
    container.appendChild(b);
  }
  const paint = v => $$('.vol-b', container).forEach((b, i) => b.classList.toggle('lit', (i + 1) * 10 <= v));
  const fromEvent = e => {
    const r = container.getBoundingClientRect();
    return clamp(Math.round((e.clientX - r.left) / r.width * 10) * 10, 0, 100);
  };
  container.addEventListener('pointerdown', e => {
    container.setPointerCapture(e.pointerId);
    applyVol(fromEvent(e));
    AudioBus.resume(); AudioBus.tick();
    const move = ev => applyVol(fromEvent(ev));
    const up = () => { container.removeEventListener('pointermove', move); container.removeEventListener('pointerup', up); };
    container.addEventListener('pointermove', move); container.addEventListener('pointerup', up);
  });
  container.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp')   { applyVol(AudioBus.volume + 10); e.preventDefault(); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowDown') { applyVol(AudioBus.volume - 10); e.preventDefault(); }
  });
  function applyVol(v){
    AudioBus.setVolume(v); paint(v); setAria(v);
    $$('#boot-vol-pct, #main-vol-pct').forEach(el => el.textContent = v + '%');
    $$('#boot-vol-blocks, #main-vol-blocks').forEach(c => { if (c !== container) syncOther(c, v); });
    $('#main-vol-icon').textContent = v === 0 ? '🔇' : '🔊';
    $('#boot-vol-icon').textContent = v === 0 ? '🔇' : '🔊';
  }
  function syncOther(c, v){ $$('.vol-b', c).forEach((b, i) => b.classList.toggle('lit', (i + 1) * 10 <= v)); c.setAttribute('aria-valuenow', v); }
  paint(AudioBus.volume); setAria(AudioBus.volume);
  container._apply = applyVol;
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const Cursor = {
  x: innerWidth/2, y: innerHeight/2, rx: 0, ry: 0,
  init(){
    if (coarse) return;
    addEventListener('mousemove', e => {
      this.x = e.clientX; this.y = e.clientY;
      $('#cur-dot').style.transform = `translate(${this.x - 3}px,${this.y - 3}px)`;
      $('#cur-dot').style.left = '0'; $('#cur-dot').style.top = '0';
      Trail.push(e.clientX, e.clientY);
      const hit = e.target.closest && e.target.closest('a,button,.node,.vol-b,input,#mp-seek');
      document.body.classList.toggle('cur-hover', !!hit);
      $('#cur-label').textContent = hit ? (hit.dataset.curlabel || (hit.classList && hit.classList.contains('node') ? 'OPEN' : '')) : '';
    }, { passive:true });
    addEventListener('mousedown', () => document.body.classList.add('cur-down'));
    addEventListener('mouseup',   () => document.body.classList.remove('cur-down'));
    this.rx = this.x; this.ry = this.y;
  },
  frame(){
    this.rx = lerp(this.rx, this.x, .18); this.ry = lerp(this.ry, this.y, .18);
    const r = $('#cur-ring'); r.style.left = (this.rx - r.offsetWidth/2) + 'px'; r.style.top = (this.ry - r.offsetHeight/2) + 'px';
    const lb = $('#cur-label'); lb.style.left = this.rx + 'px'; lb.style.top = this.ry + 'px';
  }
};

/* hover blips */
document.addEventListener('mouseover', e => {
  const hit = e.target.closest && e.target.closest('a,button,.node,.vol-b');
  if (hit && AudioBus.ctx && booted) AudioBus.hover();
}, { passive:true });

/* ============================================================
   CANVASES — grid / particles / cursor trail
   ============================================================ */
const cvGrid = $('#grid-trail'), cvP = $('#pc'), cvT = $('#cursor-trail');
const gtx = cvGrid.getContext('2d'), ptx = cvP.getContext('2d'), ttx = cvT.getContext('2d');
let W = 0, H = 0, DPR = 1;
function resize(){
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  [cvGrid, cvP, cvT].forEach(c => { c.width = W * DPR; c.height = H * DPR; });
  [gtx, ptx, ttx].forEach(x => x.setTransform(DPR, 0, 0, DPR, 0, 0));
  Particles.seed();
}
addEventListener('resize', resize);

const Grid = {
  scroll: 0,
  draw(){
    gtx.clearRect(0, 0, W, H);
    if (!gridOn) return;
    const horizon = H * .58, vpx = W / 2;
    gtx.lineWidth = 1;
    /* radiating verticals */
    for (let i = -16; i <= 16; i++){
      const x2 = vpx + i * (W / 14);
      gtx.strokeStyle = 'rgba(0,245,255,' + (0.028 + Math.abs(i) * 0.0015) + ')';
      gtx.beginPath(); gtx.moveTo(vpx + i * 26, horizon); gtx.lineTo(x2, H + 40); gtx.stroke();
    }
    /* horizontals scrolling toward viewer */
    const rows = 14;
    for (let i = 0; i < rows; i++){
      let p = ((i + this.scroll) % rows) / rows;
      p = Math.pow(p, 2.4);
      const y = horizon + p * (H - horizon + 30);
      gtx.strokeStyle = 'rgba(0,245,255,' + (0.02 + p * 0.10) + ')';
      gtx.beginPath(); gtx.moveTo(0, y); gtx.lineTo(W, y); gtx.stroke();
    }
    /* mouse glow */
    const mx = Cursor.x, my = Cursor.y;
    const rad = gtx.createRadialGradient(mx, my, 0, mx, my, 190);
    rad.addColorStop(0, 'rgba(0,245,255,.075)'); rad.addColorStop(1, 'rgba(0,245,255,0)');
    gtx.fillStyle = rad; gtx.beginPath(); gtx.arc(mx, my, 190, 0, 7); gtx.fill();
  }
};

const Particles = {
  pts: [],
  seed(){
    const n = reduceMotion ? 0 : Math.round(W * H / 26000);
    this.pts = Array.from({ length:n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .16, vy: (Math.random() - .5) * .16,
      r: .6 + Math.random() * 1.5, tw: Math.random() * 6.28
    }));
  },
  draw(tm){
    ptx.clearRect(0, 0, W, H);
    const pts = this.pts;
    for (let i = 0; i < pts.length; i++){
      const p = pts[i];
      p.x += p.vx; p.y += p.vy; p.tw += .02;
      if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
      const a = .25 + Math.sin(p.tw) * .2;
      ptx.fillStyle = 'rgba(180,245,255,' + a + ')';
      ptx.beginPath(); ptx.arc(p.x, p.y, p.r, 0, 7); ptx.fill();
      /* links */
      for (let j = i + 1; j < pts.length && j < i + 5; j++){
        const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx*dx + dy*dy;
        if (d < 11500){
          ptx.strokeStyle = 'rgba(0,245,255,' + (0.09 * (1 - d / 11500)) + ')';
          ptx.lineWidth = .7; ptx.beginPath(); ptx.moveTo(p.x, p.y); ptx.lineTo(q.x, q.y); ptx.stroke();
        }
      }
      /* mouse link */
      const dx = p.x - Cursor.x, dy = p.y - Cursor.y, d = dx*dx + dy*dy;
      if (d < 26000){
        ptx.strokeStyle = 'rgba(0,245,255,' + (0.14 * (1 - d / 26000)) + ')';
        ptx.beginPath(); ptx.moveTo(p.x, p.y); ptx.lineTo(Cursor.x, Cursor.y); ptx.stroke();
      }
    }
  }
};

const Trail = {
  pts: [],
  push(x, y){ if (!trailOn || coarse) return; this.pts.push({ x, y, life: 1 }); if (this.pts.length > 42) this.pts.shift(); },
  draw(){
    ttx.clearRect(0, 0, W, H);
    if (!trailOn) { this.pts.length = 0; return; }
    for (let i = 0; i < this.pts.length; i++){
      const p = this.pts[i]; p.life -= .025;
      if (p.life <= 0){ this.pts.splice(i--, 1); continue; }
      const n = this.pts[i + 1];
      if (n){
        ttx.strokeStyle = 'rgba(0,245,255,' + (p.life * .45) + ')';
        ttx.lineWidth = p.life * 2.6; ttx.lineCap = 'round';
        ttx.beginPath(); ttx.moveTo(p.x, p.y); ttx.lineTo(n.x, n.y); ttx.stroke();
      }
      if (p.life > .85){
        ttx.fillStyle = 'rgba(255,255,255,' + ((p.life - .85) * 2.4) + ')';
        ttx.fillRect(p.x - 1, p.y - 1, 2, 2);
      }
    }
  }
};

/* ============================================================
   NODE TREE
   ============================================================ */
const NS = 'http://www.w3.org/2000/svg';
const NODE_COLORS = { about:'#00f5ff', projects:'#bf00ff', skills:'#00ff88', hobbies:'#ffee00', contact:'#ff006e' };
const SECTIONS = ['about', 'projects', 'skills', 'hobbies', 'contact'];
const SECTION_POS = { about:[600,110], projects:[620,285], skills:[600,460], hobbies:[620,600], contact:[900,400] };
const ROOT_POS = [215, 400];
const PROJ_POS = PROJECTS.map((p, i) => [950, 120 + i * 108]);
const SKILL_POS = SKILL_FIELDS.map((s, i) => [930, 340 + i * 82]);

const ICONS = {
  about:    'M0 -11 a11 11 0 1 0 0.01 0 M-15 14 q0 -12 15 -12 q15 0 15 12',
  projects: 'M0 -14 l12 7 v14 l-12 7 l-12 -7 v-14 z M0 -14 v28 M-12 -7 l24 14 M12 -7 l-24 14',
  skills:   'M-9 -9 h18 v18 h-18 z M-4 -4 h8 v8 h-8 z M-9 -14 v4 M9 -14 v4 M-9 10 v4 M9 10 v4 M-14 -9 h4 M-14 9 h4 M10 -9 h4 M10 9 h4',
  hobbies:  'M0 -14 l3.6 8.4 h8.8 l-7 5.6 l2.6 8.6 l-8 -5.4 l-8 5.4 l2.6 -8.6 l-7 -5.6 h8.8 z',
  contact:  'M-14 -9 h28 v18 h-28 z M-14 -9 l14 10 l14 -10',
  file:     'M-9 -12 h12 l6 6 v18 h-18 z M3 -12 v6 h6',
  gear:     'M0 -13 l2.5 4.5 5 -1 1 5 4.5 2.5 -2 4.5 2 4.5 -4.5 2.5 -1 5 -5 -1 -2.5 4.5 -2.5 -4.5 -5 1 -1 -5 -4.5 -2.5 2 -4.5 -2 -4.5 4.5 -2.5 1 -5 5 1 z M0 -5 a5 5 0 1 0 0.01 0'
};

const Tree = {
  stage: $('#stage'),
  cam: { x:600, y:400, k:1, tx:600, ty:400, tk:1 },
  path: [], expanded: null, built: false,
  drag: { on:false, moved:0, sx:0, sy:0, cx:0, cy:0 },

  el(name, attrs, parent){
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    (parent || this.stage).appendChild(e);
    return e;
  },
  edge(x1, y1, x2, y2, delay){
    const mx = (x1 + x2) / 2;
    const p = this.el('path', { d:`M${x1} ${y1} Q${mx} ${y1} ${mx} ${(y1+y2)/2} T${x2} ${y2}`, class:'edge draw', 'data-for':`${x2},${y2}` });
    p.style.animationDelay = delay + 's';
    return p;
  },
  node(x, y, opts){
    const g = this.el('g', { class:'node' + (opts.root ? ' root-node' : ''), tabindex:'0', role:'button', 'data-id':opts.id });
    g.style.setProperty('--nc', opts.color);
    const g2 = this.el('g', { class:'enter-circle' }, g);
    g2.style.animationDelay = (opts.delay || 0) + 's';
    const r = opts.r || 40;
    this.el('circle', { class:'halo', cx:x, cy:y, r:r * 2.1 }, g2);
    this.el('circle', { class:'ring2', cx:x, cy:y, r:r + 9 }, g2);
    this.el('circle', { class:'ring', cx:x, cy:y, r }, g2);
    if (opts.root){
      const clip = this.el('clipPath', { id:'rootClip' }, $('#tree defs') || this.stage);
      this.el('circle', { cx:x, cy:y, r:r - 6 }, clip);
      const img = this.el('image', { href:'assets/avatar.jpg', x:x - r + 6, y:y - r + 6, width:(r - 6) * 2, height:(r - 6) * 2, 'clip-path':'url(#rootClip)', preserveAspectRatio:'xMidYMid slice' }, g2);
      img.style.pointerEvents = 'none';
    } else {
      const ic = this.el('path', { class:'ico', d:ICONS[opts.icon || 'file'], transform:`translate(${x},${y - 2}) scale(${r / 34})` }, g2);
      ic.style.pointerEvents = 'none';
      const lbl = this.el('text', { x, y:y + r + 22, 'font-size':13 }, g2); lbl.textContent = opts.label;
      if (opts.sub){ const s = this.el('text', { class:'sub', x, y:y + r + 38, 'font-size':9 }, g2); s.textContent = opts.sub; }
    }
    g.setAttribute('aria-label', opts.label || opts.id);
    g.addEventListener('click', e => { if (this.drag.moved < 6) this.onNode(opts, g, e); });
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.onNode(opts, g, e); } });
    return g;
  },
  build(){
    this.stage.innerHTML = '';
    const defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = `<clipPath id="rootClip"></clipPath>`;
    /* edges root -> sections */
    SECTIONS.forEach((s, i) => {
      const [x, y] = SECTION_POS[s];
      this.edge(ROOT_POS[0] + 40, ROOT_POS[1], x - 46, y, .25 + i * .12);
    });
    /* root */
    this.node(ROOT_POS[0], ROOT_POS[1], { id:'root', root:true, r:64, color:'#00f5ff', delay:0, label:'NOVA' });
    /* sections */
    SECTIONS.forEach((s, i) => {
      const [x, y] = SECTION_POS[s];
      this.node(x, y, { id:s, section:s, r:40, color:NODE_COLORS[s], icon:s, label:t('node.' + s), sub:t('sub.' + s), delay:.35 + i * .1 });
    });
    if (this.expanded) this.showChildren(this.expanded, true);
    this.built = true;
  },
  clearChildren(){
    $$('.child-of', this.stage).forEach(e => e.remove());
  },
  showChildren(section, instant){
    this.clearChildren();
    const arr = section === 'projects'
      ? PROJECTS.map((p, i) => ({ id:p.id, proj:p, x:PROJ_POS[i][0], y:PROJ_POS[i][1], title:p.title }))
      : SKILL_FIELDS.map((f, i) => ({ id:'skill-' + f.id, field:f, x:SKILL_POS[i][0], y:SKILL_POS[i][1], title:t('skills.' + f.id) }));
    const [px, py] = SECTION_POS[section];
    arr.forEach((c, i) => {
      const e = this.edge(px + 46, py, c.x - 34, c.y, 0);
      e.classList.add('child-of', 'child-of-' + section);
      e.style.stroke = NODE_COLORS[section] + '66';
      const n = this.node(c.x, c.y, { id:c.id, r:30, color:NODE_COLORS[section], icon:section === 'projects' ? 'file' : 'gear', label:c.title, delay:.08 * i, parent:section, proj:c.proj, field:c.field });
      n.classList.add('child-of', 'child-of-' + section);
    });
  },
  onNode(opts, g){
    AudioBus.resume();
    if (opts.id === 'root'){ this.goHome(); return; }
    HeroTitle.dismiss();
    if (opts.section){
      AudioBus.confirm();
      if (this.expanded === opts.section){
        /* second click -> open overview panel */
        this.openSectionPanel(opts.section);
        return;
      }
      this.expanded = opts.section;
      this.setPath([opts.section]);
      if (opts.section === 'projects' || opts.section === 'skills'){
        this.showChildren(opts.section);
        this.focusOn(opts.section);
      } else {
        this.clearChildren();
        this.focusOn(opts.section);
        this.openSectionPanel(opts.section);
      }
      return;
    }
    if (opts.proj){
      AudioBus.open();
      this.setPath([opts.parent, opts.id]);
      this.openProjectPanel(opts.proj, opts.id);
      return;
    }
    if (opts.field){
      AudioBus.open();
      this.setPath([opts.parent, opts.id]);
      this.openSkillPanel(opts.field, opts.id);
    }
  },
  setPath(ids){
    this.path = ids;
    const bc = $('#bc');
    if (!ids.length){ bc.innerHTML = esc(t('ui.root')); $('#bb').hidden = true; }
    else {
      const labels = ids.map(id => {
        if (SECTIONS.includes(id)) return t('node.' + id);
        const p = PROJECTS.find(x => x.id === id); if (p) return p.title;
        const f = SKILL_FIELDS.find(x => 'skill-' + x.id === id); if (f) return t('skills.' + f.id);
        return id.toUpperCase();
      });
      bc.innerHTML = esc(t('ui.root')) + labels.map(l => ' / <b>' + esc(l) + '</b>').join('');
      $('#bb').hidden = false;
    }
  },
  focusOn(section){
    const [x, y] = SECTION_POS[section];
    const hasKids = section === 'projects' || section === 'skills';
    const fx = hasKids ? (x + 950) / 2 - 140 : x - 60;
    this.cam.tk = innerWidth < 700 ? 1.15 : 1.42;
    this.cam.tx = fx; this.cam.ty = y;
    $$('.node', this.stage).forEach(n => {
      const keep = n.classList.contains('child-of-' + section) || n.dataset.id === section || n.dataset.id === 'root';
      n.classList.toggle('dimmed', !keep && section !== null);
    });
    $$('.edge', this.stage).forEach(e => e.classList.toggle('dimmed', !e.classList.contains('child-of-' + section) && !e.classList.contains('child-of') || false));
  },
  goHome(){
    this.expanded = null; this.clearChildren();
    this.setPath([]);
    this.cam.tk = 1; this.cam.tx = 600; this.cam.ty = 400;
    $$('.dimmed', this.stage).forEach(n => n.classList.remove('dimmed'));
  },
  back(){
    if (Holo.open) { Holo.hide(); return; }
    if (this.path.length > 1){ this.setPath([this.path[0]]); AudioBus.nav(); return; }
    if (this.path.length === 1){ this.goHome(); Holo.hide(); AudioBus.nav(); }
  },

  /* camera interaction */
  panSetup(){
    const svg = $('#tree');
    svg.addEventListener('pointerdown', e => {
      if (e.target.closest('.node')) return;
      this.drag.on = true; this.drag.moved = 0;
      this.drag.sx = e.clientX; this.drag.sy = e.clientY;
      this.drag.cx = this.cam.tx; this.drag.cy = this.cam.ty;
      svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener('pointermove', e => {
      if (!this.drag.on) return;
      const dx = e.clientX - this.drag.sx, dy = e.clientY - this.drag.sy;
      this.drag.moved = Math.max(this.drag.moved, Math.abs(dx) + Math.abs(dy));
      const k = this.viewScale() * this.cam.tk;
      this.cam.tx = this.drag.cx - dx / k;
      this.cam.ty = this.drag.cy - dy / k;
      this.snap();
    });
    svg.addEventListener('pointerup', () => { this.drag.on = false; });
    svg.addEventListener('wheel', e => {
      e.preventDefault();
      this.cam.tk = clamp(this.cam.tk * (e.deltaY > 0 ? .9 : 1.1), .55, 2.6);
      this.snap();
    }, { passive:false });
  },
  viewScale(){
    const r = $('#tree').getBoundingClientRect();
    return Math.min(r.width / 1200, r.height / 800);
  },
  snap(){ /* instantly apply (used for wheel/pan) */
    const r = $('#tree').getBoundingClientRect();
    const vs = this.viewScale();
    const ox = r.width / 2, oy = r.height / 2;
    const k = vs * this.cam.tk;
    this.stage.style.transform = `translate(${ox - this.cam.tx * k}px, ${oy - this.cam.ty * k}px) scale(${k})`;
  },
  frame(){
    /* smooth chase for focus changes */
    const c = this.cam;
    if (Math.abs(c.tx - c.x) > .5 || Math.abs(c.ty - c.y) > .5 || Math.abs(c.tk - c.k) > .002){
      c.x = lerp(c.x, c.tx, .09); c.y = lerp(c.y, c.ty, .09); c.k = lerp(c.k, c.tk, .09);
      this.snap();
    }
  },

  /* ------- panel builders ------- */
  openSectionPanel(section){
    if (section === 'about')    return Holo.profile();
    if (section === 'projects') return Holo.projectsOverview();
    if (section === 'skills')   return Holo.skillsOverview();
    if (section === 'hobbies')  return Holo.hobbies();
    if (section === 'contact')  return Holo.contact();
  },
  openProjectPanel(p, id){ Holo.project(p, id); },
  openSkillPanel(f, id){ Holo.skill(f, id); }
};
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* ============================================================
   HOLOGRAM PANEL
   ============================================================ */
const Holo = {
  open:false,
  show(title, tag, pathStr, html){
    const holo = $('#holo');
    $('#holo-title').textContent = title;
    $('#holo-tag').textContent = tag;
    $('#holo-path').textContent = pathStr;
    $('#holo-body').innerHTML = html;
    holo.classList.remove('closing'); holo.classList.add('open');
    holo.setAttribute('aria-hidden', 'false');
    this.open = true;
    /* animate skill bars after paint */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      $$('#holo-body .bar i').forEach(i => i.style.width = i.dataset.w + '%');
    }));
    $('#holo-close').focus({ preventScroll:true });
  },
  hide(){
    const holo = $('#holo');
    holo.classList.add('closing'); holo.classList.remove('open');
    holo.setAttribute('aria-hidden', 'true');
    setTimeout(() => holo.classList.remove('closing'), 260);
    this.open = false; AudioBus.close();
  },
  profile(){
    const rows = [['edu.1','edu.1y'],['edu.2','edu.2y'],['edu.3','edu.3y'],['edu.4','edu.4y']]
      .map(([a, b]) => `<li><b>${esc(t(a))}</b> <span class="yr">${esc(t(b))}</span></li>`).join('');
    this.show('AYAAN MALIK', t('panel.tag.profile'), '/main/about', `
      <h3>${esc(t('about.h.who'))}</h3>
      <p class="lead">${t('about.p1')}</p>
      <p>${t('about.p2')}</p>
      <p>${t('about.p3')}</p>
      <div class="marquee"><div>${'AI · ROBOTICS · WEB · <b>NOVA</b> · '.repeat(6)}</div></div>
      <h3>${esc(t('about.h.edu'))}</h3>
      <ul>${rows}</ul>
      <div class="kbd-note">${t('edu.note')}</div>
      <div class="kbd-note" style="margin-top:8px"><b>“</b>${esc(t('about.quote').replace(/[“”]/g,''))}<b>”</b></div>
    `);
  },
  projectsOverview(){
    const list = PROJECTS.map(p => `<li><b><a href="#" data-proj="${p.id}" style="color:inherit;text-decoration:none;border-bottom:1px dashed rgba(0,245,255,.4)">${esc(p.title)}</a></b> <span class="yr">${p.tags.join(' · ')}</span></li>`).join('');
    this.show(t('node.projects'), t('panel.tag.file'), '/main/projects', `
      <p class="lead">${esc(t('proj.overview'))}</p>
      <ul>${list}</ul>
    `);
    $$('#holo-body [data-proj]').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      const p = PROJECTS.find(x => x.id === a.dataset.proj);
      Tree.setPath(['projects', p.id]); AudioBus.open();
      this.project(p, p.id);
    }));
  },
  project(p, id){
    this.show(p.title.toUpperCase(), t('panel.tag.file'), '/main/projects/' + id, `
      <img class="holo-img" src="${p.img}" alt="${esc(p.title)} artwork" loading="lazy">
      <div class="chips">${p.tags.map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div>
      <p class="lead">${esc(p.desc[lang] || p.desc.en)}</p>
      <a class="holo-link" href="${p.link}" ${p.link.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${esc(t('proj.visit'))} ↗</a>
    `);
  },
  skillsOverview(){
    const list = SKILL_FIELDS.map(f => `<li><b><a href="#" data-skill="${f.id}" style="color:inherit;text-decoration:none;border-bottom:1px dashed rgba(0,245,255,.4)">${esc(t('skills.' + f.id))}</a></b></li>`).join('');
    this.show(t('node.skills'), t('panel.tag.field'), '/main/skills', `
      <h3>${esc(t('skills.h.levels'))}</h3>
      <ul>${list}</ul>
      <div class="kbd-note">${t('skills.note')}</div>
    `);
    $$('#holo-body [data-skill]').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      const f = SKILL_FIELDS.find(x => x.id === a.dataset.skill);
      Tree.setPath(['skills', 'skill-' + f.id]); AudioBus.open();
      this.skill(f, 'skill-' + f.id);
    }));
  },
  skill(f, id){
    const rows = f.items.map(([n, v]) => `
      <div class="bar-row" style="--bc:${f.color}">
        <span class="bname">${esc(n)}</span>
        <span class="bar"><i data-w="${v}"></i></span>
        <span class="bpct">${v}%</span>
      </div>`).join('');
    this.show(t('skills.' + f.id), t('panel.tag.field'), '/main/skills/' + f.id, `
      <h3>${esc(t('skills.h.levels'))}</h3>
      ${rows}
      <div class="kbd-note">${t('skills.note')}</div>
    `);
  },
  hobbies(){
    const chips = [1,2,3,4,5,6].map(i => `<span class="chip">${esc(t('hob.' + i))}</span>`).join('');
    this.show(t('node.hobbies'), t('panel.tag.sys'), '/main/hobbies', `
      <h3>${esc(t('hobbies.h'))}</h3>
      <div class="chips">${chips}</div>
      <p class="lead">${esc(t('hobbies.note'))}</p>
      <img class="holo-img" src="assets/og-cover.jpg" alt="Night sky network illustration" loading="lazy">
    `);
  },
  contact(){
    this.show(t('node.contact'), t('panel.tag.link'), '/main/contact', `
      <h3>${esc(t('contact.h'))}</h3>
      <p class="lead">${esc(t('contact.p'))}</p>
      <ul>
        <li><b>EMAIL</b> — hello@ayaanmalik.dev</li>
        <li><b>GITHUB</b> — github.com/ayaanmalik</li>
        <li><b>LINKEDIN</b> — linkedin.com/in/ayaanmalik</li>
      </ul>
      <a class="holo-link" href="mailto:hello@ayaanmalik.dev">${esc(t('contact.mail'))} ↗</a>
      <div class="kbd-note">${t('contact.note')}</div>
    `);
  }
};
$('#holo-close').addEventListener('click', () => Holo.hide());
addEventListener('keydown', e => {
  if (e.key === 'Escape'){ if (Holo.open) Holo.hide(); else Tree.back(); }
});

/* ============================================================
   HERO TITLE
   ============================================================ */
const HeroTitle = {
  show(){
    const name = 'AYAAN MALIK';
    $('#hero-name').innerHTML = name.split('').map((c, i) => `<span style="--i:${i}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
    /* type subtitle */
    const sub = t('hero.sub'), el = $('#hero-sub-text');
    el.textContent = '';
    let i = 0;
    const type = () => {
      if (i <= sub.length){ el.textContent = sub.slice(0, i++); this._tm = setTimeout(type, reduceMotion ? 0 : 46); }
      else this._away = setTimeout(() => this.dismiss(), 3400);
    };
    this._tm2 = setTimeout(type, 1400);
    $('#hero-title').classList.remove('away');
  },
  dismiss(){
    clearTimeout(this._tm); clearTimeout(this._tm2); clearTimeout(this._away);
    $('#hero-title').classList.add('away');
  }
};

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
const Boot = {
  done:false, skip:false,
  lines(){
    return {
      en: [
        ['dim', 'NOVA.SYS v3.7.1 — cold start'],
        ['',    '> mounting /dev/memory .............. ', 'OK'],
        ['',    '> render core ........................ ', 'ONLINE'],
        ['',    '> particle field ..................... ', 'STABLE'],
        ['',    '> audio bus .......................... ', 'READY'],
        ['warn','> pro-mode cockpit link .............. ', 'STANDBY'],
        ['',    '> interface assets ................... ', 'LOADED'],
        ['ok',  'ALL SYSTEMS NOMINAL — welcome back, pilot.']
      ],
      tr: [
        ['dim', 'NOVA.SYS v3.7.1 — soğuk başlatma'],
        ['',    '> bellek bağlanıyor .................. ', 'OK'],
        ['',    '> render çekirdeği ................... ', 'ÇEVRİMİÇİ'],
        ['',    '> parçacık alanı ..................... ', 'KARARLI'],
        ['',    '> ses hattı .......................... ', 'HAZIR'],
        ['warn','> pro-mode kokpit bağlantısı ......... ', 'BEKLEMEDE'],
        ['',    '> arayüz varlıkları .................. ', 'YÜKLENDİ'],
        ['ok',  'TÜM SİSTEMLER NORMAL — tekrar hoş geldin, pilot.']
      ],
      de: [
        ['dim', 'NOVA.SYS v3.7.1 — Kaltstart'],
        ['',    '> /dev/memory wird gemountet ......... ', 'OK'],
        ['',    '> Render-Kern ........................ ', 'ONLINE'],
        ['',    '> Partikelfeld ....................... ', 'STABIL'],
        ['',    '> Audio-Bus .......................... ', 'BEREIT'],
        ['warn','> Pro-Mode-Cockpit-Link .............. ', 'STANDBY'],
        ['',    '> Interface-Assets ................... ', 'GELADEN'],
        ['ok',  'ALLE SYSTEME NOMINAL — willkommen zurück, Pilot.']
      ]
    }[lang];
  },
  async run(){
    try{ document.fonts && document.fonts.load('900 20px Orbitron'); }catch(e){}
    const log = $('#boot-log');
    $('#boot').classList.add('meteor');
    const lines = this.lines();
    const total = lines.reduce((a, l) => a + (l[1] || '').length + (l[2] || '').length, 0) || 1;
    let typed = 0;
    for (const [cls, text, status] of lines){
      if (this.skip) break;
      const span = document.createElement('span');
      if (cls) span.className = cls;
      log.appendChild(span);
      for (const ch of text){
        if (this.skip) break;
        span.textContent += ch;
        typed++;
        $('#boot-fill').style.width = (typed / total * 82) + '%';
        $('#boot-pct').textContent = Math.round(typed / total * 82) + '%';
        if (!reduceMotion) await sleep(9);
      }
      if (status){
        const st = document.createElement('span');
        st.className = status === 'OK' || status === 'ONLINE' || status === 'STABLE' || status === 'READY' || status === 'LOADED' ? 'ok' : 'warn';
        st.textContent = status;
        log.appendChild(st);
        AudioBus.ctx && AudioBus.tick();
      }
      log.appendChild(document.createTextNode('\n'));
      if (!reduceMotion) await sleep(120);
    }
    /* finish bar */
    $('#boot-fill').style.width = '100%'; $('#boot-pct').textContent = '100%';
    $('#boot-cal').hidden = false;
    $('#boot-enter').hidden = false;
  },
  enter(){
    if (this.done) return;
    this.done = true;
    AudioBus.resume(); AudioBus.confirm();
    $('#boot').classList.add('gone');
    document.body.classList.add('booted');
    booted = true;
    Tree.build();
    HeroTitle.show();
  }
};
function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

/* ============================================================
   TOOLBAR / LANG / TOGGLES
   ============================================================ */
function applyI18n(){
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('.tb-lang, .b-lang').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
}
function setLang(l){
  if (!I18N[l] || l === lang) return;
  lang = l; store.set('nova-lang', l);
  applyI18n();
  if (Tree.built){
    const keepPath = Tree.path.slice();
    Tree.build();
    if (keepPath.length) Tree.setPath(keepPath);
    if (Holo.open) Holo.hide();
  }
  AudioBus.nav();
}
$$('.tb-lang, .b-lang').forEach(b => b.addEventListener('click', () => { AudioBus.resume(); setLang(b.dataset.lang); AudioBus.tick(); }));

$('#tb-trail').addEventListener('click', () => {
  trailOn = !trailOn; store.set('nova-trail', trailOn);
  $('#tb-trail').classList.toggle('on', trailOn); $('#tb-trail').classList.toggle('off', !trailOn);
  $('#tb-trail').setAttribute('aria-pressed', trailOn);
  AudioBus.resume(); AudioBus.tick();
});
$('#tb-grid').addEventListener('click', () => {
  gridOn = !gridOn; store.set('nova-grid', gridOn);
  $('#tb-grid').classList.toggle('on', gridOn); $('#tb-grid').classList.toggle('off', !gridOn);
  $('#tb-grid').setAttribute('aria-pressed', gridOn);
  AudioBus.resume(); AudioBus.tick();
});
$('#tb-fs').addEventListener('click', () => {
  AudioBus.resume(); AudioBus.tick();
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
});
document.addEventListener('fullscreenchange', () => {
  const fs = !!document.fullscreenElement;
  $('.fs-enter').style.display = fs ? 'none' : '';
  $('.fs-exit').style.display  = fs ? '' : 'none';
  $('#tb-fs').setAttribute('aria-pressed', fs);
  resize();
});

$('#bb').addEventListener('click', () => { AudioBus.resume(); Tree.back(); });
$('#btn-default').addEventListener('click', () => Boot.enter());
$('#boot-skip').addEventListener('click', () => { Boot.skip = true; Boot.enter(); });
$('#boot-test').addEventListener('click', () => {
  AudioBus.resume(); AudioBus.sweep();
  const blocks = $$('#boot-vol-blocks .vol-b');
  blocks.forEach(b => b.classList.remove('hot'));
  blocks.forEach((b, i) => setTimeout(() => {
    b.classList.add('hot'); setTimeout(() => b.classList.remove('hot'), 220);
  }, i * 55));
});

/* ============================================================
   SYSTEM CLOCK
   ============================================================ */
setInterval(() => {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  $('#sys-time').textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}, 1000);

/* ============================================================
   MAIN LOOP
   ============================================================ */
let scrollSpeed = .02;
function loop(){
  if (booted){
    Grid.scroll += reduceMotion ? 0 : scrollSpeed;
    Grid.draw();
    Particles.draw();
    Trail.draw();
    Tree.frame();
    PlayerUI.frame();
    if (!coarse) Cursor.frame();
  }
  requestAnimationFrame(loop);
}

/* ============================================================
   INIT
   ============================================================ */
function init(){
  resize();
  Cursor.init();
  PlayerUI.init();
  buildVolBlocks($('#boot-vol-blocks'), $('#boot-vol-blocks'));
  buildVolBlocks($('#main-vol-blocks'), $('#main-vol-blocks'));
  applyI18n();
  $('#tb-trail').classList.toggle('on', trailOn);
  $('#tb-grid').classList.toggle('on', gridOn);
  $('#tb-trail').setAttribute('aria-pressed', trailOn);
  Tree.panSetup();
  /* faster grid scroll while mouse moves */
  let mvT;
  addEventListener('mousemove', () => {
    scrollSpeed = .075; clearTimeout(mvT);
    mvT = setTimeout(() => scrollSpeed = .02, 500);
  }, { passive:true });
  Boot.run();
  requestAnimationFrame(loop);
}
init();
