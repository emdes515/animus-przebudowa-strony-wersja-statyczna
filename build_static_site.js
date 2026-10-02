const fs = require('fs');
const path = require('path');

// 1. Load Data
const staticDir = 'c:/Users/mateu/Downloads/animus-statyczna';
const dataFilePath = path.join(staticDir, 'projects-data.js');
let dataContent = fs.readFileSync(dataFilePath, 'utf8');

// Safely evaluate data in Node
dataContent = dataContent.replace(/const ANIMUS_PROJECTS/g, 'global.ANIMUS_PROJECTS');
dataContent = dataContent.replace(/const ANIMUS_ARTICLES/g, 'global.ANIMUS_ARTICLES');
eval(dataContent);

const projects = global.ANIMUS_PROJECTS;
const articles = global.ANIMUS_ARTICLES;

const projectIds = Object.keys(projects);
console.log(`Loaded ${projectIds.length} projects and ${articles.length} articles.`);

// Helper to escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Build list of unique photos for each project
const projectPhotosMap = {};
for (const pId of projectIds) {
  const p = projects[pId];
  const set = new Set();
  if (p.hero_img && !p.hero_img.includes('cropped-Animus-Logo')) {
    set.add(p.hero_img);
  }
  (p.articles || []).forEach(a => {
    if (a.hero_img && !a.hero_img.includes('cropped-Animus-Logo')) {
      set.add(a.hero_img);
    }
    (a.images || []).forEach(img => {
      if (img && !img.includes('cropped-Animus-Logo')) {
        set.add(img);
      }
    });
  });
  projectPhotosMap[pId] = Array.from(set);
}

// Shared Navigation Header generator
function generateHeader(relRoot, activeNav) {
  return `
  <!-- PRIMARY NAVBAR -->
  <header class="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-border-subtle transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-20 sm:h-24 flex items-center justify-between gap-4 xl:gap-6">
      
      <a href="${relRoot}index.html" class="flex items-center shrink-0 py-1" aria-label="ANIMUS Foundation Home">
        <img src="${relRoot}cropped-Animus-Logo-Horizontal.png" alt="ANIMUS Foundation" class="h-10 sm:h-12 md:h-14 lg:h-12 xl:h-14 2xl:h-[65px] w-auto max-w-[190px] sm:max-w-none object-contain transition-transform group-hover:scale-[1.03] drop-shadow-[0_2px_4px_rgba(48,0,100,0.06)] shrink-0">
      </a>

      <nav class="hidden lg:flex items-center gap-4 xl:gap-8 text-[13px] xl:text-[14px] font-medium text-slate-600 shrink-0" aria-label="Main menu">
        <a href="${relRoot}index.html" class="hover:text-slate-900 transition-colors py-1 ${activeNav === 'home' ? 'text-slate-900 font-bold' : ''}">Strona główna</a>
        <a href="${relRoot}about.html" class="hover:text-slate-900 transition-colors py-1 ${activeNav === 'about' ? 'text-slate-900 font-bold' : ''}">O nas</a>
        <a href="${relRoot}activities.html" class="hover:text-slate-900 transition-colors py-1 ${activeNav === 'activities' ? 'text-slate-900 font-bold' : ''}">Nasze działania</a>
        <a href="${relRoot}projects.html" class="text-slate-900 font-bold relative py-1 flex items-center gap-1.5 group ${activeNav === 'projects' ? 'text-slate-900 font-bold' : ''}">
          <span>Projekty</span>
          <span class="w-1.5 h-1.5 rounded-full bg-brand-violet"></span>
        </a>
        <a href="${relRoot}partners.html" class="hover:text-slate-900 transition-colors py-1 ${activeNav === 'partners' ? 'text-slate-900 font-bold' : ''}">Partnerzy</a>
        <a href="${relRoot}blog.html" class="hover:text-slate-900 transition-colors py-1 ${activeNav === 'blog' ? 'text-slate-900 font-bold' : ''}">Aktualności</a>
      </nav>

      <div class="hidden sm:flex items-center gap-2 xl:gap-3 shrink-0">
        <div class="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold mr-1 shrink-0">
          <button id="lang-pl" onclick="setLanguage('pl')" class="px-2.5 py-1 rounded-md text-white bg-brand-violet transition-all shadow-sm">PL</button>
          <button id="lang-en" onclick="setLanguage('en')" class="px-2.5 py-1 rounded-md text-slate-500 hover:text-slate-900 transition-all">EN</button>
        </div>

        <a href="https://www.facebook.com/profile.php?id=100084303353670" target="_blank" rel="noopener noreferrer" class="w-8 h-8 xl:w-9 xl:h-9 rounded-xl border border-slate-200 bg-white hover:bg-[#1877F2] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-2xs hover:border-[#1877F2] hover:shadow-sm group shrink-0" title="Facebook Fundacji ANIMUS" aria-label="Facebook Fundacji ANIMUS">
          <svg class="w-3.5 h-3.5 xl:w-4 xl:h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>

        <a href="${relRoot}contact.html" class="inline-flex items-center gap-1.5 xl:gap-2 bg-[#300064] hover:bg-[#220047] text-white px-3.5 xl:px-5 py-2 xl:py-2.5 rounded-xl font-semibold text-xs xl:text-sm shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 shrink-0">
          <span>Skontaktuj się</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </a>
      </div>

      <button id="mobile-toggle" onclick="toggleMobileMenu()" class="lg:hidden p-2 rounded-lg text-slate-700 hover:text-brand-violet hover:bg-slate-100 transition-colors shrink-0" aria-label="Toggle navigation">
        <span class="material-symbols-outlined text-2xl">menu</span>
      </button>

    </div>

    <!-- Mobile Drawer Navigation -->
    <div id="mobile-menu" class="hidden lg:hidden border-t border-slate-200 bg-white px-6 py-6 space-y-4 shadow-xl">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <span class="text-xs font-sans uppercase text-slate-400 font-bold">Język serwisu:</span>
        <div class="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
          <button onclick="setLanguage('pl')" class="px-3 py-1 rounded-md text-white bg-brand-violet transition-all shadow-sm">PL</button>
          <button onclick="setLanguage('en')" class="px-3 py-1 rounded-md text-slate-500 hover:text-slate-900 transition-all">EN</button>
        </div>
      </div>
      <div class="flex flex-col space-y-3 text-sm font-semibold text-slate-700">
        <a href="${relRoot}index.html" class="py-1 hover:text-brand-violet">Strona główna</a>
        <a href="${relRoot}about.html" class="py-1 hover:text-brand-violet">O nas</a>
        <a href="${relRoot}activities.html" class="py-1 hover:text-brand-violet">Nasze działania</a>
        <a href="${relRoot}projects.html" class="py-1 font-bold text-brand-violet">Projekty</a>
        <a href="${relRoot}partners.html" class="py-1 hover:text-brand-violet">Partnerzy</a>
        <a href="${relRoot}blog.html" class="py-1 hover:text-brand-violet">Aktualności</a>
        <a href="https://www.facebook.com/profile.php?id=100084303353670" target="_blank" rel="noopener noreferrer" class="py-1 text-slate-700 hover:text-[#1877F2] flex items-center gap-2 font-semibold">
          <svg class="w-4 h-4 fill-current text-[#1877F2]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Facebook ANIMUS</span>
        </a>
      </div>
      <div class="pt-2 border-t border-slate-100">
        <a href="${relRoot}contact.html" class="pt-2 text-brand-coral font-bold flex items-center justify-between">
          <span>Skontaktuj się</span>
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </a>
      </div>
    </div>
  </header>
  `;
}

