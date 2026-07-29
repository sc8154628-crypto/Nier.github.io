/* ============================================================
   NierZooM v3 — About Page JS
   GSAP scroll reveals + count-up + sidebar section tracking
   ============================================================ */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = Boolean(window.gsap);


function syncPortfolioStats() {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  const projects = [...(data.behance || []), ...(data.webWorks || [])];
  const values = {
    years: 6,
    projects: projects.length,
    categories: new Set(projects.map(project => project.category).filter(Boolean)).size,
    web: (data.webWorks || []).length,
  };

  document.querySelectorAll("[data-stat]").forEach((element) => {
    const value = values[element.dataset.stat];
    if (Number.isFinite(value)) element.dataset.target = value;
  });
}


/* ══════════════════════════════════════════════════════════
   COUNT-UP (IntersectionObserver)
══════════════════════════════════════════════════════════ */
function initCountUp() {
  const nums = document.querySelectorAll(".count-up");
  if (!nums.length) return;

  if (prefersReducedMotion) {
    nums.forEach(element => { element.textContent = element.dataset.target; });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1200;
      const start  = performance.now();

      const tick = (now) => {
        const t    = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(ease * target);
        if (t < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => io.observe(n));
}


/* ══════════════════════════════════════════════════════════
   SIDEBAR — section dots
══════════════════════════════════════════════════════════ */
function initSidebar() {
  const items    = document.querySelectorAll(".sidebar-item");
  const sections = [
    "v3a-hero", "v3a-intro", "v3a-stats",
    "v3a-skills", "v3a-journey", "v3-contact"
  ];

  // Click to scroll
  items.forEach((item) => {
    const targetId = item.dataset.target;
    item.addEventListener("click", () => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  function setActive(index) {
    items.forEach((item, i) => {
      item.classList.toggle("is-active", i === index);
      if (i === index) item.setAttribute("aria-current", "true");
      else item.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(sections.indexOf(entry.target.id));
      });
    }, { rootMargin: "-48% 0px -48%", threshold: 0 });

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }
}


/* ══════════════════════════════════════════════════════════
   GSAP ANIMATIONS
══════════════════════════════════════════════════════════ */
function initAnimations() {
  /* Header scroll */
  window.addEventListener("scroll", () => {
    document.getElementById("v3-header")
      ?.classList.toggle("is-scrolled", window.scrollY > 60);
  }, { passive: true });

  if (!hasGsap || prefersReducedMotion) {
    // Visibility fallback
    document.querySelectorAll(
      ".v3a-eyebrow, .v3a-role, .v3a-hero-foot, .v3a-sec-label, " +
      ".v3a-sec-heading, .v3a-bio-line, .v3a-stat, .v3a-skill-card, " +
      ".v3a-tl-item, .v3a-contact-sub, .v3a-contact-links"
    ).forEach(el => { el.style.opacity = "1"; el.style.transform = "none"; });

    document.querySelectorAll("#v3a-hero .ht, #v3-contact .ht").forEach(el => el.style.transform = "translateY(0)");
    document.querySelectorAll(".v3a-sec-num").forEach(el => el.style.opacity = "0.032");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ── HERO ── */
  // Only target .ht inside the hero — contact heading has its own ScrollTrigger
  const heroTl = gsap.timeline({ delay: 0.1 });
  heroTl
    .to(".v3a-eyebrow", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
    .to("#v3a-hero .ht", { y: "0%", duration: 0.95, stagger: 0.12, ease: "expo.out" }, "-=0.35")
    .to(".v3a-role",     { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.4")
    .to(".v3a-hero-foot",{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");

  /* ── SECTION WATERMARKS ── */
  document.querySelectorAll(".v3a-sec-num").forEach(el => {
    const section = el.closest(".v3a-section, .v3a-contact");
    if (!section) return;
    gsap.fromTo(el,
      { opacity: 0, x: -50 },
      {
        opacity: 0.032, x: 0, duration: 1.5, ease: "expo.out",
        scrollTrigger: { trigger: section, start: "top 80%", once: true }
      }
    );
  });

  /* ── 01 INTRODUCTION ── */
  const introSection = document.getElementById("v3a-intro");
  if (introSection) {
    revealEl(introSection.querySelector(".v3a-sec-label"), "top 78%");

    gsap.utils.toArray("#v3a-intro .v3a-bio-line").forEach((line, i) => {
      gsap.fromTo(line,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.75, ease: "power3.out", delay: i * 0.12,
          scrollTrigger: { trigger: line, start: "top 82%", once: true }
        }
      );
    });
  }

  /* ── 02 STATS ── */
  const statsSection = document.getElementById("v3a-stats");
  if (statsSection) {
    revealEl(statsSection.querySelector(".v3a-sec-label"), "top 78%");

    gsap.fromTo("#v3a-stats .v3a-stat",
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: "#v3a-stats .v3a-stats-row", start: "top 80%", once: true }
      }
    );
  }

  /* ── 03 CAPABILITIES ── */
  const skillsSection = document.getElementById("v3a-skills");
  if (skillsSection) {
    revealEl(skillsSection.querySelector(".v3a-sec-label"),   "top 80%");
    revealEl(skillsSection.querySelector(".v3a-sec-heading"), "top 78%", 0.1);

    gsap.fromTo("#v3a-skills .v3a-skill-card",
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out",
        scrollTrigger: { trigger: "#v3a-skills .v3a-skills-grid", start: "top 82%", once: true }
      }
    );
  }

  /* ── 04 JOURNEY ── */
  const journeySection = document.getElementById("v3a-journey");
  if (journeySection) {
    revealEl(journeySection.querySelector(".v3a-sec-label"),   "top 80%");
    revealEl(journeySection.querySelector(".v3a-sec-heading"), "top 78%", 0.1);

    gsap.utils.toArray(".v3a-tl-item").forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: i * 0.07,
          scrollTrigger: { trigger: item, start: "top 84%", once: true }
        }
      );
    });
  }

  /* ── 05 CONTACT ── */
  const contactSection = document.getElementById("v3-contact");
  if (contactSection) {
    revealEl(contactSection.querySelector(".v3a-sec-label"), "top 80%");

    gsap.fromTo("#v3-contact .ht",
      { y: "105%" },
      {
        y: "0%", duration: 1.0, stagger: 0.12, ease: "expo.out",
        scrollTrigger: { trigger: "#v3-contact .v3a-contact-heading", start: "top 80%", once: true }
      }
    );

    revealEl(contactSection.querySelector(".v3a-contact-sub"),   "top 82%", 0.25);
    revealEl(contactSection.querySelector(".v3a-contact-links"),  "top 82%", 0.4);
  }

  ScrollTrigger.refresh();
}

/* Helper: simple opacity + y fade-in */
function revealEl(el, start = "top 80%", delay = 0) {
  if (!el) return;
  gsap.fromTo(el,
    { opacity: 0, y: 20 },
    {
      opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay,
      scrollTrigger: { trigger: el, start, once: true }
    }
  );
}


/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  syncPortfolioStats();
  initCountUp();
  initSidebar();
  initAnimations();
});
