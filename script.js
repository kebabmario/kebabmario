const DISCORD_ID  = "1210792136094650399";
const DUSTIN_API  = `https://dcdn.dstn.to/profile/${DISCORD_ID}`;
const LANYARD_API = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

const MY_AVATAR = "945ae26d4ccdb7349c26476664b901b1";
const MY_NAME   = "myrixx";
const MY_USER   = "_myrixx";

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

/* ── Country scramble — never resolves ── */
function startCountryAnim() {
  const el = document.getElementById("countryText");
  if (!el) return;

  const length = 15;
  const chars  = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

  function scramble() {
    let display = "";
    for (let i = 0; i < length; i++) {
      display += chars[Math.floor(Math.random() * chars.length)];
    }
    el.textContent = display;
  }

  scramble();
  setInterval(scramble, 80);
}

/* ── Tech pills ── */
function renderTech(id, items) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";
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

/* ── Local clock GMT+8 ── */
function startLocalClock() {
  const el = document.getElementById("discordLocalTime");
  if (!el) return;
  function tick() {
    const utc8 = new Date(Date.now() + 8 * 3600000);
    const h = String(utc8.getUTCHours()).padStart(2, "0");
    const m = String(utc8.getUTCMinutes()).padStart(2, "0");
    const s = String(utc8.getUTCSeconds()).padStart(2, "0");
    el.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}

/* ── Activity text ── */
function pickActivityText(p) {
  if (p?.listening_to_spotify && p.spotify)
    return `🎵 <strong>${p.spotify.song}</strong> — ${p.spotify.artist}`;
  const acts = (p?.activities ?? []).filter(a => a.type !== 4);
  if (!acts.length) return null;
  const a = acts[0];
  const v = { 0:"Playing", 1:"Streaming", 2:"Listening to", 3:"Watching", 5:"Competing in" };
  let t = `${v[a.type] ?? "Doing"} <strong>${a.name}</strong>`;
  if (a.details) t += `<br><span class="act-details">${a.details}</span>`;
  if (a.state)   t += `<br><span class="act-state">${a.state}</span>`;
  return t;
}

/* ── Banner ── */
function applyBanner(profile, status) {
  const el = document.getElementById("discordBanner");
  if (!el) return;
  const hash = profile?.banner;
  if (hash) {
    const ext = hash.startsWith("a_") ? "gif" : "png";
    el.style.cssText = `background-image:url("https://cdn.discordapp.com/banners/${DISCORD_ID}/${hash}.${ext}?size=600");background-size:cover;background-position:center top;`;
    return;
  }
  const raw = profile?.banner_color ?? profile?.accent_color;
  const hex = raw
    ? (typeof raw === "number" ? "#" + raw.toString(16).padStart(6, "0") : raw)
    : null;
  if (hex) {
    el.style.cssText = `background:linear-gradient(135deg,${hex}cc 0%,${hex}22 70%,#0d0d11 100%);`;
    return;
  }
  const sc = {
    online:  ["#23a55a", "#1e7a42"],
    idle:    ["#f0b232", "#b07d1a"],
    dnd:     ["#f23f43", "#a82b2e"],
    offline: ["#1a1c2e", "#0d0d11"],
  };
  const [c1, c2] = sc[status] ?? sc.offline;
  el.style.cssText = `background:linear-gradient(135deg,${c1} 0%,${c2} 100%);`;
}

/* ── Decoration ── */
function applyDecoration(profile) {
  const el = document.getElementById("discordDecoration");
  if (!el) return;
  const asset = profile?.avatar_decoration_data?.asset;
  if (asset) {
    const ext = asset.startsWith("a_") ? "gif" : "png";
    el.src = `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.${ext}?size=160&passthrough=true`;
    el.style.display = "block";
    el.onerror = () => {
      el.src = "assets/decoration.png";
      el.onerror = () => { el.style.display = "none"; };
    };
    return;
  }
  el.src = "assets/decoration.png";
  el.style.display = "block";
  el.onerror = () => { el.style.display = "none"; };
}

/* ── Profile effect ── */
function applyProfileEffect(profile) {
  const el = document.getElementById("discordEffect");
  if (!el) return;
  const id = profile?.profile_effect?.id ?? profile?.profile_effect_config?.id;
  if (!id) { el.style.display = "none"; return; }
  el.src = `https://effects.discu.eu/effects/${id}/intro.webm`;
  el.style.display = "block";
  el.load();
  el.play().catch(() => {});
}

/* ── Main Discord UI update ── */
function setDiscordUI(lanyard, profile) {
  const isYou = profile?.id === DISCORD_ID || lanyard?.discord_user?.id === DISCORD_ID;

  // avatar
  const hash = isYou ? (profile?.avatar ?? MY_AVATAR) : MY_AVATAR;
  const ext  = hash.startsWith("a_") ? "gif" : "png";
  const avatarEl = document.getElementById("discordAvatar");
  if (avatarEl) avatarEl.src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${hash}.${ext}?size=128`;

  const status = lanyard?.discord_status ?? "offline";
  applyBanner(profile, status);
  applyDecoration(profile);
  applyProfileEffect(profile);

  // name + handle
  const dnEl = document.getElementById("discordDisplayName");
  if (dnEl) dnEl.textContent = isYou
    ? (profile?.global_name ?? lanyard?.discord_user?.global_name ?? MY_NAME)
    : MY_NAME;

  const hEl = document.getElementById("discordHandle");
  if (hEl) hEl.textContent = `@${isYou
    ? (profile?.username ?? lanyard?.discord_user?.username ?? MY_USER)
    : MY_USER}`;

  // status dot + label
  const labels = { online:"online", idle:"idle", dnd:"do not disturb", offline:"offline" };
  const dot = document.getElementById("discordStatusDot");
  if (dot) dot.className = `discord-status-dot ${status}`;
  const stEl = document.getElementById("discordStatusText");
  if (stEl) {
    stEl.className = `discord-status-label ${status}`;
    stEl.textContent = labels[status] ?? status;
  }

  // custom status
  const custom = (lanyard?.activities ?? []).find(a => a.type === 4);
  const cEl = document.getElementById("discordCustomStatus");
  if (cEl) {
    cEl.style.display = custom?.state ? "block" : "none";
    if (custom?.state) cEl.textContent = `${custom.emoji?.name ?? ""} ${custom.state}`.trim();
  }

  // activity
  const actText = pickActivityText(lanyard);
  const aWrap   = document.getElementById("discordActivityWrap");
  const aEl     = document.getElementById("discordActivity");
  if (aWrap) aWrap.style.display = actText ? "block" : "none";
  if (aEl)   aEl.innerHTML = actText ?? "";
}

/* ── Fetch Lanyard + Dustin ── */
async function fetchAll() {
  const [lr, dr] = await Promise.allSettled([
    fetch(LANYARD_API).then(r => r.json()),
    fetch(DUSTIN_API).then(r => r.json()),
  ]);
  const lanyard = lr.status === "fulfilled" && lr.value?.success ? lr.value.data : null;
  const profile = dr.status === "fulfilled" ? dr.value : null;
  setDiscordUI(lanyard, profile);
}

/* ── Init ── */
document.addEventListener("DOMContentLoaded", () => {
  renderTech("techCore", techCore);
  renderTech("techTools", techTools);
  startLocalClock();
  startCountryAnim();
  fetchAll();
  setInterval(fetchAll, 20_000);
});