// Shared Harmonized 4-Column Footer generator (Zero Latin quote, clean font)
function generateFooter(relRoot) {
  return `
  <!-- HARMONIZED 4-COLUMN FOOTER -->
  <footer class="bg-brand-ink text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-auto">
    <div class="max-w-7xl mx-auto px-6 sm:px-10">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-slate-800">
        
        <!-- Col 1: Brand & Description -->
        <div class="space-y-4">
          <img src="${relRoot}logo.png" alt="ANIMUS Foundation" class="h-10 w-auto object-contain brightness-0 invert" onerror="this.onerror=null; this.src='${relRoot}cropped-Animus-Logo-Horizontal.png'">
          <p class="text-xs text-slate-400 leading-relaxed">
            ANIMUS Foundation (Fundacja ANIMUS) to centrum edukacyjno-szkoleniowe aktywne od 2015 roku na rzecz edukacji pozaformalnej, młodzieży i integracji europejskiej.
          </p>
        </div>

        <!-- Col 2: Navigation -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-white mb-4">Nawigacja</h4>
          <ul class="space-y-2.5 text-xs text-slate-400 font-medium">
            <li><a href="${relRoot}index.html" class="hover:text-white transition-colors">Strona główna</a></li>
            <li><a href="${relRoot}about.html" class="hover:text-white transition-colors">O nas</a></li>
            <li><a href="${relRoot}activities.html" class="hover:text-white transition-colors">Nasze działania</a></li>
            <li><a href="${relRoot}projects.html" class="hover:text-white transition-colors">Projekty</a></li>
            <li><a href="${relRoot}partners.html" class="hover:text-white transition-colors">Partnerzy</a></li>
            <li><a href="${relRoot}blog.html" class="hover:text-white transition-colors">Aktualności (117)</a></li>
          </ul>
        </div>

        <!-- Col 3: Contact -->
        <div class="space-y-3">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-white mb-4">Kontakt</h4>
          <div class="space-y-2 text-xs text-slate-400">
            <p><strong class="text-white">Adres:</strong> ul. Polna 16, 43-180 Orzesze</p>
            <p><strong class="text-white">KRS:</strong> 0000535710</p>
            <p><strong class="text-white">NIP:</strong> 6272740470 • <strong class="text-white">REGON:</strong> 360577338</p>
            <p><strong class="text-white">E-mail:</strong> <a href="mailto:animuscentrum@gmail.com" class="hover:underline">animuscentrum@gmail.com</a></p>
            <p><strong class="text-white">Tel. (PL / ENG):</strong> <a href="tel:+48608616675" class="hover:underline font-medium">+48 608 616 675</a></p>
            <p><strong class="text-white">Tel. (ENG / UA / RU):</strong> <a href="tel:+48573394180" class="hover:underline font-medium">+48 573 394 180</a></p>
          </div>
        </div>

      </div>

      <!-- Bottom Legal Notice -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
        <p>&copy; 2015&ndash;2026 Fundacja ANIMUS Centrum Edukacyjno-Szkoleniowe. Wszystkie prawa zastrzeżone.</p>
      </div>

    </div>
  </footer>
  `;
}

// Lightbox HTML & Scripts
function generateLightboxHtml() {
  return `
  <!-- FULLSCREEN INTERACTIVE PHOTO LIGHTBOX -->
  <div id="photo-lightbox" class="fixed inset-0 z-[10000] bg-slate-950/95 backdrop-blur-md hidden flex flex-col justify-between p-4 sm:p-6 transition-all duration-300 select-none">
    
    <!-- Top Lightbox Bar -->
    <div class="flex items-center justify-between text-white text-xs font-sans z-20">
      <div class="flex items-center gap-3">
        <span id="lightbox-counter" class="bg-white/10 px-3 py-1 rounded-md font-bold">
          1 / 1
        </span>
        <span id="lightbox-filename" class="text-slate-400 hidden sm:inline truncate max-w-sm">
          Fotografia
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="toggleLightboxZoom()" class="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors" title="Powiększ/Zmniejsz">
          <span id="zoom-icon" class="material-symbols-outlined text-[20px]">zoom_in</span>
        </button>
        <button onclick="closeLightbox()" class="p-2 rounded-lg bg-white/10 hover:bg-rose-600 text-white transition-colors" title="Zamknij (Esc)">
          <span class="material-symbols-outlined text-[22px]">close</span>
        </button>
      </div>
    </div>

    <!-- Center Stage -->
    <div class="relative flex-1 flex items-center justify-center overflow-hidden my-3">
      <!-- Prev Button -->
      <button onclick="prevLightboxImage()" class="absolute left-2 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-brand-violet text-white flex items-center justify-center transition-all shadow-xl">
        <span class="material-symbols-outlined text-2xl">chevron_left</span>
      </button>

      <!-- Active Image -->
      <div id="lightbox-img-wrapper" class="max-w-full max-h-full flex items-center justify-center transition-transform duration-300">
        <img id="lightbox-active-img" src="" alt="Powiększenie" class="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl transition-all duration-200">
      </div>

      <!-- Next Button -->
      <button onclick="nextLightboxImage()" class="absolute right-2 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-brand-violet text-white flex items-center justify-center transition-all shadow-xl">
        <span class="material-symbols-outlined text-2xl">chevron_right</span>
      </button>
    </div>

    <!-- Bottom Thumbnails Strip -->
    <div id="lightbox-thumbs" class="flex items-center justify-center gap-2 overflow-x-auto py-2 custom-scrollbar max-w-3xl mx-auto z-20">
      <!-- Thumbs inserted dynamically -->
    </div>

  </div>
  `;
}

