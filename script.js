// script.js: character art, navigation, species / background / class / ability pages
const ch = (o, vb = "0 0 300 340") => {
  const v = {
      skin: "#f1c9a5",
      hair: "#5a3a22",
      eye: "#4a7a3a",
      robe: "#6b4a8a",
      ears: 0,
      horns: 0,
      hs: 0,
      horn: "#3a2a2a",
      ...o,
    },
    sk = v.skin;
  let s = `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg"><path d="M66 340Q70 230 150 222Q230 230 234 340Z" fill="${v.robe}"/><path d="M118 224Q150 266 182 224Z" fill="#0004"/><path d="M150 226V340" stroke="#0002" stroke-width="3"/>`;
  if (v.hs == 1)
    s += `<path d="M60 150Q58 36 150 36Q242 36 240 150L252 268Q222 286 206 240H94Q78 286 48 268Z" fill="${v.hair}"/>`;
  if (v.hs == 3)
    for (let a = 0; a < 9; a++)
      s += `<circle cx="${150 + 86 * Math.cos(Math.PI * (1 + a / 8))}" cy="${140 + 80 * Math.sin(Math.PI * (1 + a / 8))}" r="24" fill="${v.hair}"/>`;
  if (v.horns == 2)
    s += `<path d="M96 94Q60 60 70 20Q104 44 118 86Z M204 94Q240 60 230 20Q196 44 182 86Z" fill="${v.horn}"/>`;
  if (v.horns == 3)
    s += `<path d="M84 104Q22 96 36 48Q74 40 74 78Q54 80 62 96Q80 100 100 90Z M216 104Q278 96 264 48Q226 40 226 78Q246 80 238 96Q220 100 200 90Z" fill="${v.horn}"/>`;
  if (v.horns == 1)
    s += `<path d="M104 86Q96 58 112 48Q116 70 128 82Z M196 86Q204 58 188 48Q184 70 172 82Z" fill="${v.horn}"/>`;
  if (v.ears)
    s += `<path d="M76 146L${v.ears == 2 ? 14 : 38} 120L80 186Z M224 146L${v.ears == 2 ? 286 : 262} 120L220 186Z" fill="${sk}"/>`;
  else
    s += `<circle cx="72" cy="162" r="13" fill="${sk}"/><circle cx="228" cy="162" r="13" fill="${sk}"/>`;
  s += `<ellipse cx="150" cy="152" rx="80" ry="74" fill="${sk}"/>`;
  if (v.scales)
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 7; c++)
        s += `<circle cx="${96 + c * 18 + (r % 2) * 9}" cy="${96 + r * 18}" r="7" fill="none" stroke="#0003" stroke-width="2"/>`;
  if (v.beard)
    s += `<path d="M76 168Q76 276 150 296Q224 276 224 168Q204 224 150 226Q96 224 76 168Z" fill="${v.beard}"/>`;
  if (v.snout)
    s += `<ellipse cx="150" cy="196" rx="44" ry="28" fill="${v.snout}"/><circle cx="138" cy="190" r="3.5" fill="#0006"/><circle cx="162" cy="190" r="3.5" fill="#0006"/>`;
  if (v.mark)
    s += `<path d="M92 180Q104 196 96 208M208 180Q196 196 204 208M150 82V104" stroke="${v.mark}" stroke-width="5" stroke-linecap="round" fill="none"/>`;
  for (const x of [114, 186])
    s += `<ellipse cx="${x}" cy="150" rx="15" ry="19" fill="#231510"/><ellipse cx="${x}" cy="152" rx="11" ry="15" fill="${v.eye}"/><circle cx="${x - 4}" cy="144" r="5" fill="#fff"/><circle cx="${x + 4}" cy="158" r="2.5" fill="#fff"/>`;
  if (!v.snout)
    s += `<ellipse cx="94" cy="184" rx="13" ry="8" fill="#ff7a8a" opacity=".35"/><ellipse cx="206" cy="184" rx="13" ry="8" fill="#ff7a8a" opacity=".35"/><path d="M140 198Q150 208 160 198" stroke="#3a1a14" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  if (v.tusk)
    s += `<path d="M128 200L124 184L136 198ZM172 200L176 184L164 198Z" fill="#fff"/>`;
  if (v.hs != 2 && !v.hat)
    s += `<path d="M70 142Q76 58 150 58Q224 58 230 142Q204 100 170 104Q150 80 128 106Q96 100 70 142Z" fill="${v.hair}"/>`;
  if (v.hat)
    s += `<path d="M82 108Q150 -40 218 108Q150 84 82 108Z" fill="${v.hat}"/><circle cx="150" cy="-4" r="10" fill="#fff"/>`;
  return s + "</svg>";
};
const AB = ["STR", "DEX", "CON", "INT", "WIS", "CHA"],
  S = {
    t: 1,
    s: 0,
    c: 4,
    b: 0,
    lv: 1,
    sel: {},
    sk: 0,
    sf: "all",
    kk: 0,
    ks: {},
    eq: 0,
    ab: {
      s: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 },
      m: 21,
      p2: null,
      p1: null,
    },
    l: {},
    p: {},
  },
  $ = (i) => document.getElementById(i);
const look = (i = S.s, rb) => {
  const x = SP[i],
    l = x.L[S.l[i] || 0];
  return { ...x.v, ...(l ? l.v : {}), ...(rb ? { robe: rb } : {}) };
};
const q = (t) =>
  `<i class="q" tabindex="0">?<i class="tip"><b>${t}</b>${GL[t]}</i></i>`;
const box = (b, l, c) =>
  `<div class="bx" style="--c:${c}"><b>${b}</b><span>${l}${GL[l] ? q(l) : ""}</span></div>`;
const spName = () => {
  const x = SP[S.s],
    l = x.L[S.l[S.s] || 0];
  return l ? l.n + (/Elf|Gnome|Giant/.test(l.n) ? "" : " " + x.n) : x.n;
};
function sp() {
  const x = SP[S.s],
    li = S.l[S.s] || 0,
    l = x.L[li],
    dv = l && l.dv !== undefined ? l.dv : x.dv,
    spd = (l && l.sp) || x.sp,
    res = (l && l.r) || x.r || "—";
  const tr = [...x.tr, ...((l && l.x) || [])];
  $("v").innerHTML =
    `<div class="stage"><div class="col">${steps()}<a class="nav back" href="./">◀ Want a different start? Back to the tavern</a><div class="p" style="flex:1"><div class="k">Heritage</div><h2>${x.n}</h2><p>${x.s}</p>${l && l.d ? `<p><b style="color:var(--g)">${l.n}.</b> ${l.d}</p>` : ""}<div class="note">${x.L.length ? x.lh + ": choose one lineage →" : "No lineages. Every " + x.n + " shares the same traits."}</div></div></div>
