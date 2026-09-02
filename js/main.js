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
    megaMenu.innerHTML = CATEGORIEEN.map(cat => `
      <a href=".;/categorie/?cat=${cat.slug}">${cat.naam}</a>
    `).join("");
  }

  /* ---------------- mobiel menu ---------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks){
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", navLinks.classList.contains("open"));
    });
  }

  /* ---------------- hero-slideshow ---------------- */
  const heroSlides = document.querySelectorAll(".hero-slide");
  const heroDotsWrap = document.querySelector(".hero-dots");
  if (heroSlides.length){
    let huidige = 0;
    heroSlides[0].classList.add("is-active");

    if (heroDotsWrap){
      heroDotsWrap.innerHTML = Array.from(heroSlides).map((_, i) =>
        `<button aria-label="Toon foto ${i + 1}" class="${i === 0 ? "is-active" : ""}"></button>`
      ).join("");
    }
    const dots = heroDotsWrap ? heroDotsWrap.querySelectorAll("button") : [];

    const toonSlide = (index) => {
      heroSlides[huidige].classList.remove("is-active");
      dots[huidige]?.classList.remove("is-active");
      huidige = index;
      heroSlides[huidige].classList.add("is-active");
      dots[huidige]?.classList.add("is-active");
    };

    let timer = setInterval(() => toonSlide((huidige + 1) % heroSlides.length), 6000);

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        clearInterval(timer);
        toonSlide(i);
        timer = setInterval(() => toonSlide((huidige + 1) % heroSlides.length), 6000);
      });
    });
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
