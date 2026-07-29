/* ============================================================
   NierZooM v3 — app.js
   lokasasmita-inspired numbered showcase
   ============================================================ */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = Boolean(window.gsap);


/* ══════════════════════════════════════════════════════════
   ENGLISH TITLE HELPERS
══════════════════════════════════════════════════════════ */
const englishTitleOverrides = {
  "2024.10.18 夜晚的你知道—台法跨域音樂共演 - 活動標準字設計": "Event Logotype Design",
  "質感木質音樂盒 - Wood Music box": "Wood Music Box",
  "產品攝影 | 情境合成 - composed photo": "Product Photography & Compositing",
  "銷售頁視覺設計 Landing Page Design - Baby Body wash": "Baby Body Wash — Landing Page",
  "Collagen Packaging Design - 美妍飲 - 包裝設計": "Collagen Packaging Design",
  "Master Tai - Chicken Essence Packaging Design 滴雞精包裝設計": "Master Tai — Chicken Essence Packaging",
  "銷售頁視覺設計_Landing page Design": "Visual Design — Landing Page",
  "Logo Design - Marketlong Fresh | 馬農生鮮 標誌設計": "Marketlong Fresh — Logo Design",
  "廣拓科技 Greattop": "Greattop Technology",
  "台灣松尾 Matsuo": "Matsuo — Corporate Website",
};

function toEnglishTitle(rawTitle) {
  if (englishTitleOverrides[rawTitle]) return englishTitleOverrides[rawTitle];

  const hasZh = /[一-鿿㐀-䶿]/.test(rawTitle);
  if (!hasZh) {
    return rawTitle
      .replace(/[|_]/g, "—")
      .replace(/\s*[-–]\s*/g, " — ")
      .trim();
  }

  // Extract English words from mixed title
  const words = rawTitle.match(/[A-Za-z][A-Za-z0-9&]*(?:\s+[A-Za-z][A-Za-z0-9&]*)*/g) || [];
  const eng = words.join(" ").trim();
  return eng.length > 3 ? eng : rawTitle;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeExternalUrl(value) {
  if (!value) return "#";
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "#";
  } catch {
    return "#";
  }
}


/* ══════════════════════════════════════════════════════════
   MERGE PORTFOLIO DATA
══════════════════════════════════════════════════════════ */
function getAllProjects() {
  const data = window.PORTFOLIO_DATA;
  if (!data) { console.error("[v3] PORTFOLIO_DATA not found"); return []; }

  const behance = (data.behance || []).map(p => ({
    title: p.title,
    category: p.category || "Graphic Design",
    year: p.year || new Date((p.publishedOn || 0) * 1000).getFullYear() || 2021,
    imgSrc: p.localCover ? ("../" + p.localCover) : p.coverUrl,
    fallbackImgSrc: p.coverUrl || null,
    linkUrl: p.sourceUrl,
    linkLabel: "View on Behance ↗",
    dominantColor: p.dominantColor || { r: 30, g: 30, b: 30 },
    type: "behance",
  }));

  const web = (data.webWorks || []).map(p => ({
    title: p.title,
    category: p.category || "Web Design",
    year: p.year || 2026,
    imgSrc: p.localCover ? ("../" + p.localCover) : null,
    fallbackImgSrc: p.coverUrl || null,
    videoSrc: p.localVideo || null,
    linkUrl: p.sourceUrl || p.url,
    linkLabel: "View Website ↗",
    dominantColor: { r: 22, g: 30, b: 38 },
    type: "web",
  }));

  const projects = [...web, ...behance];
  const isWebProject = project => project.type === "web" || /web/i.test(project.category);
  return projects.sort((a, b) => Number(!isWebProject(a)) - Number(!isWebProject(b)));
}


