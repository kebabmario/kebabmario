// ── TECH STACK ──────────────────────────────────────────
const techStack = [
  { name: "JavaScript",   icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
  { name: "Java",         icon: "https://cdn.simpleicons.org/openjdk/ffffff" },
  { name: "HTML5",        icon: "https://cdn.simpleicons.org/html5/E34F26" },
  { name: "Kotlin",       icon: "https://cdn.simpleicons.org/kotlin/7F52FF" },
  { name: "C++",          icon: "https://cdn.simpleicons.org/cplusplus/00599C" },
  { name: "Cloudflare",   icon: "https://cdn.simpleicons.org/cloudflare/F48120" },
  { name: "DigitalOcean", icon: "https://cdn.simpleicons.org/digitalocean/0080FF" },
  { name: "npm",          icon: "https://cdn.simpleicons.org/npm/CB3837" },
  { name: "Node.js",      icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E" },
  { name: "Vue.js",       icon: "https://cdn.simpleicons.org/vuedotjs/4FC08D" },
  { name: "Maven",        icon: "https://cdn.simpleicons.org/apachemaven/C71A36" },
  { name: "MongoDB",      icon: "https://cdn.simpleicons.org/mongodb/47A248" },
  { name: "Figma",        icon: "https://cdn.simpleicons.org/figma/F24E1E" },
  { name: "CSS3",         icon: "https://cdn.simpleicons.org/css/1572B6" },
];

function buildMarquee() {
  const track = document.getElementById("techTrack");
  if (!track) return;
  [...techStack, ...techStack].forEach(tech => {
    const img = document.createElement("img");
    img.src = tech.icon; img.alt = tech.name;
    img.title = tech.name; img.className = "tech-logo";
    img.loading = "lazy";
    track.appendChild(img);
  });
}

// ── HERO PARTICLES ───────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles;
  const COLORS = ["#e63946","#457b9d","#f1faee","#1d3557"];

  const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
  const make   = () => ({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.8+0.4, vx:(Math.random()-0.5)*0.35, vy:(Math.random()-0.5)*0.35, color:COLORS[Math.floor(Math.random()*COLORS.length)], alpha:Math.random()*0.5+0.15 });
  const spawn  = () => { particles = Array.from({length:Math.floor((W*H)/8000)},make); };

  function draw() {
    ctx.clearRect(0,0,W,H);
    for (let i=0;i<particles.length;i++) {
      for (let j=i+1;j<particles.length;j++) {
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if (d<90) { ctx.beginPath();ctx.strokeStyle=`rgba(230,57,70,${0.06*(1-d/90)})`;ctx.lineWidth=0.6;ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.stroke(); }
      }
    }
    particles.forEach(p => {
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.color;ctx.globalAlpha=p.alpha;ctx.fill();ctx.globalAlpha=1;
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
    });
    requestAnimationFrame(draw);
  }
  resize();spawn();draw();
  window.addEventListener("resize",()=>{resize();spawn();});
}

// ── LANYARD STATUS BADGE ─────────────────────────────────
async function fetchDiscordStatus() {
  try {
    const res  = await fetch("https://api.lanyard.rest/v1/users/1210792136094650399");
    const json = await res.json();
    if (!json.success) return;
    const status = json.data.discord_status;
    const badge  = document.getElementById("discordBadge");
    if (!badge) return;
    badge.className = `discord-badge ${status}`;
    const labels = { online:"online", idle:"idle", dnd:"do not disturb", offline:"offline" };
    badge.textContent = labels[status] ?? status;
  } catch(e) { /* silent */ }
}

// ─ INIT ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  buildMarquee();
  initParticles();
  fetchDiscordStatus();
  setInterval(fetchDiscordStatus, 30_000);
});