<div class="hero">${ch(look())}</div>
<div class="col"><div class="p"><div class="k">At a glance</div><div class="boxes">${box(spd + " ft", "Speed", "#f3c26b")}${box(x.z.replace(" or ", " / "), "Size", "#e0793a")}${box(dv ? dv + " ft" : "—", "Darkvision", "#9fe0d0")}${box(res, "Resist", "#e58fb6")}</div></div>
<div class="p" style="flex:1">${x.L.length ? `<div class="k">${x.lh}</div><div class="chips">${x.L.map((q, i) => `<button class="chip ${i == li ? "on" : ""}" data-l="${i}">${q.n}</button>`).join("")}</div>` : ""}<div class="k">Traits</div><ul class="tr">${tr.map((t) => `<li><b>${t[0]}</b>${t[1] ? " · " + t[1] : ""}</li>`).join("")}</ul><button class="cta" id="pk">Choose ${l ? l.n.replace(/ Giant$/, "") : x.n}</button></div></div></div>
<div class="rail"><div class="strip">${SP.map((q, i) => `<div class="th ${i == S.s ? "on" : ""}" data-i="${i}">${ch(look(i), "40 30 220 220")}<em>${q.n}</em></div>`).join("")}</div><button class="nav" id="nx">Next ▶</button><button class="nav" id="al">▦ View all</button></div>`;
  document.querySelectorAll("[data-l]").forEach(
    (b) =>
      (b.onclick = () => {
        S.l[S.s] = +b.dataset.l;
        sp();
      }),
  );
  document.querySelectorAll(".th").forEach(
    (b) =>
      (b.onclick = () => {
        S.s = +b.dataset.i;
        sp();
      }),
  );
  $("al").onclick = all;
  $("pk").onclick = () => {
    S.p.sp = spName();
    S.t = 2;
    rd();
    sm();
  };
  $("nx").onclick = $("pk").onclick;
  const o = document.querySelector(".th.on");
  o && o.scrollIntoView({ inline: "center", block: "nearest" });
}
const rg = (a, c) => {
  const k = c[3].indexOf(a);
  return `<div class="ring ${k == 0 ? "a" : k == 1 ? "b" : ""}" style="--p:${k == 0 ? 100 : k == 1 ? 72 : 20}"><i>${a}<small>${k == 0 ? "Primary" : k == 1 ? "Support" : ""}</small></i></div>`;
};
const hasSp = () =>
  CAS.includes(CL[S.c][0]) ||
  (SP[S.s].L[S.l[S.s] || 0] || {}).n === "High Elf" ||
  BG[S.b][4].startsWith("Magic Initiate");
function steps() {
  return `<div class="p"><div class="k">Character creation</div><div class="bar"><i style="width:${(S.t / ST.length) * 100}%"></i></div><div class="st">${ST.map(
    (n, i) => {
      const k = i + 1,
        off = k == 5 && !hasSp();
      return `<button class="s ${k == S.t ? "on" : k < S.t ? "dn" : ""} ${off ? "off" : ""}" data-st="${k}" ${off ? "disabled" : ""} title="${off ? "No spell choices for this combination" : n}"><b>${off ? "–" : k}</b>${n}</button>`;
    },
  ).join("")}</div></div>`;
}
function bg() {
  const b = BG[S.b];
  $("v").innerHTML =
    `<div class="stage"><div class="col" style="align-items:center">${steps()}<div class="cl">${BG.map((q, i) => `<div class="ci ${i == S.b ? "on" : ""}" data-i="${i}" title="${q[0]}">${q[1]}</div>`).join("")}</div></div>
