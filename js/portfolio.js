/* ==========================================================================
   PORTFOLIO.JS
   Rendert portfolio-, categorie- en fotodetailpagina's op basis van data.js.
   Fotogalerijen laden per rij: links en rechts starten samen en worden pas
   zichtbaar zodra beide afbeeldingen van die rij klaar zijn.
   ========================================================================== */

function getParam(naam){
  return new URLSearchParams(window.location.search).get(naam);
}

document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     1) PORTFOLIO-OVERZICHT (/portfolio/)
     ============================================================ */
  const catGrid = document.querySelector("[data-cat-grid]");
  if (catGrid){
    catGrid.innerHTML = CATEGORIEEN.map(cat => `
      <article class="cat-card foto-beschermd">
        <img class="foto-beschermd" src="${cat.cover}" alt="${cat.naam}" loading="lazy" draggable="false">
        <div class="label">
          <span class="eyebrow">${fotosVanCategorie(cat.slug).length} foto's</span>
          <h3><a href="../categorie/?cat=${cat.slug}">${cat.naam}</a></h3>
        </div>
      </article>
    `).join("");
  }

  /* ============================================================
     2) CATEGORIEPAGINA (/categorie/)
     ============================================================ */
  const fotoGrid = document.querySelector("[data-foto-grid]");
  if (fotoGrid){
    const slug = getParam("cat");
    const categorie = vindCategorie(slug) || CATEGORIEEN[0];
    const fotos = fotosVanCategorie(categorie.slug);
    const catNaam = document.querySelector("[data-cat-naam]");
    if (catNaam) catNaam.textContent = categorie.naam;
    document.title = `${categorie.naam} — Portfolio`;

    const kaartHtml = (f, index) => {
      const afmetingen = (f.breedte && f.hoogte)
        ? ` width="${f.breedte}" height="${f.hoogte}"`
        : "";
      const beschermd = f.dier === true;
      const kaartTag = beschermd ? "div" : "a";
      const kaartAttributen = beschermd
        ? 'class="photo-card foto-beschermd"'
        : `class="photo-card" href="../foto/?id=${f.id}"`;
      return `
        <${kaartTag} ${kaartAttributen} data-foto-id="${f.id}">
          <img ${beschermd ? 'class="foto-beschermd"' : ""} data-src="${f.afbeelding}" alt="${f.titel}"${afmetingen} loading="eager" decoding="async" draggable="false">
          <div class="titel-strip">${f.titel}</div>
        </${kaartTag}>
      `;
    };

    // Elke visuele rij bevat links en rechts één foto. Beide foto's starten
    // samen en verschijnen samen; daarna komt pas de volgende rij aan de beurt.
    const rijen = [];
    for (let i = 0; i < fotos.length; i += 2){
      rijen.push(fotos.slice(i, i + 2));
    }
    fotoGrid.innerHTML = rijen.map((rij, rijIndex) => `
      <div class="photo-row" data-photo-row data-row-index="${rijIndex}">
        ${rij.map((foto, fotoIndex) => kaartHtml(foto, rijIndex * 2 + fotoIndex)).join("")}
      </div>
    `).join("");

    const fotoRijen = Array.from(fotoGrid.querySelectorAll("[data-photo-row]"));
    let rijActief = false;
    const wachtrij = [];

    // Laad de afbeeldingen van één rij parallel en wacht ook op decode().
    function laadAfbeelding(afbeelding){
      if (afbeelding.dataset.loaded === "true") return Promise.resolve();
      const bron = afbeelding.dataset.src;
      if (!bron){
        afbeelding.dataset.loaded = "true";
        return Promise.resolve();
      }

      return new Promise(resolve => {
        let afgehandeld = false;
        const klaar = async () => {
          if (afgehandeld) return;
          afgehandeld = true;
          afbeelding.removeEventListener("load", klaar);
          afbeelding.removeEventListener("error", klaar);
          if (afbeelding.naturalWidth > 0 && typeof afbeelding.decode === "function"){
            try { await afbeelding.decode(); } catch (error) { /* toon ook bij decode-fout */ }
          }
          afbeelding.dataset.loaded = "true";
          resolve();
        };

        afbeelding.addEventListener("load", klaar, { once: true });
        afbeelding.addEventListener("error", klaar, { once: true });
        afbeelding.src = bron;
        if (afbeelding.complete) klaar();
      });
    }

    async function laadRij(rij){
      const kaarten = Array.from(rij.querySelectorAll(".photo-card"));
      const afbeeldingen = kaarten.map(kaart => kaart.querySelector("img")).filter(Boolean);
      afbeeldingen.forEach(afbeelding => {
        afbeelding.fetchPriority = rij.dataset.rowIndex === "0" ? "high" : "low";
      });

      // Promise.all zorgt ervoor dat links én rechts pas zichtbaar worden
      // wanneer beide foto's geladen en decodeerbaar zijn.
      await Promise.all(afbeeldingen.map(laadAfbeelding));
      requestAnimationFrame(() => {
        kaarten.forEach(kaart => kaart.classList.add("is-visible"));
      });
    }

    async function verwerkWachtrij(){
      if (rijActief || wachtrij.length === 0) return;
      rijActief = true;
      const volgendeRij = wachtrij.shift();
      await laadRij(volgendeRij);
      rijActief = false;
      verwerkWachtrij();
    }

    if ("IntersectionObserver" in window){
      fotoGrid.classList.add("has-reveal");
      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          currentObserver.unobserve(entry.target);
          if (!wachtrij.includes(entry.target)){
            wachtrij.push(entry.target);
            wachtrij.sort((a, b) => Number(a.dataset.rowIndex) - Number(b.dataset.rowIndex));
          }
        });
        verwerkWachtrij();
      }, {
        rootMargin: "0px 0px 220px 0px",
        threshold: 0.01
      });

      fotoRijen.forEach(rij => observer.observe(rij));
    } else {
      // Fallback voor oudere browsers: laad de rijen nog steeds op volgorde.
      (async () => {
        for (const rij of fotoRijen) await laadRij(rij);
      })();
    }
  }

  /* ============================================================
     3) FOTODETAILPAGINA (/foto/)
     ============================================================ */
  const detailWrap = document.querySelector("[data-foto-detail]");
  if (detailWrap){
    const foto = vindFoto(getParam("id")) || FOTOS[0];
    const categorieSlug = categorieVanFoto(foto);
    const categorie = vindCategorie(categorieSlug);
    document.title = `${foto.titel} — Portfolio`;

    const beschermd = foto.dier === true;
    detailWrap.innerHTML = `
      <div class="foto-groot ${beschermd ? "foto-beschermd" : ""}">
        <img ${beschermd ? 'class="foto-beschermd"' : ""} src="${foto.afbeelding}" alt="${foto.titel}"
             ${foto.breedte && foto.hoogte ? `width="${foto.breedte}" height="${foto.hoogte}"` : ""}
             loading="eager" fetchpriority="high" decoding="async" draggable="false">
      </div>
      <div class="foto-info">
        <a class="terug" href="../categorie/?cat=${categorieSlug}">&larr; Terug naar ${categorie ? categorie.naam : "portfolio"}</a>
        <h1>${categorie ? categorie.naam : "Portfolio"}</h1>
        <p class="beschrijving">${foto.beschrijving}</p>
      </div>
    `;
  }

});
