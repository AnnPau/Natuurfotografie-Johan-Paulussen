/* ==========================================================================
   DATA.JS
   Dit is het ENIGE bestand dat je moet aanpassen om nieuwe foto's op de
   website te zetten. Alle pagina's (portfolio, categoriepagina's,
   fotodetail) lezen automatisch uit de lijsten hieronder.

   WERKWIJZE OM EEN NIEUWE FOTO TOE TE VOEGEN:
   1. Zet je foto (en eventueel een aparte, kleinere thumbnail) in de map
      /images.
   2. Kopieer hieronder één object uit CATEGORIEEN of FOTOS als voorbeeld,
      plak het in de lijst en pas de velden aan.
   3. Klaar — de foto verschijnt automatisch op de portfolio-pagina en op
      de juiste categoriepagina.
   ========================================================================== */

/* --------------------------------------------------------------------
   CATEGORIEEN
   slug   : gebruikt in de URL, bv. /categorie/?cat=landschappen
   naam   : weergavenaam
   cover  : afbeelding gebruikt als omslagfoto in het overzicht en menu
   -------------------------------------------------------------------- */
const CATEGORIEEN = [
  {
    slug: "europa",
    naam: "Europa",
    cover: "/images/cover-europa.jpg"
  },
  {
    slug: "afrika",
    naam: "Afrika",
    cover: "/images/cover-afrika.jpg"
  },
  {
    slug: "noordamerika",
    naam: "Noord-Amerika",
    cover: "/images/cover-noordamerika.jpg"
  },
  {
    slug: "middenamerika",
    naam: "Midden-Amerika",
    cover: "/images/cover-middenamerika.jpg"
  },
  {
    slug: "zuidamerika",
    naam: "Zuid-Amerika",
    cover: "/images/cover-zuidamerika.jpg"
  },
  {
    slug: "azie",
    naam: "Azië",
    cover: "/images/cover-azie.jpg"
  },
  {
    slug: "antarctica",
    naam: "Antarctica & Subantarctische eilanden",
    cover: "/images/cover-antarctica.jpg"
  }
];

/* --------------------------------------------------------------------
   FOTOS
   id           : unieke code, alleen kleine letters/cijfers/streepjes,
                  wordt gebruikt in de URL van de fotopagina
   titel        : titel die overal getoond wordt
   categorie    : moet exact overeenkomen met een 'slug' hierboven
   rank         : een getal (1, 2, 3, ...) dat de vaste volgorde bepaalt
                  waarin de foto's getoond worden — zowel binnen een
                  categorie als op de pagina "Alle foto's". Lager
                  getal = eerder getoond. Elk getal mag maar één keer
                  gebruikt worden; hou best een beetje ruimte tussen de
                  nummers (bv. 10, 20, 30, ...) zodat je later makkelijk
                  een nieuwe foto ertussen kan schuiven.
   afbeelding   : volledige foto (fotodetail + portfolio-grid)
   beschrijving : kort tekstblokje op de fotodetailpagina
   -------------------------------------------------------------------- */
const FOTOS = [

  // ===== VOORBEELD — kopieer dit blok om een nieuwe foto toe te voegen =====
  {
    id: "bat_eared_fox",
    rank: 1,
    titel: "Bat eared fox",
    categorie: "afrika",
    afbeelding: "/images/portfolio/afrika/bat_eared_fox.jpg",
    beschrijving: "Typ hier je tekst...",
  },

  {
    id: "aap02",
    rank: 2,
    titel: "Aap02",
    categorie: "zoogdieren",
    afbeelding: "/images/portfolio/aap02.jpg",
    beschrijving: "Typ hier je tekst...",
  },
   
  {
    id: "nijlpaard01",
    rank: 3,
    titel: "Nijlpaard01",
    categorie: "zoogdieren",
    afbeelding: "/images/portfolio/nijlpaard01.jpg",
    beschrijving: "Typ hier je tekst...",
  },
   
  {
    id: "pinguin01",
    rank: 4,
    titel: "Pinguïn01",
    categorie: "vogels",
    afbeelding: "/images/portfolio/pinguin01.jpg",
    beschrijving: "Typ hier je tekst...",
  },

  {
    id: "uil01",
    rank: 5,
    titel: "Uil01",
    categorie: "vogels",
    afbeelding: "/images/portfolio/uil01.jpg",
    beschrijving: "Typ hier je tekst...",
  },
   
  {
    id: "vlinder01",
    rank: 6,
    titel: "Vlinder01",
    categorie: "insecten",
    afbeelding: "/images/portfolio/vlinder01.jpg",
    beschrijving: "Typ hier je tekst...",
  },

  {
    id: "vogel01",
    rank: 7,
    titel: "Vogel01",
    categorie: "vogels",
    afbeelding: "/images/portfolio/vogel01.jpg",
    beschrijving: "Typ hier je tekst...",
  },
   
  {
    id: "vogel02",
    rank: 8,
    titel: "Vogel02",
    categorie: "vogels",
    afbeelding: "/images/portfolio/vogel02.jpg",
    beschrijving: "Typ hier je tekst...",
  },

  {
    id: "vogel03",
    rank: 9,
    titel: "Vogel03",
    categorie: "vogels",
    afbeelding: "/images/portfolio/vogel03.jpg",
    beschrijving: "Typ hier je tekst...",
  },

  {
    id: "vogel04",
    rank: 10,
    titel: "Vogel04",
    categorie: "vogels",
    afbeelding: "/images/portfolio/vogel04.jpg",
    beschrijving: "Typ hier je tekst...",
  },

  {
    id: "vogel05",
    rank: 11,
    titel: "Vogel05",
    categorie: "vogels",
    afbeelding: "/images/portfolio/vogel05.jpg",
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

function opVolgordeGesorteerd(lijst){
  return [...lijst].sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));
}
function vindCategorie(slug){
  if (slug === ALLE_FOTOS_SLUG) return { slug: ALLE_FOTOS_SLUG, naam: "Alle foto's" };
  return CATEGORIEEN.find(c => c.slug === slug);
}
function fotosVanCategorie(slug){
  if (slug === ALLE_FOTOS_SLUG) return opVolgordeGesorteerd(FOTOS);
  return opVolgordeGesorteerd(FOTOS.filter(f => f.categorie === slug));
}
function vindFoto(id){
  return FOTOS.find(f => f.id === id);
}
function coverFotoVoorCategorie(slug){
  const fotos = fotosVanCategorie(slug);
  return fotos.length ? fotos[0].afbeelding : "";
}
