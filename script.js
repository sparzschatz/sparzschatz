/* ---------- Passwortschutz ----------
   Einfacher Client-seitiger Schutz, kein echter Sicherheitsmechanismus.
   Passwort hier anpassen: */
const PASSWORD = "drschnelltest";

const lockScreen = document.getElementById("lock-screen");
const lockForm = document.getElementById("lock-form");
const passwordInput = document.getElementById("password-input");
const lockError = document.getElementById("lock-error");
const content = document.getElementById("content");

function unlock() {
  lockScreen.hidden = true;
  content.hidden = false;
  sessionStorage.setItem("briefe-unlocked", "true");
  init();
}

if (sessionStorage.getItem("briefe-unlocked") === "true") {
  unlock();
}

lockForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (passwordInput.value === PASSWORD) {
    lockError.classList.remove("visible");
    unlock();
  } else {
    lockError.classList.add("visible");
    passwordInput.value = "";
    passwordInput.focus();
  }
});

/* ---------- Board: Zeichnen ---------- */
let items = [];

async function init() {
  if (items.length === 0) {
    const res = await fetch("data.json");
    items = await res.json();
    renderItems();
  }
}

function renderItems() {
  const canvas = document.getElementById("board-canvas");
  canvas.innerHTML = "";

  items.forEach(item => {
    const el = document.createElement("div");
    el.className = `item item-${item.typ}`;
    el.style.left = item.x + "px";
    el.style.top = item.y + "px";
    el.style.transform = `rotate(${item.rotation || 0}deg)`;

    const tagClass = item.typ === "postkarte" ? "tag-postkarte" : "tag-tagebuch";
    const tagLabel = item.typ === "postkarte" ? "Postkarte" : "Reisetagebuch";

if (item.typ === "postkarte") {
  el.innerHTML = `
    <img class="item-face" src="${item.vorderseite}" alt="${item.titel}">
    <div class="item-label"><span class="item-tag ${tagClass}"></span>${item.titel}</div>
  `;
  el.addEventListener("click", () => openPostcard(item));
} else if (item.typ === "fotostreifen") {
  const richtung = item.ausrichtung === "hoch" ? "hoch" : "quer";
  el.classList.add(richtung);
  el.innerHTML = `
    <img class="strip-img" src="${item.bild}" alt="${item.titel}">
    <div class="item-label"><span class="item-tag tag-postkarte"></span>${item.titel}</div>
  `;
  el.addEventListener("click", () => openDiary({ ...item, seiten: [item.bild] }));
} else {
  el.innerHTML = `
    <div class="stack"><img src="${item.seiten[0]}" alt="${item.titel}"></div>
    <div class="item-label"><span class="item-tag ${tagClass}"></span>${item.titel}</div>
  `;
  el.addEventListener("click", () => openDiary(item));
}

    canvas.appendChild(el);
  });
}

/* ---------- Postkarten-Modal ---------- */
const postcardOverlay = document.getElementById("postcard-overlay");
const postcardFlip = document.getElementById("postcard-flip");
const postcardFlipBtn = document.getElementById("postcard-flip-btn");

function openPostcard(item) {
  document.getElementById("postcard-front").src = item.vorderseite;
  document.getElementById("postcard-back").src = item.rueckseite;
  document.getElementById("postcard-info").textContent =
    `${item.titel} · ${formatDate(item.datum)} · ${item.ort}`;
  postcardFlip.classList.remove("flipped");
  postcardFlipBtn.textContent = "Rückseite ansehen";
  postcardOverlay.hidden = false;
}

postcardFlipBtn.addEventListener("click", () => {
  const flipped = postcardFlip.classList.toggle("flipped");
  postcardFlipBtn.textContent = flipped ? "Vorderseite ansehen" : "Rückseite ansehen";
});

/* ---------- Tagebuch-Modal ---------- */
const diaryOverlay = document.getElementById("diary-overlay");
const diaryPageImg = document.getElementById("diary-page");
const diaryPrevBtn = document.getElementById("diary-prev");
const diaryNextBtn = document.getElementById("diary-next");

let currentDiary = null;
let currentPage = 0;

function openDiary(item) {
  currentDiary = item;
  currentPage = 0;
  document.getElementById("diary-info").textContent = `${item.titel} · ${item.ort}`;
  renderDiaryPage();
  diaryOverlay.hidden = false;
}

function renderDiaryPage() {
  diaryPageImg.src = currentDiary.seiten[currentPage];
  document.getElementById("diary-pagecount").textContent =
    `Seite ${currentPage + 1} von ${currentDiary.seiten.length}`;
  diaryPrevBtn.disabled = currentPage === 0;
  diaryNextBtn.disabled = currentPage === currentDiary.seiten.length - 1;
}

diaryPrevBtn.addEventListener("click", () => {
  if (currentPage > 0) { currentPage--; renderDiaryPage(); }
});

diaryNextBtn.addEventListener("click", () => {
  if (currentPage < currentDiary.seiten.length - 1) { currentPage++; renderDiaryPage(); }
});

/* ---------- Overlays schließen ---------- */
document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", closeOverlays);
});

document.querySelectorAll(".overlay").forEach(ov => {
  ov.addEventListener("click", (e) => {
    if (e.target === ov) closeOverlays();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeOverlays();
  if (!diaryOverlay.hidden) {
    if (e.key === "ArrowLeft") diaryPrevBtn.click();
    if (e.key === "ArrowRight") diaryNextBtn.click();
  }
});

function closeOverlays() {
  postcardOverlay.hidden = true;
  diaryOverlay.hidden = true;
}

/* ---------- Hilfsfunktion ---------- */
function formatDate(iso) {
  const parts = iso.split("-");
  if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
  if (parts.length === 2) return `${parts[1]}/${parts[0]}`;
  return iso;
}

if (item.typ === "video") {
  const video = document.createElement("video");

  video.src = item.video;
  video.controls = true;
  video.preload = "metadata";
  video.playsInline = true;

  video.style.width = "320px";
  video.style.height = "auto";
  video.style.display = "block";

  element.appendChild(video);
}
