/* ==========================================================================
   PORTFOLIO.JS
   Rendert drie soorten pagina's aan de hand van data.js:
   1) /portfolio/  → overzicht van alle categorieën
   2) /categorie/  → foto's van 1 categorie (?cat=slug)
   3) /foto/       → detail van 1 foto (?id=foto-id)
   Elk onderdeel controleert zelf of de bijbehorende HTML-elementen
   bestaan, zodat dit bestand overal veilig ingeladen kan worden.
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
      <a class="cat-card" href="../categorie/?cat=${cat.slug}">
        <img src="${cat.cover}" alt="${cat.naam}" loading="lazy">
        <div class="label">
          <span class="eyebrow">${fotosVanCategorie(cat.slug).length} foto's</span>
          <h3>${cat.naam}</h3>
        </div>
      </a>
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

    // titel & intro van de pagina invullen
    document.querySelectorAll("[data-cat-titel]").forEach(el => el.textContent = categorie.naam);
    document.title = `${categorie.naam} — Portfolio`;

    // Alleen de eerste rij wordt meteen ingeladen; de overige foto's laden
    // pas wanneer ze in de buurt van het zichtbare deel van de pagina komen.
    const AANTAL_DIRECT_INLADEN = 2;

    function renderGrid(){
      fotoGrid.innerHTML = fotos.map((f, i) => {
        // Met breedte/hoogte uit data.js reserveert de browser meteen de
        // juiste hoogte voor de foto (zichtbaar als het grijze vlak),
        // nog vóór de foto zelf geladen is — zo verspringt de pagina niet.
        const afmetingen = (f.breedte && f.hoogte)
          ? ` width="${f.breedte}" height="${f.hoogte}"`
          : "";
        const eager = i < AANTAL_DIRECT_INLADEN;
        const voorrang = i === 0 ? ' fetchpriority="high"' : "";
        return `
          <a class="photo-card" data-foto-id="${f.id}" href="../foto/?id=${f.id}">
            <img src="${f.afbeelding}" alt="${f.titel}"${afmetingen} loading="${eager ? "eager" : "lazy"}"${voorrang}>
            <div class="titel-strip">${f.titel}</div>
          </a>
        `;
      }).join("");
    }

    // Activeer de scroll-animatie alleen wanneer de browser dit ondersteunt.
    // Een kaart wordt pas zichtbaar zodra de afbeelding geladen en gedecodeerd is.
    if ("IntersectionObserver" in window){
      fotoGrid.classList.add("has-reveal");
      renderGrid();

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const kaart = entry.target;
          const afbeelding = kaart.querySelector("img");
          observer.unobserve(kaart);

          const toonKaart = () => kaart.classList.add("is-visible");
          const wachtOpAfbeelding = async () => {
            if (!afbeelding) {
              toonKaart();
              return;
            }

            // Wacht op de echte afbeelding, zodat geen leeg vlak animeert.
            if (!afbeelding.complete){
              await new Promise(resolve => {
                afbeelding.addEventListener("load", resolve, { once: true });
                afbeelding.addEventListener("error", resolve, { once: true });
              });
            }

            // decode() voorkomt dat de kaart verschijnt vóór de foto klaar is
            // om daadwerkelijk getoond te worden. Bij een fout tonen we ze toch.
            if (typeof afbeelding.decode === "function"){
              try { await afbeelding.decode(); } catch (error) { /* toon ook bij decode-fout */ }
            }
            toonKaart();
          };

          wachtOpAfbeelding();
        });
      }, {
        rootMargin: "0px 0px 120px 0px",
        threshold: 0.05
      });

      fotoGrid.querySelectorAll(".photo-card").forEach((kaart, index) => {
        // Kleine vertraging tussen kaarten geeft het scrollen een rustig ritme.
        kaart.style.setProperty("--reveal-delay", `${Math.min(index % 2, 1) * 90}ms`);
        revealObserver.observe(kaart);
      });
    } else {
      // Oudere browsers tonen de foto's gewoon zonder scroll-animatie.
      renderGrid();
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

    detailWrap.innerHTML = `
      <div class="foto-groot">
        <img src="${foto.afbeelding}" alt="${foto.titel}"
             ${foto.breedte && foto.hoogte ? `width="${foto.breedte}" height="${foto.hoogte}"` : ""}
             loading="eager" fetchpriority="high" decoding="async">
      </div>
      <div class="foto-info">
        <a class="terug" href="../categorie/?cat=${categorieSlug}">&larr; Terug naar ${categorie ? categorie.naam : "portfolio"}</a>
        <span class="eyebrow">${categorie ? categorie.naam : ""}</span>
        <h1>${foto.titel}</h1>
        <p class="beschrijving">${foto.beschrijving}</p>
      </div>
    `;
  }

});