<div class="hero">${ch(look())}<div class="badge">${b[1]}</div></div>
<div class="col"><div class="p"><div class="k">Background</div><h2>${b[0]}</h2><p>${b[2]}</p><div class="k">Ability scores · +2/+1 or +1/+1/+1</div><div class="boxes" style="grid-template-columns:repeat(3,1fr)">${b[3].map((a) => box(a, "Ability", "#f3c26b")).join("")}</div>
<ul class="tr" style="max-height:none"><li><b>Origin Feat</b>${q("Origin Feat")} · ${b[4]}</li><li><b>Skills</b> · ${b[5].join(", ")}</li><li><b>Tool</b> · ${b[6]}</li></ul><button class="cta" id="pk">Choose ${b[0]}</button></div></div></div>
<div class="rail"><button class="nav" id="pv">◀ Prev</button><button class="nav" id="nx">Next ▶</button></div>`;
  document.querySelectorAll(".ci").forEach(
    (q) =>
      (q.onclick = () => {
        S.b = +q.dataset.i;
        bg();
      }),
  );
  $("pk").onclick = () => {
    S.p.bg = b[0];
    S.t = 4;
    rd();
    sm();
  };
  $("pv").onclick = () => {
    S.t = 2;
    rd();
  };
  $("nx").onclick = $("pk").onclick;
}
function cl() {
  const c = CL[S.c],
    f = F[c[0]],
    [die, role] = c[4].split(" · ");
  $("v").innerHTML =
    `<div class="stage"><div class="col" style="align-items:center">${steps()}<div class="cl">${CL.map((q, i) => `<div class="ci ${i == S.c ? "on" : ""}" data-i="${i}" title="${q[0]}">${q[1]}</div>`).join("")}</div></div>
