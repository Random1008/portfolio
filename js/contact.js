/* =====================================================================
   contact.js — canaux de contact et formulaire.
   - contact.formEndpoint renseigné : envoi réel en POST (FormData),
     succès affiché uniquement si le service répond OK.
   - Sinon : aucun envoi n'est simulé ; le visiteur peut ouvrir sa
     messagerie (si un email est configuré) ou copier son message.
   ===================================================================== */
(function () {
  "use strict";
  const PF = window.PF; if (!PF) return;
  const { esc, icon, corners, has } = PF;
  const C = PF.data.contact || {};

  /* ---------- Canaux ---------- */
  const channels = [
    has(C.email) ? { label: "Email", icon: "mail", url: `mailto:${C.email}`, shown: C.email } : null,
    ...(C.links || []).filter((l) => has(l.url)).map((l) => ({ ...l, shown: l.url.replace(/^https?:\/\/(www\.)?/, "") }))
  ].filter(Boolean);
  PF.mount("[data-contact-channels]", channels.length
    ? channels.map((c) => `
        <a class="channel blueprint" href="${esc(c.url)}" ${c.url.startsWith("mailto:") ? "" : 'target="_blank" rel="noopener"'}>${corners}
          ${icon(c.icon || "link", 22)}<span><strong>${esc(c.label)}</strong><span>${esc(c.shown)}</span></span>${icon("arrow-right", 16)}
        </a>`).join("")
    : `<p class="empty-state">Coordonnées à renseigner dans <span class="mono">js/data.js</span> (contact.email, contact.links).</p>`);

  /* ---------- Formulaire ---------- */
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = form.querySelector("[data-form-status]");
  const submit = form.querySelector("[type=submit]");
  const note = form.querySelector("[data-form-note]");
  if (note) note.textContent = has(C.formEndpoint)
    ? "Les messages sont transmis via le service d'envoi configuré."
    : "Aucun service d'envoi n'est configuré : une alternative vous sera proposée.";

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Indiquez votre nom."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Adresse email invalide."),
    subject: (v) => (v.trim().length >= 2 ? "" : "Indiquez un sujet."),
    message: (v) => (v.trim().length >= 10 ? "" : "Votre message doit contenir au moins 10 caractères.")
  };
  const check = (input) => {
    const msg = rules[input.name]?.(input.value) || "";
    input.setAttribute("aria-invalid", String(!!msg));
    const err = document.getElementById(`${input.id}-error`);
    if (err) err.textContent = msg;
    return !msg;
  };
  Object.keys(rules).forEach((n) => {
    const el = form.elements[n];
    el?.addEventListener("blur", () => check(el));
    el?.addEventListener("input", () => el.getAttribute("aria-invalid") === "true" && check(el));
  });

  const show = (html, ok = false) => {
    status.hidden = false;
    status.classList.toggle("is-success", ok);
    status.innerHTML = html;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputs = Object.keys(rules).map((n) => form.elements[n]);
    const valid = inputs.map(check).every(Boolean);
    if (!valid) { inputs.find((i) => i.getAttribute("aria-invalid") === "true")?.focus(); return; }
    const data = Object.fromEntries(new FormData(form));

    if (!has(C.formEndpoint)) {
      const body = `${data.message}\n\n— ${data.name} (${data.email})`;
      const mailto = has(C.email) ? `mailto:${C.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}` : "";
      show(`
        <strong>Votre message n'a pas été envoyé.</strong>
        <span>Aucun service d'envoi n'est configuré sur ce site. ${mailto ? "Vous pouvez l'envoyer depuis votre messagerie :" : "Copiez votre message et utilisez l'un des canaux de contact."}</span>
        <div class="form-footer">
          ${mailto ? `<a class="btn btn-primary blueprint" href="${esc(mailto)}">${corners}${icon("mail", 16)}Ouvrir ma messagerie</a>` : ""}
          <button class="btn btn-secondary" type="button" data-copy>${icon("copy", 16)}Copier le message</button>
        </div>`);
      status.querySelector("[data-copy]").addEventListener("click", async (ev) => {
        const txt = `Sujet : ${data.subject}\n\n${body}`;
        try { await navigator.clipboard.writeText(txt); ev.currentTarget.lastChild.textContent = "Message copié"; }
        catch { ev.currentTarget.lastChild.textContent = "Copie impossible — sélectionnez le texte manuellement"; }
      });
      return;
    }

    submit.disabled = true;
    const label = submit.innerHTML;
    submit.innerHTML = `${corners}Envoi en cours…`;
    try {
      const res = await fetch(C.formEndpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`Le service a répondu ${res.status}`);
      form.reset();
      show(`<strong>Message envoyé.</strong><span>Merci, je vous répondrai dès que possible.</span>`, true);
    } catch (err) {
      show(`<strong>L'envoi a échoué.</strong><span>${esc(err.message || "Erreur réseau")}. Votre message n'a pas été transmis : réessayez ou utilisez un autre canal.</span>`);
    } finally {
      submit.disabled = false;
      submit.innerHTML = label;
    }
  });
})();
