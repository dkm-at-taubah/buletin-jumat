
const editionTitle = "Ketika Hati Belajar Berserah";
const editionUrl = window.location.href;

function shareWhatsApp(){
  const text = `🕌 *Buletin Jumat Masjid At-Taubah BNN RI*\n\n*${editionTitle}*\n\nMari membaca, mengambil hikmah, dan menyebarkan kebaikan.\n\n👉 ${editionUrl}`;
  window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
}
async function copyLink(){
  try{
    await navigator.clipboard.writeText(editionUrl);
    alert("Link buletin sudah disalin.");
  }catch(e){
    prompt("Salin link Buletin Jumat:", editionUrl);
  }
}
function savePDF(){
  window.print();
}
function openLatest(){
  window.location.href = "edisi/001/";
}
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll("[data-share]").forEach(el=>el.addEventListener("click",shareWhatsApp));
  document.querySelectorAll("[data-copy]").forEach(el=>el.addEventListener("click",copyLink));
  document.querySelectorAll("[data-pdf]").forEach(el=>el.addEventListener("click",savePDF));
  document.querySelectorAll("[data-latest]").forEach(el=>el.addEventListener("click",openLatest));
});
