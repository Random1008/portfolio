/* =====================================================================
   main.js — utilitaires partagés, en-tête, pied de page, thème,
   menu mobile, navigation active et rendu des sections de contenu.
   ===================================================================== */
(function () {
  "use strict";
  const D = window.PORTFOLIO || {};
  const root = document.documentElement;
  const BASE = document.body.dataset.base || "";   // "" sur l'accueil, "../" dans pages/
  const PAGE = document.body.dataset.page || "home";

  /* ---------- Utilitaires (exposés pour les autres scripts) ---------- */
  const PF = (window.PF = {
    data: D, base: BASE, page: PAGE,
    esc: (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])),
    icon(name, size = 20) {
      const p = (window.ICONS || {})[name] || (window.ICONS || {})["code-xml"] || "";
      return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${p}</svg>`;
    },
    corners: '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>',
    todo: (t = "À compléter") => `<span class="todo">${PF.esc(t)}</span>`,
    has: (v) => (Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim())),
    /* Chemin d'un fichier local relatif au dossier portfolio/ ; les URLs absolues sont conservées. */
    asset: (p) => (/^(https?:|data:|\/)/.test(p) ? p : BASE + p),
    list(items, empty = "À compléter") {
      return PF.has(items) ? `<ul class="check-list">${items.map((i) => `<li>${PF.esc(i)}</li>`).join("")}</ul>` : PF.todo(empty);
    },
    homeHref: (id) => (PAGE === "home" ? `#${id}` : `${BASE}index.html#${id}`),
    mount(sel, html) { const el = document.querySelector(sel); if (el) el.innerHTML = html; return el; },
    reducedMotion: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  });
  const { esc, icon, corners, has } = PF;
  const P = D.profile || {};

  const NAV = [
    ["accueil", "Accueil"], ["apropos", "À propos"], ["competences", "Compétences"],
    ["projets", "Projets"], ["parcours", "Parcours"], ["contact", "Contact"]
  ];
  const brand = () => {
    const mark = has(P.initials) ? esc(P.initials) : "&lt;/&gt;";
    return `<span class="brand-mark blueprint">${corners}${mark}</span><span class="brand-text">${has(P.name) ? esc(P.name) : "Portfolio"}</span>`;
  };
  const cvButton = (extra = "") => has(P.cv)
    ? `<a class="btn btn-primary blueprint ${extra}" href="${esc(PF.asset(P.cv))}" download>${corners}${icon("download", 16)}<span class="nav-cv-label">Télécharger mon CV</span></a>`
    : `<button class="btn btn-secondary ${extra}" type="button" disabled title="Ajoutez le chemin de votre CV dans js/data.js (profile.cv)">${icon("download", 16)}<span class="nav-cv-label">CV bientôt disponible</span></button>`;

  /* ---------- En-tête ---------- */
  const header = document.querySelector("[data-site-header]");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <nav class="nav container" aria-label="Navigation principale">
        <a class="nav-brand" href="${PF.homeHref("accueil")}" aria-label="Accueil">${brand()}</a>
        <div class="nav-links" id="nav-links">
          ${NAV.map(([id, label]) => `<a href="${PF.homeHref(id)}" data-nav="${id}">${label}</a>`).join("")}
        </div>
        <div class="nav-actions">
          <button class="btn btn-secondary btn-icon" type="button" data-theme-toggle aria-label="Basculer le thème"></button>
          ${cvButton()}
          <button class="btn btn-secondary btn-icon nav-toggle" type="button" aria-controls="nav-links" aria-expanded="false" aria-label="Ouvrir le menu">${icon("menu")}</button>
        </div>
      </nav>`;
  }

  /* ---------- Thème clair / sombre (mémorisé dans localStorage) ---------- */
  const themeBtn = document.querySelector("[data-theme-toggle]");
  const paintThemeBtn = () => {
    if (!themeBtn) return;
    const dark = root.dataset.theme !== "light";
    themeBtn.innerHTML = icon(dark ? "sun" : "moon", 18);
    themeBtn.setAttribute("aria-label", dark ? "Activer le mode clair" : "Activer le mode sombre");
  };
  paintThemeBtn();
  themeBtn?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("pf-theme", root.dataset.theme); } catch (e) { /* stockage indisponible */ }
    paintThemeBtn();
    window.dispatchEvent(new CustomEvent("themechange"));
  });

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  const setMenu = (open) => {
    if (!toggle || !links) return;
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    toggle.innerHTML = icon(open ? "x" : "menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle?.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  links?.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && links?.classList.contains("is-open")) { setMenu(false); toggle.focus(); } });
  window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ---------- Lien actif selon la section visible ---------- */
  if (PAGE === "home" && "IntersectionObserver" in window) {
    const navLinks = [...document.querySelectorAll("[data-nav]")];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.toggleAttribute("aria-current", a.dataset.nav === en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach(([id]) => { const s = document.getElementById(id); if (s) io.observe(s); });
  } else {
    const current = { projets: "projets", contact: "contact" }[PAGE];
    document.querySelector(`[data-nav="${current}"]`)?.setAttribute("aria-current", "page");
  }

  /* ---------- Hero ---------- */
  const title = document.querySelector("[data-bind='title']");
  if (title && has(P.title)) {
    const hl = P.titleHighlight || "";
    const t = esc(P.title);
    title.innerHTML = hl && P.title.includes(hl) ? t.replace(esc(hl), `<em>${esc(hl)}</em>`) : t;
  }
  [["subtitle", P.subtitle], ["intro", P.intro]].forEach(([k, v]) => {
    const el = document.querySelector(`[data-bind='${k}']`);
    if (el && has(v)) el.textContent = v;
  });
  if (has(P.name)) document.title = `${P.name} — ${document.title}`;

  /* ---------- À propos ---------- */
  const A = D.about || {};
  PF.mount("[data-about-text]", (A.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join("") || PF.todo());
  document.querySelector(".about-figure")?.classList.toggle("duotone", !!(A.illustration || P.photo));
  PF.mount("[data-about-figure]", (A.illustration || P.photo)
    ? `<img src="${esc(PF.asset(A.illustration || P.photo))}" alt="Illustration de mon univers informatique" loading="lazy" width="800" height="600">`
    : `<div class="placeholder">${icon("image", 28)}<span>Illustration à ajouter<br>about.illustration dans js/data.js</span></div>`);
  PF.mount("[data-about-cards]", [
    ["Centres d'intérêt", "sparkles", A.interests], ["Objectifs", "target", A.goals], ["Spécialisations", "layers", A.specialties]
  ].map(([t, ic, items], i) => `
    <article class="card blueprint reveal" style="--d:${i * 0.08}s">${corners}
      <div class="icon-frame">${icon(ic)}</div>
      <h3 class="card-title">${t}</h3>
      ${PF.list(items)}
    </article>`).join(""));

  /* ---------- Compétences ---------- */
  const max = D.skillLevelMax || 5;
  const level = (lv) => {
    const n = Number.isInteger(lv) ? Math.max(0, Math.min(max, lv)) : null;
    const bars = Array.from({ length: max }, (_, i) => `<span class="${n !== null && i < n ? "on" : ""}"></span>`).join("");
    const label = n === null ? "Niveau : à définir" : `Niveau : ${n}/${max}`;
    return `<div class="level"><div class="level-bar" style="--max:${max}" role="img" aria-label="${label}">${bars}</div><span class="level-label">${label}</span></div>`;
  };
  PF.mount("[data-skills]", (D.skills || []).map((g) => `
    <div class="skill-group">
      <div class="reveal">
        <h3 class="skill-group-title">${esc(g.category)}</h3>
        <span class="skill-group-count">${String(g.items.length).padStart(2, "0")} compétence${g.items.length > 1 ? "s" : ""}</span>
      </div>
      <div class="skill-grid">
        ${g.items.map((s, i) => `
          <article class="card blueprint skill-card is-interactive reveal" style="--d:${i * 0.05}s">${corners}
            <div class="skill-head"><div class="icon-frame">${icon(s.icon)}</div><h4 class="card-title">${esc(s.name)}</h4></div>
            <p class="card-body">${esc(s.description)}</p>
            ${level(s.level)}
          </article>`).join("")}
      </div>
    </div>`).join(""));

  /* ---------- Intelligence artificielle ---------- */
  const AI = D.ai || {};
  PF.mount("[data-ai-domains]", (AI.domains || []).map((d, i) => `
    <article class="card blueprint ai-card is-interactive reveal" style="--d:${(i % 4) * 0.06}s">${corners}
      <div class="skill-head"><div class="icon-frame">${icon(d.icon)}</div><span class="ai-num">${String(i + 1).padStart(2, "0")}</span></div>
      <h3 class="card-title">${esc(d.title)}</h3>
      <p class="card-body">${esc(d.description)}</p>
    </article>`).join(""));
  const L = AI.lab || {};
  PF.mount("[data-ai-intro]", has(L.intro) ? `<p>${esc(L.intro)}</p>` : `<p class="text-muted">Présentation de mes expérimentations avec l'IA.</p>${PF.todo("ai.lab.intro dans js/data.js")}`);
  const demoList = (demos) => has(demos)
    ? `<ul class="check-list">${demos.map((d) => `<li>${d.url ? `<a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.label)}</a>` : esc(d.label)}</li>`).join("")}</ul>`
    : PF.todo();
  PF.mount("[data-ai-lab]", [
    ["Modèles utilisés", "message", PF.list(L.models)], ["Projets IA", "folder", PF.list(L.projects)],
    ["Outils", "terminal", PF.list(L.tools)], ["Expérimentations", "sparkles", PF.list(L.experiments)],
    ["Démonstrations", "external", demoList(L.demos)]
  ].map(([t, ic, body]) => `<div class="lab-slot"><h4>${icon(ic, 16)}${t}</h4>${body}</div>`).join(""));

  /* ---------- Parcours ---------- */
  PF.mount("[data-timeline]", (D.timeline || []).map((t, i) => `
    <li class="tl-item reveal" style="--d:${i * 0.05}s">
      <span class="tl-marker">${icon(t.icon || "target", 13)}</span>
      <span class="tl-date">${has(t.date) ? esc(t.date) : PF.todo("Date à préciser")}</span>
      <article class="card blueprint tl-card">${corners}
        <span class="tag-list"><span class="tag tag-accent">${esc(t.category)}</span></span>
        <h3 class="card-title">${esc(t.title)}</h3>
        ${has(t.description) ? `<p class="card-body">${esc(t.description)}</p>` : PF.todo("Description à compléter")}
      </article>
    </li>`).join(""));

  /* ---------- Pied de page ---------- */
  const footer = document.querySelector("[data-site-footer]");
  if (footer) {
    const C = D.contact || {};
    const gh = (C.links || []).find((l) => l.label === "GitHub" && has(l.url));
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="nav-brand" href="${PF.homeHref("accueil")}">${brand()}</a>
            <p class="text-muted" style="margin-top:16px;max-width:40ch">Portfolio personnel — informatique, intelligence artificielle, systèmes et cybersécurité.</p>
          </div>
          <nav aria-label="Navigation secondaire">
            <h2>Navigation</h2>
            <ul class="footer-links">
              ${NAV.map(([id, l]) => `<li><a href="${PF.homeHref(id)}">${l}</a></li>`).join("")}
            </ul>
          </nav>
          <div>
            <h2>Liens</h2>
            <ul class="footer-links">
              <li><a href="${BASE}pages/projets.html">Tous les projets</a></li>
              <li><a href="${BASE}pages/homelab.html">Homelab</a></li>
              <li><a href="${BASE}pages/contact.html">Contact</a></li>
              ${gh ? `<li><a href="${esc(gh.url)}" target="_blank" rel="noopener">GitHub</a></li>` : ""}
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${has(P.name) ? esc(P.name) : ""} — Portfolio personnel</span>
          <span>HTML · CSS · JavaScript</span>
        </div>
      </div>
      <button class="btn btn-primary btn-icon blueprint to-top" type="button" aria-label="Revenir en haut de la page">${corners}${icon("arrow-up", 18)}</button>`;
  }

  /* ---------- Retour en haut ---------- */
  const toTop = document.querySelector(".to-top");
  if (toTop) {
    const onScroll = () => toTop.classList.toggle("is-visible", window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: PF.reducedMotion() ? "auto" : "smooth" }));
  }
})();