/* ══════════════════════════════════════════════════════════
   BUILD PROJECT SECTIONS
══════════════════════════════════════════════════════════ */
function buildProjects(projects) {
  const container = document.getElementById("projects-container");
  if (!container) return;

  projects.forEach((p, i) => {
    const num = String(i + 1).padStart(2, "0");
    const title = toEnglishTitle(p.title);
    const safeTitle = escapeHtml(title);
    const safeCategory = escapeHtml(p.category);
    const safeYear = escapeHtml(p.year);
    const safeImgSrc = p.imgSrc ? escapeHtml(p.imgSrc) : "";
    const safeFallbackImgSrc = p.fallbackImgSrc ? escapeHtml(p.fallbackImgSrc) : "";
    const safeVideoSrc = p.videoSrc ? escapeHtml(p.videoSrc) : "";
    const safeLink = escapeHtml(safeExternalUrl(p.linkUrl));
    const safeLinkLabel = escapeHtml(p.linkLabel);
    const { r, g, b } = p.dominantColor;

    // For very bright colours, darken the block slightly
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const bgColor = luminance > 0.72
      ? `rgb(${Math.round(r * 0.55)}, ${Math.round(g * 0.55)}, ${Math.round(b * 0.55)})`
      : `rgb(${r}, ${g}, ${b})`;

    const isReversed = i % 2 === 1;
    const playbackAttrs = prefersReducedMotion ? "controls" : "autoplay muted loop";
    const mediaTag = p.videoSrc
      ? `<video class="proj-visual" ${playbackAttrs} playsinline preload="metadata" poster="${safeImgSrc}" aria-label="${safeTitle} preview"><source src="${safeVideoSrc}" type="video/mp4" /></video>`
      : p.imgSrc
        ? `<img class="proj-visual" src="${safeImgSrc}" data-fallback-src="${safeFallbackImgSrc}" alt="${safeTitle}" loading="lazy" decoding="async" />`
        : `<div class="proj-img-placeholder"></div>`;

    const section = document.createElement("section");
    section.className = `proj-section${isReversed ? " is-reversed" : ""}`;
    section.id = `proj-${num}`;
    section.dataset.index = num;
    section.style.setProperty("--project-accent", bgColor);

    section.innerHTML = `
      <div class="proj-bg-num" aria-hidden="true">${num}</div>
      <div class="proj-project-code" aria-hidden="true">Archive / ${num} / ${safeYear}</div>

      <div class="proj-media">
        <div class="proj-img-wrap">
          ${mediaTag}
          <span class="proj-frame proj-frame--tl" aria-hidden="true"></span>
          <span class="proj-frame proj-frame--tr" aria-hidden="true"></span>
          <span class="proj-frame proj-frame--bl" aria-hidden="true"></span>
          <span class="proj-frame proj-frame--br" aria-hidden="true"></span>
        </div>
        <div class="proj-color-block" style="--proj-color: ${bgColor}">
          <span class="proj-category-label">${safeCategory}</span>
        </div>
        <div class="proj-year-block">
          <span class="proj-year-num">${safeYear}</span>
        </div>
      </div>

      <div class="proj-info">
        <div class="proj-num-label">Project / ${num}</div>
        <h2 class="proj-title">${safeTitle}</h2>
        <div class="proj-divider"></div>
        <div class="proj-meta">
          <span class="proj-cat-tag">${safeCategory}</span>
          <a
            href="${safeLink}"
            target="_blank"
            rel="noreferrer noopener"
            class="proj-link"
          >${safeLinkLabel}</a>
        </div>
      </div>
    `;

    container.appendChild(section);

    const visual = section.querySelector(".proj-visual");
    visual?.addEventListener("error", () => {
      const fallbackSrc = visual.dataset.fallbackSrc;
      if (fallbackSrc && visual.getAttribute("src") !== fallbackSrc) {
        visual.setAttribute("src", fallbackSrc);
        return;
      }
      visual.replaceWith(Object.assign(document.createElement("div"), {
        className: "proj-img-placeholder",
      }));
    });

    const video = section.querySelector("video");
    if (video && !prefersReducedMotion) {
      video.muted = true;
      video.play().catch(() => {});
    }
  });
}


