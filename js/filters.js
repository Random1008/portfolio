/* filters.js — filtres de projets par catégorie, avec transition légère. */
(function () {
  "use strict";
  const PF = window.PF, P = window.Projects;
  if (!PF || !P) return;
  const cats = PF.data.projectCategories || [];
  const count = (id) => (id === "all" ? P.list.length : P.list.filter((p) => p.categories.includes(id)).length);

  document.querySelectorAll("[data-project-filters]").forEach((bar) => {
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Filtrer les projets par catégorie");
    bar.innerHTML = cats.map((c, i) => `
      <button class="filter-btn" type="button" data-filter="${PF.esc(c.id)}" aria-pressed="${i === 0}">
        ${PF.esc(c.label)}<span class="filter-count">${String(count(c.id)).padStart(2, "0")}</span>
      </button>`).join("");

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn || btn.getAttribute("aria-pressed") === "true") return;
      bar.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      const grids = document.querySelectorAll("[data-projects-grid]");
      if (PF.reducedMotion()) return P.render(btn.dataset.filter);
      grids.forEach((g) => g.classList.add("is-leaving"));
      setTimeout(() => {
        P.render(btn.dataset.filter, true);
        grids.forEach((g) => g.classList.remove("is-leaving"));
      }, 220);
    });
  });
})();
