(() => {
  const FALLOFF = (progress) => progress * progress * (3 - 2 * progress);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  document.querySelectorAll("[data-line-sidebar]").forEach((sidebar) => {
    const list = sidebar.querySelector(".line-sidebar__list");
    const items = [...sidebar.querySelectorAll(".line-sidebar__item")];
    const targets = items.map(() => 0);
    const current = items.map(() => 0);
    let activeKey = sidebar.dataset.active;
    let frame = null;
    let lastTime = 0;

    const setActive = (key) => {
      activeKey = key;
      items.forEach((item) => {
        const active = item.dataset.navKey === key;
        item.classList.toggle("is-active", active);
        if (active) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      });
      startLoop();
    };

    const draw = (now) => {
      const elapsed = Math.min((now - lastTime) / 1000, 0.05);
      const easing = 1 - Math.exp(-elapsed / 0.16);
      let moving = false;
      lastTime = now;

      items.forEach((item, index) => {
        const target = Math.max(targets[index], item.dataset.navKey === activeKey ? 1 : 0);
        const next = current[index] + (target - current[index]) * easing;
        const settled = Math.abs(target - next) < 0.0015;
        current[index] = settled ? target : next;
        item.style.setProperty("--effect", current[index].toFixed(4));
        if (!settled) moving = true;
      });

      frame = moving ? requestAnimationFrame(draw) : null;
    };

    const startLoop = () => {
      if (reducedMotion) {
        items.forEach((item, index) => {
          const value = item.dataset.navKey === activeKey ? 1 : targets[index];
          current[index] = value;
          item.style.setProperty("--effect", value);
        });
        return;
      }
      if (frame !== null) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(draw);
    };

    if (finePointer) {
      list.addEventListener("pointermove", (event) => {
        items.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const distance = Math.abs(event.clientY - (rect.top + rect.height / 2));
          targets[index] = FALLOFF(Math.max(0, 1 - distance / 70));
        });
        startLoop();
      });

      list.addEventListener("pointerleave", () => {
        targets.fill(0);
        startLoop();
      });
    }

    items.forEach((item) => item.addEventListener("click", () => setActive(item.dataset.navKey)));

    const contact = document.getElementById("v3-contact");
    if (contact && sidebar.dataset.active === "about") {
      const observer = new IntersectionObserver(([entry]) => {
        setActive(entry.isIntersecting ? "contact" : "about");
      }, { rootMargin: "-25% 0px -40%", threshold: 0.05 });
      observer.observe(contact);
    }

    setActive(activeKey);
  });
})();
