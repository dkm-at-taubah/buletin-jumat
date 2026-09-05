
const CONFIG = {
  title: "Ketika Hati Belajar Berserah",
  edition: "001",
  pdf: "Buletin-Jumat-001.pdf",
  submissionEndpoint: "" // isi URL Google Apps Script/backend produksi nanti
};

function shareWA(){
  const text = `🕌 *Buletin Jumat Masjid At-Taubah BNN RI*\n\n*${CONFIG.title}*\n\nMari membaca, mengambil hikmah, dan menyebarkan kebaikan.\n\n👉 ${location.href}`;
  window.open("https://wa.me/?text="+encodeURIComponent(text),"_blank","noopener");
}
async function copyLink(){
  try{await navigator.clipboard.writeText(location.href);alert("Link Buletin Jumat sudah disalin.");}
  catch(e){prompt("Salin link Buletin Jumat:",location.href);}
}
function downloadPDF(){
  window.location.href = CONFIG.pdf;
}
function latest(){
  window.location.href = "edisi/001/";
}
