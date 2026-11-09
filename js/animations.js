/* =====================================================================
   animations.js — apparitions au scroll, terminal animé et réseau de
   particules du hero. Tout est désactivé si prefers-reduced-motion.
   Chargé en dernier pour observer les éléments générés par les autres scripts.
   ===================================================================== */
(function () {
  "use strict";
  const PF = window.PF; if (!PF) return;
  const reduced = PF.reducedMotion();

  /* ---------- Apparition progressive ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Terminal ---------- */
  const term = document.querySelector("[data-terminal]");
  const lines = PF.data.terminal || [];
  if (term && lines.length) {
    const esc = PF.esc;
    const full = lines.map((l) => `<span class="prompt">~$</span> ${esc(l.cmd)}\n${l.out.map((o) => `<span class="out">${esc(o)}</span>`).join("\n")}\n`).join("\n");
    const caret = '<span class="caret" aria-hidden="true"></span>';
    term.setAttribute("aria-label", lines.map((l) => `${l.cmd} : ${l.out.join(" ")}`).join(". "));
    if (reduced) {
      term.innerHTML = full + `<span class="prompt">~$</span> ${caret}`;
    } else {
      let html = "", li = 0;
      const typeLine = () => {
        if (li >= lines.length) { term.innerHTML = html + `<span class="prompt">~$</span> ${caret}`; return; }
        const { cmd, out } = lines[li++];
        let c = 0;
        const step = () => {
          term.innerHTML = html + `<span class="prompt">~$</span> ${esc(cmd.slice(0, c))}${caret}`;
          if (c++ < cmd.length) return setTimeout(step, 45 + Math.random() * 40);
          html += `<span class="prompt">~$</span> ${esc(cmd)}\n${out.map((o) => `<span class="out">${esc(o)}</span>`).join("\n")}\n\n`;
          term.innerHTML = html + caret;
          setTimeout(typeLine, 600);
        };
        step();
      };
      setTimeout(typeLine, 700);
    }
  }

  /* ---------- Réseau de particules ---------- */
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas?.getContext?.("2d");
  if (!ctx) return;
  let w = 0, h = 0, pts = [], color = "#749dc4", running = false, raf = 0;
  const readColor = () => { color = getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim() || color; };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(70, Math.round((w * h) / 16000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3 }));
  };
  const LINK = 140;
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color; ctx.strokeStyle = color;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (running) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1; }
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
        if (d < LINK) { ctx.globalAlpha = (1 - d / LINK) * 0.45; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      ctx.globalAlpha = 0.9; ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
    }
    ctx.globalAlpha = 1;
    if (running) raf = requestAnimationFrame(draw);
  };
  const start = () => { if (reduced || running || document.hidden) return; running = true; raf = requestAnimationFrame(draw); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  readColor(); resize(); draw();
  window.addEventListener("resize", () => { resize(); draw(); });
  window.addEventListener("themechange", () => { readColor(); if (!running) draw(); });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop())).observe(canvas);
})();
