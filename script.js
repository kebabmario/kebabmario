const DISCORD_ID = "1210792136094650399";

const DECORATION_URL = "assets/decoration.png";

const CSS3_ICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg";
const CPP_ICON  = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg";

const techCore = [
  { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
  { name: "Java",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
  { name: "HTML5",      icon: "https://cdn.simpleicons.org/html5/E34F26" },
  { name: "CSS3",       icon: CSS3_ICON },
  { name: "Node.js",    icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E" },
  { name: "Vue.js",     icon: "https://cdn.simpleicons.org/vuedotjs/4FC08D" },
  { name: "MongoDB",    icon: "https://cdn.simpleicons.org/mongodb/47A248" },
  { name: "Kotlin",     icon: "https://cdn.simpleicons.org/kotlin/7F52FF" },
  { name: "C++",        icon: CPP_ICON },
];

const techTools = [
  { name: "Cloudflare",   icon: "https://cdn.simpleicons.org/cloudflare/F48120" },
  { name: "DigitalOcean", icon: "https://cdn.simpleicons.org/digitalocean/0080FF" },
  { name: "npm",          icon: "https://cdn.simpleicons.org/npm/CB3837" },
  { name: "Apache Maven", icon: "https://cdn.simpleicons.org/apachemaven/C71A36" },
  { name: "Figma",        icon: "https://cdn.simpleicons.org/figma/F24E1E" },
];

function renderTech(targetId, items) {
  const el = document.getElementById(targetId);
  if (!el) return;
  for (const item of items) {
    const pill = document.createElement("div");
    pill.className = "tech-pill";
    pill.title = item.name;
    const img = document.createElement("img");
    img.src = item.icon;
    img.alt = item.name;
    img.loading = "lazy";
    pill.appendChild(img);
    el.appendChild(pill);
  }
}

function pickActivityText(presence) {
  if (presence?.listening_to_spotify && presence.spotify) {
    return `🎵 Listening to <strong>${presence.spotify.song}</strong> by ${presence.spotify.artist}`;
  }
  const activities = Array.isArray(presence?.activities) ? presence.activities : [];
  const real = activities.filter(a => a && a.type !== 4);
  if (real.length === 0) return null;
  const a = real[0];
  const typeMap = { 0:"Playing", 1:"Streaming", 2:"Listening to", 3:"Watching", 5:"Competing in" };
  const verb = typeMap[a.type] ?? "Doing";
  let text = `${verb} <strong>${a.name}</strong>`;
  if (a.details) text += `<br><span class="act-details">${a.details}</span>`;
  if (a.state)   text += `<br><span class="act-state">${a.state}</span>`;
  return text;
}

function applyBanner(user, status) {
  const bannerEl = document.getElementById("discordBanner");
  if (!bannerEl) return;

  const bannerHash = user?.banner;
  if (bannerHash) {
    const ext = bannerHash.startsWith("a_") ? "gif" : "png";
    bannerEl.style.cssText = `background-image:url("https://cdn.discordapp.com/banners/${DISCORD_ID}/${bannerHash}.${ext}?size=600");background-size:cover;background-position:center top;`;
    return;
  }

  const accent = user?.banner_color;
  if (accent) {
    bannerEl.style.cssText = `background:linear-gradient(135deg,${accent}ee 0%,${accent}44 60%,#0b0d12 100%);`;
    return;
  }

  const sc = { online:["#23a55a","#1e7a42"], idle:["#f0b232","#b07d1a"], dnd:["#f23f43","#a82b2e"], offline:["#5865F2","#3b4499"] };
  const [c1, c2] = sc[status] ?? sc.offline;
  bannerEl.style.cssText = `background:linear-gradient(135deg,${c1}cc 0%,${c2}66 50%,#0b0d12 100%);`;
}

function setDiscordUI(p) {
  const user = p?.discord_user;

  // Avatar — always use DISCORD_ID in the URL
  const avatarHash = user?.avatar ?? "945ae26d4ccdb7349c26476664b901b1";
  const avatarExt  = avatarHash.startsWith("a_") ? "gif" : "png";
  const avatarUrl  = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${avatarHash}.${avatarExt}?size=128`;
  const avatarEl   = document.getElementById("discordAvatar");
  if (avatarEl) avatarEl.src = avatarUrl;

  // Decoration — .png, no passthrough
  const decoEl = document.getElementById("discordDecoration");
  if (decoEl) {
    decoEl.src = DECORATION_URL;
    decoEl.style.display = "block";
    // hide if it still errors
    decoEl.onerror = () => { decoEl.style.display = "none"; };
  }

  const status = p?.discord_status ?? "offline";
  applyBanner(user, status);

  // Name / handle
  const username = user?.global_name || user?.username || "kebabmario";
  const dnEl = document.getElementById("discordDisplayName");
  if (dnEl) dnEl.textContent = username;
  const handleEl = document.getElementById("discordHandle");
  if (handleEl) handleEl.textContent = `@${user?.username ?? "kebabmario"}`;

  // Status label
  const labels = { online:"online", idle:"idle", dnd:"do not disturb", offline:"offline" };
  const dot = document.getElementById("discordStatusDot");
  if (dot) dot.className = `discord-status-dot ${status}`;
  const stText = document.getElementById("discordStatusText");
  if (stText) { stText.className = `discord-status-label ${status}`; stText.textContent = labels[status] ?? status; }

  // Custom status (type 4)
  const custom  = (p?.activities ?? []).find(a => a.type === 4);
  const customEl = document.getElementById("discordCustomStatus");
  if (customEl) {
    customEl.style.display = custom?.state ? "block" : "none";
    if (custom?.state) customEl.textContent = `${custom.emoji?.name ?? ""} ${custom.state}`.trim();
  }

  // Real activity
  const actEl   = document.getElementById("discordActivity");
  const actWrap = document.getElementById("discordActivityWrap");
  const actText = pickActivityText(p);
  if (actWrap) actWrap.style.display = actText ? "block" : "none";
  if (actEl)   actEl.innerHTML = actText ?? "";
}

async function fetchPresence() {
  try {
    const res  = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const json = await res.json();
    if (!json?.success) throw new Error("lanyard failed");
    setDiscordUI(json.data);
  } catch(e) {
    console.error("[Lanyard]", e);
    setDiscordUI(null);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderTech("techCore", techCore);
  renderTech("techTools", techTools);
  fetchPresence();
  setInterval(fetchPresence, 20_000);
});
