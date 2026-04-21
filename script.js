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
const navLinks = document.querySelectorAll(".main-nav a");
const contentSections = [...document.querySelectorAll("main section[id]")];
const backToTopBtn = document.getElementById("backToTopBtn");
const yearElement = document.getElementById("year");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const themeToggle = document.getElementById("themeToggle");
const themeToggleLabel = document.getElementById("themeToggleLabel");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  if (!themeToggle || !themeToggleLabel) {
    return;
  }

  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggleLabel.textContent = isDark ? "Light mode" : "Dark mode";
}

function setupThemeToggle() {
  const savedTheme = localStorage.getItem("theme");
  applyTheme(savedTheme || document.documentElement.getAttribute("data-theme") || "light");

  if (!themeToggle) {
    return;
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

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
      (project) => `
        <article class="project-card">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="tag-list">
            ${project.stack.map((item) => `<span class="tag">${item}</span>`).join("")}
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
    link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
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

    formMessage.className = "form-message";

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
setFooterYear();
updateActiveNav();
loadProjects();
