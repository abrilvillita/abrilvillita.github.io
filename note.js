const id = Number(new URLSearchParams(location.search).get("id"));
const note = Number.isInteger(id) && id >= 0 ? window.PORTFOLIO_CONTENT.notes[id] : null;
if (!note || !note.body) {
  document.querySelector("#note-title").textContent = "Story coming soon";
  document.querySelector("#note-excerpt").textContent = "This field note is still in progress.";
} else {
  document.title = note.title + " · Abril Miranda";
  document.querySelector("#note-date").textContent = note.date;
  document.querySelector("#note-title").textContent = note.title;
  document.querySelector("#note-excerpt").textContent = note.excerpt;
  document.querySelector("#note-body").replaceChildren(...note.body.split(/\n\s*\n/).filter(Boolean).map(text => { const paragraph = document.createElement("p"); paragraph.textContent = text.trim(); return paragraph; }));
  if (/^[a-zA-Z0-9_-]{11}$/.test(note.youtubeId || "")) {
    const frame = document.createElement("iframe");
    frame.src = "https://www.youtube-nocookie.com/embed/" + note.youtubeId;
    frame.title = "Video for " + note.title;
    frame.loading = "lazy";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    const wrapper = document.createElement("div");
    wrapper.className = "video-frame";
    wrapper.append(frame);
    document.querySelector("#note-video").append(wrapper);
  }
}

