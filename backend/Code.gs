
/**
 * BULETIN JUMAT AT-TAUBAH — BACKEND
 * Google Apps Script
 *
 * Spreadsheet tabs created automatically:
 * SETTINGS, EDITIONS, SUBMISSIONS
 *
 * Admin credentials:
 * - ADMIN_USER
 * - ADMIN_PASSWORD
 *
 * Set them in Project Settings > Script properties.
 *
 * Optional GitHub publishing:
 * - GITHUB_TOKEN
 * - GITHUB_OWNER
 * - GITHUB_REPO
 * - GITHUB_BRANCH
 *
 * The GitHub token is stored only in Script Properties, never in public JS.
 */

const SHEETS = {
  SETTINGS: 'SETTINGS',
  EDITIONS: 'EDITIONS',
  SUBMISSIONS: 'SUBMISSIONS'
};

function setup() {
  const ss = SpreadsheetApp.getActive();
  ensureSheet_(ss, SHEETS.SETTINGS, ['key','value']);
  ensureSheet_(ss, SHEETS.EDITIONS, ['no','date','title','ayah','ayahTrans','ayahRef','hadith','hadithTrans','hadithRef','article','reflection','doa','doaTrans','doaRef','status','updated']);
  ensureSheet_(ss, SHEETS.SUBMISSIONS, ['id','name','displayName','email','wa','title','category','text','fileUrl','status','created']);
  PropertiesService.getScriptProperties().setProperty('SETUP_DONE','1');
  return 'Setup selesai';
}

function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) sh.appendRow(headers);
}

function doGet(e) {
  const action = (e.parameter.action || '').trim();
  const token = e.parameter.token || '';
  if (action === 'login') return json_({ok:false,message:'Gunakan POST untuk login.'});
  if (action === 'publicEdition') {
    return json_(publicEdition_(e.parameter.no || '001'));
  }
  if (!validToken_(token)) return json_({ok:false,message:'Tidak berwenang.'});
  if (action === 'dashboard') return json_(dashboard_());
  if (action === 'getSettings') return json_({ok:true,settings:getSettings_()});
  return json_({ok:false,message:'Action tidak dikenal.'});
}

function doPost(e) {
  let body = {};
  try { body = JSON.parse(e.postData.contents || '{}'); } catch (_) {}
  const action = e.parameter.action || body.action || '';
  if (action === 'login') return json_(login_(body.user, body.password));
  const token = e.parameter.token || body.token || '';
  if (!validToken_(token)) return json_({ok:false,message:'Sesi tidak valid.'});

  if (action === 'dashboard') return json_(dashboard_());
  if (action === 'saveEdition') return json_(saveEdition_(body));
  if (action === 'getEdition') return json_(getEdition_(body.no));
  if (action === 'publishEdition') return json_(publishEdition_(body));
  if (action === 'saveSettings') return json_(saveSettings_(body));
  if (action === 'saveSubmission') return json_(saveSubmission_(body));
  return json_({ok:false,message:'Action tidak dikenal.'});
}

function login_(user, password) {
  const props = PropertiesService.getScriptProperties();
  const expectedUser = props.getProperty('ADMIN_USER') || '';
  const expectedPass = props.getProperty('ADMIN_PASSWORD') || '';
  if (!expectedUser || !expectedPass) return {ok:false,message:'ADMIN_USER/ADMIN_PASSWORD belum diatur di Script Properties.'};
  if (String(user) !== expectedUser || String(password) !== expectedPass) return {ok:false,message:'ID admin atau password salah.'};
  const token = Utilities.getUuid();
  CacheService.getScriptCache().put('TOKEN_'+token, expectedUser, 21600);
  return {ok:true,token};
}

function validToken_(token) {
  return !!token && !!CacheService.getScriptCache().get('TOKEN_'+token);
}

function ss_(){ return SpreadsheetApp.getActive(); }

function dashboard_() {
  setup();
  const ed = rows_(SHEETS.EDITIONS);
  const sub = rows_(SHEETS.SUBMISSIONS);
  const settings = getSettings_();
  const published = ed.filter(x=>String(x.status).toLowerCase()==='published');
  published.sort((a,b)=>String(b.no).localeCompare(String(a.no),undefined,{numeric:true}));
  return {ok:true,editions:ed,submissions:sub,latest:published.length?published[0].no:(ed.length?ed[ed.length-1].no:''),settings};
}

function rows_(sheetName) {
  const sh = ss_().getSheetByName(sheetName);
  if (!sh || sh.getLastRow()<2) return [];
  const values = sh.getDataRange().getValues();
  const headers = values.shift();
  return values.filter(r=>r.join('')!=='').map(r=>headers.reduce((o,h,i)=>(o[h]=r[i],o),{}));
}

