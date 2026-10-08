const model = structuredClone(window.PORTFOLIO_CONTENT);
const definitions = {
  projects: [
    ["title","Project name"],["category","Category"],["stage","Stage"],["summary","Short description","textarea"],["image","Image URL"],["accent","Color","select"],["tags","Tags, separated by commas"],["url","Main link"],["repo","Code link"]
  ],
  notes: [["date","Date"],["title","Title"],["excerpt","Short introduction","textarea"],["body","Full story (paragraphs separated by a blank line)","textarea"],["youtubeId","YouTube video ID (optional)"],["url","External link (optional)"]],
  credentials: [["title","Credential"],["issuer","Issuer"],["url","Verification link"]]
};
const colors = ["coral","blue","mint","yellow","peach","lavender"];
const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
function field(key,label,type,value,wide=false) {
  const name = esc(key), val = esc(value), cls = wide ? "field wide" : "field";
  if (type === "textarea") return `<label class="${cls}">${label}<textarea data-key="${name}">${val}</textarea></label>`;
  if (type === "select") return `<label class="${cls}">${label}<select data-key="${name}">${colors.map(c=>`<option value="${c}" ${c===value?"selected":""}>${c}</option>`).join("")}</select></label>`;
  return `<label class="${cls}">${label}<input data-key="${name}" value="${val}"></label>`;
}
function render() {
  document.querySelector("#global-fields").innerHTML =
    field("cvUrl","CV URL (public PDF link)","text",model.cvUrl) +
    field("introductionVideo","Introduction video URL","text",model.introductionVideo) +
    field("featuredVideo.title","Featured video title","text",model.featuredVideo.title) +
    field("featuredVideo.youtubeId","Featured YouTube ID","text",model.featuredVideo.youtubeId);
  for (const type of Object.keys(definitions)) {
    document.querySelector("#"+type).innerHTML = model[type].map((entry,index)=>`<div class="entry" data-type="${type}" data-index="${index}"><div class="entry-head"><strong>${index+1}. ${esc(entry.title||entry.issuer||"New entry")}</strong><button class="small-button" data-remove="${type}" data-index="${index}">Remove</button></div><div class="fields">${definitions[type].map(([key,label,input])=>field(key,label,input,key==="tags"?(entry.tags||[]).join(", "):entry[key],input==="textarea")).join("")}</div></div>`).join("");
  }
}
document.addEventListener("input", event => {
  const key = event.target.dataset.key;
  if (!key) return;
  const entry = event.target.closest(".entry");
  if (entry) {
    model[entry.dataset.type][Number(entry.dataset.index)][key] = key==="tags" ? event.target.value.split(",").map(v=>v.trim()).filter(Boolean) : event.target.value;
    return;
  }
  if (key.startsWith("featuredVideo.")) model.featuredVideo[key.split(".")[1]] = event.target.value;
  else model[key] = event.target.value;
});
document.addEventListener("click", event => {
  const add = event.target.dataset.add, remove = event.target.dataset.remove;
  if (add) {
    const blank = add==="projects" ? {title:"",category:"",stage:"In development",summary:"",image:"",accent:"mint",tags:[],url:"",repo:""} : add==="notes" ? {date:"",title:"",excerpt:"",body:"",youtubeId:"",url:""} : {title:"",issuer:"",url:""};
    model[add].push(blank); render();
  }
  if (remove) { model[remove].splice(Number(event.target.dataset.index),1); render(); }
});
document.querySelector("#download").addEventListener("click", () => {
  const file = new Blob(["/* Edit with edit.html or directly in GitHub. */\nwindow.PORTFOLIO_CONTENT = " + JSON.stringify(model,null,2) + ";\n"],{type:"text/javascript"});
  const url = URL.createObjectURL(file), link = document.createElement("a");
  link.href=url;link.download="content.js";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
render();