/* ══════════════════════════════════════════════════════════
   BUILD SIDEBAR
══════════════════════════════════════════════════════════ */
function buildSidebar(count) {
  const list = document.getElementById("sidebar-list");
  if (!list) return;

  for (let i = 1; i <= count; i++) {
    const num = String(i).padStart(2, "0");
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.className = "sidebar-item";
    button.type = "button";
    button.dataset.target = `proj-${num}`;
    button.setAttribute("aria-label", `Go to project ${num}`);
    button.innerHTML = `<span class="sb-num">${num}</span><span class="sb-dot"></span>`;

    button.addEventListener("click", () => {
      const target = document.getElementById(`proj-${num}`);
      if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

    li.appendChild(button);
    list.appendChild(li);
  }
}


/* ══════════════════════════════════════════════════════════
   GSAP ANIMATIONS
══════════════════════════════════════════════════════════ */
function setActiveSidebar(index) {
  document.querySelectorAll(".sidebar-item").forEach((item, i) => {
    item.classList.toggle("is-active", i === index);
    if (i === index) item.setAttribute("aria-current", "true");
    else item.removeAttribute("aria-current");
  });
}

function initSidebarTracking() {
  const sections = [...document.querySelectorAll(".proj-section")];
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveSidebar(sections.indexOf(entry.target));
    });
  }, { rootMargin: "-48% 0px -48%", threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

function initAnimations(projects) {
  window.addEventListener("scroll", () => {
    const header = document.getElementById("v3-header");
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 60);
  }, { passive: true });

  /* ── Fallback for no GSAP / reduced motion ── */
  if (!hasGsap || prefersReducedMotion) {
    document.querySelectorAll(
      ".proj-num-label, .proj-title, .proj-meta, .hero-eyebrow, .hero-foot"
    ).forEach(el => { el.style.opacity = "1"; el.style.transform = "none"; });

    document.querySelectorAll(".proj-img-wrap").forEach(el => {
      el.style.clipPath = "inset(0% 0 0 0)";
    });
    document.querySelectorAll(".proj-color-block, .proj-year-block").forEach(el => {
      el.style.clipPath = "inset(0 0 0% 0)";
    });
    document.querySelectorAll(".proj-divider").forEach(el => {
      el.style.transform = "scaleX(1)";
      el.style.opacity = "1";
    });
    document.querySelectorAll(".ht").forEach(el => {
      el.style.transform = "translateY(0)";
    });
    document.querySelectorAll(".proj-bg-num").forEach(el => {
      el.style.opacity = "0.032";
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ── HERO ── */
  const heroTl = gsap.timeline({ delay: 0.1 });
  heroTl
    .to(".hero-eyebrow", {
      opacity: 1, y: 0, duration: 0.7, ease: "power2.out"
    })
    .to(".ht", {
      y: "0%", duration: 0.95, stagger: 0.14, ease: "expo.out"
    }, "-=0.4")
    .to(".hero-foot", {
      opacity: 1, y: 0, duration: 0.6, ease: "power2.out"
    }, "-=0.35");

  /* ── PER-PROJECT ── */
  projects.forEach((_, i) => {
    const num = String(i + 1).padStart(2, "0");
    const section = document.getElementById(`proj-${num}`);
    if (!section) return;

    const imgWrap    = section.querySelector(".proj-img-wrap");
    const visual     = section.querySelector(".proj-visual");
    const colorBlock = section.querySelector(".proj-color-block");
    const yearBlock  = section.querySelector(".proj-year-block");
    const bgNum      = section.querySelector(".proj-bg-num");
    const numLabel   = section.querySelector(".proj-num-label");
    const title      = section.querySelector(".proj-title");
    const divider    = section.querySelector(".proj-divider");
    const meta       = section.querySelector(".proj-meta");
    const isReversed = section.classList.contains("is-reversed");

    /* Reveal timeline */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 74%",
        once: true,
      }
    });

    // ① Image: clip from bottom (curtain rise)
    if (imgWrap) tl.to(imgWrap, {
      clipPath: "inset(0% 0 0 0)",
      duration: 1.1, ease: "expo.out"
    });

    // ② Colour block: clip from top
    if (colorBlock) tl.to(colorBlock, {
      clipPath: "inset(0 0 0% 0)",
      duration: 0.75, ease: "expo.out"
    }, "-=0.8");

    // ③ Year strip
    if (yearBlock) tl.to(yearBlock, {
      clipPath: "inset(0 0 0% 0)",
      duration: 0.5, ease: "expo.out"
    }, "-=0.55");

    // ④ Number label
    if (numLabel) tl.to(numLabel, {
      opacity: 1, y: 0, duration: 0.45, ease: "power2.out"
    }, "-=0.65");

    // ⑤ Title
    if (title) tl.fromTo(title,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      "-=0.45"
    );

    // ⑥ Divider
    if (divider) tl.to(divider, {
      scaleX: 1, opacity: 1, duration: 0.55, ease: "expo.out"
    }, "-=0.35");

    // ⑦ Meta
    if (meta) tl.fromTo(meta,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
      "-=0.3"
    );

    /* Watermark number */
    if (bgNum) gsap.fromTo(bgNum,
      { opacity: 0, x: isReversed ? 50 : -50 },
      {
        opacity: 0.032, x: 0,
        duration: 1.5, ease: "expo.out",
        scrollTrigger: { trigger: section, start: "top 80%", once: true }
      }
    );

    /* Parallax on image */
    if (visual) gsap.to(visual, {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end:   "bottom top",
        scrub: 1.2,
      }
    });
  });

  ScrollTrigger.refresh();
}


/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  const projects = getAllProjects();

  if (!projects.length) {
    const message = document.createElement("p");
    message.className = "projects-empty";
    message.textContent = "No projects found.";
    document.getElementById("projects-container")?.appendChild(message);
    return;
  }

  // Update hero count
  const countEl = document.getElementById("hero-count");
  if (countEl) countEl.textContent = projects.length;

  buildProjects(projects);
  buildSidebar(projects.length);
  initSidebarTracking();
  initAnimations(projects);
});
