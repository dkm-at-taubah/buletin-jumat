const CONFIG = {
  redactionWA: "", // Isi nomor WA Redaksi DKM, contoh 62812xxxxxxxx
  title: "Ketika Hati Belajar Berserah",
  edition: "001"
};

function shareWA(){
  const text = `🕌 *Buletin Jumat Masjid At-Taubah BNN RI*\n\n*${CONFIG.title}*\n\nMari membaca, mengambil hikmah, dan menyebarkan kebaikan.\n\n👉 ${location.href}`;
  const target = CONFIG.redactionWA
    ? "https://wa.me/" + CONFIG.redactionWA + "?text="
    : "https://wa.me/?text=";
  window.location.href = target + encodeURIComponent(text);
}

function submitWA(){
  const text = `✍️ *Punya Tulisan untuk Dibagi? — Buletin Jumat Masjid At-Taubah BNN RI*\n\nAssalamu'alaikum. Saya ingin mengirim tulisan untuk dipertimbangkan sebagai bahan Buletin Jumat.\n\nNama:\nJudul tulisan:\n\nNaskah/file akan saya kirim melalui WhatsApp.\n\nTerima kasih.`;
  const target = CONFIG.redactionWA
    ? "https://wa.me/" + CONFIG.redactionWA + "?text="
    : "https://wa.me/?text=";
  window.location.href = target + encodeURIComponent(text);
}
