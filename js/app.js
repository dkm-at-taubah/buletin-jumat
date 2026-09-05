
const CONFIG = {
  redactionWA: "", // contoh: 62812xxxxxxxx; isi nomor WA Redaksi DKM
  title: "Ketika Hati Belajar Berserah",
  edition: "001",
  submissionEndpoint: "" // isi URL Google Apps Script/backend produksi nanti
};

function shareWA(){
  const text = `🕌 *Buletin Jumat Masjid At-Taubah BNN RI*\n\n*${CONFIG.title}*\n\nMari membaca, mengambil hikmah, dan menyebarkan kebaikan.\n\n👉 ${location.href}`;
  const target = CONFIG.redactionWA ? "https://wa.me/"+CONFIG.redactionWA+"?text=" : "https://wa.me/?text=";
  window.open(target+encodeURIComponent(text),"_blank","noopener");
}
catch(e){prompt("Salin link Buletin Jumat:",location.href);}
}
function latest(){
  window.location.href = "edisi/001/";
}

function submitWA(){
  const text = `✍️ *Kirim Tulisan — Buletin Jumat Masjid At-Taubah BNN RI*\n\nAssalamu'alaikum. Saya ingin mengirim tulisan untuk dipertimbangkan sebagai bahan Buletin Jumat.\n\nNama:\nJudul tulisan:\n\nNaskah/file akan saya kirim melalui WhatsApp.\n\nTerima kasih.`;
  window.open("https://wa.me/?text="+encodeURIComponent(text),"_blank","noopener");
}
