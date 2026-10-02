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
        <a href="${relRoot}projects.html" class="hover:text-slate-900 transition-colors py-1 ${activeNav === 'projects' ? 'text-slate-900 font-bold' : ''}">Projekty</a>
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
        <a href="${relRoot}projects.html" class="py-1 hover:text-brand-violet">Projekty</a>
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

// Shared Harmonized 3-Column Footer generator (Zero Latin quote, clean font)
function generateFooter(relRoot) {
  return `
  <!-- HARMONIZED 3-COLUMN FOOTER -->
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
            <li><a href="${relRoot}blog.html" class="hover:text-white transition-colors">Aktualności</a></li>
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

// Premium Cinema Darkroom Lightbox (1-to-1 with single.php)
function generateLightboxHtml() {
  return `
  <!-- PREMIUM CINEMA DARKROOM LIGHTBOX -->
  <div id="gallery-lightbox" class="fixed inset-0 z-[999999] bg-[#0b0f19]/98 backdrop-blur-2xl hidden flex flex-col justify-between p-4 sm:p-6 transition-all duration-300 select-none">
    
    <!-- Top Lightbox Bar -->
    <div class="flex items-center justify-between text-white text-xs font-sans z-20">
      <div class="flex items-center gap-3">
        <span id="lightbox-counter" class="bg-white/10 px-3 py-1 rounded-md font-bold text-white">
          1 / 1
        </span>
        <span id="lightbox-filename" class="text-slate-400 hidden sm:inline truncate max-w-sm">
          Fotografia archiwalna ANIMUS
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

    function openLightbox(idx) {
      if (!currentGallery || currentGallery.length === 0) return;
      currentLightboxIdx = idx;
      isZoomed = false;
      const lb = document.getElementById('gallery-lightbox');
      if (!lb) return;
      lb.classList.remove('hidden');
      updateLightboxDisplay();
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      const lb = document.getElementById('gallery-lightbox');
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
          <button onclick="openLightbox(\${i})" class="w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all \${i === currentLightboxIdx ? 'border-brand-coral scale-110 shadow-lg' : 'border-white/20 opacity-60 hover:opacity-100'}">
            <img src="\${t}" alt="thumb" class="w-full h-full object-cover">
          </button>
        \`).join('');
      }
    }

    window.addEventListener('keydown', (e) => {
      const lb = document.getElementById('gallery-lightbox');
      if (!lb || lb.classList.contains('hidden')) return;

      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
      if (e.key === 'Escape') closeLightbox();
    });

    function toggleMobileMenu() {
      const menu = document.getElementById('mobile-menu');
      if (menu) menu.classList.toggle('hidden');
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

// -------------------------------------------------------------
// GENERATE STATIC PROJECT PAGE (1-to-1 matching single-project.php)
// -------------------------------------------------------------
function generateProjectPageHtml(projectId, isNested) {
  const p = projects[projectId];
  const relRoot = isNested ? '../../' : '../';

  const pIndex = projectIds.indexOf(projectId);
  const prevId = projectIds[(pIndex - 1 + projectIds.length) % projectIds.length];
  const nextId = projectIds[(pIndex + 1) % projectIds.length];

  const prevLink = isNested ? `../${prevId}/` : `${prevId}.html`;
  const nextLink = isNested ? `../${nextId}/` : `${nextId}.html`;
  const prevProj = projects[prevId];
  const nextProj = projects[nextId];

  const projectPhotos = projectPhotosMap[projectId] || [];
  const projectArticles = p.articles || [];
  const descParagraphs = (p.desc_pl || '').split('\n').filter(Boolean);

  return `<!DOCTYPE html>
<html lang="pl" class="scroll-smooth">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(p.name)} | Fundacja ANIMUS</title>
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
            sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
            heading: ['Space Grotesk', 'sans-serif'],
            mono: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
          },
          boxShadow: {
            'elevation-hover': '0 12px 30px -8px rgba(48, 0, 100, 0.12), 0 4px 10px -3px rgba(0, 0, 0, 0.04)'
          }
        }
      }
    };
  </script>

  <style>
    html, body {
      overflow-x: clip;
      max-width: 100vw;
    }
    .notebook-grid {
      background-color: #FAF9F6;
      background-image: radial-gradient(rgba(148, 163, 184, 0.38) 1px, transparent 1px);
      background-size: 28px 28px;
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

  <!-- MAIN ARTICLE CONTAINER (1-to-1 matching single-project.php) -->
  <main class="flex-grow pt-24 sm:pt-28 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
      
      <!-- TOP BREADCRUMBS & NAVIGATION -->
      <nav class="py-4 flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-slate-500 border-b border-slate-200 mb-8 min-w-0" aria-label="Breadcrumb">
        <div class="flex items-center gap-2 flex-wrap min-w-0">
          <a href="${relRoot}index.html" class="hover:text-brand-violet transition-colors shrink-0">ANIMUS</a>
          <span>/</span>
          <a href="${relRoot}projects.html" class="hover:text-brand-violet transition-colors shrink-0">Projekty</a>
          <span>/</span>
          <span class="text-slate-900 font-bold truncate max-w-xs sm:max-w-md min-w-0">${escapeHtml(p.name)}</span>
        </div>

        <a href="${relRoot}projects.html" class="inline-flex items-center gap-1.5 text-slate-700 hover:text-brand-violet font-bold transition-colors shrink-0">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Wszystkie Projekty</span>
        </a>
      </nav>

      <!-- PROJECT HERO CARD -->
      <section class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 mb-12 min-w-0">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 min-w-0">
          
          <!-- Hero Imagery -->
          <div class="lg:col-span-5 relative min-h-[300px] sm:min-h-[360px] bg-slate-100 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200 min-w-0">
            <img src="${p.hero_img || `${relRoot}cropped-Animus-Logo-Horizontal.png`}" alt="${escapeHtml(p.name)}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='${relRoot}cropped-Animus-Logo-Horizontal.png'">
            
            <div class="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 flex-wrap">
              <span style="background-color: ${escapeHtml(p.color || '#300064')};" class="text-white font-sans text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-lg font-bold shadow-md">
                <span>${escapeHtml(p.badge_pl || 'Erasmus+')}</span>
              </span>
              <span class="bg-slate-950/85 backdrop-blur-sm text-white font-sans text-xs px-3 py-1.5 rounded-lg font-semibold shadow-md">
                ${escapeHtml(p.period || '2024–2025')}
              </span>
            </div>
          </div>

          <!-- Hero Core Dossier Header -->
          <div class="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 min-w-0">
            <div class="space-y-4">
              
              <!-- Meta Row -->
              <div class="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-sans text-slate-500 font-medium">
                <div class="flex items-center gap-1.5 text-slate-800 font-bold">
                  <span class="material-symbols-outlined text-[18px] text-brand-coral">location_on</span>
                  <span>${escapeHtml(p.location || 'Polska • Europa')}</span>
                </div>
                <div class="flex items-center gap-1.5 text-slate-600">
                  <span class="material-symbols-outlined text-[18px] text-brand-violet">handshake</span>
                  <span>${escapeHtml(p.partners || 'Fundacja ANIMUS i Partnerzy')}</span>
                </div>
              </div>

              <!-- Main H1 Title -->
              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 leading-tight tracking-tight">
                ${escapeHtml(p.name)}
              </h1>

              ${p.name_en && p.name_en !== p.name ? `
                <p class="text-sm font-sans text-brand-violet font-semibold">
                  English Title: ${escapeHtml(p.name_en)}
                </p>
              ` : ''}

              <!-- Subtitle Excerpt -->
              <p class="text-base sm:text-lg text-slate-600 leading-relaxed font-sans pt-2">
                ${escapeHtml(p.desc_pl || '')}
              </p>

            </div>

            <!-- Key Metrics Bar -->
            <div class="pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div class="text-slate-500 text-xs font-medium">Kronika Działań</div>
                <div class="text-lg font-extrabold font-heading text-slate-900 mt-0.5">${projectArticles.length} <span>relacji</span></div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div class="text-slate-500 text-xs font-medium">Okres Realizacji</div>
                <div class="text-lg font-extrabold font-heading text-slate-900 mt-0.5">${escapeHtml(p.period || '2024–2025')}</div>
              </div>
              <div class="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div class="text-slate-500 text-xs font-medium">Zasięg</div>
                <div class="text-lg font-extrabold font-heading text-brand-violet mt-0.5 truncate">${escapeHtml(p.location || 'Polska • Europa')}</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- TWO-COLUMN EDITORIAL & PASSPORT SECTION -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16 w-full min-w-0">
        
        <!-- Main Content Column (8 cols) -->
        <div class="lg:col-span-8 space-y-10 min-w-0 w-full">
          
          <!-- Opis merytoryczny projektu -->
          <article class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <div class="flex items-center justify-between border-b border-slate-200 pb-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-2xl text-brand-violet">description</span>
                <h2 class="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                  Merytoryczne Założenia i Cele Inicjatywy
                </h2>
              </div>
              <span class="text-xs font-sans bg-purple-50 text-brand-violet px-3 py-1 rounded-full font-bold border border-purple-200">
                Dossier Merytoryczne
              </span>
            </div>

            <!-- Content Body -->
            <div class="prose prose-slate max-w-none text-slate-700 leading-relaxed font-sans text-base sm:text-lg space-y-4">
              ${descParagraphs.map(para => `<p>${escapeHtml(para)}</p>`).join('')}
            </div>

            <!-- English Abstract Box if available -->
            ${p.desc_en ? `
              <div class="mt-8 pt-6 border-t border-slate-200 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div class="flex items-center gap-2 text-brand-violet font-sans text-xs font-bold uppercase tracking-wider mb-2">
                  <span class="material-symbols-outlined text-[18px]">language</span>
                  <span>International Project Abstract (English)</span>
                </div>
                <p class="text-sm text-slate-600 leading-relaxed font-sans">
                  ${escapeHtml(p.desc_en)}
                </p>
              </div>
            ` : ''}

          </article>

          <!-- VISUAL DOCUMENTATION GALLERY CARD (BENTO GRID + LIGHTBOX) -->
          ${projectPhotos.length > 0 ? `
          <section id="galeria" class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6 min-w-0">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div class="flex items-center gap-2 text-brand-violet font-sans text-xs font-bold uppercase tracking-wider mb-1">
                  <span class="material-symbols-outlined text-base">photo_library</span>
                  <span>Dokumentacja Wizualna Projektu</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
                  Fotoreportaż &amp; Archiwum Działań w Terenie
                </h2>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs font-sans text-slate-500">
                  ${projectPhotos.length} oryginalnych fotografii
                </span>
                <button onclick="openLightbox(0)" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-coral hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-xs">
                  <span class="material-symbols-outlined text-sm">fullscreen</span>
                  <span>Lightbox</span>
                </button>
              </div>
            </div>

            <!-- Bento Grid Gallery Layout -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              ${projectPhotos.map((imgUrl, idx) => {
                const isFirst = (idx === 0);
                const cellClass = isFirst ? 'sm:col-span-2 sm:row-span-2 min-h-[300px] sm:min-h-[420px]' : 'min-h-[200px] sm:min-h-[200px]';
                return `
                <div class="${cellClass} relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group shadow-xs hover:shadow-md transition-all duration-300" onclick="openLightbox(${idx})">
                  <img src="${imgUrl}" alt="Fotografia ${idx + 1} - ${escapeHtml(p.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.onerror=null; this.src='${relRoot}cropped-Animus-Logo-Horizontal.png'">
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 text-white">
                    <span class="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                      <span class="material-symbols-outlined text-lg">zoom_in</span>
                    </span>
                  </div>
                  <span class="absolute bottom-2.5 left-2.5 bg-black/65 backdrop-blur-md text-white text-[10px] font-sans px-2 py-0.5 rounded border border-white/10">
                    #${String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                `;
              }).join('')}
            </div>
          </section>
          ` : ''}

          <!-- CHRONICLE OF FIELD REPORTS (RELACJE TERENOWE) -->
          <section id="kronika" class="space-y-6">
            <div class="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span class="text-xs font-sans text-brand-coral uppercase tracking-wider font-bold">Relacje Terenowe</span>
                <h3 class="text-2xl font-extrabold font-heading text-slate-900">
                  Kronika Działań Projektu (${projectArticles.length})
                </h3>
              </div>
              <span class="text-xs font-sans text-slate-500">
                Pełna dokumentacja warsztatów i wymian
              </span>
            </div>

            ${projectArticles.length > 0 ? `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${projectArticles.map(art => {
                  const artUrl = isNested ? `../../aktualnosci/${art.slug}/` : `../aktualnosci/${art.slug}.html`;
                  const artHero = art.hero_img || (art.images && art.images[0]) || `${relRoot}cropped-Animus-Logo-Horizontal.png`;
                  const artPhotosCount = (art.images || []).length;
                  return `
                  <article class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:border-brand-violet hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                    <div>
                      <a href="${artUrl}" class="h-48 w-full bg-slate-100 overflow-hidden relative block">
                        <img src="${artHero}" alt="${escapeHtml(art.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.onerror=null; this.src='${relRoot}cropped-Animus-Logo-Horizontal.png'">
                        <span class="absolute top-3 left-3 bg-brand-violet text-white font-sans text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md font-bold shadow-sm">
                          ${escapeHtml(p.badge_pl || 'Relacja')}
                        </span>
                        ${artPhotosCount > 1 ? `
                          <span class="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white font-sans text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1 shadow-sm">
                            <span class="material-symbols-outlined text-[12px]">photo_camera</span>
                            <span>${artPhotosCount}</span>
                          </span>
                        ` : ''}
                      </a>
                      
                      <div class="p-5 sm:p-6 space-y-2.5">
                        <div class="text-[11px] font-sans font-semibold text-slate-500 flex items-center gap-1.5">
                          <span class="material-symbols-outlined text-[14px] text-brand-coral">calendar_today</span>
                          <span>${escapeHtml(art.date)}</span>
                        </div>
                        <h4 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-violet transition-colors line-clamp-2 leading-snug font-heading">
                          <a href="${artUrl}">
                            ${escapeHtml(art.title)}
                          </a>
                        </h4>
                        <p class="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-sans">
                          ${escapeHtml(art.summary || '')}
                        </p>
                      </div>
                    </div>

                    <div class="p-5 sm:p-6 pt-0">
                      <a href="${artUrl}" class="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-violet group-hover:text-brand-coral transition-colors font-sans">
                        <span>Czytaj relację</span>
                        <span class="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </a>
                    </div>
                  </article>
                  `;
                }).join('')}
              </div>
            ` : `
              <div class="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                <span class="material-symbols-outlined text-4xl text-slate-400">folder_open</span>
                <p class="text-sm text-slate-600 font-sans">
                  Kronika tego projektu jest w trakcie redakcji. Wkrótce pojawią się nowe wpisy i reportaże.
                </p>
              </div>
            `}
          </section>

        </div>

        <!-- Right Sidebar Passport Column (4 cols) -->
        <aside class="lg:col-span-4 space-y-6 lg:sticky lg:top-28 min-w-0 w-full">
          
          <!-- Passport Card -->
          <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
            <div class="flex items-center justify-between border-b border-slate-200 pb-4">
              <span class="text-sm font-bold text-slate-800 font-heading">Paszport Projektu</span>
              <span class="material-symbols-outlined text-xl text-brand-violet">verified</span>
            </div>

            <div class="space-y-4 text-xs">
              <div>
                <span class="text-slate-500 block mb-0.5 font-medium">Program ramowy</span>
                <span class="text-slate-900 font-bold text-sm font-heading">${escapeHtml(p.badge_pl || 'Erasmus+')}</span>
              </div>
              <div class="border-t border-slate-100 pt-3">
                <span class="text-slate-500 block mb-0.5 font-medium">Lata realizacji</span>
                <span class="text-slate-900 font-bold text-sm font-heading">${escapeHtml(p.period || '2024–2025')}</span>
              </div>
              <div class="border-t border-slate-100 pt-3">
                <span class="text-slate-500 block mb-0.5 font-medium">Lokalizacja</span>
                <span class="text-slate-900 font-bold text-sm font-heading">${escapeHtml(p.location || 'Polska • Europa')}</span>
              </div>
              <div class="border-t border-slate-100 pt-3">
                <span class="text-slate-500 block mb-0.5 font-medium">Konsorcjum i partnerzy</span>
                <p class="text-slate-800 font-medium text-xs leading-relaxed mt-1">
                  ${escapeHtml(p.partners || 'Fundacja ANIMUS')}
                </p>
              </div>
              <div class="border-t border-slate-100 pt-3">
                <span class="text-slate-500 block mb-0.5 font-medium">Liczba wpisów w kronice</span>
                <span class="text-brand-violet font-extrabold text-sm sm:text-base font-heading">${projectArticles.length} <span>udokumentowanych relacji</span></span>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-200 space-y-3">
              <a href="${relRoot}contact.html" class="w-full inline-flex items-center justify-center gap-2 bg-[#300064] hover:bg-[#220047] text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                <span>Zapytaj o ten projekt</span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </a>

              <a href="${relRoot}projects.html" class="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 px-4 rounded-xl font-semibold text-sm transition-all">
                <span class="material-symbols-outlined text-[16px]">grid_view</span>
                <span>Katalog Wszystkich Projektów</span>
              </a>
            </div>

          </div>

          <!-- Institutional Seal -->
          <div class="bg-gradient-to-br from-slate-900 to-brand-violet text-white rounded-3xl p-6 space-y-3 shadow-md">
            <div class="flex items-center gap-3">
              <img src="${relRoot}cropped-Animus-Logo-Horizontal.png" alt="ANIMUS" class="h-8 w-auto brightness-0 invert">
            </div>
            <p class="text-xs text-purple-200 leading-relaxed font-sans">
              Fundacja ANIMUS realizuje projekty edukacji pozaformalnej, młodzieżowe wymiany Erasmus+ oraz narzędzia adaptacji społecznej od 2015 roku.
            </p>
            <div class="pt-2 text-[11px] font-sans text-purple-300">
              KRS 0000535710 • NIP 6272740470
            </div>
          </div>

        </aside>

      </div>

      <!-- BOTTOM ADJACENT PROJECTS NAVIGATION -->
      <section class="border-t border-slate-200 pt-8 mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${prevProj ? `
          <a href="${prevLink}" class="p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-violet hover:shadow-md transition-all group flex items-center gap-4">
            <span class="material-symbols-outlined text-2xl text-slate-400 group-hover:text-brand-violet transition-colors">arrow_back</span>
            <div>
              <span class="text-[10px] font-sans text-slate-400 uppercase tracking-wider block font-bold">Poprzedni Projekt</span>
              <span class="text-sm font-bold text-slate-900 group-hover:text-brand-violet transition-colors line-clamp-1">${escapeHtml(prevProj.name)}</span>
            </div>
          </a>
        ` : '<div></div>'}

        ${nextProj ? `
          <a href="${nextLink}" class="p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-violet hover:shadow-md transition-all group flex items-center justify-between gap-4 text-right">
            <div>
              <span class="text-[10px] font-sans text-slate-400 uppercase tracking-wider block font-bold">Kolejny Projekt</span>
              <span class="text-sm font-bold text-slate-900 group-hover:text-brand-violet transition-colors line-clamp-1">${escapeHtml(nextProj.name)}</span>
            </div>
            <span class="material-symbols-outlined text-2xl text-slate-400 group-hover:text-brand-violet transition-colors">arrow_forward</span>
          </a>
        ` : '<div></div>'}
      </section>

    </div>
  </main>

  ${generateLightboxHtml()}

  ${generateFooter(relRoot)}

  ${generateLightboxScript(JSON.stringify(projectPhotos))}

</body>
</html>
`;
}