<div class="hero">${ch(look(S.s, c[5]))}<div class="badge">${c[1]}</div></div>
<div class="col"><div class="p"><div class="k">${role}</div><h2>${c[0]}</h2><div class="pill">Hit Point Die: ${die.toUpperCase()}${q("Hit Point Die")}</div><p>${c[2]}</p>
<div class="k">Class features</div><div class="ft">${f.map((t) => `<div class="fi ${t[0] > S.lv ? "lk" : ""}" tabindex="0"><span>${t[1]}</span><div class="tip"><b>${t[2]}</b><em>Level ${t[0]}</em>${t[3]}</div></div>`).join("")}</div>
<div class="k">Recommended stat distribution</div><div class="rings">${AB.map((a) => rg(a, c)).join("")}</div>
<div class="row"><div class="lvl"><button id="lm">−</button><span>Level ${S.lv}</span><button id="lp">+</button></div><button class="nav" id="lu">View level up traits</button></div>
<button class="cta" id="pk">Choose ${c[0]}</button></div></div></div>
<div class="rail"><button class="nav" id="pv">◀ Prev</button><button class="nav" id="nx">Next ▶</button></div>`;
  document.querySelectorAll(".ci").forEach(
    (q) =>
      (q.onclick = () => {
        S.c = +q.dataset.i;
        cl();
      }),
  );
  $("lm").onclick = () => {
    S.lv = Math.max(1, S.lv - 1);
    cl();
  };
  $("lp").onclick = () => {
    S.lv = Math.min(12, S.lv + 1);
    cl();
  };
  $("lu").onclick = () => {
    $("m2t").textContent = c[0] + " · Level-up traits";
    $("m2b").innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      .map((l) => {
        const g = f
          .filter((t) => t[0] == l)
          .map((t) => `<li>${t[1]} <b>${t[2]}</b> · ${t[3]}</li>`);
        if ([4, 8, 12].includes(l))
          g.push(
            "<li>📈 <b>Ability Score Improvement</b> · +2 to one score, +1 to two, or take a feat.</li>",
          );
        if (l == 5 || l == 9)
          g.push(`<li>🎓 <b>Proficiency Bonus +${l == 5 ? 3 : 4}</b></li>`);
        return `<div class="lr ${l <= S.lv ? "on" : ""}"><b>Level ${l}</b><ul>${g.join("")}</ul></div>`;
      })
      .join("");
    $("m2").classList.add("on");
  };
  $("pk").onclick = () => {
    S.p.cl = c[0];
    sm();
    S.t = 3;
    rd();
  };
  $("pv").onclick = () => {
    S.t = 1;
    rd();
  };
  $("nx").onclick = $("pk").onclick;
}
function go(d) {
  if (S.t > 3) return;
  if (S.t == 1) {
    S.s = (S.s + d + SP.length) % SP.length;
    sp();
  } else if (S.t == 3) {
    S.b = (S.b + d + BG.length) % BG.length;
    bg();
  } else {
    S.c = (S.c + d + CL.length) % CL.length;
    cl();
  }
}
function all() {
  $("gr").innerHTML = SP.map(
    (q, i) =>
      `<button class="tile ${i == S.s ? "on" : ""}" data-i="${i}">${ch(look(i), "40 30 220 220")}${q.n}</button>`,
  ).join("");
  document.querySelectorAll(".tile").forEach(
    (t) =>
      (t.onclick = () => {
        S.s = +t.dataset.i;
        $("m").classList.remove("on");
        sp();
      }),
  );
  $("m").classList.add("on");
}
function sm() {
  $("sum").innerHTML =
    `Your hero: <b>${S.p.sp || "…"}</b> · <b>${S.p.cl || "…"}</b> · <b>${S.p.bg || "…"}</b>${((n) => (n ? ` · <b>${n} spells</b>` : ""))(Object.values(S.sel).flat().length)}`;
}
function rd() {
  [sp, cl, bg, skl, spl, abl, eqp, sheet][S.t - 1]();
}
$("x2").onclick = () => $("m2").classList.remove("on");
$("v").addEventListener("click", (e) => {
  const b = e.target.closest("[data-st]");
  if (b && !b.disabled) {
    S.t = +b.dataset.st;
    rd();
  }
});
$("x").onclick = () => $("m").classList.remove("on");
const AN2 = {
    STR: ["Strength", "Athletics · melee power"],
    DEX: ["Dexterity", "Acrobatics, Stealth · AC"],
    CON: ["Constitution", "Hit points · concentration"],
    INT: ["Intelligence", "Arcana, History · lore"],
    WIS: ["Wisdom", "Perception, Insight"],
    CHA: ["Charisma", "Persuasion, Deception"],
  },
  COST = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
const spent = () => AB.reduce((t, a) => t + COST[S.ab.s[a]], 0);
function bon() {
  const o = S.ab,
    L = BG[S.b][3];
  if (!L.includes(o.p2)) o.p2 = L[0];
  if (!L.includes(o.p1) || o.p1 == o.p2) o.p1 = L.find((a) => a != o.p2);
  return (a) =>
    o.m == 111 ? +L.includes(a) : a == o.p2 ? 2 : a == o.p1 ? 1 : 0;
}
const pri = () => {
  const r = [...CL[S.c][3], "CON", "DEX", "WIS", "CHA", "INT", "STR"];
  return r.filter((a, i) => r.indexOf(a) == i);
};
function recAb() {
  const o = S.ab,
    T = [15, 14, 13, 12, 10, 8],
    P = pri(),
    best = P.filter((a) => BG[S.b][3].includes(a));
  P.forEach((a, i) => (o.s[a] = T[i]));
  o.m = 21;
  o.p2 = best[0];
  o.p1 = best[1];
}
function abl() {
  const o = S.ab,
    y = scrollY,
    b = bon(),
    L = BG[S.b][3],
    left = 27 - spent(),
    c = CL[S.c],
    fin = (a) => o.s[a] + b(a),
    md = (a) => Math.floor((fin(a) - 10) / 2),
    sg = (n) => (n >= 0 ? "+" : "") + n,
    hp = +c[4].split(" · ")[0].slice(1) + md("CON");
  const row = (a) => {
    const k = c[3].indexOf(a);
    return `<div class="ar ${k >= 0 ? "rec" : ""}"><div><b>${AN2[a][0]}</b><small>${AN2[a][1]}</small>${k >= 0 ? `<em>${k ? "Recommended · Support" : "Recommended · Primary"}</em>` : ""}</div><div class="sp"><button data-a="${a}" data-d="-1" ${o.s[a] <= 8 ? "disabled" : ""}>−</button><span>${o.s[a]}</span><button data-a="${a}" data-d="1" ${o.s[a] >= 15 || COST[o.s[a] + 1] - COST[o.s[a]] > left ? "disabled" : ""}>+</button></div><div class="bn">${b(a) ? "+" + b(a) : ""}</div><div class="fv"><b>${fin(a)}</b><small>${sg(md(a))}</small></div></div>`;
  };
  const ch2 = (k, a) =>
    `<button class="chip ${o["p" + k] == a ? "on" : ""}" data-p="${k}:${a}">${a}</button>`;
  $("v").innerHTML = `<div class="stage"><div class="col">${steps()}
