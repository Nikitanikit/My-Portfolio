(() => {
  const nav = document.querySelector(".nav-links");
  const menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }));
  }

  const fillFromApi = async () => {
    try {
      const response = await fetch("/api/portfolio");
      if (!response.ok) throw new Error(`Portfolio API returned ${response.status}`);
      const data = await response.json();
      const status = document.querySelector("#status-label");
      const description = document.querySelector("#hero-description");
      if (status && data.statusLabel) status.textContent = data.statusLabel;
      if (description && data.description) description.textContent = data.description;
    } catch (error) {
      // Static fallback copy is already present, so the hero remains usable if API access fails.
      console.info("Using built-in portfolio content.", error);
    }
  };
  fillFromApi();

  const initAboutAtmosphere = () => {
    const section = document.querySelector("#about");
    const atmosphere = section?.querySelector(".about-atmosphere");
    if (!section || !atmosphere) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(entries => {
        entries.forEach(entry => atmosphere.classList.toggle("is-offscreen", !entry.isIntersecting));
      }, { threshold: 0.05 })
      : null;

    if (observer) observer.observe(atmosphere);

    if (reduceMotion || !finePointer) return;

    section.addEventListener("pointermove", event => {
      const bounds = section.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      atmosphere.style.setProperty("--about-tilt-x", `${(x - 0.5) * 12}deg`);
      atmosphere.style.setProperty("--about-tilt-y", `${(0.5 - y) * 8}deg`);
      atmosphere.style.setProperty("--about-light-x", `${Math.round(x * 100)}%`);
      atmosphere.style.setProperty("--about-light-y", `${Math.round(y * 100)}%`);
    }, { passive: true });

    section.addEventListener("pointerleave", () => {
      atmosphere.style.setProperty("--about-tilt-x", "0deg");
      atmosphere.style.setProperty("--about-tilt-y", "0deg");
      atmosphere.style.setProperty("--about-light-x", "50%");
      atmosphere.style.setProperty("--about-light-y", "50%");
    });
  };

  const initSkillInteractions = () => {
    const cards = document.querySelectorAll(".skill-card");
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(entries => {
        entries.forEach(entry => entry.target.classList.toggle("is-visible", entry.isIntersecting));
      }, { rootMargin: "100px 0px", threshold: 0.01 })
      : null;

    cards.forEach(card => {
      observer ? observer.observe(card) : card.classList.add("is-visible");
      const visual = card.querySelector(".skill-visual");
      const activate = () => {
        card.classList.add("is-active");
        visual?.classList.add("is-active");
      };
      const deactivate = () => {
        card.classList.remove("is-active");
        visual?.classList.remove("is-active");
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      };

      card.addEventListener("pointerenter", event => {
        if (event.pointerType !== "touch") activate();
      });
      card.addEventListener("pointermove", event => {
        if (event.pointerType === "touch" || !window.matchMedia("(pointer: fine)").matches) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", `${x * 5}deg`);
        card.style.setProperty("--tilt-y", `${y * -5}deg`);
      }, { passive: true });
      card.addEventListener("pointerleave", deactivate);
      card.addEventListener("focusin", activate);
      card.addEventListener("focusout", event => {
        if (!card.contains(event.relatedTarget)) deactivate();
      });
    });

    document.addEventListener("visibilitychange", () => {
      document.body.classList.toggle("page-hidden", document.hidden);
    });
  };

  const initAnimations = () => {
    initAboutAtmosphere();
    initSkillInteractions();
    if (!window.gsap) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document.querySelectorAll(".hero-reveal, .section-reveal").forEach(el => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    gsap.set(".hero-reveal", { opacity: 0, y: 22 });
    gsap.set(".section-reveal", { opacity: 0, y: 28 });
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro.to(".hero-reveal", { opacity: 1, y: 0, duration: 0.8, stagger: 0.09, clearProps: "transform" }, 0.15);
    intro.from(".hero-art", { opacity: 0, scale: 0.92, duration: 1.15, ease: "power2.out" }, 0.35);
    intro.from(".floating-tag", { opacity: 0, y: 14, duration: 0.65, stagger: 0.14 }, 0.8);

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray(".section-reveal").forEach((element) => {
        gsap.to(element, {
          opacity: 1, y: 0, duration: 0.85, ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true }
        });
      });
      gsap.from(".skill-card", {
        opacity: 0, y: 28, duration: 0.7, stagger: 0.075, ease: "power3.out",
        scrollTrigger: { trigger: ".skill-grid", start: "top 86%", once: true }
      });
      gsap.from(".project-window", {
        opacity: 0, y: 35, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".project-window", start: "top 85%", once: true }
      });
    }

  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAnimations, { once: true });
  } else {
    initAnimations();
  }
})();
