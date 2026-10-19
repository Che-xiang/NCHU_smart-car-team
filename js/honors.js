/* 荣誉档案：届次 → 赛事阶段 → 组别 → 队伍 → 证书。数据见 honors-data.js。 */
(function () {
  "use strict";
  const root = document.getElementById("honorsArchive");
  const archive = window.HONORS_ARCHIVE;
  if (!root || !archive) return;
  const records = archive.certificates.filter(item => ["student", "team"].includes(item.role));
  const roles = { team: "团队证书", student: "队员证书" };
  const stages = { national: "全国总决赛", regional: "分赛区", history: "历史归档" };
  const batchSize = 12;
  let edition = null;
  let stage = "national";
  let search = "";
  let gallery = [];
  let position = 0;
  let opener = null;

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function button(cls, text, action) {
    const node = el("button", cls, text);
    node.type = "button";
    node.addEventListener("click", action);
    return node;
  }
  function distinct(items, key) { return [...new Set(items.map(item => item[key]))]; }
  function editionItems(id) { return records.filter(item => item.edition === id); }
  function thumbnailPath(item) {
    return item.thumbnail || item.image;
  }

  const heading = el("div", "archive-heading");
  heading.append(el("p", "kicker", "HONORS ARCHIVE"), el("h3", "", "每一份荣誉，都有迹可循"),
    el("p", "archive-muted", "选择届次，再按赛事阶段、组别和队伍查看团队与队员获奖证书。个人证书未注明队名时，归入“队伍未标注”，不推断所属队伍。"));
  const editions = el("div", "archive-editions");
  editions.setAttribute("aria-label", "选择竞赛届次");
  const editionButtons = [];
  archive.editions.forEach(item => {
    const certificates = editionItems(item.id);
    const card = button("archive-edition", "", () => chooseEdition(item));
    card.setAttribute("aria-pressed", "false");
    card.append(el("span", "archive-year", item.subtitle), el("strong", "", item.label),
      el("span", "archive-card-count", certificates.length ? certificates.length + " 张证书已收录" : "等待收录"),
      el("span", "archive-card-link", "进入专区 →"));
    editions.append(card);
    editionButtons.push({ item, card });
  });
  const welcome = el("p", "archive-empty", "从上方选择一个届次，展开属于这一届的荣誉档案。");
  const panel = el("div", "archive-panel");
  panel.hidden = true;
  const panelHead = el("div", "archive-panel-head");
  const panelTitle = el("h3", "");
  panelTitle.tabIndex = -1;
  const back = button("archive-back", "← 返回全部届次", () => {
    panel.hidden = true;
    welcome.hidden = false;
    editionButtons.forEach(({card}) => card.setAttribute("aria-pressed", "false"));
    const selected = editionButtons.find(({item}) => item.id === edition.id);
    if (selected) selected.card.focus();
  });
  panelHead.append(panelTitle, back);
  const stageButtons = el("div", "archive-stages");
  stageButtons.setAttribute("aria-label", "选择赛事阶段");
  const searchLabel = el("label", "archive-search");
  searchLabel.append(el("span", "", "查找本届证书"));
  const input = el("input", "");
  input.type = "search";
  input.placeholder = "搜索组别、队名或姓名";
  searchLabel.append(input);
  const status = el("p", "archive-status");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const groups = el("div", "archive-groups");
  panel.append(panelHead, stageButtons, searchLabel, status, groups);
  root.append(heading, editions, welcome, panel);
  let searchTimer;
  input.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { search = input.value.trim(); renderGroups(); }, 180);
  });

  function chooseEdition(item) {
    clearTimeout(searchTimer);
    edition = item;
    search = "";
    input.value = "";
    const available = editionItems(item.id);
    stage = available.length ? available[0].stage : "national";
    panel.hidden = false;
    welcome.hidden = true;
    panelTitle.textContent = item.label + " · 荣誉档案";
    editionButtons.forEach(entry => entry.card.setAttribute("aria-pressed", String(entry.item.id === item.id)));
    renderStages();
    renderGroups();
    panelTitle.focus({ preventScroll: true });
  }
  function stageLabel(key) { return edition.id === "20" && key === "regional" ? "华东赛区" : stages[key] || key; }
  function renderStages() {
    stageButtons.replaceChildren();
    const available = editionItems(edition.id);
    const keys = edition.id === "before19" ? distinct(available, "stage") : ["national", "regional"];
    keys.forEach(key => {
      const count = available.filter(item => item.stage === key).length;
      const tab = button("archive-stage", (stageLabel(key)) + " · " + count + "张", () => {
        stage = key;
        stageButtons.querySelectorAll("button").forEach(node => node.setAttribute("aria-pressed", String(node === tab)));
        renderGroups();
      });
      tab.setAttribute("aria-pressed", String(stage === key));
      stageButtons.append(tab);
    });
  }
  function renderGroups() {
    groups.replaceChildren();
    const all = editionItems(edition.id).filter(item => item.stage === stage);
    const query = search.toLocaleLowerCase();
    const visible = all.filter(item => !query || [item.group, item.team, item.name, item.award, roles[item.role]].join(" ").toLocaleLowerCase().includes(query));
    gallery = visible;
    status.textContent = (stageLabel(stage)) + " · " + distinct(visible, "group").length + " 个组别 · " +
      new Set(visible.map(item => item.group + "/" + item.team)).size + " 个归档栏 · " + visible.length + " 张证书" +
      (search ? "（搜索结果）" : "；证书张数不等于获奖项数。");
    if (!visible.length) {
      groups.append(el("p", "archive-empty", search ? "没有找到匹配的证书，请更换关键词或切换赛事阶段。" : "本专区暂未收录该阶段的证书，后续上传后会在这里显示。"));
      return;
    }
    distinct(visible, "group").forEach(name => {
      const items = visible.filter(item => item.group === name);
      const detail = el("details", "archive-group");
      const summary = el("summary", "archive-summary");
      summary.append(el("span", "archive-summary-title", name),
        el("span", "archive-summary-count", distinct(items, "team").length + " 个归档栏 / " + items.length + " 张"));
      detail.append(summary);
      const content = el("div", "archive-group-content");
      distinct(items, "team").forEach(team => content.append(teamDetails(team, items.filter(item => item.team === team))));
      detail.append(content);
      if (search) detail.open = true;
      groups.append(detail);
    });
  }
  function teamDetails(name, items) {
    const detail = el("details", "archive-team");
    const summary = el("summary", "archive-summary");
    const title = el("span", "archive-summary-title", name);
    const awards = distinct(items, "award").filter(Boolean).join(" / ");
    if (awards) title.append(el("span", "archive-award", awards));
    summary.append(title, el("span", "archive-summary-count", items.length + " 张证书"));
    detail.append(summary);
    let built = false;
    function build() {
      if (built) return;
      built = true;
      const body = el("div", "archive-team-body");
      Object.entries(roles).forEach(([role, label]) => {
        const certificates = items.filter(item => item.role === role);
        if (!certificates.length) return;
        const section = el("section", "archive-role");
        section.append(el("h4", "", label + " · " + certificates.length + "张"));
        const grid = el("div", "archive-certificate-grid");
        section.append(grid);
        let shown = 0;
        const more = button("archive-more", "加载更多", appendBatch);
        function appendBatch() {
          certificates.slice(shown, shown + batchSize).forEach(item => grid.append(certificateCard(item)));
          shown = Math.min(shown + batchSize, certificates.length);
          more.hidden = shown >= certificates.length;
          more.textContent = "再显示 " + Math.min(batchSize, certificates.length - shown) + " 张";
        }
        appendBatch();
        section.append(more);
        body.append(section);
      });
      detail.append(body);
    }
    detail.addEventListener("toggle", () => { if (detail.open) build(); });
    if (search) { detail.open = true; build(); }
    return detail;
  }
  function certificateCard(item) {
    const card = button("archive-certificate", "", () => openViewer(item, card));
    card.setAttribute("aria-label", "查看" + item.team + " · " + item.name + "的" + roles[item.role]);
    const image = el("img", "");
    image.src = thumbnailPath(item);
    image.alt = item.team + " · " + item.name + " · " + (item.award || "获奖证书");
    image.loading = "lazy";
    image.decoding = "async";
    image.fetchPriority = "low";
    image.width = 320;
    image.height = 452;
    image.addEventListener("error", () => {
      image.hidden = true;
      card.classList.add("archive-image-error");
      card.append(el("span", "archive-muted", "缩略图暂不可用，点击查看大图"));
    }, { once: true });
    card.append(image, el("strong", "", item.name), el("span", "archive-muted", "点击放大查看"));
    return card;
  }

  const viewer = el("dialog", "archive-viewer");
  viewer.setAttribute("aria-label", "奖状大图预览");
  const bar = el("div", "archive-viewer-bar");
  const caption = el("p", "");
  caption.id = "archiveViewerCaption";
  viewer.setAttribute("aria-labelledby", caption.id);
  const close = button("archive-close", "关闭 ×", () => viewer.close());
  bar.append(caption, close);
  const fullImage = el("img", "archive-full-image");
  fullImage.decoding = "async";
  const error = el("p", "archive-empty", "图片暂时无法加载，请使用“打开高清图”链接查看。");
  error.hidden = true;
  fullImage.addEventListener("error", () => { error.hidden = false; fullImage.hidden = true; });
  const controls = el("div", "archive-viewer-controls");
  const prev = button("archive-more", "← 上一张", () => changeImage(-1));
  const next = button("archive-more", "下一张 →", () => changeImage(1));
  const original = el("a", "archive-more", "打开高清图 ↗");
  original.target = "_blank";
  original.rel = "noopener noreferrer";
  controls.append(prev, original, next);
  viewer.append(bar, fullImage, error, controls);
  document.body.append(viewer);
  viewer.addEventListener("click", event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") { event.preventDefault(); changeImage(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); changeImage(1); }
  });
  viewer.addEventListener("close", () => {
    document.body.classList.remove("archive-modal-open");
    fullImage.removeAttribute("src");
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
  });
  function showImage() {
    const item = gallery[position];
    caption.textContent = (position + 1) + " / " + gallery.length + " · " + item.group + " · " + item.team + " · " + item.name;
    fullImage.alt = item.name + " · " + (item.award || "获奖证书");
    fullImage.hidden = false;
    error.hidden = true;
    fullImage.src = item.image;
    original.href = item.image;
    prev.disabled = position === 0;
    next.disabled = position === gallery.length - 1;
  }
  function changeImage(delta) {
    const target = position + delta;
    if (target < 0 || target >= gallery.length) return;
    position = target;
    showImage();
  }
  function openViewer(item, card) {
    if (typeof viewer.showModal !== "function") {
      window.open(item.image, "_blank", "noopener,noreferrer");
      return;
    }
    position = gallery.indexOf(item);
    opener = card;
    showImage();
    viewer.showModal();
    document.body.classList.add("archive-modal-open");
    close.focus();
  }
})();