function generateLightboxScript(galleryArrayJson) {
  return `
  <script>
    const currentGallery = ${galleryArrayJson};
    let currentLightboxIdx = 0;
    let isZoomed = false;

    function openGalleryAt(idx) {
      if (!currentGallery || currentGallery.length === 0) return;
      currentLightboxIdx = idx;
      isZoomed = false;
      const lb = document.getElementById('photo-lightbox');
      if (!lb) return;
      lb.classList.remove('hidden');
      updateLightboxDisplay();
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      const lb = document.getElementById('photo-lightbox');
      if (lb) lb.classList.add('hidden');
      document.body.style.overflow = '';
    }

    function nextLightboxImage() {
      if (!currentGallery || currentGallery.length === 0) return;
      currentLightboxIdx = (currentLightboxIdx + 1) % currentGallery.length;
      isZoomed = false;
      updateLightboxDisplay();
    }

    function prevLightboxImage() {
      if (!currentGallery || currentGallery.length === 0) return;
      currentLightboxIdx = (currentLightboxIdx - 1 + currentGallery.length) % currentGallery.length;
      isZoomed = false;
      updateLightboxDisplay();
    }

    function toggleLightboxZoom() {
      isZoomed = !isZoomed;
      const img = document.getElementById('lightbox-active-img');
      const icon = document.getElementById('zoom-icon');
      if (img) {
        if (isZoomed) {
          img.className = 'max-w-none max-h-none object-contain rounded-xl shadow-2xl transition-all duration-300 scale-125 cursor-zoom-out';
          if (icon) icon.textContent = 'zoom_out';
        } else {
          img.className = 'max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl transition-all duration-300 cursor-zoom-in';
          if (icon) icon.textContent = 'zoom_in';
        }
      }
    }

    function updateLightboxDisplay() {
      const img = document.getElementById('lightbox-active-img');
      const counter = document.getElementById('lightbox-counter');
      const thumbsContainer = document.getElementById('lightbox-thumbs');

      if (img && currentGallery[currentLightboxIdx]) {
        img.src = currentGallery[currentLightboxIdx];
      }
      if (counter) {
        counter.textContent = (currentLightboxIdx + 1) + ' / ' + currentGallery.length;
      }

      if (thumbsContainer) {
        thumbsContainer.innerHTML = currentGallery.map((t, i) => \`
          <button onclick="openGalleryAt(\${i})" class="w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all \${i === currentLightboxIdx ? 'border-brand-coral scale-110 shadow-lg' : 'border-white/20 opacity-60 hover:opacity-100'}">
            <img src="\${t}" alt="thumb" class="w-full h-full object-cover">
          </button>
        \`).join('');
      }
    }

    window.addEventListener('keydown', (e) => {
      const lb = document.getElementById('photo-lightbox');
      if (!lb || lb.classList.contains('hidden')) return;

      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
      if (e.key === 'Escape') closeLightbox();
    });

    function toggleMobileMenu() {
      const menu = document.getElementById('mobile-menu');
      if (menu) menu.classList.toggle('hidden');
    }

    function copyCurrentProjectLink() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Skopiowano link do projektu do schowka!');
      });
    }

    function copyCurrentLink() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Skopiowano link do relacji do schowka!');
      });
    }

    function shareArticle(network) {
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      let shareUrl = '';
      if (network === 'facebook') {
        shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
      } else if (network === 'twitter') {
        shareUrl = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title;
      }
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=450');
      }
    }

    function setLanguage(lang) {
      localStorage.setItem('animus_lang', lang);
      const btnPl = document.getElementById('lang-pl');
      const btnEn = document.getElementById('lang-en');
      if (btnPl && btnEn) {
        if (lang === 'pl') {
          btnPl.className = 'px-2.5 py-1 rounded-md text-white bg-brand-violet transition-all shadow-sm';
          btnEn.className = 'px-2.5 py-1 rounded-md text-slate-500 hover:text-slate-900 transition-all';
        } else {
          btnEn.className = 'px-2.5 py-1 rounded-md text-white bg-brand-violet transition-all shadow-sm';
          btnPl.className = 'px-2.5 py-1 rounded-md text-slate-500 hover:text-slate-900 transition-all';
        }
      }
    }
  </script>
  `;
}

