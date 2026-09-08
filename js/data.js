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
    cover: "../images/cover_europa.jpg"
  },
  {
    slug: "afrika",
    naam: "Afrika",
    cover: "../images/cover_afrika.webp"
  },
  {
    slug: "noord-amerika",
    naam: "Noord-Amerika",
    cover: "../images/cover_noord-amerika.jpg"
  },
  {
    slug: "midden-amerika",
    naam: "Midden-Amerika",
    cover: "../images/cover_midden-amerika.jpg"
  },
  {
    slug: "zuid-amerika",
    naam: "Zuid-Amerika",
    cover: "../images/cover_zuid-amerika.webp"
  },
  {
    slug: "azie",
    naam: "Azië",
    cover: "../images/cover_azie.jpg"
  },
  {
    slug: "antarctica",
    naam: "Antarctica & Subantarctische eilanden",
    cover: "../images/cover_antarctica.jpg"
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
   breedte,
   hoogte       : (optioneel, in pixels) de afmetingen van de foto, bv.
                  1600 x 1067. Hiermee reserveert de categoriepagina op
                  voorhand precies de juiste ruimte (het grijze vlak)
                  voor de foto, zodat de pagina niet verspringt terwijl
                  de foto's inladen. Laat je dit weg, dan blijft alles
                  gewoon werken, maar kan de pagina een klein beetje
                  verschuiven zodra die foto ingeladen is.
   beschrijving : kort tekstblokje op de fotodetailpagina
   -------------------------------------------------------------------- */
const FOTOS = [

  // ===== VOORBEELD — kopieer dit blok om een nieuwe foto toe te voegen =====
  {
    id: "bat_eared_fox",
    titel: "Bat eared fox",
    afbeelding: "../images/portfolio/afrika/bat_eared_fox.webp",
    breedte: 1800,
    hoogte: 1200,
    beschrijving: "Typ hier je tekst...",
  },
  {
    id: "buffel1",
    titel: "Buffel 1",
    afbeelding: "../images/portfolio/afrika/buffel1.webp",
    breedte: 1800,
    hoogte: 1200,
    beschrijving: "Typ hier je tekst...",
  },
  {
    id: "buffel2",
    titel: "Buffel 2",
    afbeelding: "../images/portfolio/afrika/buffel2.webp",
    breedte: 1800,
    hoogte: 1200,
    beschrijving: "Typ hier je tekst...",
  },
  {
    id: "gnoemigration",
    titel: "Gnoe migration",
    afbeelding: "../images/portfolio/afrika/gnoemigration.webp",
    breedte: 1800,
    hoogte: 1200,
    beschrijving: "Typ hier je tekst...",
  },
  {
    id: "meerkat",
    titel: "Meerkat",
    afbeelding: "../images/portfolio/afrika/meerkat.webp",
    breedte: 1800,
    hoogte: 1200,
    beschrijving: "Typ hier je tekst...",
  },
  {
    id: "zebra",
    titel: "Zebra",
    afbeelding: "../images/portfolio/afrika/zebra.webp",
    breedte: 1800,
    hoogte: 1200,
    beschrijving: "Typ hier je tekst...",
  },
  {
    id: "capibara",
    titel: "Capibara",
    afbeelding: "../images/portfolio/zuid-amerika/capibara.webp",
    breedte: 1800,
    hoogte: 1200,
    beschrijving: "Typ hier je tekst...",
  },
  {
    id: "culpeo",
    titel: "Culpeo",
    afbeelding: "../images/portfolio/zuid-amerika/culpeo.webp",
    breedte: 1800,
    hoogte: 1200,
    beschrijving: "Typ hier je tekst...",
  },
  {
    id: "emperor_tamarin",
    titel: "Emperor tamarin",
    afbeelding: "../images/portfolio/zuid-amerika/emperor_tamarin.webp",
    breedte: 1800,
    hoogte: 1200,
    beschrijving: "Typ hier je tekst...",
  },
  {
    id: "guanaco",
    titel: "Guanaco",
    afbeelding: "../images/portfolio/zuid-amerika/guanaco.webp",
    breedte: 1800,
    hoogte: 1200,
    beschrijving: "Typ hier je tekst...",
  },
  {
    id: "jaguar1",
    titel: "Jaguar 1",
    afbeelding: "../images/portfolio/zuid-amerika/jaguar1.webp",
    breedte: 1800,
    hoogte: 1200,
    beschrijving: "Typ hier je tekst...",
  },
  {
    id: "jaguar2",
    titel: "Jaguar 2",
    afbeelding: "../images/portfolio/zuid-amerika/jaguar2.webp",
    breedte: 1800,
    hoogte: 1200,
    beschrijving: "Typ hier je tekst...",
  },
  {
    id: "puma",
    titel: "Puma",
    afbeelding: "../images/portfolio/zuid-amerika/puma.webp",
    breedte: 1800,
    hoogte: 1200,
    beschrijving: "Typ hier je tekst...",
  },
  {
    id: "reuzenotter",
    titel: "Reuzenotter",
    afbeelding: "../images/portfolio/zuid-amerika/reuzenotter.webp",
    breedte: 1800,
    hoogte: 1200,
    beschrijving: "Typ hier je tekst...",
  }

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
