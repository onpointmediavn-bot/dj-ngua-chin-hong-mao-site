// DJ Ngựa Chín Hồng Mao — tương tác tối giản, không thư viện ngoài
document.documentElement.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* Hero video: chỉ tự phát khi người dùng không yêu cầu giảm chuyển động; luôn có nút dừng */
const video = document.getElementById("heroVideo");
const toggle = document.getElementById("videoToggle");
const label = toggle.querySelector(".vt-label");
function setPlaying(playing) {
  toggle.setAttribute("aria-pressed", String(!playing));
  label.textContent = playing ? "Tạm dừng video" : "Phát video";
}
if (reduceMotion.matches) {
  setPlaying(false);
} else {
  video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
}
toggle.addEventListener("click", () => {
  if (video.paused) { video.play().then(() => setPlaying(true)).catch(() => {}); }
  else { video.pause(); setPlaying(false); }
});

/* Header đặc lại khi cuộn khỏi hero */
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* Phóng to ảnh show: bấm ảnh có data-zoom; bấm nền, nút Đóng hoặc Esc để đóng */
let lastFocus = null;
function closeLightbox() {
  const lb = document.querySelector(".co-lb");
  if (!lb) return;
  lb.remove();
  if (lastFocus) lastFocus.focus();
}
document.addEventListener("click", e => {
  if (document.querySelector(".co-lb")) { closeLightbox(); return; }
  const t = e.target.closest("[data-zoom]");
  if (!t) return;
  lastFocus = t;
  const d = document.createElement("div");
  d.className = "co-lb";
  d.setAttribute("role", "dialog");
  d.setAttribute("aria-modal", "true");
  d.setAttribute("aria-label", "Xem ảnh lớn");
  const img = document.createElement("img");
  img.src = t.dataset.zoom;
  img.alt = t.querySelector("img")?.alt || "";
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "co-lb-close"; btn.textContent = "Đóng ✕";
  d.append(img, btn);
  document.body.appendChild(d);
  btn.focus();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

/* Hiện nội dung theo nhịp khi cuộn */
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -10% 0px" });
  items.forEach(el => io.observe(el));
} else {
  items.forEach(el => el.classList.add("is-in"));
}

/* Form: CHƯA kết nối backend — không gửi dữ liệu đi đâu */
const form = document.getElementById("bookingForm");
const status = document.getElementById("formStatus");
form.addEventListener("submit", e => {
  e.preventDefault();
  const missing = [...form.querySelectorAll("[required]")].filter(f => !f.value.trim());
  form.querySelectorAll("[aria-invalid]").forEach(f => f.removeAttribute("aria-invalid"));
  if (missing.length) {
    missing.forEach(f => f.setAttribute("aria-invalid", "true"));
    status.textContent = "Vui lòng điền tên và số điện thoại.";
    missing[0].focus();
    return;
  }
  status.textContent = "Bản xem trước: biểu mẫu chưa kết nối, thông tin chưa được gửi. Vui lòng liên hệ trực tiếp.";
});

document.getElementById("year").textContent = new Date().getFullYear();