// Generate Static Project Page
function generateProjectPageHtml(projectId, isNested) {
  const p = projects[projectId];
  const relRoot = isNested ? '../../' : '../';
  const relProjekty = isNested ? '../' : '';
  const relAktualnosci = isNested ? '../../aktualnosci/' : '../aktualnosci/';
  const ext = isNested ? '/' : '.html';

  const pIndex = projectIds.indexOf(projectId);
  const prevId = projectIds[(pIndex - 1 + projectIds.length) % projectIds.length];
  const nextId = projectIds[(pIndex + 1) % projectIds.length];

  const prevLink = isNested ? `../${prevId}/` : `${prevId}.html`;
  const nextLink = isNested ? `../${nextId}/` : `${nextId}.html`;

  const projectPhotos = projectPhotosMap[projectId] || [];
  const projectArticles = p.articles || [];

  // Split description paragraphs
  const descParagraphs = (p.desc_pl || '').split('\n').filter(Boolean);

  // Build Bento Grid HTML for project photos
  let bentoGalleryHtml = '';
  if (projectPhotos.length > 0) {
    bentoGalleryHtml = `
    <!-- BENTO PHOTO GALLERY SECTION -->
    <section id="galeria" class="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span class="text-xs font-sans uppercase font-bold tracking-widest text-brand-coral flex items-center gap-1.5 mb-2">
              <span class="material-symbols-outlined text-[16px]">photo_camera</span>
              <span>Galeria Fotograficzna Projektu</span>
            </span>
            <h2 class="text-2xl sm:text-4xl font-heading font-extrabold text-white">
              Fotorelacja i Archiwum Działań w Terenie (${projectPhotos.length} zdjęć)
            </h2>
          </div>
          <button onclick="openGalleryAt(0)" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-coral hover:bg-orange-600 text-white font-sans font-bold text-xs shadow-md transition-all shrink-0">
            <span class="material-symbols-outlined text-[18px]">fullscreen</span>
            <span>Otwórz pełnoekranową galerię (Lightbox)</span>
          </button>
        </div>

        <!-- Bento Grid of Photos -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          ${projectPhotos.map((img, idx) => `
            <div onclick="openGalleryAt(${idx})" class="relative rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/80 aspect-[4/3] group cursor-pointer shadow-md hover:shadow-2xl hover:border-brand-coral transition-all duration-300 hover:scale-[1.02]">
              <img src="${img}" alt="Zdjęcie ${idx + 1} - ${escapeHtml(p.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.onerror=null; this.src='${relRoot}cropped-Animus-Logo-Horizontal.png'">
              <div class="absolute inset-0 bg-brand-violet/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span class="w-10 h-10 rounded-full bg-white/95 text-brand-violet flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                  <span class="material-symbols-outlined text-[20px]">zoom_in</span>
                </span>
              </div>
              <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-sans text-white/90">
                #${idx + 1}
              </span>
            </div>
          `).join('')}
        </div>

      </div>
    </section>
    `;
  }

  // Build Chronicle Grid HTML for project articles
  let chronicleHtml = '';
  if (projectArticles.length > 0) {
    chronicleHtml = `
    <!-- PROJECT CHRONICLE & ARTICLES SECTION -->
    <section id="relacje" class="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span class="text-xs font-sans uppercase font-bold tracking-widest text-brand-violet flex items-center gap-1.5 mb-2">
              <span class="material-symbols-outlined text-[16px]">menu_book</span>
              <span>Kronika Terenowa</span>
            </span>
            <h2 class="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900">
              Raporty, Relacje i Działania w Ramach Tego Projektu (${projectArticles.length})
            </h2>
          </div>
          <p class="text-xs sm:text-sm font-sans text-slate-500">
            Wszystkie oficjalne relacje zrealizowane w projekcie
          </p>
        </div>

        <!-- Articles Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          ${projectArticles.map((a, aIdx) => {
            const artUrl = isNested ? `../../aktualnosci/${a.slug}/` : `../aktualnosci/${a.slug}.html`;
            const artImg = a.hero_img || (a.images && a.images[0]) || `${relRoot}cropped-Animus-Logo-Horizontal.png`;
            const photosCount = (a.images || []).length;
            return `
            <article class="bg-white rounded-3xl border border-slate-200/90 shadow-warm-card hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1">
              <a href="${artUrl}" class="relative aspect-[16/10] overflow-hidden bg-slate-100 block">
                <img src="${artImg}" alt="${escapeHtml(a.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.onerror=null; this.src='${relRoot}cropped-Animus-Logo-Horizontal.png'">
                <div class="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] font-sans font-medium">
                  <span class="material-symbols-outlined text-[13px] text-brand-amber">photo_library</span>
                  <span>${photosCount} zdjęć</span>
                </div>
                <div class="absolute bottom-3 left-3 bg-brand-violet text-white px-2.5 py-1 rounded-md text-[10px] font-sans font-bold uppercase tracking-wider">
                  ${escapeHtml(a.date)}
                </div>
              </a>
              <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div class="space-y-2">
                  <h3 class="font-heading font-extrabold text-lg text-slate-900 group-hover:text-brand-violet transition-colors line-clamp-2">
                    <a href="${artUrl}">
                      ${escapeHtml(a.title)}
                    </a>
                  </h3>
                  <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    ${escapeHtml(a.summary || '')}
                  </p>
                </div>
                <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span class="text-[11px] font-sans text-slate-400">Raport terenowy</span>
                  <a href="${artUrl}" class="inline-flex items-center gap-1 text-xs font-bold text-brand-coral group-hover:translate-x-0.5 transition-transform">
                    <span>Czytaj relację</span>
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </a>
                </div>
              </div>
            </article>
            `;
          }).join('')}
        </div>

      </div>
    </section>
    `;
  }

  // Partners pills
  const partnersList = (p.partners || '').split('•').map(s => s.trim()).filter(Boolean);

  return `<!DOCTYPE html>
<html lang="pl" class="scroll-smooth">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(p.name)} | Karta Projektu | Fundacja ANIMUS</title>
  <meta name="description" content="${escapeHtml(p.desc_pl ? p.desc_pl.substring(0, 160) : '')}">

  <!-- Favicon -->
  <link rel="icon" href="${relRoot}logo.png" type="image/png">

  <!-- Typography: Space Grotesk, Inter, Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Material Symbols Outlined -->
  <link rel="stylesheet" href="${relRoot}material-symbols.css" />

  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: '#300064',
              hover: '#220047',
              container: '#4a0e8f',
              fixed: '#eedcff',
              dark: '#1c003b'
            },
            secondary: {
              DEFAULT: '#F35813',
              container: '#ff7738'
            },
            brand: {
              'violet': '#300064',
              'coral': '#F35813',
              'cyan': '#2AD0FF',
              'amber': '#EA9A05',
              'ink': '#0F172A',
              'paper': '#FAF9F6'
            },
            surface: '#fdfbf7',
            'border-subtle': '#E2E8F0'
          },
          fontFamily: {
            heading: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
            body: ['"Inter"', 'sans-serif'],
            sans: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
            mono: ['"Plus Jakarta Sans"', 'ui-monospace', 'monospace']
          },
          boxShadow: {
            'die-ambient': '0 20px 40px -10px rgba(48, 0, 100, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)',
            'warm-card': '0 10px 30px -5px rgba(48, 0, 100, 0.06), 0 4px 10px rgba(0, 0, 0, 0.02)'
          }
        }
      }
    };
  </script>

  <style>
    .notebook-grid {
      background-color: #FAF9F6;
      background-image: radial-gradient(rgba(148, 163, 184, 0.38) 1px, transparent 1px);
      background-size: 28px 28px;
    }
    html, body {
      overflow-x: clip;
      max-width: 100vw;
    }
    .custom-scrollbar::-webkit-scrollbar {
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
    }
  </style>
</head>
<body class="bg-surface text-slate-900 antialiased flex flex-col min-h-screen overflow-x-clip selection:bg-brand-violet selection:text-white">

  ${generateHeader(relRoot, 'projects')}

  <!-- MAIN PROJECT DOSSIER HERO -->
  <main class="flex-grow">
    
    <!-- Hero Header Section -->
    <section class="relative bg-brand-ink text-white pt-28 pb-16 sm:pt-36 sm:pb-20 overflow-hidden">
      <!-- Ambient Backdrop Glow -->
      <div class="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,#4a0e8f,transparent_60%)]"></div>
      <div class="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-brand-coral/10 blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Breadcrumbs & Meta Badges -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-2 text-xs font-sans text-slate-400">
            <a href="${relRoot}index.html" class="hover:text-white transition-colors">Główna</a>
            <span>/</span>
            <a href="${relRoot}projects.html" class="hover:text-white transition-colors">Projekty</a>
            <span>/</span>
            <span class="text-white font-semibold">${escapeHtml(p.name)}</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs font-sans text-xs font-bold text-white border border-white/15">
              ${escapeHtml(p.period || '2020–2026')}
            </span>
            <span class="px-3 py-1 rounded-lg bg-brand-coral text-white font-sans text-xs font-bold shadow-md">
              ${escapeHtml(p.badge_pl || 'Erasmus+')}
            </span>
          </div>
        </div>

        <!-- Project Title Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <div class="lg:col-span-7 space-y-6">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              ${escapeHtml(p.name)}
            </h1>
            
            <p class="text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
              ${escapeHtml(p.desc_pl || '')}
            </p>

            <!-- Quick Specs Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 font-sans text-xs">
              <div class="flex items-start gap-2.5">
                <span class="material-symbols-outlined text-brand-coral text-[20px] shrink-0 mt-0.5">location_on</span>
                <div>
                  <div class="text-slate-400 uppercase tracking-wider text-[10px]">Zasięg / Lokalizacja</div>
                  <div class="text-white font-semibold mt-0.5">${escapeHtml(p.location || 'Polska • Europa')}</div>
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <span class="material-symbols-outlined text-brand-cyan text-[20px] shrink-0 mt-0.5">group_work</span>
                <div>
                  <div class="text-slate-400 uppercase tracking-wider text-[10px]">Konsorcjum i Partnerzy</div>
                  <div class="text-white font-semibold mt-0.5">${escapeHtml(p.partners || 'Fundacja ANIMUS i Partnerzy Międzynarodowi')}</div>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex flex-wrap items-center gap-3 pt-2">
              ${projectPhotos.length > 0 ? `
              <a href="#galeria" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-coral hover:bg-orange-600 text-white font-sans font-bold text-xs shadow-md transition-all">
                <span class="material-symbols-outlined text-[16px]">photo_library</span>
                <span>Zobacz galerię (${projectPhotos.length} zdjęć)</span>
              </a>
              ` : ''}
              ${projectArticles.length > 0 ? `
              <a href="#relacje" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-violet hover:bg-primary-container text-white font-sans font-bold text-xs shadow-md transition-all">
                <span class="material-symbols-outlined text-[16px]">menu_book</span>
                <span>Kronika relacji (${projectArticles.length})</span>
              </a>
              ` : ''}
              <button onclick="copyCurrentProjectLink()" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-sans text-xs font-semibold border border-white/15 transition-all">
                <span class="material-symbols-outlined text-[16px]">share</span>
                <span>Udostępnij</span>
              </button>
            </div>
          </div>

          <!-- Hero Image Column -->
          <div class="lg:col-span-5">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-slate-900 aspect-[4/3] group">
              <img src="${p.hero_img || `${relRoot}cropped-Animus-Logo-Horizontal.png`}" alt="${escapeHtml(p.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onerror="this.onerror=null; this.src='${relRoot}cropped-Animus-Logo-Horizontal.png'">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
              
              <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-sans text-white/90 pointer-events-none">
                <span class="flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md">
                  <span class="material-symbols-outlined text-[14px] text-brand-coral">verified</span>
                  <span>Zweryfikowana inicjatywa ANIMUS</span>
                </span>
                <span class="bg-brand-violet/90 backdrop-blur-xs px-2.5 py-1 rounded-md font-bold">
                  ${projectArticles.length} relacji • ${projectPhotos.length} zdjęć
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- CONTENT & PASSPORT SECTION -->
    <section class="py-16 sm:py-20 notebook-grid border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <!-- Left Column: Detailed Description & Strategic Blueprint -->
          <div class="lg:col-span-8 space-y-10">
            
            <div class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-warm-card space-y-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined text-[22px]">description</span>
                </div>
                <div>
                  <span class="text-[11px] font-sans font-bold uppercase tracking-wider text-brand-coral">Paszport Merytoryczny</span>
                  <h2 class="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">Opis i Założenia Strategiczne</h2>
                </div>
              </div>

              <div class="prose prose-slate max-w-none text-slate-700 leading-relaxed font-sans space-y-4 text-base sm:text-lg">
                ${descParagraphs.map(pText => `<p>${escapeHtml(pText)}</p>`).join('')}
              </div>

              ${p.desc_en ? `
              <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 mt-6">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span class="material-symbols-outlined text-[16px] text-brand-violet">translate</span>
                  <span>Abstract (English)</span>
                </div>
                <p class="text-sm text-slate-600 italic leading-relaxed">
                  ${escapeHtml(p.desc_en)}
                </p>
              </div>
              ` : ''}

              <!-- Methodology / Impact Highlights -->
              <div class="pt-6 border-t border-slate-100">
                <h3 class="text-sm font-sans uppercase tracking-wider font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span class="material-symbols-outlined text-brand-coral text-[18px]">verified</span>
                  <span>Kluczowe rezultaty i metodyka pracy</span>
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                    <span class="material-symbols-outlined text-brand-violet text-[22px] mb-2">sports_esports</span>
                    <h4 class="font-heading font-bold text-sm text-slate-900">Edukacja Pozaformalna</h4>
                    <p class="text-xs text-slate-600 mt-1">Aktywne warsztaty, gry adaptacyjne i uczenie przez doświadczenie (experiential learning).</p>
                  </div>
                  <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                    <span class="material-symbols-outlined text-brand-coral text-[22px] mb-2">diversity_3</span>
                    <h4 class="font-heading font-bold text-sm text-slate-900">Włączenie Młodzieży</h4>
                    <p class="text-xs text-slate-600 mt-1">Równe szanse, certyfikacja Youthpass i budowanie kompetencji obywatelskich.</p>
                  </div>
                  <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                    <span class="material-symbols-outlined text-brand-cyan text-[22px] mb-2">public</span>
                    <h4 class="font-heading font-bold text-sm text-slate-900">Wymiar Europejski</h4>
                    <p class="text-xs text-slate-600 mt-1">Konsorcja międzynarodowe, transfer dobrych praktyk i mobilność Erasmus+.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Right Column: Consortium Passport Card & Fast Actions -->
          <div class="lg:col-span-4 space-y-6">
            
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-warm-card space-y-6">
              <h3 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                <span class="material-symbols-outlined text-brand-violet text-[22px]">badge</span>
                <span>Paszport Konsorcjum</span>
              </h3>

              <div class="space-y-4 text-xs font-sans">
                <div class="pb-3 border-b border-slate-100">
                  <div class="text-[10px] font-sans text-slate-400 uppercase tracking-wider">Lider / Koordynator</div>
                  <div class="font-bold text-slate-900 text-sm mt-0.5">Fundacja ANIMUS Centrum Edukacyjno-Szkoleniowe</div>
                  <div class="text-slate-500 font-sans text-[11px] mt-0.5">Orzesze, Polska • OID: E10189332</div>
                </div>

                <div class="pb-3 border-b border-slate-100">
                  <div class="text-[10px] font-sans text-slate-400 uppercase tracking-wider">Partnerzy Wdrożeniowi</div>
                  <div class="font-medium text-slate-700 mt-1 space-y-1">
                    ${partnersList.map(part => `
                      <div class="flex items-center gap-1.5 text-xs text-slate-800">
                        <span class="w-1.5 h-1.5 rounded-full bg-brand-coral"></span>
                        <span>${escapeHtml(part)}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="pb-3 border-b border-slate-100">
                  <div class="text-[10px] font-sans text-slate-400 uppercase tracking-wider">Status Inicjatywy</div>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span class="font-semibold text-slate-900">Zrealizowany i udokumentowany</span>
                  </div>
                </div>

                <div>
                  <div class="text-[10px] font-sans text-slate-400 uppercase tracking-wider">Certyfikacja i Uznawalność</div>
                  <div class="font-medium text-slate-700 mt-1 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-brand-coral text-[16px]">military_tech</span>
                    <span>Certyfikat Youthpass / Zaświadczenie MEN</span>
                  </div>
                </div>
              </div>

              <!-- Quick Contact CTA -->
              <div class="pt-4 border-t border-slate-100">
                <a href="${relRoot}contact.html" class="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-brand-violet hover:text-white text-slate-800 font-heading font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs">
                  <span class="material-symbols-outlined text-[16px]">mail</span>
                  <span>Zgłoś partnerstwo lub zapytaj o projekt</span>
                </a>
              </div>
            </div>

            <!-- Adjacent Projects Navigation Card -->
            <div class="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4">
              <div class="text-[10px] font-sans uppercase text-slate-400 tracking-wider">Nawigacja po projektach</div>
              <div class="flex items-center justify-between gap-3 text-xs font-semibold">
                <a href="${prevLink}" class="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1">
                  <span class="material-symbols-outlined text-[16px]">chevron_left</span>
                  <span>Poprzedni</span>
                </a>
                <a href="${relRoot}projects.html" class="text-slate-400 hover:text-white transition-colors">Wszystkie (10)</a>
                <a href="${nextLink}" class="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1">
                  <span>Następny</span>
                  <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>

    ${bentoGalleryHtml}

    ${chronicleHtml}

  </main>

  ${generateLightboxHtml()}

  ${generateFooter(relRoot)}

  ${generateLightboxScript(JSON.stringify(projectPhotos))}

</body>
</html>
`;
}

// Generate Static Article Page
function generateArticlePageHtml(article, isNested) {
  const relRoot = isNested ? '../../' : '../';
  const parentProject = projects[article.project_id] || { name: 'Projekt ANIMUS', id: 'okulary-mlodziezowe' };
  
  const articlePhotos = article.images || [];
  if (article.hero_img && !articlePhotos.includes(article.hero_img) && !article.hero_img.includes('cropped-Animus-Logo')) {
    articlePhotos.unshift(article.hero_img);
  }

  // Find index in all articles for Prev / Next
  const artIdx = articles.findIndex(a => a.slug === article.slug);
  const prevArt = articles[(artIdx - 1 + articles.length) % articles.length];
  const nextArt = articles[(artIdx + 1) % articles.length];

  const prevLink = isNested ? `../../aktualnosci/${prevArt.slug}/` : `../aktualnosci/${prevArt.slug}.html`;
  const nextLink = isNested ? `../../aktualnosci/${nextArt.slug}/` : `../aktualnosci/${nextArt.slug}.html`;
  const projectLink = isNested ? `../../projekty/${article.project_id}/` : `../projekty/${article.project_id}.html`;

  // Sibling articles
  const siblings = articles.filter(a => a.project_id === article.project_id);

  // Text blocks
  const textBlocks = article.text_blocks || [article.summary || ''];

  return `<!DOCTYPE html>
<html lang="pl" class="scroll-smooth">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(article.title)} | Aktualności | Fundacja ANIMUS</title>
  <meta name="description" content="${escapeHtml(article.summary ? article.summary.substring(0, 160) : '')}">

  <!-- Favicon -->
  <link rel="icon" href="${relRoot}logo.png" type="image/png">

  <!-- Typography: Space Grotesk, Inter, Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Material Symbols Outlined -->
  <link rel="stylesheet" href="${relRoot}material-symbols.css" />

  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: '#300064',
              hover: '#220047',
              container: '#4a0e8f',
              fixed: '#eedcff',
              dark: '#1c003b'
            },
            secondary: {
              DEFAULT: '#F35813',
              container: '#ff7738'
            },
            brand: {
              'violet': '#300064',
              'coral': '#F35813',
              'cyan': '#2AD0FF',
              'amber': '#EA9A05',
              'ink': '#0F172A',
              'paper': '#FAF9F6'
            },
            surface: '#fdfbf7',
            'border-subtle': '#E2E8F0'
          },
          fontFamily: {
            heading: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
            body: ['"Inter"', 'sans-serif'],
            sans: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
            mono: ['"Plus Jakarta Sans"', 'ui-monospace', 'monospace']
          },
          boxShadow: {
            'die-ambient': '0 20px 40px -10px rgba(48, 0, 100, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)',
            'warm-card': '0 10px 30px -5px rgba(48, 0, 100, 0.06), 0 4px 10px rgba(0, 0, 0, 0.02)'
          }
        }
      }
    };
  </script>

  <style>
    .notebook-grid {
      background-color: #FAF9F6;
      background-image: radial-gradient(rgba(148, 163, 184, 0.38) 1px, transparent 1px);
      background-size: 28px 28px;
    }
    html, body {
      overflow-x: clip;
      max-width: 100vw;
    }
    .custom-scrollbar::-webkit-scrollbar {
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
    }
  </style>