function saveEdition_(d) {
  setup();
  if (!d.no || !d.title) return {ok:false,message:'Nomor edisi dan judul wajib diisi.'};
  const sh = ss_().getSheetByName(SHEETS.EDITIONS);
  const values = sh.getDataRange().getValues();
  const headers = values[0];
  const row = [d.no,d.date||'',d.title,d.ayah||'',d.ayahTrans||'',d.ayahRef||'',d.hadith||'',d.hadithTrans||'',d.hadithRef||'',d.article||'',d.reflection||'',d.doa||'',d.doaTrans||'',d.doaRef||'',d.status||'draft',new Date()];
  let found = -1;
  for (let i=1;i<values.length;i++) if(String(values[i][0])===String(d.no)){found=i+1;break;}
  if(found>0) sh.getRange(found,1,1,row.length).setValues([row]); else sh.appendRow(row);
  return {ok:true,message:'Edisi '+d.no+' tersimpan.'};
}

function getEdition_(no) {
  const list = rows_(SHEETS.EDITIONS).filter(x=>String(x.no)===String(no));
  return list.length ? {ok:true,edition:list[0]} : {ok:false,message:'Edisi tidak ditemukan.'};
}

function publicEdition_(no) {
  setup();
  const list = rows_(SHEETS.EDITIONS).filter(x=>String(x.no)===String(no));
  if (!list.length) return {ok:false,message:'Edisi tidak ditemukan.'};
  return {ok:true,edition:list[0]};
}

function publishEdition_(d) {
  const saved = saveEdition_(Object.assign({},d,{status:'published'}));
  if (!saved.ok) return saved;
  let github = {ok:true,message:'Tersimpan sebagai published di Spreadsheet.'};
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('GITHUB_TOKEN') && props.getProperty('GITHUB_OWNER') && props.getProperty('GITHUB_REPO')) {
    github = publishToGitHub_(d);
  }
  return {ok:true,message:'Edisi '+d.no+' ditandai terbit. '+github.message};
}

function getSettings_() {
  setup();
  const rows = rows_(SHEETS.SETTINGS);
  const out={};
  rows.forEach(r=>out[r.key]=r.value);
  return out;
}

function saveSettings_(d) {
  setup();
  const sh=ss_().getSheetByName(SHEETS.SETTINGS);
  const all=sh.getDataRange().getValues();
  Object.keys(d||{}).forEach(k=>{
    let row=-1;
    for(let i=1;i<all.length;i++) if(String(all[i][0])===k){row=i+1;break;}
    if(row>0) sh.getRange(row,1,1,2).setValues([[k,d[k]]]);
    else sh.appendRow([k,d[k]]);
  });
  return {ok:true,message:'Pengaturan tersimpan.'};
}

function saveSubmission_(d) {
  setup();
  const sh=ss_().getSheetByName(SHEETS.SUBMISSIONS);
  sh.appendRow([Utilities.getUuid(),d.name||'',d.displayName||'',d.email||'',d.wa||'',d.title||'',d.category||'',d.text||'',d.fileUrl||'',d.status||'Masuk',new Date()]);
  return {ok:true,message:'Tulisan tercatat.'};
}

/**
 * Optional: publishes an edition HTML file to GitHub using the Contents API.
 * This does not expose the GitHub token to the browser.
 */
function publishToGitHub_(d) {
  const props=PropertiesService.getScriptProperties();
  const token=props.getProperty('GITHUB_TOKEN');
  const owner=props.getProperty('GITHUB_OWNER');
  const repo=props.getProperty('GITHUB_REPO');
  const branch=props.getProperty('GITHUB_BRANCH') || 'main';
  const path='edisi/'+String(d.no).padStart(3,'0')+'/index.html';
  const content=renderEditionHtml_(d);
  const api='https://api.github.com/repos/'+encodeURIComponent(owner)+'/'+encodeURIComponent(repo)+'/contents/'+path;
  const headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
  let sha='';
  try {
    const get=UrlFetchApp.fetch(api+'?ref='+encodeURIComponent(branch),{method:'get',headers, muteHttpExceptions:true});
    if(get.getResponseCode()===200) sha=JSON.parse(get.getContentText()).sha||'';
  } catch (_) {}
  const payload={message:'Publish Buletin Jumat Edisi '+d.no,content:Utilities.base64Encode(Utilities.newBlob(content,'text/html','index.html').getBytes()),branch};
  if(sha) payload.sha=sha;
  const res=UrlFetchApp.fetch(api,{method:'put',contentType:'application/json',headers,payload:JSON.stringify(payload),muteHttpExceptions:true});
  const ok=res.getResponseCode()>=200 && res.getResponseCode()<300;
  return {ok,message:ok?'File edisi berhasil dipublish ke GitHub.':'Data tersimpan, tetapi publish GitHub gagal: '+res.getContentText().slice(0,180)};
}

