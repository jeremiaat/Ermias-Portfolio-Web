// Smooth scroll for navigation links
document.querySelectorAll("nav a, .hero-actions a, .btn").forEach(link => {
  if (link.hash && link.hash.startsWith("#") && link.pathname === window.location.pathname) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
          history.pushState(null, null, targetId);
        }
      }
    });
  }
});

// Intersection Observer for fade-in animations
const sections = document.querySelectorAll(".section");
const heroSection = document.querySelector(".hero");

const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -20px 0px"
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

sections.forEach(section => {
  section.style.opacity = "0";
  section.style.transform = "translateY(28px)";
  section.style.transition = "opacity 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.7s ease-out";
  fadeObserver.observe(section);
});

// Hero section fade-in
if (heroSection) {
  heroSection.style.opacity = "0";
  heroSection.style.transform = "translateY(18px)";
  heroSection.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  heroObserver.observe(heroSection);
}

// Active navigation highlight on scroll
const navLinks = document.querySelectorAll("nav a");
const allSections = Array.from(document.querySelectorAll("section[id]"));

function updateActiveNav() {
  let current = "";
  const scrollPos = window.scrollY + 150;
  allSections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    const href = link.getAttribute("href").substring(1);
    if (href === current) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", () => {
  requestAnimationFrame(updateActiveNav);
  const backBtn = document.getElementById("backToTopBtn");
  if (window.scrollY > 500) {
    backBtn.classList.add("show");
  } else {
    backBtn.classList.remove("show");
  }
});
updateActiveNav();

// Back to top button functionality
const backBtn = document.getElementById("backToTopBtn");
backBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Handle hash links on page load
if (window.location.hash) {
  const target = document.querySelector(window.location.hash);
  if (target) {
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}

// Update footer year dynamically
const footerYear = document.querySelector(".footer p");
if (footerYear) {
  const currentYear = new Date().getFullYear();
  if (footerYear.innerHTML.includes("2026")) {
    footerYear.innerHTML = footerYear.innerHTML.replace("2026", currentYear);
  }
}