// -------------------------------------------------------------
// GENERATE STATIC ARTICLE PAGE (1-to-1 matching WordPress single.php)
// -------------------------------------------------------------
function generateArticlePageHtml(article, isNested) {
  const relRoot = isNested ? '../../' : '../';
  const parentProject = projects[article.project_id] || null;
  
  const articlePhotos = (article.images && article.images.length > 0) ? [...article.images] : [];
  if (article.hero_img && !articlePhotos.includes(article.hero_img) && !article.hero_img.includes('cropped-Animus-Logo')) {
    articlePhotos.unshift(article.hero_img);
  }

  const projectLink = parentProject ? (isNested ? `../../projekty/${article.project_id}/` : `../projekty/${article.project_id}.html`) : `${relRoot}projects.html`;

  // Sibling articles belonging to the same project (Hierarchy Tree)
  const siblings = parentProject ? (parentProject.articles || []) : [];

  // Related articles from OTHER projects (Section 3)
  const otherArticles = articles.filter(a => a.project_id !== article.project_id && a.slug !== article.slug).slice(0, 3);

  // Text blocks & Reading Time calculation
  const textBlocks = article.text_blocks || [article.summary || ''];
  const fullText = textBlocks.join(' ');
  const wordCount = fullText.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  const heroImg = article.hero_img || (articlePhotos.length > 0 ? articlePhotos[0] : `${relRoot}cropped-Animus-Logo-Horizontal.png`);

  return `<!DOCTYPE html>
<html lang="pl" class="scroll-smooth">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(article.title)} | ANIMUS Foundation</title>
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
            'brand-violet': '#300064',
            'brand-coral': '#F35813',
            'brand-cyan': '#2AD0FF',
            'brand-amber': '#EA9A05',
            'brand-ink': '#141824',
            'brand-canvas': '#fdfbf7',
            primary: '#300064',
            surface: '#ffffff',
            'border-subtle': '#e2e8f0',
          },
          fontFamily: {
            sans: ['"Inter"', '"Plus Jakarta Sans"', 'sans-serif'],
            heading: ['"Space Grotesk"', 'sans-serif'],
            mono: ['"Plus Jakarta Sans"', 'monospace'],
          }
        }
      }
    };
  </script>

  <style>
    body {
      font-family: 'Inter', sans-serif;
      color: #0F172A;
      background-color: #FAF9F6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    h1, h2, h3, h4, .font-heading {
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: -0.025em;
    }
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

  <!-- MAIN ARTICLE CONTENT (1-to-1 matching single.php) -->
  <main class="flex-grow pt-24 sm:pt-28 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

      <!-- ========================================================
           1. TOP BREADCRUMBS & NAVIGATION
      ======================================================== -->
      <nav class="py-4 flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-slate-500 border-b border-slate-200 mb-8 min-w-0" aria-label="Breadcrumb">
        <div class="flex items-center gap-2 flex-wrap min-w-0">
          <a href="${relRoot}index.html" class="hover:text-brand-violet transition-colors shrink-0">ANIMUS</a>
          <span>/</span>
          <a href="${relRoot}blog.html" class="hover:text-brand-violet transition-colors shrink-0">Aktualności</a>
          ${parentProject ? `
            <span>/</span>
            <a href="${projectLink}" class="hover:text-brand-violet transition-colors shrink-0 flex items-center gap-1 text-slate-700 font-semibold">
              <span class="material-symbols-outlined text-[14px] text-brand-violet">folder</span>
              <span>${escapeHtml(parentProject.name)}</span>
            </a>
          ` : ''}
          <span>/</span>
          <span class="text-slate-900 font-bold truncate max-w-xs sm:max-w-md min-w-0">${escapeHtml(article.title)}</span>
        </div>

        <div class="flex items-center gap-3">
          ${parentProject ? `
            <a href="${projectLink}" class="inline-flex items-center gap-1.5 text-brand-violet hover:text-brand-coral font-bold transition-colors shrink-0 text-xs font-sans">
              <span class="material-symbols-outlined text-[15px]">folder</span>
              <span>Karta Projektu</span>
            </a>
            <span class="text-slate-300">•</span>
          ` : ''}
          <a href="${relRoot}blog.html" class="inline-flex items-center gap-1.5 text-slate-700 hover:text-brand-violet font-bold transition-colors shrink-0 text-xs font-sans">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Wszystkie Aktualności</span>
          </a>
        </div>
      </nav>

      <!-- ========================================================
           2. TWO-COLUMN ARTICLE & PASSPORT SECTION
      ======================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16 w-full min-w-0">
        
        <!-- Main Content Column (Left lg:col-span-8) -->
        <div class="lg:col-span-8 space-y-10 min-w-0 w-full">
          
          <!-- Article Primary Card -->
          <article class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 min-w-0">
            
            <!-- Metadata & Header -->
            <div class="space-y-4">
              <div class="flex items-center gap-3 flex-wrap">
                ${parentProject ? `
                  <a href="${projectLink}" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-brand-violet hover:bg-[#200045] text-white shadow-xs transition-colors flex items-center gap-1.5" title="Przejdź do karty projektu">
                    <span class="material-symbols-outlined text-[14px]">folder</span>
                    <span>${escapeHtml(parentProject.name)}</span>
                  </a>
                ` : `
                  <span class="px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-brand-violet text-white shadow-xs">
                    Aktualności
                  </span>
                `}

                <span class="text-xs font-sans font-semibold text-slate-500 flex items-center gap-1">
                  <span class="material-symbols-outlined text-[15px] text-brand-coral">calendar_today</span>
                  <span>${escapeHtml(article.date)}</span>
                </span>
                <span class="text-slate-300">•</span>
                <span class="text-xs font-sans text-slate-500 flex items-center gap-1">
                  <span class="material-symbols-outlined text-[15px]">schedule</span>
                  <span>ok. ${readingTime} min czytania</span>
                </span>
              </div>

              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-heading leading-tight tracking-tight">
                ${escapeHtml(article.title)}
              </h1>

              ${article.summary ? `
              <p class="text-base sm:text-lg text-slate-600 font-sans leading-relaxed border-l-4 border-brand-violet pl-4 py-1 italic bg-purple-50/40 rounded-r-xl">
                ${escapeHtml(article.summary)}
              </p>
              ` : ''}
            </div>

            <!-- Spotlight Hero Image inside Card -->
            ${heroImg ? `
            <div class="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-[500px] shadow-xs relative group cursor-pointer" onclick="openLightbox(0)">
              <img src="${heroImg}" alt="${escapeHtml(article.title)}" class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" onerror="this.onerror=null; this.src='${relRoot}cropped-Animus-Logo-Horizontal.png'">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div class="flex items-center gap-2 text-white text-xs font-semibold bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/20">
                  <span class="material-symbols-outlined text-sm">zoom_in</span>
                  <span>Kliknij, aby powiększyć zdjęcie</span>
                </div>
              </div>
            </div>
            ` : ''}

            <!-- Article Body Text -->
            <div class="prose prose-lg max-w-none text-slate-800 leading-relaxed font-sans space-y-6 pt-2">
              ${textBlocks.map(block => `<p>${escapeHtml(block)}</p>`).join('')}
            </div>

          </article>

          <!-- Visual Documentation Gallery Card (if multiple photos) -->
          ${articlePhotos.length > 1 ? `
          <section class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6 min-w-0">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div class="flex items-center gap-2 text-brand-violet font-sans text-xs font-bold uppercase tracking-wider mb-1">
                  <span class="material-symbols-outlined text-base">photo_library</span>
                  <span>Dokumentacja Wizualna</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
                  Fotoreportaż &amp; Kadry z Działań
                </h2>
              </div>
              <span class="text-xs font-sans text-slate-500">
                ${articlePhotos.length} oryginalnych fotografii
              </span>
            </div>

            <!-- Bento Grid Gallery Layout -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              ${articlePhotos.map((imgUrl, idx) => {
                const isFirst = (idx === 0);
                const cellClass = isFirst ? 'sm:col-span-2 sm:row-span-2 min-h-[300px] sm:min-h-[420px]' : 'min-h-[200px] sm:min-h-[200px]';
                return `
                <div class="${cellClass} relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group shadow-xs hover:shadow-md transition-all duration-300" onclick="openLightbox(${idx})">
                  <img src="${imgUrl}" alt="Fotografia ${idx + 1} - ${escapeHtml(article.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.onerror=null; this.src='${relRoot}cropped-Animus-Logo-Horizontal.png'">
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 text-white">
                    <span class="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                      <span class="material-symbols-outlined text-lg">zoom_in</span>
                    </span>
                  </div>
                  <span class="absolute bottom-2.5 left-2.5 bg-black/65 backdrop-blur-md text-white text-[10px] font-sans px-2 py-0.5 rounded border border-white/10">
                    #${String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                `;
              }).join('')}
            </div>
          </section>
          ` : ''}

          <!-- Project Timeline / Chronicle (Hierarchical Tree of Project Articles) -->
          ${siblings.length > 0 && parentProject ? `
          <section class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 min-w-0">
            
            <!-- Tree Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="w-2 h-2 rounded-full bg-brand-violet"></span>
                  <span class="text-[11px] font-sans font-bold uppercase tracking-wider text-brand-violet">
                    Kronika Działań Projektowych
                  </span>
                </div>
                <h3 class="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                  ${escapeHtml(parentProject.name)}
                </h3>
                <div class="flex flex-wrap items-center gap-2.5 text-xs font-sans text-slate-500 mt-1">
                  ${parentProject.location ? `
                    <span class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px] text-brand-coral">location_on</span>
                      <span>${escapeHtml(parentProject.location)}</span>
                    </span>
                    <span>•</span>
                  ` : ''}
                  ${parentProject.period ? `
                    <span>${escapeHtml(parentProject.period)}</span>
                    <span>•</span>
                  ` : ''}
                  <span>${siblings.length} wpisów w kronice</span>
                </div>
              </div>

              <a href="${projectLink}" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-violet hover:bg-[#200045] text-white text-xs font-semibold transition-all shadow-sm shrink-0">
                <span>Pełna Karta Projektu</span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>

            <!-- Tree Timeline with Vertical Bar -->
            <div class="relative pl-6 sm:pl-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-200 space-y-3">
              ${siblings.map(sib => {
                const isCurrent = (sib.slug === article.slug);
                const sibLink = isNested ? `../../aktualnosci/${sib.slug}/` : `../aktualnosci/${sib.slug}.html`;
                if (isCurrent) {
                  return `
                  <div class="relative">
                    <span class="absolute -left-6 sm:-left-8 top-5 w-3.5 h-3.5 rounded-full bg-brand-violet ring-4 ring-purple-100 shadow-xs"></span>
                    <div class="p-4 sm:p-5 rounded-2xl bg-brand-ink text-white border border-slate-900 shadow-xs">
                      <div class="flex items-center justify-between gap-3 mb-1">
                        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider bg-white/15 text-white">
                          <span class="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
                          TERAZ CZYTASZ
                        </span>
                        <span class="text-xs font-sans text-slate-400">${escapeHtml(sib.date)}</span>
                      </div>
                      <h4 class="text-base sm:text-lg font-bold font-heading text-white">
                        ${escapeHtml(sib.title)}
                      </h4>
                    </div>
                  </div>
                  `;
                } else {
                  return `
                  <div class="relative">
                    <span class="absolute -left-6 sm:-left-8 top-5 w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-brand-violet transition-colors"></span>
                    <a href="${sibLink}" class="group block p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 hover:border-slate-300 transition-all">
                      <div class="flex items-center justify-between gap-3">
                        <div class="min-w-0">
                          <span class="text-xs font-sans text-slate-400 block mb-0.5">${escapeHtml(sib.date)}</span>
                          <h4 class="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-brand-violet transition-colors truncate">
                            ${escapeHtml(sib.title)}
                          </h4>
                        </div>
                        <span class="w-8 h-8 rounded-lg bg-white border border-slate-200 group-hover:bg-brand-violet group-hover:text-white group-hover:border-brand-violet text-slate-400 flex items-center justify-center shrink-0 transition-all">
                          <span class="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                        </span>
                      </div>
                    </a>
                  </div>
                  `;
                }
              }).join('')}
            </div>

          </section>
          ` : ''}

        </div>

        <!-- Right Sidebar Passport Column (lg:col-span-4 sticky) -->
        <aside class="lg:col-span-4 space-y-6 lg:sticky lg:top-28 min-w-0 w-full">
          
          <!-- Article Passport Card -->
          <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
            <div class="flex items-center justify-between border-b border-slate-200 pb-4">
              <span class="text-sm font-bold text-slate-800 font-heading">Metryka Artykułu</span>
              <span class="material-symbols-outlined text-xl text-brand-violet">description</span>
            </div>

            <!-- Key Metadata Items -->
            <div class="space-y-4 text-xs">
              <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <span class="text-slate-500 font-sans">Data publikacji</span>
                <span class="font-bold text-slate-800 text-right font-sans">${escapeHtml(article.date)}</span>
              </div>
              
              <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <span class="text-slate-500 font-sans">Kategoria</span>
                <span class="font-bold text-brand-violet text-right">${escapeHtml(parentProject ? parentProject.name : 'Aktualności')}</span>
              </div>

              <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <span class="text-slate-500 font-sans">Czas lektury</span>
                <span class="font-bold text-slate-800 text-right font-sans">ok. ${readingTime} min</span>
              </div>

              <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <span class="text-slate-500 font-sans">Galeria zdjęć</span>
                <span class="font-bold text-slate-800 text-right font-sans">${articlePhotos.length} kadrów</span>
              </div>

              <div class="flex items-start justify-between gap-3">
                <span class="text-slate-500 font-sans">Wydawca</span>
                <span class="font-bold text-slate-800 text-right">Fundacja ANIMUS</span>
              </div>
            </div>

            <!-- Associated Project Mini-Card -->
            ${parentProject ? `
            <div class="pt-4 border-t border-slate-200 space-y-3">
              <span class="text-[11px] font-sans text-slate-400 uppercase tracking-wider font-bold block">
                Powiązany Projekt Flagowy
              </span>
              <div class="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/70 space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                    <img src="${parentProject.hero_img || `${relRoot}cropped-Animus-Logo-Horizontal.png`}" alt="${escapeHtml(parentProject.name)}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='${relRoot}cropped-Animus-Logo-Horizontal.png'">
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-sm font-bold text-slate-900 truncate font-heading">
                      ${escapeHtml(parentProject.name)}
                    </h4>
                    ${parentProject.period ? `
                      <span class="text-[11px] font-sans text-slate-500 block">${escapeHtml(parentProject.period)}</span>
                    ` : ''}
                  </div>
                </div>
                <a href="${projectLink}" class="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-violet hover:bg-[#200045] text-white text-xs font-semibold transition-all shadow-xs">
                  <span>Przejdź do karty projektu</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
            ` : ''}

            <!-- Foundation Contact Card -->
            <div class="pt-4 border-t border-slate-200 space-y-3">
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div class="flex items-center gap-2 text-slate-800 font-bold">
                  <span class="material-symbols-outlined text-base text-brand-coral">verified</span>
                  <span>Fundacja ANIMUS</span>
                </div>
                <p class="text-slate-500 text-[11px] leading-relaxed">
                  Centrum Edukacyjno-Szkoleniowe aktywne od 2015 roku na Śląsku i w Europie.
                </p>
                <div class="pt-2 flex items-center justify-between">
                  <a href="${relRoot}contact.html" class="text-brand-coral hover:text-brand-violet font-bold text-xs font-sans inline-flex items-center gap-1 transition-colors">
                    <span>Kontakt z fundacją</span>
                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </aside>

      </div>

      <!-- ========================================================
           3. POWIĄZANE ARTYKUŁY (RELACJE Z INNYCH PROJEKTÓW)
      ======================================================== -->
      <section class="pt-10 border-t border-slate-200">
        <div class="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-brand-violet block mb-1">
              POZNAJ INNE DZIAŁANIA
            </span>
            <h3 class="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
              Relacje z innych projektów Fundacji
            </h3>
          </div>
          <a href="${relRoot}blog.html" class="text-xs font-semibold text-brand-violet hover:text-brand-coral transition-colors flex items-center gap-1 shrink-0">
            <span>Wszystkie aktualności</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          ${otherArticles.map(rel => {
            const relUrl = isNested ? `../../aktualnosci/${rel.slug}/` : `../aktualnosci/${rel.slug}.html`;
            const relHero = rel.hero_img || `${relRoot}cropped-Animus-Logo-Horizontal.png`;
            const relProjName = rel.project_name || 'Aktualności';
            return `
            <a href="${relUrl}" class="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 hover:border-brand-violet hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 block no-underline text-inherit">
              <div>
                <div class="h-48 w-full bg-slate-100 overflow-hidden relative block">
                  <img src="${relHero}" alt="${escapeHtml(rel.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.onerror=null; this.src='${relRoot}cropped-Animus-Logo-Horizontal.png'">
                  <span class="absolute top-3 left-3 bg-brand-violet text-white font-sans text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md font-bold shadow-sm">
                    ${escapeHtml(relProjName)}
                  </span>
                </div>
                <div class="p-5 sm:p-6 space-y-2.5">
                  <div class="text-[11px] font-sans text-slate-500 font-semibold uppercase flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[14px] text-brand-coral">calendar_today</span>
                    <span>${escapeHtml(rel.date)}</span>
                  </div>
                  <h4 class="text-base sm:text-lg font-bold font-heading text-slate-900 group-hover:text-brand-violet transition-colors line-clamp-2 leading-snug">
                    ${escapeHtml(rel.title)}
                  </h4>
                  ${rel.summary ? `
                  <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed font-sans">
                    ${escapeHtml(rel.summary)}
                  </p>
                  ` : ''}
                </div>
              </div>
            </a>
            `;
          }).join('')}
        </div>
      </section>

    </div>
  </main>

  ${generateLightboxHtml()}

  ${generateFooter(relRoot)}

  ${generateLightboxScript(JSON.stringify(articlePhotos))}

</body>
</html>
`;
}

// 2. Execution Loop
console.log('Generating files and directories with 1-to-1 WordPress template match...');

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
let projectsIndexContent = fs.readFileSync(path.join(staticDir, 'projects.html'), 'utf8');
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
projectsIndexContent = projectsIndexContent.replace(/single-project\.html\?id=(\w[\w-]*)/g, '$1/');
fs.writeFileSync(path.join(projektyDir, 'index.html'), projectsIndexContent, 'utf8');
console.log('Generated projekty/index.html.');

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
blogIndexContent = blogIndexContent.replace(/single-article\.html\?slug=([\w-]+)/g, '$1/');
fs.writeFileSync(path.join(aktualnosciDir, 'index.html'), blogIndexContent, 'utf8');
console.log('Generated aktualnosci/index.html.');

console.log('Build completed successfully!');
