const content = window.PORTFOLIO_CONTENT;
const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const safeURL = (value = "") => /^https:\/\//i.test(value) ? value : "";
const projectGrid = document.querySelector("#project-grid");
projectGrid.innerHTML = content.projects.map((project, index) => {
  const image = safeURL(project.image);
  const url = safeURL(project.url);
  const repo = safeURL(project.repo);
  return `<article class="project-card accent-${escapeHTML(project.accent)}">
    <div class="project-image">${image ? `<img src="${escapeHTML(image)}" alt="Screenshot of ${escapeHTML(project.title)}" loading="lazy">` : `<span class="project-initial">${escapeHTML(project.title.slice(0, 2))}</span><span class="image-deco">✳</span>`}
      <span class="stage">${escapeHTML(project.stage)}</span></div>
    <div class="project-info"><div class="project-topline"><span>${String(index + 1).padStart(2, "0")} / ${escapeHTML(project.category)}</span></div><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.summary)}</p>
    <div class="tags">${project.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
    <div class="card-links">${url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">Explore ↗</a>` : `<span>Story in progress</span>`}${repo && repo !== url ? `<a href="${escapeHTML(repo)}" target="_blank" rel="noopener noreferrer">Code ↗</a>` : ""}</div></div></article>`;
}).join("");
document.querySelector("#notes-grid").innerHTML = content.notes.map((note,index) => {
  const url = safeURL(note.url);
  const article = note.body ? `note.html?id=${index}` : "";
  return `<article class="note-card"><span>${escapeHTML(note.date)}</span><h3>${escapeHTML(note.title)}</h3><p>${escapeHTML(note.excerpt)}</p>${article ? `<a href="${article}">Read the story ↗</a>` : url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">Read or watch ↗</a>` : `<small>Full story coming soon</small>`}</article>`;
}).join("");
document.querySelector("#credential-list").innerHTML = content.credentials.map(item => `<div class="credential-row"><span>${escapeHTML(item.issuer)}</span><strong>${escapeHTML(item.title)}</strong>${safeURL(item.url) ? `<a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : "<span>Completed</span>"}</div>`).join("");
const video = content.featuredVideo;
document.querySelector("#video-feature").innerHTML = video && /^[a-zA-Z0-9_-]{11}$/.test(video.youtubeId) ? `<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${video.youtubeId}" title="${escapeHTML(video.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><span class="video-caption">${escapeHTML(video.title)} ↗</span>` : '<div class="video-placeholder">Video coming soon ✳</div>';
const introURL = safeURL(content.introductionVideo);
if (introURL) {
  const intro = document.createElement("a");
  intro.className = "intro-link";
  intro.href = introURL;
  intro.target = "_blank";
  intro.rel = "noopener noreferrer";
  intro.textContent = "Watch my introduction ↗";
  document.querySelector(".media-grid > div:first-child").append(intro);
  const match = introURL.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  if (match) {
    document.querySelector(".hero-art").innerHTML = `<iframe class="intro-frame" src="https://www.youtube-nocookie.com/embed/${match[1]}" title="Introduction to Abril Miranda" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    document.querySelector(".hero-art").setAttribute("aria-label","Introduction video");
  }
}
if (video && /^[a-zA-Z0-9_-]{11}$/.test(video.youtubeId)) {
  const heroVideo = document.createElement("a");
  heroVideo.className = "text-link";
  heroVideo.href = "#media";
  heroVideo.textContent = "Watch featured video ↓";
  document.querySelector(".hero-actions").append(heroVideo);
}
if (safeURL(content.cvUrl)) {
  const link = document.createElement("a");
  link.className = "cv-link";
  link.href = content.cvUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Download CV ↗";
  document.querySelector(".hero-actions").append(link);
}
document.querySelector("#year").textContent = new Date().getFullYear();
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } }), { threshold: 0.08 });
  document.querySelectorAll(".project-card, .note-card, .section-heading, .about-grid").forEach(element => { element.classList.add("reveal"); observer.observe(element); });
}