<div class="p"><div class="k">Points remaining</div><div class="pips">${Array.from({ length: 27 }, (_, i) => `<i class="${i < 27 - left ? "u" : ""}"></i>`).join("")}</div><div class="note"><b style="color:var(--g)">${left}</b> of 27 · scores range 8–15 before bonuses</div></div>
<div class="p"><div class="k">${BG[S.b][0]} bonus</div><div class="chips"><button class="chip ${o.m == 21 ? "on" : ""}" data-m="21">+2 / +1</button><button class="chip ${o.m == 111 ? "on" : ""}" data-m="111">+1 / +1 / +1</button></div>${o.m == 21 ? `<div class="note">+2 to</div><div class="chips">${L.map((a) => ch2(2, a)).join("")}</div><div class="note">+1 to</div><div class="chips">${L.map((a) => ch2(1, a)).join("")}</div>` : `<div class="note">+1 to ${L.join(", ")}</div>`}</div></div>
<div class="hero">${ch(look(S.s, c[5]))}<div class="badge">${c[1]}</div></div>
<div class="col"><div class="p"><div class="k">Ability scores</div><div class="boxes" style="grid-template-columns:repeat(3,1fr)">${box(hp, "Hit points", "#e58fb6")}${box(10 + md("DEX"), "Armor class", "#f3c26b")}${box(sg(md("DEX")), "Initiative", "#9fe0d0")}</div></div>
<div class="p"><div class="row" style="margin:0 0 6px"><button class="nav" id="rc">★ Recommended for ${c[0]}</button><button class="nav" id="rs">Reset</button></div>${AB.map(row).join("")}<button class="cta" id="pk">Confirm ability scores ▶</button></div></div></div>`;
  document.querySelectorAll("[data-d]").forEach(
    (e) =>
      (e.onclick = () => {
        o.s[e.dataset.a] += +e.dataset.d;
        S.p.ab = 0;
        abl();
      }),
  );
  document.querySelectorAll("[data-m]").forEach(
    (e) =>
      (e.onclick = () => {
        o.m = +e.dataset.m;
        S.p.ab = 0;
        abl();
      }),
  );
  document.querySelectorAll("[data-p]").forEach(
    (e) =>
      (e.onclick = () => {
        const [k, a] = e.dataset.p.split(":");
        if (k == 2) o.p2 = a;
        else {
          if (a == o.p2) o.p2 = o.p1;
          o.p1 = a;
        }
        S.p.ab = 0;
        abl();
      }),
  );
  $("rc").onclick = () => {
    recAb();
    S.p.ab = 0;
    abl();
  };
  $("rs").onclick = () => {
    AB.forEach((a) => (o.s[a] = 8));
    S.p.ab = 0;
    abl();
  };
  $("pk").onclick = () => {
    S.p.ab = 1;
    S.t = 7;
    rd();
  };
  scrollTo(0, y);
}
// ---- Shared maths: final score, modifier, signed number ----
// Ability Score Improvements at levels 4, 8 and 12 go +2 into the class's
// main ability (max 20), then its second one.
// ponytail: Fighter/Rogue bonus ASIs and feats instead of +2 are not modelled
function asi(a) {
  const [p1, p2] = CL[S.c][3],
    base = (k) => S.ab.s[k] + bon()(k);
  let left = 2 * ((S.lv >= 4) + (S.lv >= 8) + (S.lv >= 12)),
    add = { [p1]: 0, [p2]: 0 };
  for (const k of [p1, p2]) {
    add[k] = Math.max(0, Math.min(left, 20 - base(k)));
    left -= add[k];
  }
  return add[a] || 0;
}
const fin = (a) => S.ab.s[a] + bon()(a) + asi(a),
  md = (a) => Math.floor((fin(a) - 10) / 2),
  sg = (n) => (n >= 0 ? "+" : "") + n,
  pb = () => 2 + Math.floor((S.lv - 1) / 4);
// ---- Skills ----
function skSrc() {
  const c = CL[S.c][0],
    [n, from, rec] = CSK[c],
    x = SP[S.s],
    a = [{ k: "cl", t: c + " skills", n, from, rec }];
  if (x.n == "Human")
    a.push({ k: "hu", t: "Human · Skillful", n: 1, from: [], rec: ["Perception", "Insight"] });
  if (x.n == "Elf")
    a.push({ k: "el", t: "Elf · Keen Senses", n: 1, from: ["Insight", "Perception", "Survival"], rec: ["Perception", "Insight"] });
  if (BG[S.b][4] == "Skilled")
    a.push({ k: "fe", t: "Skilled feat", n: 3, from: [], rec: ["Perception", "Insight", "Persuasion", "Stealth"] });
  return a;
}
// Drop picks that no longer fit (class changed, now from background…); returns every proficient skill
function skFix() {
  const taken = [...BG[S.b][5]];
  for (const a of skSrc()) {
    S.ks[a.k] = (S.ks[a.k] || [])
      .filter((n) => (!a.from.length || a.from.includes(n)) && !taken.includes(n))
      .slice(0, a.n);
    taken.push(...S.ks[a.k]);
  }
  return taken;
}
function recSkills() {
  const taken = [...BG[S.b][5]];
  for (const a of skSrc()) {
    const pool = a.from.length ? a.from : SKL.map((x) => x[0]);
    S.ks[a.k] = [...a.rec, ...pool]
      .filter((n, i, r) => r.indexOf(n) == i && !taken.includes(n))
      .slice(0, a.n);
    taken.push(...S.ks[a.k]);
  }
}
function skl() {
  const A = skSrc(),
    a = A[Math.min(S.kk, A.length - 1)],
    y = scrollY,
    taken = skFix(),
    sel = S.ks[a.k],
    bgs = BG[S.b][5];
  const card = ([n, ab, d]) => {
    const on = sel.includes(n),
      fb = bgs.includes(n),
      other = !on && !fb && taken.includes(n);
    if (!fb && !other && a.from.length && !a.from.includes(n)) return "";
    const tag = fb
      ? "✔ Background"
      : other
        ? "✔ Taken"
        : a.rec.includes(n)
          ? "★ Recommended"
          : "";
    return `<div class="sc ${on ? "on" : ""} ${fb || other ? "lock" : ""} ${!on && !fb && !other && sel.length >= a.n ? "full" : ""}" data-k="${n}"><div class="sh"><b>${n}</b><em>${tag}</em></div><p><b>Used for:</b> ${d}</p><div class="inf">Uses ${AN2[ab][0]}</div></div>`;
  };
  $("v").innerHTML =
    `<div class="spw"><div class="col">${steps()}<div class="p" style="text-align:center"><div style="width:170px;margin:0 auto">${ch(look(S.s, CL[S.c][5]), "40 30 220 220")}</div><div class="k">Your skills</div><p style="margin-top:8px">${taken.join(" · ")}</p></div></div>
