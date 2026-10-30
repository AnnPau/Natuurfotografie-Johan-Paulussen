/* ==========================================================================
   MAIN.JS — gedeeld op elke pagina
   - navigatiebalk die van transparant naar effen kleurt bij scrollen
   - mega-menu onder "Portfolio" gevuld met de categorieën uit data.js
   - mobiel menu open/dicht
   - hero-slideshow op de homepagina
   - scroll-reveal animatie voor de horizontale "bars" op de homepagina
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------- navigatiebalk kleurt bij scrollen -----------------
     Alleen op pagina's mét een fullscreen hero (nu enkel de homepage)
     start de balk transparant en wordt ze pas effen bij scrollen. Op
     alle andere pagina's (die geen donkere hero hebben om overheen te
     zweven) staat de balk altijd effen, anders is de witte tekst
     onleesbaar op een lichte pagina-achtergrond. */
  const nav = document.querySelector(".site-nav");
  const hero = document.querySelector(".hero");
  if (nav){
    if (hero){
      const updateNav = () => {
        if (window.scrollY > 40) nav.classList.add("is-scrolled");
        else nav.classList.remove("is-scrolled");
      };
      updateNav();
      window.addEventListener("scroll", updateNav, { passive: true });
    } else {
      nav.classList.add("is-scrolled");
    }
  }

  /* ---------------- mini-menu vullen met categorienamen ----------------
     Bewust enkel tekst, geen foto's: de bezoeker kiest hier snel een
     categorie. Foto's verschijnen pas op de portfolio-pagina zelf. */
  const megaMenu = document.querySelector("[data-mega-menu]");
  if (megaMenu && typeof CATEGORIEEN !== "undefined"){
    // Op de homepage (met hero) staat deze pagina op het hoogste niveau,
    // op alle andere pagina's een niveau dieper (bv. /portfolio/) —
    // vandaar het pad hieronder aangepast aan waar we ons bevinden.
    const megaMenuBasis = hero ? "categorie/" : "../categorie/";
    megaMenu.innerHTML = CATEGORIEEN.map(cat => `
      <a href="${megaMenuBasis}?cat=${cat.slug}">${cat.naam}</a>
    `).join("");
  }

  /* ---------------- mobiel menu ---------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks){
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen);
      navToggle.setAttribute("aria-label", isOpen ? "Sluit menu" : "Menu");
      navToggle.textContent = isOpen ? "✕" : "☰";
      document.body.classList.toggle("nav-open", isOpen);
    });
  }

  /* ---------------- hero-slideshow ----------------
     De eerste foto wordt meteen geladen (en staat als preload in de <head>).
     De overige foto's worden pas opgehaald wanneer ze bijna aan de beurt zijn.
     Zo worden niet alle grote slideshowfoto's tegelijk gedownload. */
  const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
  const heroDotsWrap = document.querySelector(".hero-dots");
  if (heroSlides.length){
    let huidige = 0;
    let timer = null;
    let wijziging = 0;

    if (heroDotsWrap){
      heroDotsWrap.innerHTML = heroSlides.map((_, i) =>
        `<button aria-label="Toon foto ${i + 1}" class="${i === 0 ? "is-active" : ""}"></button>`
      ).join("");
    }
    const dots = heroDotsWrap ? heroDotsWrap.querySelectorAll("button") : [];

    const laadSlide = (index) => {
      const slide = heroSlides[index];
      if (slide.dataset.loaded === "true") return Promise.resolve(true);
      if (slide.imagePromise) return slide.imagePromise;

      const afbeelding = slide.dataset.bg;
      if (!afbeelding) return Promise.resolve(false);

      slide.imagePromise = new Promise((resolve) => {
        const image = new Image();
        image.decoding = "async";
        image.fetchPriority = index === 0 ? "high" : "low";
        image.onload = () => {
          slide.style.backgroundImage = `url("${afbeelding}")`;
          slide.dataset.loaded = "true";
          resolve(true);
        };
        image.onerror = () => {
          delete slide.imagePromise;
          resolve(false);
        };
        image.src = afbeelding;
      });

      return slide.imagePromise;
    };

    const toonSlide = async (index) => {
      const huidigeWijziging = ++wijziging;
      const geladen = await laadSlide(index);
      if (!geladen || huidigeWijziging !== wijziging) return;

      heroSlides[huidige].classList.remove("is-active");
      dots[huidige]?.classList.remove("is-active");
      huidige = index;
      heroSlides[huidige].classList.add("is-active");
      dots[huidige]?.classList.add("is-active");

      // Haal alvast alleen de volgende foto op voor een vloeiende overgang.
      laadSlide((huidige + 1) % heroSlides.length);
    };

    const planVolgendeSlide = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await toonSlide((huidige + 1) % heroSlides.length);
        planVolgendeSlide();
      }, 6000);
    };

    dots.forEach((dot, i) => {
      dot.addEventListener("click", async () => {
        clearTimeout(timer);
        await toonSlide(i);
        planVolgendeSlide();
      });
    });

    toonSlide(0).then(planVolgendeSlide);
  }

  /* ---------------- scroll-reveal voor de horizontale bars ---------------- */
  const bars = document.querySelectorAll(".bar");
  if (bars.length){
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    bars.forEach(bar => observer.observe(bar));
  }

});
