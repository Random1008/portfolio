/* =====================================================================
   projects.js — cartes projets et modale de détail.
   Expose window.Projects.render(filtre) utilisé par filters.js.
   Lien direct vers un projet : pages/projets.html?projet=<id>
   ===================================================================== */
(function () {
  "use strict";
  const PF = window.PF; if (!PF) return;
  const { esc, icon, corners, has } = PF;
  const projects = PF.data.projects || [];
  const cats = Object.fromEntries((PF.data.projectCategories || []).map((c) => [c.id, c.label]));

  const media = (p) => has(p.image)
    ? `<figure class="project-media duotone"><img src="${esc(PF.asset(p.image))}" alt="Aperçu du projet ${esc(p.title)}" loading="lazy" width="640" height="360"></figure>`
    : `<div class="project-media"><div class="placeholder">${icon(p.icon || "folder", 40)}<span>Visuel à ajouter</span></div></div>`;

  const extLinks = (p, cls = "btn-ghost") => [
    has(p.github) ? `<a class="btn ${cls}" href="${esc(p.github)}" target="_blank" rel="noopener">${icon("github", 16)}GitHub</a>` : "",
    has(p.demo) ? `<a class="btn ${cls}" href="${esc(p.demo)}" target="_blank" rel="noopener">${icon("external", 16)}Démonstration</a>` : ""
  ].join("");

  const card = (p, i) => `
    <article class="card blueprint project-card is-interactive" data-id="${esc(p.id)}" style="--d:${i * 0.06}s">${corners}
      ${media(p)}
      <div class="project-body">
        <div class="project-cats">${p.categories.map((c) => `<span class="card-kicker">#${esc(cats[c] || c)}</span>`).join("")}</div>
        <h3 class="card-title"><button class="project-title-btn" type="button" data-open="${esc(p.id)}">${esc(p.title)}</button></h3>
        <p class="card-body">${esc(p.description)}</p>
        <div class="tag-list">${(p.tech || []).map((t) => `<span class="tag tag-neutral">${esc(t)}</span>`).join("")}</div>
        <div class="project-actions">
          <button class="btn btn-secondary" type="button" data-open="${esc(p.id)}">Voir le projet ${icon("arrow-right", 16)}</button>
          ${extLinks(p)}
        </div>
      </div>
    </article>`;

  const grids = [...document.querySelectorAll("[data-projects-grid]")];

  function render(filter = "all", animate = false) {
    const list = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));
    grids.forEach((g) => {
      g.innerHTML = list.length
        ? list.map(card).join("")
        : `<p class="empty-state">Aucun projet dans la catégorie « ${esc(cats[filter] || filter)} » pour le moment.</p>`;
      if (animate) g.querySelectorAll(".project-card").forEach((c) => c.classList.add("is-entering"));
    });
  }
  render();

  /* ---------- Modale ---------- */
  const dialog = document.createElement("dialog");
  dialog.className = "project-modal blueprint";
  dialog.setAttribute("aria-labelledby", "modal-title");
  document.body.appendChild(dialog);
  let opener = null;

  const block = (title, body) => `<section><h3>// ${title}</h3>${body}</section>`;
  const text = (v) => (has(v) ? `<p>${esc(v)}</p>` : PF.todo());

  function open(id) {
    const p = projects.find((x) => x.id === id);
    if (!p) return;
    opener = document.activeElement;
    const gallery = has(p.images)
      ? `<div class="modal-gallery">${p.images.map((src, i) => `<figure class="duotone"><img src="${esc(PF.asset(src))}" alt="${esc(p.title)} — image ${i + 1}" loading="lazy"></figure>`).join("")}</div>`
      : PF.todo("Images à ajouter (projects[].images)");
    const links = extLinks(p, "btn-secondary");
    dialog.innerHTML = `${corners}
      <div class="modal-scroll">
        <header class="modal-head">
          <div class="icon-frame">${icon(p.icon || "folder")}</div>
          <div>
            <div class="project-cats">${p.categories.map((c) => `<span class="card-kicker">#${esc(cats[c] || c)}</span>`).join("")}</div>
            <h2 id="modal-title">${esc(p.title)}</h2>
          </div>
          <button class="btn btn-secondary btn-icon" type="button" data-close aria-label="Fermer">${icon("x")}</button>
        </header>
        <div class="modal-content">
          <p class="modal-lead">${esc(p.description)}</p>
          <div class="modal-sections">
            ${block("Contexte", text(p.context))}
            ${block("Objectifs", PF.list(p.objectives))}
            ${block("Technologies", has(p.tech) ? `<div class="tag-list">${p.tech.map((t) => `<span class="tag tag-accent">${esc(t)}</span>`).join("")}</div>` : PF.todo())}
            ${block("Fonctionnalités", PF.list(p.features))}
            ${block("Difficultés rencontrées", PF.list(p.challenges))}
            ${block("Solutions apportées", PF.list(p.solutions))}
            ${block("Améliorations possibles", PF.list(p.improvements))}
            ${block("Liens", links ? `<div class="modal-links">${links}</div>` : PF.todo("Lien GitHub / démo à ajouter"))}
          </div>
          <div><h3 class="kicker">// Images du projet</h3>${gallery}</div>
        </div>
      </div>`;
    document.body.classList.add("modal-open");
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
    dialog.querySelector("[data-close]").focus();
  }
  function close() {
    if (dialog.open && typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open");
  }
  dialog.addEventListener("close", () => { document.body.classList.remove("modal-open"); opener?.focus?.(); });
  dialog.addEventListener("click", (e) => { if (e.target === dialog || e.target.closest("[data-close]")) close(); });
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-open]"); if (b) open(b.dataset.open); });

  const fromUrl = new URLSearchParams(location.search).get("projet");
  if (fromUrl) open(fromUrl);

  window.Projects = { render, open, close, list: projects };
})();