<div class="p"><p>Skills are what you're good at outside of combat. You add your proficiency bonus (+2) when you roll for one you're trained in. Your background already gave you <b style="color:var(--g)">${bgs.join(" and ")}</b>.</p><div class="chips">${A.map((x, i) => `<button class="chip ${x === a ? "on" : ""}" data-kk="${i}">${x.t}</button>`).join("")}</div><div class="row" style="margin:0"><span class="pill">Chosen ${sel.length}/${a.n}${q("Proficiency")}</span><button class="nav" id="rck">★ Use recommended skills</button></div>
<div class="sg">${SKL.map(card).join("")}</div><button class="cta" id="gok">Continue ▶</button></div></div>`;
  document.querySelectorAll("[data-k]").forEach(
    (e) =>
      (e.onclick = () => {
        const n = e.dataset.k,
          i = sel.indexOf(n);
        if (i >= 0) sel.splice(i, 1);
        else if (!taken.includes(n) && sel.length < a.n) sel.push(n);
        skl();
      }),
  );
  document.querySelectorAll("[data-kk]").forEach(
    (b) =>
      (b.onclick = () => {
        S.kk = +b.dataset.kk;
        skl();
      }),
  );
  $("rck").onclick = () => {
    recSkills();
    skl();
  };
  $("gok").onclick = () => {
    S.t = hasSp() ? 5 : 6;
    rd();
  };
  scrollTo(0, y);
}
// ---- Equipment ----
const eqOpts = () => {
  const e = EQ[CL[S.c][0]];
  return [...e.k, ["Gold only", `${e.g} GP to buy your own gear with your DM`, 0, [], e.g]];
};
function acOf(o) {
  const ar = o[2] || { Barbarian: "UB", Monk: "UM" }[CL[S.c][0]] || [10, 99, 0];
  if (ar == "UB") return 10 + md("DEX") + md("CON");
  if (ar == "UM") return 10 + md("DEX") + md("WIS");
  return ar[0] + (ar[1] ? Math.min(md("DEX"), ar[1]) : 0) + ar[2];
}
const wmod = (w) =>
  w[3] == "S" ? md("STR") : w[3] == "D" ? md("DEX") : Math.max(md("STR"), md("DEX"));
const atk = (w) =>
  `<li><b>${w[0]}</b> · ${sg(wmod(w) + pb())} to hit · ${w[1]}${wmod(w) ? sg(wmod(w)) : ""} ${w[2]}</li>`;
function eqp() {
  const O = eqOpts(),
    y = scrollY;
  S.eq = Math.min(S.eq, O.length - 1);
  $("v").innerHTML =
    `<div class="spw"><div class="col">${steps()}<div class="p" style="text-align:center"><div style="width:170px;margin:0 auto">${ch(look(S.s, CL[S.c][5]), "40 30 220 220")}</div><div class="boxes" style="grid-template-columns:repeat(2,1fr)">${box(acOf(O[S.eq]), "Armor class", "#f3c26b")}${box(O[S.eq][4] + " GP", "Gold", "#e0793a")}</div></div></div>
