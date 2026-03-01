const DISCORD_ID     = "1210792136094650399";
const DUSTIN_API     = `https://dcdn.dstn.to/profile/${DISCORD_ID}`;
const LANYARD_API    = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

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

function applyBanner(profile, status) {
  const bannerEl = document.getElementById("discordBanner");
  if (!bannerEl) return;

  const bannerHash = profile?.banner;
  if (bannerHash) {
    const ext = bannerHash.startsWith("a_") ? "gif" : "png";
    const url = `https://cdn.discordapp.com/banners/${DISCORD_ID}/${bannerHash}.${ext}?size=600`;
    bannerEl.style.cssText = `background-image:url("${url}");background-size:cover;background-position:center top;`;
    console.log("[Banner] image:", url);
    return;
  }

  const accent = profile?.banner_color ?? profile?.accent_color;
  const hex = accent
    ? (typeof accent === "number" ? "#" + accent.toString(16).padStart(6,"0") : accent)
    : null;

  if (hex) {
    bannerEl.style.cssText = `background:linear-gradient(135deg,${hex}ee 0%,${hex}44 60%,#0b0d12 100%);`;
    console.log("[Banner] accent colour:", hex);
    return;
  }

  const sc = {
    online:  ["#23a55a","#1e7a42"],
    idle:    ["#f0b232","#b07d1a"],
    dnd:     ["#f23f43","#a82b2e"],
    offline: ["#5865F2","#3b4499"],
  };
  const [c1, c2] = sc[status] ?? sc.offline;
  bannerEl.style.cssText = `background:linear-gradient(135deg,${c1}cc 0%,${c2}66 50%,#0b0d12 100%);`;
  console.log("[Banner] gradient fallback — no banner or accent on this profile");
}

function applyDecoration(profile) {
  const decoEl = document.getElementById("discordDecoration");
  if (!decoEl) return;

  const asset = profile?.avatar_decoration_data?.asset;
  if (asset) {
    const ext = asset.startsWith("a_") ? "gif" : "png";
    const url = `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.${ext}?size=160&passthrough=true`;
    decoEl.src = url;
    decoEl.style.display = "block";
    decoEl.onerror = () => {
      decoEl.src = "assets/decoration.png";
      decoEl.onerror = () => { decoEl.style.display = "none"; };
    };
    console.log("[Decoration] asset:", url);
    return;
  }

  decoEl.src = "assets/decoration.png";
  decoEl.style.display = "block";
  decoEl.onerror = () => { decoEl.style.display = "none"; };
}

function applyProfileEffect(profile) {
  const effectEl = document.getElementById("discordEffect");
  if (!effectEl) return;

  const effectId = profile?.profile_effect?.id ?? profile?.profile_effect_config?.id;
  if (!effectId) {
    effectEl.style.display = "none";
    return;
  }

  const url = `https://effects.discu.eu/effects/${effectId}/intro.webm`;
  effectEl.src = url;
  effectEl.style.display = "block";
  effectEl.load();
  effectEl.play().catch(() => {});
  console.log("[Effect]", url);
}

function setDiscordUI(lanyardData, dustinProfile) {
  const avatarHash = dustinProfile?.avatar ?? "945ae26d4ccdb7349c26476664b901b1";
  const avatarExt  = avatarHash.startsWith("a_") ? "gif" : "png";
  const avatarUrl  = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${avatarHash}.${avatarExt}?size=128`;
  const avatarEl   = document.getElementById("discordAvatar");
  if (avatarEl) avatarEl.src = avatarUrl;

  const status = lanyardData?.discord_status ?? "offline";

  applyBanner(dustinProfile, status);
  applyDecoration(dustinProfile);
  applyProfileEffect(dustinProfile);

  const dnEl = document.getElementById("discordDisplayName");
  if (dnEl) dnEl.textContent = dustinProfile?.global_name ?? "myrixx";
  const handleEl = document.getElementById("discordHandle");
  if (handleEl) handleEl.textContent = `@${dustinProfile?.username ?? "myrixx"}`;

  const labels = { online:"online", idle:"idle", dnd:"do not disturb", offline:"offline" };
  const dot = document.getElementById("discordStatusDot");
  if (dot) dot.className = `discord-status-dot ${status}`;
  const stText = document.getElementById("discordStatusText");
  if (stText) {
    stText.className = `discord-status-label ${status}`;
    stText.textContent = labels[status] ?? status;
  }


  const custom   = (lanyardData?.activities ?? []).find(a => a.type === 4);
  const customEl = document.getElementById("discordCustomStatus");
  if (customEl) {
    customEl.style.display = custom?.state ? "block" : "none";
    if (custom?.state) customEl.textContent = `${custom.emoji?.name ?? ""} ${custom.state}`.trim();
  }

  const actEl   = document.getElementById("discordActivity");
  const actWrap = document.getElementById("discordActivityWrap");
  const actText = pickActivityText(lanyardData);
  if (actWrap) actWrap.style.display = actText ? "block" : "none";
  if (actEl)   actEl.innerHTML = actText ?? "";
}

async function fetchAll() {
  const [lanyardRes, dustinRes] = await Promise.allSettled([
    fetch(LANYARD_API).then(r => r.json()),
    fetch(DUSTIN_API).then(r => r.json()),
  ]);

  const lanyardData  = lanyardRes.status === "fulfilled" && lanyardRes.value?.success
    ? lanyardRes.value.data
    : null;

  const dustinProfile = dustinRes.status === "fulfilled"
    ? dustinRes.value
    : null;

  console.log("[Dustin]", dustinProfile);
  console.log("[Lanyard]", lanyardData);

  setDiscordUI(lanyardData, dustinProfile);
}

document.addEventListener("DOMContentLoaded", () => {
  renderTech("techCore", techCore);
  renderTech("techTools", techTools);
  fetchAll();
  setInterval(fetchAll, 20_000);
});
