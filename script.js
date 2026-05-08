const fallbackProjects = [
  {
    title: "BookStore Telegram Bot",
    description:
      "A commerce-focused Telegram bot with structured ordering flows, persistent data, and a practical user experience.",
    stack: ["TypeScript", "Supabase", "grammY"]
  },
  {
    title: "Portfolio Website",
    description:
      "A clean, modern portfolio designed to present projects, skills, and personal brand with clarity.",
    stack: ["React", "TypeScript", "CSS"]
  },
  {
    title: "Node.js API Service",
    description:
      "A maintainable API service focused on organized routes, reliable responses, and straightforward integration.",
    stack: ["Node.js", "Express", "REST API"]
  }
];

const projectGrid = document.getElementById("projectGrid");
const navLinks = document.querySelectorAll("#mainNav a, #mobileMenu a");
const contentSections = [...document.querySelectorAll("main section[id]")];
const backToTopBtn = document.getElementById("backToTopBtn");
const yearElement = document.getElementById("year");
const localTimeElement = document.getElementById("localTime");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const menuIcon = document.getElementById("menuIcon");

function applyTheme(theme) {
  const html = document.documentElement;
  
  if (theme === "dark") {
    html.classList.remove("light");
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
    html.classList.add("light");
  }

  if (!themeToggle || !themeIcon) {
    return;
  }

  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeIcon.textContent = isDark ? "light_mode" : "dark_mode";
}

function setupThemeToggle() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (systemTheme.matches) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  if (!themeToggle) {
    return;
  }

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";

    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  });

  systemTheme.addEventListener("change", (event) => {
    const chosenTheme = localStorage.getItem("theme");

    if (chosenTheme) {
      return;
    }

    applyTheme(event.matches ? "dark" : "light");
  });
}

function renderProjects(projects) {
  if (!projectGrid) {
    return;
  }

  projectGrid.innerHTML = projects
    .map(
      (project, index) => `
        <article class="project-card">
          <div class="project-content">
            <span class="project-category">${project.stack[0] || 'Project'}</span>
            <h3 class="headline-md">${project.title}</h3>
            <p class="body-md">${project.description}</p>
            <div class="project-tags">
              ${project.stack.map((item) => `<span class="tag">${item}</span>`).join("")}
            </div>
            <a class="project-link" href="#">
              <span class="project-link-text">View Project Details</span>
              <span class="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
            </a>
          </div>
        </article>
      `
    )
    .join("");
}

async function loadProjects() {
  try {
    const response = await fetch("./projects.json");

    if (!response.ok) {
      throw new Error("Could not load project data.");
    }

    const projects = await response.json();
    renderProjects(projects);
  } catch (error) {
    renderProjects(fallbackProjects);
  }
}

function updateActiveNav() {
  const marker = window.scrollY + 180;
  let currentSection = "";

  contentSections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (marker >= top && marker < bottom) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSection}`;
    if (isActive) {
      link.classList.add("nav-link-active");
    } else {
      link.classList.remove("nav-link-active");
    }
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (!targetElement) {
        return;
      }

      event.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

      // Close mobile menu if open
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        menuIcon.textContent = "menu";
      }
    });
  });
}

function setupRevealAnimation() {
  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupScrollUI() {
  window.addEventListener("scroll", () => {
    window.requestAnimationFrame(() => {
      updateActiveNav();
      backToTopBtn.classList.toggle("show", window.scrollY > 520);
    });
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupContactForm() {
  if (!contactForm || !formMessage) {
    return;
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name").toString().trim();
    const email = formData.get("email").toString().trim();
    const message = formData.get("message").toString().trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    formMessage.className = "font-body-md text-body-md";

    if (!name || !email || !message) {
      formMessage.textContent = "Please fill in all fields before sending your message.";
      formMessage.classList.add("is-error");
      return;
    }

    if (!emailPattern.test(email)) {
      formMessage.textContent = "Please enter a valid email address.";
      formMessage.classList.add("is-error");
      return;
    }

    formMessage.textContent = `Thanks, ${name}. Your message is ready to be sent.`;
    formMessage.classList.add("is-success");
    contactForm.reset();
  });
}

function setupMobileMenu() {
  if (!mobileMenuToggle || !mobileMenu) {
    return;
  }

  mobileMenuToggle.addEventListener("click", () => {
    const isExpanded = mobileMenuToggle.getAttribute("aria-expanded") === "true";
    
    mobileMenuToggle.setAttribute("aria-expanded", String(!isExpanded));
    mobileMenu.classList.toggle("hidden");
    menuIcon.textContent = isExpanded ? "menu" : "close";
    
    // Prevent body scroll when menu is open
    if (!isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // Close menu when clicking on navigation links
  const mobileNavLinks = mobileMenu.querySelectorAll("a");
  mobileNavLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.classList.add("hidden");
      menuIcon.textContent = "menu";
      document.body.style.overflow = "";
    });
  });
}

function updateLocalTime() {
  if (!localTimeElement) return;
  
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const gmtOffset = -now.getTimezoneOffset() / 60;
  const gmtString = gmtOffset >= 0 ? `GMT+${gmtOffset}` : `GMT${gmtOffset}`;
  
  localTimeElement.textContent = `${hours}:${minutes} ${gmtString}`;
}

function setFooterYear() {
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

setupSmoothScroll();
setupRevealAnimation();
setupScrollUI();
setupContactForm();
setupThemeToggle();
setupMobileMenu();
setFooterYear();
updateActiveNav();
updateLocalTime();
setInterval(updateLocalTime, 60000); // Update every minute
loadProjects();