<div class="p"><p>Take the standard kit and you're ready to play: armor, weapons and supplies picked for a ${CL[S.c][0]}. The numbers below are already worked out from your ability scores.</p><div class="sg">${O.map(
      (o, i) =>
        `<div class="sc ${i == S.eq ? "on" : ""}" data-e="${i}"><div class="sh"><b>${o[0]}</b><em>${i == 0 ? "★ Recommended" : ""}</em></div><p>${o[1]}${o[3].length ? ` · ${o[4]} GP` : ""}</p><div class="inf">🛡️ AC ${acOf(o)}</div>${o[3].length ? `<ul class="tr" style="max-height:none">${o[3].map(atk).join("")}</ul>` : ""}</div>`,
    ).join("")}</div><button class="cta" id="goe">See my character ▶</button></div></div>`;
  document.querySelectorAll("[data-e]").forEach(
    (e) =>
      (e.onclick = () => {
        S.eq = +e.dataset.e;
        eqp();
      }),
  );
  $("goe").onclick = () => {
    S.t = 8;
    rd();
  };
  scrollTo(0, y);
}
// ---- Summary: every number worked out ----
function sheet() {
  const c = CL[S.c],
    cx = CX[c[0]],
    x = SP[S.s],
    l = x.L[S.l[S.s] || 0],
    o = eqOpts()[Math.min(S.eq, eqOpts().length - 1)],
    prof = skFix(),
    PB = pb(),
    die = +c[4].slice(1, 3),
    // ponytail: non-casters with a racial/feat spell use their best mental score; ask per source if it matters
    cs = cx[1] || ["INT", "WIS", "CHA"].sort((p, r) => md(r) - md(p))[0],
    dc = 8 + PB + md(cs),
    spells = [...new Set(Object.values(S.sel).flat())],
    // max die at level 1, the average (half + 1) each level after
    hp =
      die + md("CON") + (S.lv - 1) * (die / 2 + 1 + md("CON")) + (x.n == "Dwarf" ? S.lv : 0),
    feats = F[c[0]].filter((t) => t[0] <= S.lv),
    ups = [4, 8, 12].filter((n) => n <= S.lv),
    sk = (n) => md(SKL.find((s) => s[0] == n)[1]) + (prof.includes(n) ? PB : 0);
  const spl1 = (n) => {
    const z = SPL.find((s) => s[0] == n);
    const bits = [
      z[9] == "Attack roll" ? `${sg(md(cs) + PB)} to hit` : / save/.test(z[9]) ? `DC ${dc} ${z[9]}` : "",
      `${z[5]} ${z[4]}`.trim(),
    ].filter(Boolean);
    return `<li><b>${n}</b>${bits.length ? " · " + bits.join(" · ") : ""}</li>`;
  };
  $("v").innerHTML =
    `<div class="stage"><div class="col">${steps()}<div class="p"><div class="k">Level ${S.lv} ${c[0]}</div><h2>${S.p.sp || spName()}</h2><p>${BG[S.b][0]} background</p><div class="k">Your first fight</div><p>${cx[2]}</p></div>
