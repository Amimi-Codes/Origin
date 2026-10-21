// launch.js: the tavern. Click a portal: the soul flies into it, bursts into
// scattering pixels, the screen fades to black and the builder appears beneath.
// It's all one page, so the address stays …/Origin/.
const launch = document.getElementById("launch"),
  soul = document.getElementById("soul"),
  fade = document.getElementById("fade"),
  calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
let busy = false;
function enter(mode) {
  launch.hidden = true;
  document.body.classList.remove("tavern");
  scrollTo(0, 0);
  if (mode == "ready") exm();
  if (mode == "quick") quiz();
  // Back button returns to the tavern instead of leaving the site
  // (browsers refuse history changes on file:// pages; that's fine)
  try {
    history.pushState({ builder: 1 }, "", "./");
  } catch (e) {}
  requestAnimationFrame(() => fade.classList.remove("on"));
}
addEventListener("popstate", () => launch.hidden && location.reload());
// old links like builder.html#quick land here with the hash: skip the tavern
const m = { "#build": "build", "#ready": "ready", "#quick": "quick" }[location.hash];
if (m) {
  try {
    history.replaceState(null, "", "./");
  } catch (e) {}
  enter(m);
}
document.querySelectorAll(".portal").forEach((p) =>
  p.addEventListener("click", () => {
    if (busy) return;
    busy = true;
    const st = getComputedStyle(p),
      gate = p.querySelector(".gate").getBoundingClientRect();
    soul.style.setProperty("--sx", st.getPropertyValue("--x"));
    soul.style.setProperty("--sy", +st.getPropertyValue("--y") - 12);
    soul.classList.add("go");
    if (!calm)
      setTimeout(
        () =>
          burst(
            gate.left + gate.width / 2,
            gate.top + gate.height * 0.4,
            st.getPropertyValue("--glow").trim(),
          ),
        850,
      );
    setTimeout(() => fade.classList.add("on"), calm ? 0 : 1800);
    setTimeout(() => {
      document.querySelectorAll(".bit").forEach((b) => b.remove());
      enter(p.dataset.mode);
    }, calm ? 550 : 2350);
  }),
);
function burst(x, y, glow) {
  soul.classList.add("gone");
  const cols = ["#fff", glow, glow, "#4ac8f0", "#a8f0f0"],
    reach = Math.max(innerWidth, innerHeight) * 0.6;
  for (let i = 0; i < 140; i++) {
    const b = document.createElement("i"),
      a = Math.random() * Math.PI * 2,
      d = reach * (0.15 + Math.random() * 0.85),
      z = 6 + Math.round(Math.random() * 3) * 4,
      c = cols[i % cols.length];
    b.className = "bit";
    b.style.cssText = `left:${x - z / 2}px;top:${y - z / 2}px;width:${z}px;height:${z}px;background:${c};box-shadow:0 0 ${z * 1.5}px ${c}`;
    document.body.append(b);
    b.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { opacity: 1, offset: 0.6 },
        {
          transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 40}px) scale(.3)`,
          opacity: 0,
        },
      ],
      {
        duration: 1100 + Math.random() * 700,
        delay: Math.random() * 120,
        easing: "cubic-bezier(.2,.6,.35,1)",
        fill: "forwards",
      },
    );
  }
}
