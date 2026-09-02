/* ==========================================================================
   DATA.JS
   Dit is het ENIGE bestand dat je moet aanpassen om nieuwe foto's op de
   website te zetten. Alle pagina's (portfolio, categoriepagina's,
   fotodetail) lezen automatisch uit de lijst FOTOS hieronder.

   WERKWIJZE OM EEN NIEUWE FOTO TOE TE VOEGEN:
   1. Zet je foto in de submap van /images/portfolio/ die overeenkomt met
      de juiste categorie, bv. images/portfolio/afrika/leeuw.jpg. De
      submapnaam moet exact overeenkomen met een 'slug' uit CATEGORIEEN
      hieronder (europa, afrika, noordamerika, middenamerika,
      zuidamerika, azie, antarctica) — de categorie van een foto wordt
      hieraan automatisch herkend, je hoeft dit dus nergens apart in te
      vullen.
   2. Kopieer hieronder één object uit FOTOS als voorbeeld, plak het in
      de lijst en pas id, titel, afbeelding en beschrijving aan.
   3. De VOLGORDE waarin de foto's hieronder staan bepaalt ook de
      volgorde waarin ze getoond worden — zowel op de pagina "Alle
      foto's" als binnen elke categoriepagina. Wil je een foto vooraan
      of tussen twee andere tonen, verplaats dan gewoon het hele object
      naar de juiste plek in de lijst.
   4. Klaar — de foto verschijnt automatisch op de portfolio-pagina en op
      de juiste categoriepagina.
   ========================================================================== */

/* --------------------------------------------------------------------
   CATEGORIEEN
   slug   : gebruikt in de URL (bv. /categorie/?cat=europa) én als naam
            van de submap in /images/portfolio/ waarin de foto's van
            die categorie moeten staan
   naam   : weergavenaam
   cover  : afbeelding gebruikt als omslagfoto in het overzicht en menu
   -------------------------------------------------------------------- */
const CATEGORIEEN = [
  {
    slug: "europa",
    naam: "Europa",
    cover: "../images/cover-europa.jpg"
  },
  {
    slug: "afrika",
    naam: "Afrika",
    cover: "../images/cover-afrika.jpg"
  },
  {
    slug: "noordamerika",
    naam: "Noord-Amerika",
    cover: "../images/cover-noordamerika.jpg"
  },
  {
    slug: "middenamerika",
    naam: "Midden-Amerika",
    cover: "../images/cover-middenamerika.jpg"
  },
  {
    slug: "zuidamerika",
    naam: "Zuid-Amerika",
    cover: "../images/cover-zuidamerika.jpg"
  },
  {
    slug: "azie",
    naam: "Azië",
    cover: "../images/cover-azie.jpg"
  },
  {
    slug: "antarctica",
    naam: "Antarctica & Subantarctische eilanden",
    cover: "../images/cover-antarctica.jpg"
  }
];

/* --------------------------------------------------------------------
   FOTOS
   id           : unieke code, alleen kleine letters/cijfers/streepjes,
                  wordt gebruikt in de URL van de fotopagina
   titel        : titel die overal getoond wordt
   afbeelding   : pad naar de volledige foto — moet in de submap staan
                  van images/portfolio/ die overeenkomt met de
                  categorie (fotodetail + portfolio-grid)
   beschrijving : kort tekstblokje op de fotodetailpagina
   -------------------------------------------------------------------- */
const FOTOS = [

  // ===== VOORBEELD — kopieer dit blok om een nieuwe foto toe te voegen =====
  {
    id: "bat_eared_fox",
    titel: "Bat eared fox",
    afbeelding: "../images/portfolio/afrika/bat_eared_fox.webp",
    beschrijving: "Typ hier je tekst...",
  },
  // ===== nieuwe foto's hieronder toevoegen (komma tussen elk object!) =====

];

/* --------------------------------------------------------------------
   Hulpfuncties — gebruikt door portfolio.js, hoeft u niet aan te passen
   -------------------------------------------------------------------- */

// Virtuele categorie "alle foto's" — geen echte categorie uit de lijst
// hierboven, maar wordt gebruikt door de knop "Alle foto's" op de
// portfolio-pagina om alle foto's samen te tonen.
const ALLE_FOTOS_SLUG = "alle";

// Leidt de categorie van een foto af uit haar pad: de submap net na
// "portfolio/" in het afbeeldingspad, bv.
// "../images/portfolio/afrika/leeuw.jpg" -> "afrika".
function categorieVanFoto(foto){
  const match = foto.afbeelding.match(/portfolio\/([^/]+)\//);
  return match ? match[1] : null;
}

function vindCategorie(slug){
  if (slug === ALLE_FOTOS_SLUG) return { slug: ALLE_FOTOS_SLUG, naam: "Alle foto's" };
  return CATEGORIEEN.find(c => c.slug === slug);
}

// Foto's van een categorie, in dezelfde volgorde als hierboven in FOTOS.
function fotosVanCategorie(slug){
  if (slug === ALLE_FOTOS_SLUG) return FOTOS;
  return FOTOS.filter(f => categorieVanFoto(f) === slug);
}

function vindFoto(id){
  return FOTOS.find(f => f.id === id);
}

function coverFotoVoorCategorie(slug){
  const fotos = fotosVanCategorie(slug);
  return fotos.length ? fotos[0].afbeelding : "";
}