function renderEditionHtml_(d) {
  const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const paras=String(d.article||'').split(/\n+/).filter(Boolean).map(x=>'<p>'+esc(x)+'</p>').join('');
  const reflections=String(d.reflection||'').split(/\n+/).filter(Boolean).map(x=>'<li>'+esc(x)+'</li>').join('');
  const base='../../';
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Buletin Jumat Edisi ${esc(d.no)} — ${esc(d.title)}</title><link rel="stylesheet" href="${base}css/style.css"></head><body><div class="top"><div class="wrap"><span>Pengurus DKM Masjid At-Taubah BNN RI</span><span>Media Syiar Digital</span></div></div><header class="mast"><div class="wrap mast-inner"><div><img class="logo" src="${base}assets/logo-dkm.jpg" alt="Logo DKM"></div><div><div class="eyebrow">Buletin Jumat</div><div class="bigtitle"><span>MASJID</span><span>AT-TAUBAH</span></div><div class="brandline">BNN RI</div><div class="tagline">Dari masjid, untuk hati, dan untuk kebaikan.</div></div><div class="mast-quote">“Masjid bukan hanya tempat kita datang, tetapi tempat hati kita kembali.”</div></div></header><div class="edbar"><div class="wrap"><span>EDISI ${esc(d.no)}</span><span>${esc(d.date)}</span><span>Jumat Berkah</span></div></div><main class="wrap page"><section class="card" style="margin-bottom:18px;background:linear-gradient(135deg,#f7fcff,#e4f3ff);text-align:center"><div class="ribbon">✨ MARI MENAMBAH ILMU</div><div class="cardpad"><div class="ar small">رَبِّ زِدْنِي عِلْمًا</div><div class="trans">“Ya Tuhanku, tambahkanlah ilmu kepadaku.”</div><div class="src">QS. Taha: 114</div><p style="margin:12px auto 0;max-width:760px;color:var(--muted)">Semoga setiap edisi Buletin Jumat menjadi jalan untuk belajar, menambah ilmu, memperluas pemahaman, dan membawa kebaikan dalam kehidupan.</p></div></section><div class="layout"><div><section class="card ayah"><div class="ribbon">📖 AYAT JUMAT</div><div class="ayahbody"><div class="ar">${esc(d.ayah)}</div><div class="trans">“${esc(d.ayahTrans)}”</div><div class="src">${esc(d.ayahRef)}</div></div></section><section class="card" style="margin-top:18px"><div class="ribbon">📜 HADIS PILIHAN</div><div class="hadithbody"><div class="ar">${esc(d.hadith)}</div><p class="trans">“${esc(d.hadithTrans)}”</p><div class="src">${esc(d.hadithRef)}</div></div></section></div><div><article class="card cardpad article"><div class="ribbon">🌿 RENUNGAN UTAMA</div><h1>${esc(d.title)}</h1><div class="by">Redaksi DKM At-Taubah</div>${paras}</article></div></div><div class="lower"><section class="card reflection cardpad"><div class="ribbon">💡 UNTUK DIRENUNGKAN</div><ul>${reflections}</ul></section><section class="card doa cardpad"><div class="ribbon">🤲 DOA JUMAT</div><div class="ar small">${esc(d.doa)}</div><p class="trans">“${esc(d.doaTrans)}”</p><div class="src">${esc(d.doaRef)}</div></section></div><section class="card donation"><div class="ribbon">❤️ INFAQ UNTUK MASJID</div><div class="donation-grid"><div><h2>Mari Bersama Memakmurkan Masjid At-Taubah BNN RI</h2><p>Infaq dapat mendukung operasional masjid, kegiatan keagamaan, pembinaan jamaah, dan pelayanan sosial.</p><div class="info">QRIS infaq resmi DKM ditampilkan di area ini.</div></div><div class="qris"><div><div class="qr-placeholder">QRIS DKM</div><strong style="display:block;margin-top:10px;color:#06356d">Scan QRIS Infaq</strong><div class="src">QRIS resmi DKM</div></div></div></div></section><div class="actions"><button class="btn wa" onclick="shareWA()">🟢 Bagikan ke WhatsApp</button><button class="btn primary" onclick="submitWA()">✍️ Punya Tulisan untuk Dibagi?</button></div></main><footer class="footer"><div class="wrap"><div><strong>🕌 DKM Masjid At-Taubah BNN RI</strong><br><small>Bersama memakmurkan masjid, menguatkan iman, melayani umat.</small></div><div><small>#JumatBerkah • Syiar • Ilmu • Ukhuwah • Infaq</small></div></div></footer><script>function shareWA(){const t='🕌 *Buletin Jumat Masjid At-Taubah BNN RI*\\n\\n*${esc(d.title)}*\\n\\nMari membaca dan menyebarkan kebaikan.\\n\\n👉 '+location.href;window.open('https://wa.me/?text='+encodeURIComponent(t),'_blank')}function submitWA(){const t='✍️ *Kirim Tulisan — Buletin Jumat Masjid At-Taubah BNN RI*\\n\\nAssalamu’alaikum. Saya ingin mengirim tulisan untuk dipertimbangkan Redaksi Buletin Jumat.\\n\\nNama:\\nJudul tulisan:\\n\\nNaskah/file akan saya kirim melalui WhatsApp.';window.open('https://wa.me/?text='+encodeURIComponent(t),'_blank')}</script></body></html>`;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
