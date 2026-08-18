(function () {
  const works = window.NZ_WORKS || [];
  const profile = window.NZ_PROFILE || {};
  const page = document.body.dataset.page || "home";
  const app = document.getElementById("app");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  const href = (work) => work.type === "web" ? work.externalUrl : `project.html?id=${encodeURIComponent(work.key)}`;
  const projectHref = (work) => `project.html?id=${encodeURIComponent(work.key)}`;
  const target = (work) => work.type === "web" ? ' target="_blank" rel="noreferrer noopener"' : "";

  function nav() {
    const links = [["home", "NierZooM.", "index.html"], ["works", "Work", "works.html"], ["about", "About", "about.html"], ["contact", "Contact", "contact.html"]];
    return `<nav class="top-nav" aria-label="Primary">${links.map(([key,label,url]) => `<a href="${url}"${page === key ? ' aria-current="page"' : ""}>${label}</a>`).join("")}<button class="mobile-toggle" type="button" aria-expanded="false">Menu</button></nav><nav class="mobile-nav" aria-label="Mobile">${links.slice(1).map(([,label,url]) => `<a href="${url}">${label}</a>`).join("")}</nav>`;
  }

  function footer() {
    return `<footer class="bottom-footer"><div>© 2026 NierZooM</div><div><a href="${profile.behance}" target="_blank" rel="noreferrer">Behance</a></div><div>GMT +8 / <span id="clock">Taiwan</span></div></footer>`;
  }

  function initSmoothScroll() {
    if (!window.Lenis) return null;
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 1,
      anchors: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    });

    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    window.addEventListener("pagehide", () => lenis.destroy(), { once: true });
    window.NIERZOOM_LENIS = lenis;
    return lenis;
  }

  function setFoldText(element, label = element.dataset.foldLabel || element.textContent.trim()) {
    if (!element || !label) return;
    element.dataset.foldLabel = label;
    element.dataset.foldText = "true";
    element.setAttribute("aria-label", label);
    element.textContent = "";

    const text = document.createElement("span");
    text.className = "fold-text";
    text.setAttribute("aria-hidden", "true");
    const characters = [...label];

    characters.forEach((character, index) => {
      const char = document.createElement("span");
      char.className = "fold-char";
      char.style.setProperty("--fold-delay", `${index * 0.055}s`);
      char.style.setProperty("--fold-return-delay", `${(characters.length - index - 1) * 0.025}s`);

      const inner = document.createElement("span");
      inner.className = "fold-char-inner";
      const front = document.createElement("span");
      front.className = "fold-char-face fold-char-face--front";
      front.textContent = character === " " ? "\u00a0" : character;
      const back = document.createElement("span");
      back.className = "fold-char-face fold-char-face--back";
      back.textContent = character === " " ? "\u00a0" : character;
      inner.append(front, back);
      char.append(inner);
      text.append(char);
    });

    element.append(text);
  }

  function initFoldText() {
    document.querySelectorAll(".top-nav a, .mobile-nav a, .mobile-toggle").forEach((element) => setFoldText(element));
  }

  function createGsapText(element) {
    if (!element || element.dataset.gsapText === "true") return;
    const hasOnlyLineBreaks = [...element.children].every((child) => child.tagName === "BR");
    if (element.children.length > 0 && !hasOnlyLineBreaks) return;
    const rawLabel = hasOnlyLineBreaks ? element.innerText : element.textContent;
    const label = rawLabel.replace(/\r/g, "").replace(/[^\S\r\n]+/g, " ").trim();
    if (!label) return;

    const computed = getComputedStyle(element);
    const wrapper = document.createElement("span");
    wrapper.className = "gsap-text";
    if (["block", "flex", "grid", "list-item"].includes(computed.display)) wrapper.classList.add("gsap-text--block");
    wrapper.setAttribute("aria-hidden", "true");

    label.split(/(\n)/).forEach((line) => {
      if (line === "\n") {
        wrapper.append(document.createElement("br"));
        return;
      }

      line.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          // Keep normal spaces outside animated word spans so wrapped lines begin at the same edge.
          wrapper.append(document.createTextNode(" "));
          return;
        }

        const word = document.createElement("span");
        word.className = "gsap-text-word";
        const characters = /[\u3400-\u9fff\uf900-\ufaff]/.test(part) ? [...part] : [part];
        characters.forEach((character) => {
          const char = document.createElement("span");
          char.className = "gsap-text-char";
          char.textContent = character;
          word.append(char);
        });
        wrapper.append(word);
      });
    });

    element.dataset.gsapText = "true";
    element.setAttribute("aria-label", label.replace(/\n/g, " "));
    element.textContent = "";
    element.append(wrapper);

    const chars = wrapper.querySelectorAll(".gsap-text-char");
    if (!window.gsap || reducedMotion || !chars.length) return;

    gsap.set(chars, { opacity: 0, yPercent: 115, rotateX: -38, transformOrigin: "50% 100%" });
    gsap.to(chars, {
      opacity: 1,
      yPercent: 0,
      rotateX: 0,
      duration: .82,
      ease: "power3.out",
      stagger: Math.min(.028, 1.1 / chars.length),
      scrollTrigger: { trigger: element, start: "top 88%", once: true },
    });
  }

  function initGsapText() {
    const selectors = [
      ".index-card-info span", ".index-footer > p:first-child", ".index-statement", ".page-heading h1", ".work-count", ".view-switch button",
      ".work-tile h2", ".work-tile-info > span", ".about-lead h1", ".about-zh",
      ".principle > span", ".principle h2", ".principle p", ".experience > p",
      ".experience-row > span", ".experience-row h3", ".experience-row p", ".contact-copy h1",
      ".contact-copy p", ".contact-copy a", ".form-row > span", ".contact-submit",
      ".project-title > p", ".project-title h1", ".project-description > p", ".project-facts > *",
      ".project-nav a", ".bottom-footer > div:first-child", ".bottom-footer a",
    ];
    document.querySelectorAll(selectors.join(",")).forEach(createGsapText);
  }

  function initDepthCarousel() {
    const carousel = document.getElementById("depth-carousel");
    if (!carousel) return;
    const cards = [...carousel.querySelectorAll(".index-card")];
    const counter = document.getElementById("depth-counter");
    let activeIndex = 0;
    let wheelLocked = false;
    let dragStart = null;
    let dragged = false;
    let autoPlayId = null;
    const autoPlayDelay = 5200;

    const positionCards = (animate = true) => {
      const cardWidth = cards[0]?.getBoundingClientRect().width || Math.min(innerWidth * 0.7, 520);
      const spacing = cardWidth + Math.max(14, innerWidth * 0.014);
      cards.forEach((card, index) => {
        let offset = index - activeIndex;
        if (offset > cards.length / 2) offset -= cards.length;
        if (offset < -cards.length / 2) offset += cards.length;
        const distance = Math.abs(offset);
        const opacity = distance <= 1 ? 1 : 0;
        const values = {
          xPercent: -50,
          yPercent: -50,
          x: offset * spacing,
          opacity,
          duration: animate ? 0.9 : 0,
          ease: "power4.inOut",
          overwrite: true,
        };
        card.style.zIndex = String(20 - distance);
        card.style.pointerEvents = distance <= 1 ? "auto" : "none";
        card.classList.toggle("is-active", distance === 0);
        card.tabIndex = distance === 0 ? 0 : -1;
        card.setAttribute("aria-hidden", String(distance !== 0));
        if (window.gsap && !reducedMotion) gsap.to(card, values);
        else {
          card.style.transform = `translate(-50%, -50%) translateX(${values.x}px)`;
          card.style.opacity = String(opacity);
        }
      });
      counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    };

    const goTo = (index) => {
      activeIndex = (index + cards.length) % cards.length;
      positionCards();
    };

    const stopAutoPlay = () => {
      if (!autoPlayId) return;
      window.clearInterval(autoPlayId);
      autoPlayId = null;
    };
    const startAutoPlay = () => {
      if (reducedMotion || autoPlayId || cards.length < 2) return;
      autoPlayId = window.setInterval(() => goTo(activeIndex + 1), autoPlayDelay);
    };

    cards.forEach((card, index) => card.addEventListener("click", (event) => {
      if (dragged) {
        event.preventDefault();
        dragged = false;
        return;
      }
      if (index !== activeIndex) {
        event.preventDefault();
        stopAutoPlay();
        goTo(index);
      }
    }));

    carousel.addEventListener("wheel", (event) => {
      event.preventDefault();
      if (wheelLocked || Math.max(Math.abs(event.deltaX), Math.abs(event.deltaY)) < 8) return;
      stopAutoPlay();
      wheelLocked = true;
      goTo(activeIndex + (event.deltaY > 0 || event.deltaX > 0 ? 1 : -1));
      window.setTimeout(() => { wheelLocked = false; }, 420);
    }, { passive: false });

    carousel.addEventListener("pointerdown", (event) => {
      stopAutoPlay();
      dragStart = event.clientX;
      dragged = false;
      carousel.classList.add("is-dragging");
      carousel.setPointerCapture?.(event.pointerId);
    });
    carousel.addEventListener("pointermove", (event) => {
      if (dragStart === null) return;
      dragged = Math.abs(event.clientX - dragStart) > 8;
    });
    carousel.addEventListener("pointerup", (event) => {
      if (dragStart !== null && Math.abs(event.clientX - dragStart) > 42) goTo(activeIndex + (event.clientX < dragStart ? 1 : -1));
      dragStart = null;
      carousel.classList.remove("is-dragging");
    });
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") { stopAutoPlay(); goTo(activeIndex + 1); }
      if (event.key === "ArrowLeft") { stopAutoPlay(); goTo(activeIndex - 1); }
    });
    document.getElementById("depth-prev")?.addEventListener("click", () => { stopAutoPlay(); goTo(activeIndex - 1); });
    document.getElementById("depth-next")?.addEventListener("click", () => { stopAutoPlay(); goTo(activeIndex + 1); });
    carousel.addEventListener("pointerenter", stopAutoPlay);
    carousel.addEventListener("pointerleave", startAutoPlay);
    carousel.addEventListener("focusin", stopAutoPlay);
    carousel.addEventListener("focusout", (event) => { if (!carousel.contains(event.relatedTarget)) startAutoPlay(); });
    document.addEventListener("visibilitychange", () => document.hidden ? stopAutoPlay() : startAutoPlay());
    window.addEventListener("resize", () => positionCards(false), { passive: true });
    positionCards(false);
    startAutoPlay();
  }

  function homeTemplate() {
    const cards = works.map((work, index) => `<a class="index-card" data-index="${index}" href="${escapeHtml(href(work))}"${target(work)}><div class="index-card-media"><img src="${escapeHtml(work.cover)}" alt="${escapeHtml(work.title)}" loading="${index < 4 ? "eager" : "lazy"}" draggable="false" decoding="async"></div><div class="index-card-info"><span>${escapeHtml(work.title)}</span><span>${work.year}</span></div></a>`).join("");
    return `<section class="index-stage"><div class="depth-carousel" id="depth-carousel" tabindex="0" aria-label="Selected work carousel" data-lenis-prevent><div class="depth-stage">${cards}</div><div class="depth-controls"><button class="depth-control" id="depth-prev" type="button" aria-label="Previous project">←</button><span class="depth-counter" id="depth-counter"></span><button class="depth-control" id="depth-next" type="button" aria-label="Next project">→</button></div></div><div class="index-footer"><p>Independent<br>Visual Designer</p><p class="index-statement">Brand identity, web design and visual systems shaped with clarity and purpose.</p><p class="index-time">Taiwan<br><span id="stage-clock">GMT +8</span></p></div></section>`;
  }

  function projectMediaMarkup(work) {
    const media = [...work.gallery].sort((first, second) => Number(/\.(mp4|mov|webm)$/i.test(second)) - Number(/\.(mp4|mov|webm)$/i.test(first)));
    return media.map((src, index) => {
      const video = /\.(mp4|mov|webm)$/i.test(src);
      const mimeType = src.toLowerCase().endsWith(".webm") ? "video/webm" : src.toLowerCase().endsWith(".mov") ? "video/quicktime" : "video/mp4";
      const content = video
        ? `<video autoplay muted loop playsinline preload="auto" aria-label="${escapeHtml(`${work.title} background video`)}"><source src="${escapeHtml(src)}" type="${mimeType}"></video>`
        : `<img src="${escapeHtml(src)}" alt="${escapeHtml(`${work.title} detail ${index + 1}`)}" loading="lazy" decoding="async">`;
      const greattopVideo = video && work.key === "web-greattop" ? " project-media-item--greattop-video" : "";
      return `<figure class="project-media-item${video ? " project-media-item--video" : ""}${greattopVideo} reveal">${content}</figure>`;
    }).join("");
  }

  function workTile(work) {
    const tileContent = `<div class="work-tile-media"><img src="${escapeHtml(work.cover)}" alt="${escapeHtml(work.title)}" loading="lazy" decoding="async"></div><div class="work-tile-info"><h2>${escapeHtml(work.title)}</h2><span>${escapeHtml(work.category)}<br>${work.year}${work.type === "web" ? " ↗" : ""}</span></div>`;
    return `<article class="work-entry"><a class="work-tile reveal" href="${projectHref(work)}">${tileContent}</a></article>`;
  }

  function worksTemplate() {
    return `<header class="page-heading"><h1>Selected Work</h1></header><div class="work-toolbar"><span class="work-count">${String(works.length).padStart(2,"0")} projects</span><div class="view-switch"><button type="button" class="active" data-view="grid">Grid</button><span>/</span><button type="button" data-view="list">List</button></div></div><section class="work-collection grid" id="work-collection">${works.map(workTile).join("")}</section>`;
  }

  function aboutTemplate() {
    const services = profile.services.map(([,title]) => `<span>${escapeHtml(title)}</span>`).join("");
    return `<section class="about-lead"><h1 class="reveal">For over six years, I have translated ideas into visual systems and digital experiences, helping brands find a voice that is clear, useful and distinctly their own.</h1><p class="about-zh">我相信好的設計不是加入更多，而是讓真正重要的內容被看見。透過品牌、網頁、包裝與影像，將抽象想法整理成能被感受與理解的視覺語言。</p></section><div class="marquee"><div class="marquee-track">${services}${services}</div></div><section class="principles"><article class="principle reveal"><span>[ BALANCE ]</span><h2>Creative meets commercial.</h2><p>在美學與實際效能之間取得平衡，讓作品不只被看見，也能完成溝通目的。</p></article><article class="principle reveal"><span>[ CLARITY ]</span><h2>Every element earns its place.</h2><p>從資訊層級到互動節奏，移除不必要的干擾，讓核心價值成為畫面主角。</p></article><article class="principle reveal"><span>[ LONGEVITY ]</span><h2>Designed beyond the moment.</h2><p>建立可以延伸、調整並持續使用的設計系統，而不是只追逐短暫的視覺潮流。</p></article></section><section class="experience"><p>[ EXPERIENCE ]</p>${profile.experience.map(([year,company,role]) => `<article class="experience-row reveal"><span>${escapeHtml(year)}</span><h3>${escapeHtml(company)}</h3><p>${escapeHtml(role)}</p></article>`).join("")}</section>`;
  }

  function contactTemplate() {
    return `<section class="contact-page"><div class="contact-copy"><div><h1>Contact<br>me</h1><p>Have a new project in mind? Tell me where you are now, and what the next step needs to become.</p></div><div><a href="mailto:${profile.email}">${profile.email}</a><br><a href="${profile.behance}" target="_blank" rel="noreferrer">Behance ↗</a></div></div><div class="contact-form-wrap"><form class="contact-form" id="contact-form"><div class="form-row"><span>01</span><label>Name<input name="name" required></label></div><div class="form-row"><span>02</span><label>Email<input type="email" name="email" required></label></div><div class="form-row"><span>03</span><label>Brand name<input name="brand"></label></div><div class="form-row"><span>04</span><label>Subject<select name="service"><option>Brand Identity</option><option>Web Design</option><option>Packaging Design</option><option>Visual Design</option><option>Photography</option></select></label></div><div class="form-row"><span>05</span><label>Other info<textarea name="message" required></textarea></label></div><button class="contact-submit" type="submit">Submit</button></form></div></section>`;
  }

  function projectTemplate() {
    const id = new URLSearchParams(location.search).get("id");
    const work = works.find((item) => item.key === id) || works[3];
    document.title = `${work.title} — NierZooM`;
    const index = works.indexOf(work);
    const previous = works[(index - 1 + works.length) % works.length];
    const next = works[(index + 1) % works.length];
    const media = projectMediaMarkup(work);
    const description = work.description || `A selected ${work.category.toLowerCase()} project. This page brings together the final visual direction, applications and project details.`;
    return `<header class="project-title"><p>${escapeHtml(work.category)} / ${work.year}</p><h1>${escapeHtml(work.title)}</h1></header><section class="project-description reveal"><p>${escapeHtml(description)}</p><div class="project-facts"><span>Year / ${work.year}</span><span>Scope / ${escapeHtml(work.category)}</span><span>Images / ${work.gallery.length}</span>${work.externalUrl ? `<a href="${escapeHtml(work.externalUrl)}" target="_blank" rel="noreferrer noopener">Visit website ↗</a>` : ""}</div></section><section class="project-media">${media}</section><nav class="project-nav"><a href="${projectHref(previous)}">Prev</a><a href="works.html">Back</a><a href="${projectHref(next)}">Next</a></nav>`;
  }

  const templates = { home: homeTemplate, works: worksTemplate, about: aboutTemplate, contact: contactTemplate, project: projectTemplate };
  document.body.insertAdjacentHTML("afterbegin", nav());
  app.innerHTML = templates[page]();
  document.body.insertAdjacentHTML("beforeend", footer());

  const menu = document.querySelector(".mobile-toggle");
  menu?.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menu.setAttribute("aria-expanded", String(open));
    setFoldText(menu, open ? "Close" : "Menu");
  });

  initDepthCarousel();

  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => {
    const collection = document.getElementById("work-collection");
    document.querySelectorAll("[data-view]").forEach((item) => item.classList.toggle("active", item === button));
    collection.className = `work-collection ${button.dataset.view}`;
  }));
  document.getElementById("work-collection")?.addEventListener("pointermove", (event) => { event.currentTarget.style.setProperty("--preview-x", `${event.clientX}px`); event.currentTarget.style.setProperty("--preview-y", `${event.clientY}px`); });

  document.getElementById("contact-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`[Portfolio inquiry] ${data.get("brand") || data.get("name")}`);
    const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\nService: ${data.get("service")}\n\n${data.get("message")}`);
    location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  });

  function updateClock() {
    const value = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Taipei", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
    document.querySelectorAll("#clock, #stage-clock").forEach((element) => { element.textContent = `GMT +8 / ${value}`; });
  }
  updateClock();
  window.setInterval(updateClock, 30000);

  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  initSmoothScroll();

  if (window.gsap && !reducedMotion) {
    gsap.to(".marquee-track", { xPercent: -50, duration: 24, repeat: -1, ease: "none" });
    gsap.utils.toArray(".reveal").forEach((element) => gsap.to(element, { opacity: 1, y: 0, duration: .8, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } }));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => { element.style.opacity = "1"; element.style.transform = "none"; });
  }
  initFoldText();
  initGsapText();
  requestAnimationFrame(() => window.ScrollTrigger?.refresh());
})();
