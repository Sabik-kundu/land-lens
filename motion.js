gsap.registerPlugin(ScrollTrigger);
window.animateIn = () => {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
  /* Headline: split into masked characters */
  const h1 = $("#land-lens-text");
  h1.innerHTML = h1.textContent.split(" ").map(w =>
    `<span class="word">${[...w].map(c => `<span class="ch">${c}</span>`).join("")}</span>`).join(" ");

  /* Tricolor curtains lift off the photo to reveal it */
  const photo = $("#photo");
  ["#ff611f", "#ffffff", "#046a38"].forEach((col, i) => {
    const d = document.createElement("div");
    d.className = "curtain";
    d.style.cssText = `left:${i * 33}%;background:${col}`;
    photo.appendChild(d);
  });
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from("#main-header", { yPercent: -150, opacity: 0, duration: 0.9 })
    .from(".ch", { yPercent: 115, rotate: 8, duration: 0.9, stagger: 0.035 }, 0.2)
    .from("#hero-bar", { scaleX: 0, duration: 0.9, ease: "expo.out" }, 0.8)
    .from("#hero-description, .cta-buttons .btn", { y: 24, opacity: 0, stagger: 0.12, duration: 0.7 }, 0.9)
    .to(".curtain", { yPercent: -101, duration: 1.2, stagger: 0.14, ease: "expo.inOut" }, 0.5)
    .from("#hero-img", { scale: 1.35, duration: 2, ease: "expo.out" }, 0.5)
    .from(".hero-content, .hero-facts > div", { y: 44, scale: 0.94, opacity: 0, stagger: 0.09, duration: 0.9, ease: "back.out(1.2)" }, 0.1);

  /* Mouse depth: photo drifts slightly */
  const hero = $("#home-section");
  const drift = gsap.quickTo("#hero-img", "x", { duration: 0.8, ease: "power3" });
  hero.addEventListener("pointermove", e => drift((e.clientX / innerWidth - 0.5) * 14));

  /* Scroll: photo slides inside its frame */
  gsap.to("#hero-img", { yPercent: -9, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });

  /* Scroll progress + header morph + active nav link */
  gsap.to("#progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  ScrollTrigger.create({ start: 80, end: "max", toggleClass: { targets: "#main-header", className: "compact" } });
  $$("section").forEach(s => ScrollTrigger.create({
    trigger: s, start: "top 45%", end: "bottom 45%",
    onToggle: t => t.isActive && $$(".nav-list a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + s.id))
  }));

  /* Section titles: gradient underline draws in */
  $$(".section-title").forEach(t => gsap.fromTo(t, { "--u": 0 }, { "--u": 1, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: t, start: "top 85%" } }));

  /* Magnetic buttons */
  $$(".magnetic").forEach(b => {
    const qx = gsap.quickTo(b, "x", { duration: 0.4, ease: "power3" }), qy = gsap.quickTo(b, "y", { duration: 0.4, ease: "power3" });
    b.addEventListener("pointermove", e => {
      const r = b.getBoundingClientRect();
      qx((e.clientX - r.left - r.width / 2) * 0.3); qy((e.clientY - r.top - r.height / 2) * 0.4);
    });
    b.addEventListener("pointerleave", () => { qx(0); qy(0); });
  });

  /* Cards: batch reveal, re-run whenever a grid re-renders (search, filter, pages) */
  const store = new Map();
  window.animateIn = grid => {
    (store.get(grid) || []).forEach(t => t.kill());
    const kids = [...grid.children], policy = grid.id === "policy-grid";
    gsap.set(kids, { opacity: 0 });
    store.set(grid, ScrollTrigger.batch(kids, {
      start: "top 90%", once: true,
      onEnter: els => els.forEach((el, i) => gsap.fromTo(el,
        policy ? { x: kids.indexOf(el) % 2 ? 90 : -90, opacity: 0 } : { y: 60, rotateX: -18, opacity: 0, transformOrigin: "50% 0" },
        { x: 0, y: 0, rotateX: 0, opacity: 1, duration: 0.9, delay: i * 0.09, ease: "back.out(1.3)", clearProps: "transform" }))
    }));
    ScrollTrigger.refresh();
  };

  /* About: scrubbed word-by-word text fill */
  const intro = $("#about-intro");
  intro.innerHTML = intro.textContent.split(" ").map(w => `<span class="w">${w}</span>`).join("");
  gsap.fromTo(".about-intro .w", { opacity: 0.15 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: intro, start: "top 80%", end: "bottom 45%", scrub: true } });

  /* Stats: count up while cards pop in */
  $$(".stat-card").forEach((c, i) => {
    const n = $(".stat-number", c), o = { v: 0 }, sfx = n.dataset.suffix || "";
    gsap.from(c, { yPercent: 40, opacity: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out", scrollTrigger: { trigger: c, start: "top 90%" } });
    gsap.to(o, { v: +n.dataset.target, duration: 1.8, delay: i * 0.1, ease: "power2.out", snap: { v: 1 }, onUpdate: () => (n.textContent = o.v + sfx), scrollTrigger: { trigger: c, start: "top 90%" } });
  });

  /* Feature cards: staggered reveal + cursor-driven 3D tilt */
  gsap.from(".feature-card", { y: 60, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".feature-card", start: "top 90%" } });
  $$(".feature-card").forEach(c => {
    gsap.set(c, { transformPerspective: 900 });
    const rx = gsap.quickTo(c, "rotationX", { duration: 0.5 }), ry = gsap.quickTo(c, "rotationY", { duration: 0.5 });
    c.addEventListener("pointermove", e => {
      const r = c.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 16); rx(-((e.clientY - r.top) / r.height - 0.5) * 16);
    });
    c.addEventListener("pointerleave", () => { rx(0); ry(0); });
  });

  /* Footer: tricolor line sweeps in, giant wordmark drifts */
  gsap.from("#footer-bar", { scaleX: 0, ease: "none", scrollTrigger: { trigger: "#footer", start: "top 90%", end: "top 40%", scrub: true } });
  gsap.fromTo("#footer-mark", { yPercent: 40 }, { yPercent: -5, ease: "none", scrollTrigger: { trigger: "#footer", start: "top bottom", end: "bottom bottom", scrub: true } });
});