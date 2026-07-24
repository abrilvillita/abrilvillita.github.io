const root = document.documentElement;
const themeButton = document.querySelector("#themeToggle");
const glow = document.querySelector(".cursorGlow");

const savedTheme = localStorage.getItem("abril-theme");
if (savedTheme) root.dataset.theme = savedTheme;

function syncThemeButton() {
  const light = root.dataset.theme === "light";
  themeButton.querySelector("span").textContent = light ? "☾" : "☀";
  themeButton.setAttribute("aria-label", light ? "Use dark theme" : "Use light theme");
}

syncThemeButton();
themeButton.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  localStorage.setItem("abril-theme", root.dataset.theme);
  syncThemeButton();
});

window.addEventListener("pointermove", (event) => {
  glow.style.setProperty("--x", `${event.clientX}px`);
  glow.style.setProperty("--y", `${event.clientY}px`);
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const selected = button.dataset.filter;
    document.querySelectorAll(".projectCard").forEach((card) => {
      const visible = selected === "all" || card.dataset.category === selected;
      card.classList.toggle("filteredOut", !visible);
    });
  });
});

const projectDetails = {
  texthuman: {
    eyebrow: "Product engineering",
    title: "TextHuman",
    description: "A complete product journey spanning public interface, account flows, AI processing, subscriptions and private operations.",
    points: ["Authentication and account recovery", "Supabase/PostgreSQL data layer", "Mercado Pago subscription flow", "Cloudflare Worker backend boundary", "Transactional email and usage management"],
  },
  myfather: {
    eyebrow: "Interactive learning",
    title: "MyFather",
    description: "A product experiment applying game progression, motion and conversational AI to an educational experience.",
    points: ["Learning paths and daily lessons", "Quizzes, progress and virtual rewards", "Bilingual adult and child-oriented experiences", "AI companion with cost-aware local logic", "Work in progress, documented honestly"],
  },
  hawks: {
    eyebrow: "Frontend for a real team",
    title: "Laguna HAWKS",
    description: "A public identity and sponsor-facing experience for a student engineering team that builds and races a gravity vehicle.",
    points: ["Responsive editorial layout", "Motion-rich entrance and scrolling", "Vehicle technology and safety storytelling", "Sponsor and team communication", "Custom visual identity"],
  },
  tiburones: {
    eyebrow: "Interactive narrative",
    title: "Tiburones.exe",
    description: "A browser game where interface choices change the path, encouraging younger players to think before reacting.",
    points: ["Branching conversation logic", "Mission and boss progression", "State-driven interface updates", "Local browser persistence", "Tested with real players"],
  },
  resq: {
    eyebrow: "Social-impact concept",
    title: "ResQ+",
    description: "A concept exploring how software could provide clearer, adaptive information before and during emergencies.",
    points: ["High-fidelity mobile interface", "Adaptive instruction concept", "Community coordination", "Voice and accessibility exploration", "Concept only; not an operational emergency system"],
  },
  dashboard: {
    eyebrow: "Team operations",
    title: "Campaign Dashboard",
    description: "A planning surface built around the real coordination needs of a student campaign.",
    points: ["Tasks and deadlines", "Budget and sponsorship tracking", "Proposal management", "Shared notes and priorities", "Client-side prototype"],
  },
};

const projectDialog = document.querySelector("#projectDialog");
document.querySelectorAll(".detailButton").forEach((button) => {
  button.addEventListener("click", () => {
    const data = projectDetails[button.dataset.project];
    document.querySelector("#dialogEyebrow").textContent = data.eyebrow;
    document.querySelector("#dialogTitle").textContent = data.title;
    document.querySelector("#dialogDescription").textContent = data.description;
    document.querySelector("#dialogPoints").innerHTML = data.points.map((point) => `<span>${point}</span>`).join("");
    projectDialog.showModal();
  });
});
document.querySelector(".dialogClose").addEventListener("click", () => projectDialog.close());
projectDialog.addEventListener("click", (event) => {
  if (event.target === projectDialog) projectDialog.close();
});

const commandDialog = document.querySelector("#commandDialog");
document.querySelector("#commandOpen").addEventListener("click", () => commandDialog.showModal());
commandDialog.querySelector("button").addEventListener("click", () => commandDialog.close());
commandDialog.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => commandDialog.close()));
window.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    commandDialog.open ? commandDialog.close() : commandDialog.showModal();
  }
  if (event.key === "Escape") {
    if (projectDialog.open) projectDialog.close();
    if (commandDialog.open) commandDialog.close();
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("inView");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".projectCard, .timeline article, .credentialList a, .archiveGrid a").forEach((element) => {
  element.classList.add("observe");
  observer.observe(element);
});
