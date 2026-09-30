const makeList = ({ items, perPage, gridId, pagerId, sectionId, card, matches, empty }) => {
  const grid = document.getElementById(gridId);
  const pager = document.getElementById(pagerId);
  const state = { list: items, page: 1, query: "", extra: () => true };

  const buildPager = total => {
    pager.innerHTML = "";
    const pages = Math.ceil(total / perPage);
    if (pages <= 1) return;
    const btn = (label, page, { disabled, active, arrow } = {}) => {
      const b = document.createElement("button");
      b.className = "page-btn" + (active ? " active" : "");
      b.disabled = !!disabled;
      b.innerHTML = label;
      if (arrow) b.setAttribute("aria-label", page < state.page ? "Previous page" : "Next page");
      b.addEventListener("click", () => go(page));
      pager.appendChild(b);
    };
    btn('<ion-icon name="chevron-back-outline"></ion-icon>', state.page - 1, { disabled: state.page === 1, arrow: true });
    for (let p = 1; p <= pages; p++) btn(String(p), p, { active: p === state.page });
    btn('<ion-icon name="chevron-forward-outline"></ion-icon>', state.page + 1, { disabled: state.page === pages, arrow: true });
  };

  const show = () => {
    const start = (state.page - 1) * perPage;
    const slice = state.list.slice(start, start + perPage);
    grid.innerHTML = slice.length ? slice.map(card).join("") : `<p class="empty">${empty}</p>`;
    buildPager(state.list.length);
    if (slice.length) window.animateIn(grid);
  };

  const go = page => {
    if (page < 1 || page > Math.ceil(state.list.length / perPage)) return;
    state.page = page;
    show();
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
  };

  const refilter = () => {
    const q = state.query;
    state.list = items.filter(i => state.extra(i) && matches(i, q));
    state.page = 1;
    show();
  };

  show();
  return { state, refilter };
};

const datasetCard = d => `
  <article class="dcard" data-cat="${d.category}">
    <div class="dimg"><img src="${d.image}" alt=""><span class="chip">${d.category}</span></div>
    <div class="dbody">
      <h3>${d.title}</h3>
      <p>${d.description}</p>
      <div class="dact">
        ${d.viewLink ? `<a href="${d.viewLink}" class="icon-btn view-btn" title="View map"><ion-icon name="eye-outline"></ion-icon></a>` : ""}
        <a href="${d.downloadLink}" class="icon-btn download-btn" title="Download" download><ion-icon name="download-outline"></ion-icon></a>
      </div>
    </div>
  </article>`;

const policyCard = p => `
  <a class="policy-card" href="${p.link}">
    <div class="policy-card-image"><img src="${p.image}" alt=""></div>
    <div class="policy-card-content"><h3>${p.title}</h3><p>${p.description}</p></div>
  </a>`;

const dsList = makeList({
  items: datasets, perPage: 6, gridId: "dataset-grid", pagerId: "pagination", sectionId: "dataset-section",
  card: datasetCard, empty: "No dataset found matching your search.",
  matches: (d, q) => [d.title, d.description, d.category].some(t => t.toLowerCase().includes(q))
});

const plList = makeList({
  items: policies, perPage: 10, gridId: "policy-grid", pagerId: "policy-pagination", sectionId: "policy-section",
  card: policyCard, empty: "No policy found matching your search.",
  matches: (p, q) => [p.title, p.description].some(t => t.toLowerCase().includes(q))
});

document.getElementById("searchInput").addEventListener("input", e => { dsList.state.query = e.target.value.toLowerCase(); dsList.refilter(); });
document.getElementById("searchPolicyInput").addEventListener("input", e => { plList.state.query = e.target.value.toLowerCase(); plList.refilter(); });

const cats = ["All", ...new Set(datasets.map(d => d.category))];
let catIndex = 0;
document.getElementById("filter-btn").addEventListener("click", () => {
  catIndex = (catIndex + 1) % cats.length;
  const c = cats[catIndex];
  document.getElementById("filter-label").textContent = c;
  dsList.state.extra = d => c === "All" || d.category === c;
  dsList.refilter();
});

document.getElementById("footer-year").textContent = new Date().getFullYear();

/* Chatbot button appears after the hero, with a short-lived tooltip */
const initChatbot = () => {
  const bot = document.querySelector("flowise-fullchatbot");
  const hero = document.getElementById("home-section");
  if (!bot) return false;
  const tip = document.createElement("div");
  tip.className = "chatbot-tooltip";
  tip.textContent = "Ask Land Lens AI";
  document.body.appendChild(tip);
  let timer;
  const hide = () => { tip.classList.remove("tooltip-visible"); clearTimeout(timer); };
  new IntersectionObserver(([e]) => {
    bot.classList.toggle("chatbot-visible", !e.isIntersecting);
    if (e.isIntersecting) hide();
    else { tip.classList.add("tooltip-visible"); clearTimeout(timer); timer = setTimeout(hide, 4500); }
  }).observe(hero);
  bot.addEventListener("click", hide);
  return true;
};
if (!initChatbot()) {
  const watch = new MutationObserver((_, o) => initChatbot() && o.disconnect());
  watch.observe(document.body, { childList: true, subtree: true });
}