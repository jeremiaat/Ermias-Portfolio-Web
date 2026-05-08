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

// Generate unique ID for projects
function generateProjectId(project) {
  return project.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
}

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
            <a class="project-link" href="${project.github || '#'}" target="_blank" rel="noopener noreferrer">
              <span class="project-link-text">View Code</span>
              <span class="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
            </a>
          </div>
        </article>
      `
    )
    .join("");
}

async function loadProjects() {
  // First try to load from localStorage (admin changes)
  const stored = localStorage.getItem('portfolioProjects');
  if (stored) {
    try {
      const projects = JSON.parse(stored);
      renderProjects(projects);
      return;
    } catch (e) {
      console.error('Error parsing localStorage projects:', e);
    }
  }

  // Fallback to loading from projects.json and save to localStorage
  try {
    const response = await fetch("./projects.json");

    if (!response.ok) {
      throw new Error("Could not load project data.");
    }

    const projects = await response.json();
    // Assign IDs to projects from projects.json and save to localStorage
    const projectsWithIds = projects.map(project => ({
      ...project,
      id: generateProjectId(project)
    }));
    localStorage.setItem('portfolioProjects', JSON.stringify(projectsWithIds));
    renderProjects(projectsWithIds);
  } catch (error) {
    // Assign IDs to fallback projects too
    const fallbackWithIds = fallbackProjects.map(project => ({
      ...project,
      id: generateProjectId(project)
    }));
    localStorage.setItem('portfolioProjects', JSON.stringify(fallbackWithIds));
    renderProjects(fallbackWithIds);
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

      // Skip admin link - let hashchange handle it
      if (targetId === "#admin") {
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
          mobileMenuToggle.setAttribute("aria-expanded", "false");
          menuIcon.textContent = "menu";
        }
        return;
      }

      // Close mobile menu if open (do this early for all nav clicks)
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        menuIcon.textContent = "menu";
      }

      const targetElement = document.querySelector(targetId);

      // If element is hidden (admin mode) or not found, let hashchange handle it
      if (!targetElement || targetElement.classList.contains('hidden')) {
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

// Admin Panel Functions
function setupAdmin() {
  const adminSection = document.getElementById('admin');
  const addProjectBtn = document.getElementById('addProjectBtn');
  const projectModal = document.getElementById('projectModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModalBtn = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelBtn');
  const projectForm = document.getElementById('projectForm');
  const modalTitle = document.getElementById('modalTitle');
  const projectIdInput = document.getElementById('projectId');
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const stackInput = document.getElementById('stack');
  const githubInput = document.getElementById('github');
  const projectList = document.getElementById('projectList');

  const deleteModal = document.getElementById('deleteModal');
  const deleteModalOverlay = document.getElementById('deleteModalOverlay');
  const closeDeleteModalBtn = document.getElementById('closeDeleteModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  let projects = [];
  let projectToDelete = null;

  function loadAdminProjects() {
    const stored = localStorage.getItem('portfolioProjects');
    if (stored) {
      try {
        projects = JSON.parse(stored);
        // Assign IDs to any projects that don't have them
        let needsSave = false;
        projects = projects.map(project => {
          if (!project.id) {
            needsSave = true;
            return { ...project, id: generateProjectId(project) };
          }
          return project;
        });
        if (needsSave) {
          saveAdminProjects();
        }
      } catch (e) {
        projects = [];
      }
    }
    renderAdminProjects();
  }

  function saveAdminProjects() {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
  }

  function renderAdminProjects() {
    if (!projectList) return;

    if (projects.length === 0) {
      projectList.innerHTML = `
        <div class="empty-state">
          <span class="material-symbols-outlined">folder_open</span>
          <p>No projects yet. Click "Add New Project" to get started.</p>
        </div>
      `;
      return;
    }

    projectList.innerHTML = projects.map(project => {
      const id = project.id || generateProjectId(project);
      return `
        <div class="project-list-item">
          <div class="project-list-item-content">
            <h3 class="project-list-item-title">${escapeHtml(project.title)}</h3>
            <p class="project-list-item-description">${escapeHtml(project.description)}</p>
            <div class="project-list-item-stack">
              ${project.stack.map(tech => `<span class="tag">${escapeHtml(tech)}</span>`).join('')}
            </div>
          </div>
          <div class="project-list-item-actions">
            <button class="btn-icon edit" data-id="${id}" title="Edit">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="btn-icon delete" data-id="${id}" title="Delete">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Add event listeners to buttons
    document.querySelectorAll('.btn-icon.edit').forEach(btn => {
      btn.addEventListener('click', () => editProject(btn.dataset.id));
    });
    document.querySelectorAll('.btn-icon.delete').forEach(btn => {
      btn.addEventListener('click', () => showDeleteModal(btn.dataset.id));
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function openModal() {
    if (!projectModal) return;
    modalTitle.textContent = 'Add New Project';
    projectForm.reset();
    projectIdInput.value = '';
    projectModal.classList.remove('hidden');
  }

  function editProject(id) {
    const project = projects.find(p => (p.id || generateProjectId(p)) === id);
    if (!project) return;

    modalTitle.textContent = 'Edit Project';
    projectIdInput.value = id;
    titleInput.value = project.title;
    descriptionInput.value = project.description;
    stackInput.value = project.stack.join(', ');
    githubInput.value = project.github || '';
    projectModal.classList.remove('hidden');
  }

  function closeModal() {
    if (projectModal) projectModal.classList.add('hidden');
  }

  function showDeleteModal(id) {
    projectToDelete = id;
    if (deleteModal) deleteModal.classList.remove('hidden');
  }

  function closeDeleteModal() {
    if (deleteModal) deleteModal.classList.add('hidden');
    projectToDelete = null;
  }

  function deleteProject() {
    if (!projectToDelete) return;

    projects = projects.filter(p => (p.id || generateProjectId(p)) !== projectToDelete);
    saveAdminProjects();
    renderAdminProjects();
    closeDeleteModal();
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const id = projectIdInput.value;
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const stack = stackInput.value.split(',').map(s => s.trim()).filter(s => s);
    const github = githubInput.value.trim();

    if (!title || !description || stack.length === 0) {
      alert('Please fill in all fields');
      return;
    }

    if (id) {
      const index = projects.findIndex(p => (p.id || generateProjectId(p)) === id);
      if (index !== -1) {
        projects[index] = { ...projects[index], title, description, stack, github };
      }
    } else {
      const newProject = {
        id: generateProjectId({ title, description, stack }),
        title,
        description,
        stack,
        github
      };
      projects.push(newProject);
    }

    saveAdminProjects();
    renderAdminProjects();
    closeModal();
  }

  function checkAdminVisibility() {
    const hash = window.location.hash;
    const contentSections = document.querySelectorAll('main section:not(#admin)');

    if (hash === '#admin') {
      if (adminSection) adminSection.classList.remove('hidden');
      contentSections.forEach(s => s.classList.add('hidden'));
      document.body.classList.add('admin-mode');
      loadAdminProjects();
    } else {
      if (adminSection) adminSection.classList.add('hidden');
      contentSections.forEach(s => s.classList.remove('hidden'));
      document.body.classList.remove('admin-mode');
    }
  }

  // Event listeners
  if (addProjectBtn) addProjectBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  if (closeDeleteModalBtn) closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  if (deleteModalOverlay) deleteModalOverlay.addEventListener('click', closeDeleteModal);
  if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', deleteProject);

  if (projectForm) projectForm.addEventListener('submit', handleFormSubmit);

  // Check on hash change
  window.addEventListener('hashchange', checkAdminVisibility);

  // Check on initial load
  checkAdminVisibility();
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
setupAdmin();