<div class="p"><div class="k">Ability scores</div><div class="boxes" style="grid-template-columns:repeat(3,1fr)">${AB.map((a) => box(sg(md(a)), a + " " + fin(a), "#f3c26b")).join("")}</div>${ups.length ? `<div class="note">Includes +${ups.length * 2} from Ability Score Improvements at level ${ups.join(", ")}.</div>` : ""}<div class="k" style="margin-top:12px">Saving throws${q("Saving throws")}</div><ul class="tr" style="max-height:none">${AB.map((a) => `<li>${cx[0].includes(a) ? "<b>★ " + a + "</b>" : a} ${sg(md(a) + (cx[0].includes(a) ? PB : 0))}</li>`).join("")}</ul></div>
<div class="p"><div class="k">Class features</div><ul class="tr" style="max-height:none">${feats.map((t) => `<li>${t[1]} <b>${t[2]}</b> · ${t[3]}</li>`).join("")}</ul></div></div>
<div class="hero">${ch(look(S.s, c[5]))}<div class="badge">${c[1]}</div></div>
<div class="col"><div class="p"><div class="k">Combat</div><div class="boxes">${box(hp, "Hit points", "#e58fb6")}${box(acOf(o), "Armor class", "#f3c26b")}${box(sg(md("DEX")), "Initiative", "#9fe0d0")}${box(((l && l.sp) || x.sp) + " ft", "Speed", "#e0793a")}</div>
${o[3].length ? `<div class="k" style="margin-top:12px">Weapons</div><ul class="tr" style="max-height:none">${o[3].map(atk).join("")}</ul>` : ""}</div>
${spells.length ? `<div class="p"><div class="k">Spells</div><div class="boxes" style="grid-template-columns:repeat(2,1fr)">${box(dc, "Spell save DC", "#9fe0d0")}${box(sg(md(cs) + PB), "Spell attack", "#e58fb6")}</div><ul class="tr" style="max-height:none">${spells.map(spl1).join("")}</ul></div>` : ""}
<div class="p"><div class="k">Skills · ★ = proficient</div><div class="boxes" style="grid-template-columns:repeat(2,1fr)">${box(sg(PB), "Proficiency", "#f3c26b")}${box(10 + sk("Perception"), "Passive Perception", "#9fe0d0")}</div><ul class="tr two" style="max-height:none">${SKL.map(([n]) => `<li>${prof.includes(n) ? `<b>★ ${n}</b>` : n} ${sg(sk(n))}</li>`).join("")}</ul>
<div class="k" style="margin-top:12px">Equipment</div><p style="margin-top:6px">${o[1]}${o[3].length ? ` · ${o[4]} GP` : ""}</p></div></div></div>`;
}
// ---- Ready-made characters ----
function exm() {
  $("m2t").textContent = "Start from a ready-made character";
  $("m2b").innerHTML =
    `<p class="note">Pick one and every step is filled in for you. You can still go back and change anything.</p><div class="grid">${EX.map((e, i) => {
      const x = SP.find((s) => s.n == e[1]),
        l = x.L[e[2]],
        c = CL.find((k) => k[0] == e[4]);
      return `<button class="tile" data-x="${i}">${ch({ ...x.v, ...(l ? l.v : {}), robe: c[5] }, "40 30 220 220")}${e[0]}<small class="note" style="display:block;padding:0 8px">${l ? l.n.replace(/ ·.*| Elf$/, "") + " " : ""}${e[1]} ${e[4]}<br>${e[5]}</small></button>`;
    }).join("")}</div>`;
  document.querySelectorAll("[data-x]").forEach(
    (b) =>
      (b.onclick = () => {
        const e = EX[+b.dataset.x];
        askLevel("", exm, (lv) =>
          build(
            SP.findIndex((s) => s.n == e[1]),
            e[2],
            BG.findIndex((k) => k[0] == e[3]),
            CL.findIndex((k) => k[0] == e[4]),
            lv,
          ),
        );
      }),
  );
  $("m2").classList.add("on");
}
// Fill every step with recommended picks and jump to the summary
function build(si, li, bi, ci, lv = 1) {
  S.lv = lv;
  S.s = si;
  S.l[si] = li;
  S.b = bi;
  S.c = ci;
  S.sel = {};
  S.ks = {};
  S.eq = 0;
  recSkills();
  recSpells();
  recAb();
  S.p = { sp: spName(), bg: BG[bi][0], cl: CL[ci][0], ab: 1 };
  S.t = 8;
  $("m2").classList.remove("on");
  rd();
  sm();
}
// Bardic Inspiration: a few questions, then a character built from the answers
function quiz(i = 0, ans = []) {
  const n = QZ.length + 1,
    head = `<div class="note">Question ${i + 1} of ${n}</div><div class="bar"><i style="width:${(i / n) * 100}%"></i></div>`;
  $("m2t").textContent = "Bardic Inspiration";
  if (i == QZ.length)
    return askLevel(head, () => quiz(i - 1, ans.slice(0, -1)), (lv) => build(...fromQuiz(ans), lv));
  const [q, opts] = QZ[i];
  $("m2b").innerHTML =
    `${head}<h3 class="qq">${q}</h3><div class="sg">${opts.map((o, k) => `<button class="sc qa" data-q="${k}"><div class="sh"><b>${o.t}</b></div>${o.h ? `<p>${o.h}</p>` : ""}</button>`).join("")}</div>${i ? '<button class="nav" id="qb" style="margin-top:14px">◀ Back</button>' : ""}`;
  document.querySelectorAll("[data-q]").forEach(
    (b) => (b.onclick = () => quiz(i + 1, [...ans, +b.dataset.q])),
  );
  if (i) $("qb").onclick = () => quiz(i - 1, ans.slice(0, -1));
  $("m2").classList.add("on");
}
// Last question for quick build and ready-made characters: starting level
function askLevel(head, back, done) {
  $("m2b").innerHTML =
    `${head}<h3 class="qq">What level is your adventure starting at?</h3><p class="note">New to D&amp;D or starting a new campaign? Pick level 1. If you're joining a game already underway, ask your DM.</p><div class="lvls">${Array.from({ length: 12 }, (_, i) => `<button class="sc qa" data-lv="${i + 1}"><b>${i + 1}</b>${i ? "" : "<small>Recommended</small>"}</button>`).join("")}</div><button class="nav" id="qb" style="margin-top:14px">◀ Back</button>`;
  document.querySelectorAll("[data-lv]").forEach((b) => (b.onclick = () => done(+b.dataset.lv)));
  $("qb").onclick = back;
  $("m2").classList.add("on");
}
// Answers -> [species, lineage, background, class] indexes
function fromQuiz(ans) {
  const pick = ans.map((k, i) => QZ[i][1][k]),
    pts = {},
    r = (n) => Math.floor(Math.random() * n);
  // some questions count more (party role); ties go to the earlier answer
  pick.forEach((o, i) => {
    for (const c in o.c || {}) pts[c] = (pts[c] || 0) + o.c[c] * (QZ[i][2] || 1);
  });
  const cn = Object.keys(pts).sort((x, y) => pts[y] - pts[x])[0],
    ci = CL.findIndex((c) => c[0] == cn),
    bs = pick.find((o) => o.b).b,
    bn = bs.find((n) => BG.find((b) => b[0] == n)[3].includes(CL[ci][3][0])) || bs[0],
    ss = pick.find((o) => o.s).s,
    sn = ss.length ? ss[r(ss.length)] : SP[r(SP.length)].n,
    si = SP.findIndex((x) => x.n == sn);
  return [si, r(SP[si].L.length || 1), BG.findIndex((b) => b[0] == bn), ci];
}
addEventListener("keydown", (e) => {
  if (e.key == "ArrowRight") go(1);
  if (e.key == "ArrowLeft") go(-1);
});
rd();
if (location.hash == "#ready") exm();
if (location.hash == "#quick") quiz();
// Show the site's main address (…/Origin/) whichever portal brought us here.
// Refreshing goes back to the tavern, which is fine: picks aren't saved yet.
try {
  history.replaceState(null, "", "./");
} catch (e) {}