</head>
<body class="bg-surface text-slate-900 antialiased flex flex-col min-h-screen overflow-x-clip selection:bg-brand-violet selection:text-white">

  ${generateHeader(relRoot, 'blog')}

  <main class="flex-grow">
    
    <!-- Article Header Hero -->
    <article class="relative">
      
      <div class="bg-brand-ink text-white pt-28 pb-16 sm:pt-36 sm:pb-20 relative overflow-hidden">
        <div class="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,#4a0e8f,transparent_60%)]"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-brand-coral/10 blur-3xl pointer-events-none"></div>

        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          
          <!-- Breadcrumb & Top Bar -->
          <div class="flex items-center justify-between gap-4 flex-wrap text-xs font-sans text-slate-400">
            <div class="flex items-center gap-2">
              <a href="${relRoot}index.html" class="hover:text-white transition-colors">Główna</a>
              <span>/</span>
              <a href="${relRoot}blog.html" class="hover:text-white transition-colors">Aktualności</a>
              <span>/</span>
              <a href="${projectLink}" class="hover:text-white transition-colors">${escapeHtml(parentProject.name)}</a>
            </div>

            <a href="${relRoot}blog.html" class="text-brand-coral hover:text-white flex items-center gap-1 font-semibold">
              <span class="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Wszystkie aktualności (117)</span>
            </a>
          </div>

          <!-- Metadata Tags -->
          <div class="flex items-center gap-3 flex-wrap">
            <span class="px-3 py-1 rounded-lg bg-brand-violet font-sans text-xs font-bold text-white shadow-xs">
              ${escapeHtml(parentProject.name)}
            </span>
            <span class="text-xs font-sans text-slate-400 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">calendar_today</span>
              <span>${escapeHtml(article.date)}</span>
            </span>
            <span class="text-xs font-sans text-slate-400 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px] text-brand-amber">photo_library</span>
              <span>${articlePhotos.length} zdjęć</span>
            </span>
          </div>

          <!-- Article Title -->
          <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white leading-tight tracking-tight">
            ${escapeHtml(article.title)}
          </h1>

          <!-- Lead Summary -->
          <p class="text-base sm:text-xl text-slate-300 font-sans leading-relaxed">
            ${escapeHtml(article.summary || '')}
          </p>

          <!-- Share Toolbar -->
          <div class="flex items-center justify-between gap-4 pt-4 border-t border-white/10 flex-wrap">
            <div class="flex items-center gap-2 text-xs font-sans text-slate-400">
              <span>Autor: <strong class="text-white">Zespół Fundacji ANIMUS</strong></span>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs font-sans text-slate-400 mr-1">Udostępnij:</span>
              <button onclick="shareArticle('facebook')" class="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-colors" title="Facebook">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button onclick="shareArticle('twitter')" class="w-8 h-8 rounded-lg bg-white/10 hover:bg-sky-500 text-white flex items-center justify-center transition-colors" title="Twitter / X">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </button>
              <button onclick="copyCurrentLink()" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-semibold flex items-center gap-1 transition-colors" title="Kopiuj link">
                <span class="material-symbols-outlined text-[15px]">content_copy</span>
                <span>Kopiuj</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Main Photo Hero Feature -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div class="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-[16/9] sm:aspect-[21/9] relative group">
          <img src="${article.hero_img || `${relRoot}cropped-Animus-Logo-Horizontal.png`}" alt="${escapeHtml(article.title)}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='${relRoot}cropped-Animus-Logo-Horizontal.png'">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none"></div>
          ${articlePhotos.length > 0 ? `
          <button onclick="openGalleryAt(0)" class="absolute bottom-4 right-4 bg-brand-ink/80 hover:bg-brand-violet text-white text-xs font-sans px-3.5 py-2 rounded-xl backdrop-blur-md flex items-center gap-2 shadow-lg transition-all">
            <span class="material-symbols-outlined text-[16px]">fullscreen</span>
            <span>Otwórz pełną galerię w Lightbox</span>
          </button>
          ` : ''}
        </div>
      </div>

      <!-- Article Content & Bento Gallery Section -->
      <div class="py-14 sm:py-20 notebook-grid">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <!-- Article Text Body -->
          <div class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-warm-card">
            <div class="space-y-6 text-slate-800 text-base sm:text-lg font-sans leading-relaxed">
              ${textBlocks.map(block => `<p>${escapeHtml(block)}</p>`).join('')}
            </div>
          </div>

          ${articlePhotos.length > 0 ? `
          <!-- Bento Photo Gallery Grid -->
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-4">
              <div>
                <span class="text-xs font-semibold text-brand-violet uppercase tracking-wider">Galeria Foto & Reportaż</span>
                <h2 class="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                  Fotorelacja z Działań w Terenie (${articlePhotos.length} zdjęć)
                </h2>
              </div>
              <span class="text-xs font-sans text-slate-500 font-semibold">
                Kliknij zdjęcie, aby powiększyć
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              ${articlePhotos.map((img, idx) => `
                <div onclick="openGalleryAt(${idx})" class="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[4/3] group cursor-pointer shadow-xs hover:shadow-lg transition-all hover:scale-[1.02]">
                  <img src="${img}" alt="Zdjęcie ${idx + 1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.onerror=null; this.src='${relRoot}cropped-Animus-Logo-Horizontal.png'">
                  <div class="absolute inset-0 bg-brand-violet/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="w-10 h-10 rounded-full bg-white/90 text-brand-violet flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                      <span class="material-symbols-outlined text-[20px]">zoom_in</span>
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <!-- Project Hierarchy Tree (Sibling articles in this project) -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-warm-card space-y-6">
            <div class="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 flex-wrap">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center">
                  <span class="material-symbols-outlined text-[22px]">account_tree</span>
                </div>
                <div>
                  <span class="text-[11px] font-sans font-bold text-brand-coral uppercase tracking-wider">Kontekst Inicjatywy</span>
                  <h3 class="text-lg sm:text-xl font-heading font-extrabold text-slate-900">
                    Pozostałe Etapy i Relacje w Tym Projekcie (${siblings.length})
                  </h3>
                </div>
              </div>

              <a href="${projectLink}" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-brand-violet hover:text-white font-sans text-xs font-bold text-slate-700 transition-colors shadow-2xs">
                <span>Karta Projektu: ${escapeHtml(parentProject.name)}</span>
                <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
              </a>
            </div>

            <!-- Hierarchy Timeline List -->
            <div class="space-y-3">
              ${siblings.map((sib, sIdx) => {
                const isCurrent = (sib.slug === article.slug);
                const sibLink = isNested ? `../../aktualnosci/${sib.slug}/` : `../aktualnosci/${sib.slug}.html`;
                return `
                <div class="flex items-center justify-between p-3.5 rounded-2xl transition-all ${isCurrent ? 'bg-brand-violet/10 border-2 border-brand-violet font-bold' : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'}">
                  <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center font-sans text-xs ${isCurrent ? 'bg-brand-violet text-white' : 'bg-slate-200 text-slate-700'}">
                      0${sIdx + 1}
                    </div>
                    <div>
                      <a href="${sibLink}" class="text-xs sm:text-sm text-slate-900 hover:text-brand-violet line-clamp-1">
                        ${escapeHtml(sib.title)}
                      </a>
                      <div class="text-[11px] font-sans text-slate-500">${escapeHtml(sib.date)}</div>
                    </div>
                  </div>

                  <div>
                    ${isCurrent ? `
                      <span class="px-2.5 py-1 rounded-md bg-brand-violet text-white text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Aktualnie czytasz</span>
                      </span>
                    ` : `
                      <a href="${sibLink}" class="text-xs font-semibold text-brand-violet hover:text-brand-coral flex items-center gap-1">
                        <span>Przejdź</span>
                        <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </a>
                    `}
                  </div>
                </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Adjacent Article Navigation -->
          <div class="flex items-center justify-between gap-4 pt-6 font-sans text-xs font-bold">
            <a href="${prevLink}" class="px-4 py-3 rounded-2xl bg-white border border-slate-200 hover:border-brand-violet hover:text-brand-violet shadow-2xs transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">chevron_left</span>
              <span>Poprzednia relacja</span>
            </a>
            <a href="${relRoot}blog.html" class="text-slate-500 hover:text-slate-900 transition-colors hidden sm:inline">
              Wszystkie relacje (117)
            </a>
            <a href="${nextLink}" class="px-4 py-3 rounded-2xl bg-white border border-slate-200 hover:border-brand-violet hover:text-brand-violet shadow-2xs transition-all flex items-center gap-2">
              <span>Następna relacja</span>
              <span class="material-symbols-outlined text-[18px]">chevron_right</span>
            </a>
          </div>

        </div>
      </div>
    </article>

  </main>

  ${generateLightboxHtml()}

  ${generateFooter(relRoot)}

  ${generateLightboxScript(JSON.stringify(articlePhotos))}

</body>
</html>
`;
}

// 2. Execution Loop
console.log('Generating files and directories...');

// Ensure base directories
const projektyDir = path.join(staticDir, 'projekty');
const aktualnosciDir = path.join(staticDir, 'aktualnosci');

if (!fs.existsSync(projektyDir)) fs.mkdirSync(projektyDir, { recursive: true });
if (!fs.existsSync(aktualnosciDir)) fs.mkdirSync(aktualnosciDir, { recursive: true });

// A. Generate All 10 Projects
let projectCount = 0;
for (const pId of projectIds) {
  // Nested structure: projekty/{slug}/index.html
  const projectFolder = path.join(projektyDir, pId);
  if (!fs.existsSync(projectFolder)) fs.mkdirSync(projectFolder, { recursive: true });
  
  const nestedHtml = generateProjectPageHtml(pId, true);
  fs.writeFileSync(path.join(projectFolder, 'index.html'), nestedHtml, 'utf8');

  // Flat structure: projekty/{slug}.html
  const flatHtml = generateProjectPageHtml(pId, false);
  fs.writeFileSync(path.join(projektyDir, `${pId}.html`), flatHtml, 'utf8');

  projectCount++;
}
console.log(`Generated ${projectCount} project pages (dual nested + flat).`);

// B. Generate All 117 Articles
let articleCount = 0;
for (const art of articles) {
  // Nested structure: aktualnosci/{slug}/index.html
  const artFolder = path.join(aktualnosciDir, art.slug);
  if (!fs.existsSync(artFolder)) fs.mkdirSync(artFolder, { recursive: true });

  const nestedHtml = generateArticlePageHtml(art, true);
  fs.writeFileSync(path.join(artFolder, 'index.html'), nestedHtml, 'utf8');

  // Flat structure: aktualnosci/{slug}.html
  const flatHtml = generateArticlePageHtml(art, false);
  fs.writeFileSync(path.join(aktualnosciDir, `${art.slug}.html`), flatHtml, 'utf8');

  articleCount++;
}
console.log(`Generated ${articleCount} article pages (dual nested + flat).`);

// C. Copy / Create Index pages for projekty/ and aktualnosci/
// projekty/index.html can mirror projects.html with adjusted asset links
let projectsIndexContent = fs.readFileSync(path.join(staticDir, 'projects.html'), 'utf8');
// Adjust relative paths for projekty/index.html (it's one level deep)
projectsIndexContent = projectsIndexContent.replace(/href="\.\//g, 'href="../');
projectsIndexContent = projectsIndexContent.replace(/src="\.\//g, 'src="../');
projectsIndexContent = projectsIndexContent.replace(/href="index\.html"/g, 'href="../index.html"');
projectsIndexContent = projectsIndexContent.replace(/href="about\.html"/g, 'href="../about.html"');
projectsIndexContent = projectsIndexContent.replace(/href="activities\.html"/g, 'href="../activities.html"');
projectsIndexContent = projectsIndexContent.replace(/href="projects\.html"/g, 'href="../projects.html"');
projectsIndexContent = projectsIndexContent.replace(/href="partners\.html"/g, 'href="../partners.html"');
projectsIndexContent = projectsIndexContent.replace(/href="blog\.html"/g, 'href="../blog.html"');
projectsIndexContent = projectsIndexContent.replace(/href="contact\.html"/g, 'href="../contact.html"');
projectsIndexContent = projectsIndexContent.replace(/src="projects-data\.js"/g, 'src="../projects-data.js"');
projectsIndexContent = projectsIndexContent.replace(/src="cropped-Animus-Logo-Horizontal\.png"/g, 'src="../cropped-Animus-Logo-Horizontal.png"');
projectsIndexContent = projectsIndexContent.replace(/src="logo\.png"/g, 'src="../logo.png"');
projectsIndexContent = projectsIndexContent.replace(/href="material-symbols\.css"/g, 'href="../material-symbols.css"');
// Point project cards directly to their subfolder
projectsIndexContent = projectsIndexContent.replace(/single-project\.html\?id=(\w[\w-]*)/g, '$1/');
fs.writeFileSync(path.join(projektyDir, 'index.html'), projectsIndexContent, 'utf8');
console.log('Generated projekty/index.html.');

// aktualnosci/index.html can mirror blog.html with adjusted asset links
let blogIndexContent = fs.readFileSync(path.join(staticDir, 'blog.html'), 'utf8');
blogIndexContent = blogIndexContent.replace(/href="\.\//g, 'href="../');
blogIndexContent = blogIndexContent.replace(/src="\.\//g, 'src="../');
blogIndexContent = blogIndexContent.replace(/href="index\.html"/g, 'href="../index.html"');
blogIndexContent = blogIndexContent.replace(/href="about\.html"/g, 'href="../about.html"');
blogIndexContent = blogIndexContent.replace(/href="activities\.html"/g, 'href="../activities.html"');
blogIndexContent = blogIndexContent.replace(/href="projects\.html"/g, 'href="../projects.html"');
blogIndexContent = blogIndexContent.replace(/href="partners\.html"/g, 'href="../partners.html"');
blogIndexContent = blogIndexContent.replace(/href="blog\.html"/g, 'href="../blog.html"');
blogIndexContent = blogIndexContent.replace(/href="contact\.html"/g, 'href="../contact.html"');
blogIndexContent = blogIndexContent.replace(/src="projects-data\.js"/g, 'src="../projects-data.js"');
blogIndexContent = blogIndexContent.replace(/src="cropped-Animus-Logo-Horizontal\.png"/g, 'src="../cropped-Animus-Logo-Horizontal.png"');
blogIndexContent = blogIndexContent.replace(/src="logo\.png"/g, 'src="../logo.png"');
blogIndexContent = blogIndexContent.replace(/href="material-symbols\.css"/g, 'href="../material-symbols.css"');
// Point article cards directly to their subfolder
blogIndexContent = blogIndexContent.replace(/single-article\.html\?slug=([\w-]+)/g, '$1/');
fs.writeFileSync(path.join(aktualnosciDir, 'index.html'), blogIndexContent, 'utf8');
console.log('Generated aktualnosci/index.html.');

console.log('Build completed successfully!');
