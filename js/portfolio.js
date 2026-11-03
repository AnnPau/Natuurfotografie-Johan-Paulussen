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
        <${kaartTag} ${kaartAttributen} data-foto-id="${f.id}" data-row-index="${Math.floor(index / 2)}">
          <img ${beschermd ? 'class="foto-beschermd"' : ""} data-src="${f.afbeelding}" alt="${f.titel}"${afmetingen} loading="eager" decoding="async" draggable="false">
          <div class="titel-strip">${f.titel}</div>
        </${kaartTag}>
      `;
    };

    // De kaarten blijven rechtstreeks in de oorspronkelijke CSS-grid staan:
    // twee kolommen op desktop, zonder extra rij-elementen die de opmaak wijzigen.
    fotoGrid.innerHTML = fotos.map((foto, index) => kaartHtml(foto, index)).join("");

    const kaarten = Array.from(fotoGrid.querySelectorAll(".photo-card"));
    const rijen = [];
    for (let i = 0; i < kaarten.length; i += 2){
      rijen.push({ index: Math.floor(i / 2), kaarten: kaarten.slice(i, i + 2) });
    }

    let rijActief = false;
    const wachtrij = [];
    const ingeplandeRijen = new Set();

    // Laad beide afbeeldingen van een rij parallel en wacht op decode().
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
      const afbeeldingen = rij.kaarten
        .map(kaart => kaart.querySelector("img"))
        .filter(Boolean);
      afbeeldingen.forEach(afbeelding => {
        afbeelding.fetchPriority = rij.index === 0 ? "high" : "low";
      });

      // De twee foto's starten samen en worden pas samen zichtbaar als beide klaar zijn.
      await Promise.all(afbeeldingen.map(laadAfbeelding));
      requestAnimationFrame(() => {
        rij.kaarten.forEach(kaart => kaart.classList.add("is-visible"));
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
          const kaart = entry.target;
          currentObserver.unobserve(kaart);
          const rijIndex = Number(kaart.dataset.rowIndex);
          if (ingeplandeRijen.has(rijIndex)) return;

          ingeplandeRijen.add(rijIndex);
          const rij = rijen[rijIndex];
          if (rij){
            wachtrij.push(rij);
            wachtrij.sort((a, b) => a.index - b.index);
          }
        });
        verwerkWachtrij();
      }, {
        rootMargin: "0px 0px 220px 0px",
        threshold: 0.01
      });

      // Eén kaart per rij observeren volstaat: de tweede staat op dezelfde gridrij.
      rijen.forEach(rij => {
        const eersteKaart = rij.kaarten[0];
        if (eersteKaart) observer.observe(eersteKaart);
      });
    } else {
      // Fallback voor oudere browsers: laad de fotoparen nog steeds samen.
      (async () => {
        for (const rij of rijen) await laadRij(rij);
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
