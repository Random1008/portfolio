/* =====================================================================
   homelab.js — schéma d'infrastructure, cartes des équipements,
   services et projets d'administration.
   La supervision n'affiche des états que si homelab.monitoringApi
   est renseignée (fetch d'un JSON [{ id, status }]).
   ===================================================================== */
(function () {
  "use strict";
  const PF = window.PF; if (!PF) return;
  const { esc, icon, corners, has } = PF;
  const H = PF.data.homelab || {};
  const machines = H.machines || [];
  const byId = Object.fromEntries(machines.map((m) => [m.id, m]));

  /* ---------- Schéma ---------- */
  const node = (id) => {
    const m = byId[id];
    const n = m ? { label: m.name, icon: m.icon, sub: m.type } : (H.network || {})[id] || { label: id, icon: "server" };
    const inner = `${corners}${icon(n.icon, 22)}<span><strong>${esc(n.label)}</strong>${n.sub ? `<small>${esc(n.sub)}</small>` : ""}</span>`;
    return m
      ? `<a class="topo-node blueprint" href="#eq-${esc(id)}" aria-label="Voir l'équipement ${esc(n.label)}">${inner}</a>`
      : `<div class="topo-node blueprint">${inner}</div>`;
  };
  PF.mount("[data-homelab-topology]", `${corners}
    <span class="topology-label">schéma — infrastructure réseau</span>
    <div class="topo" role="img" aria-label="Schéma : ${(H.tiers || []).map((t) => t.map((id) => (byId[id] || (H.network || {})[id] || {}).name || (H.network || {})[id]?.label || id).join(", ")).join(" → ")}">
      ${(H.tiers || []).map((tier) => `
        <div class="topo-tier ${tier.length > 1 ? "multi" : ""}" style="--n:${tier.length}">
          ${tier.map((id) => `<div class="topo-cell">${node(id)}</div>`).join("")}
        </div>`).join("")}
    </div>`);

  /* ---------- Équipements ---------- */
  const val = (v) => (has(v) ? esc(v) : PF.todo("À renseigner"));
  PF.mount("[data-homelab-machines]", machines.map((m, i) => `
    <article class="card blueprint machine-card reveal" id="eq-${esc(m.id)}" style="--d:${i * 0.06}s">${corners}
      <header class="machine-head">
        <div class="icon-frame">${icon(m.icon)}</div>
        <div><h3 class="card-title">${esc(m.name)}</h3><span class="level-label">${esc(m.type || "")}</span></div>
        <span class="status" data-status="${esc(m.id)}">Non supervisé</span>
      </header>
      <div class="machine-body">
        ${has(m.description) ? `<p class="card-body">${esc(m.description)}</p>` : ""}
        <dl class="spec">
          <dt>Fonction</dt><dd>${val(m.role)}</dd>
          <dt>Système</dt><dd>${val(m.os)}</dd>
          <dt>Services</dt><dd>${has(m.services) ? `<div class="tag-list">${m.services.map((s) => `<span class="tag tag-accent">${esc(s)}</span>`).join("")}</div>` : PF.todo("À renseigner")}</dd>
        </dl>
      </div>
    </article>`).join(""));

  /* ---------- Services hébergés (agrégés depuis les machines) ---------- */
  const services = machines.flatMap((m) => (m.services || []).map((s) => ({ s, host: m.name })));
  PF.mount("[data-homelab-services]", services.length
    ? `<table class="table"><thead><tr><th scope="col">Service</th><th scope="col">Hôte</th></tr></thead><tbody>${services.map((x) => `<tr><td>${esc(x.s)}</td><td>${esc(x.host)}</td></tr>`).join("")}</tbody></table>`
    : `<p class="empty-state">Aucun service renseigné — ajoutez-les dans <span class="mono">homelab.machines[].services</span>.</p>`);

  /* ---------- Projets d'administration ---------- */
  PF.mount("[data-homelab-admin]", (H.adminProjects || []).map((a, i) => `
    <article class="card blueprint is-interactive reveal" style="--d:${i * 0.05}s">${corners}
      <div class="icon-frame">${icon(a.icon)}</div>
      <h4 class="card-title">${esc(a.title)}</h4>
      ${has(a.description) ? `<p class="card-body">${esc(a.description)}</p>` : PF.todo("Description à compléter")}
    </article>`).join(""));

  /* ---------- Supervision ---------- */
  const panel = document.querySelector("[data-monitor-panel]");
  const setPanel = (html) => { if (panel) panel.innerHTML = `${corners}${html}`; };
  if (!has(H.monitoringApi)) {
    setPanel(`<span class="status">Supervision non connectée</span><span class="text-muted">Aucune API de monitoring configurée : aucun état en temps réel n'est affiché.</span>`);
    return;
  }
  setPanel(`<span class="status">Connexion à l'API…</span>`);
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), 8000);
  fetch(H.monitoringApi, { signal: ctrl.signal, headers: { Accept: "application/json" } })
    .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then((rows) => {
      if (!Array.isArray(rows)) throw new Error("Format inattendu");
      rows.forEach(({ id, status }) => {
        const el = document.querySelector(`[data-status="${CSS.escape(String(id))}"]`);
        if (!el) return;
        const up = status === "up";
        el.className = `status ${up ? "is-up" : "is-down"}`;
        el.textContent = up ? "En ligne" : "Hors ligne";
      });
      setPanel(`<span class="status is-up">Supervision connectée</span><span class="text-muted">Dernière mise à jour : ${new Date().toLocaleTimeString("fr-FR")}</span>`);
    })
    .catch((err) => setPanel(`<span class="status is-down">API injoignable</span><span class="text-muted">${esc(err.message)} — aucun état affiché.</span>`));
})();
