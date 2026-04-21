const fallbackProjects = [
  {
    title: "Responsive Portfolio Interface",
    description:
      "A modern portfolio page using semantic HTML and responsive CSS for a clean, minimal presentation.",
    stack: ["HTML5", "CSS3", "Responsive Design"]
  },
  {
    title: "Interactive Course Showcase",
    description:
      "JavaScript handles scrolling, active navigation, section reveals, and quick feedback in the contact form.",
    stack: ["JavaScript", "DOM", "Events"]
  },
  {
    title: "Asynchronous Project Loader",
    description:
      "Project content is loaded asynchronously from a JSON file to reflect the Ajax chapter in a simple way.",
    stack: ["AJAX", "JSON", "Fetch API"]
  }
];

const projectGrid = document.getElementById("projectGrid");
const navLinks = document.querySelectorAll(".main-nav a");
const contentSections = [...document.querySelectorAll("main section[id]")];
const backToTopBtn = document.getElementById("backToTopBtn");
const yearElement = document.getElementById("year");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

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
setFooterYear();
updateActiveNav();
loadProjects();
