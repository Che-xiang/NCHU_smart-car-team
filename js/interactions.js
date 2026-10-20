/** 技术栏目详情与站内图片查看器：优先兼容手机返回手势。 */
(function () {
  "use strict";

  const TECH_DETAILS = {
    "运动控制与轨迹跟踪": {
      lead: "让智能车在速度不断提高的同时，依然能够稳定理解自身状态、规划行驶轨迹并准确执行转向与加减速。",
      learn: ["车辆运动学与动力学基础", "编码器、惯导等状态信息的融合", "横向路径跟踪与纵向速度控制"],
      practice: "从低速直线与定圆测试开始，逐步加入弯道、坡道和复杂赛道元素；通过日志比较不同控制参数对误差、速度和稳定性的影响。",
      result: "能够建立可调试的闭环控制系统，解释车辆为什么偏离、振荡或失稳，并用数据完成参数整定。"
    },
    "机器视觉与感知": {
      lead: "把摄像头中的像素转化为车可以使用的赛道边界、目标位置和场景信息，是智能车理解环境的入口。",
      learn: ["图像采集、标定与预处理", "边缘、中线和目标特征提取", "轻量化检测与嵌入式部署"],
      practice: "针对曝光变化、反光、运动模糊和遮挡建立测试样本，在电脑端验证算法后，再压缩计算量并移植到车载平台。",
      result: "形成从数据采集、算法验证到实时部署的完整能力，并能通过可视化结果快速定位识别问题。"
    },
    "嵌入式系统与电控": {
      lead: "负责智能车实时运行的底层基础，让传感器、处理器、电机、舵机和通信模块可靠地协同工作。",
      learn: ["微控制器与实时任务设计", "传感器接口和通信协议", "电机驱动、电源与安全保护"],
      practice: "先分别验证采集、通信和执行器驱动，再设计模块间接口与异常处理，最后在整车环境中检查时序、电源和抗干扰表现。",
      result: "能够阅读原理图、完成底层程序与电气联调，并让系统在高负载和复杂现场环境下稳定运行。"
    },
    "机械结构与整车集成": {
      lead: "把规则要求、传感器视野、电气布局和车辆性能落实为可加工、可装配、可维护的整车结构。",
      learn: ["底盘、支架与传动结构设计", "重心、刚度和轻量化权衡", "线束空间与快速维护设计"],
      practice: "围绕实际车模进行测量、建模、加工和装配，通过碰撞、振动与连续运行测试发现干涉、松动和重心问题。",
      result: "能够完成从三维设计到整车装配的闭环，并在有限时间内快速定位和修复结构问题。"
    },
    "仿真测试与数据分析": {
      lead: "用统一的测试流程和数据记录，把偶发的现场现象转化为可以重复、比较和定位的工程问题。",
      learn: ["模型与赛道仿真", "运行日志和图像回放", "指标设计、参数扫描与结果对比"],
      practice: "固定赛道、程序版本和测试条件，记录关键状态量，利用曲线与回放对比修改前后的误差、速度和任务完成率。",
      result: "能够建立可复现的测试证据，减少依靠感觉调车，并为控制、视觉和硬件改进提供依据。"
    },
    "深度学习与决策": {
      lead: "探索学习型算法在智能车上的实际落地，让模型不仅在电脑上有效，也能在有限算力和实时约束下稳定工作。",
      learn: ["数据集构建与模型训练", "端到端驾驶和强化学习思路", "模型压缩、部署与决策安全"],
      practice: "从明确任务和评价指标开始，完成数据清洗、训练和离线验证，再进行车载推理速度、资源占用与异常场景测试。",
      result: "理解从数据到部署的完整链路，能够判断学习型方法的适用边界，并与传统控制方法协同设计。"
    },
    "项目创新与应用": {
      lead: "从真实需求出发，把嵌入式、感知、控制和交互能力组合成能够演示、验证并持续迭代的创新作品。",
      learn: ["需求拆解与方案设计", "多模块接口和系统集成", "作品展示、复盘与版本迭代"],
      practice: "选择智慧城市、农业、家居或机器人等场景，制作最小可运行原型，再围绕可靠性、易用性和展示效果逐步完善。",
      result: "能够独立推进一个完整项目，清晰说明问题、方案、个人工作和验证结果，并沉淀可复用资料。"
    },
    "科研探索与工程实践": {
      lead: "在开放问题中练习自主选题、资料调研、实验验证和工程表达，把兴趣方向发展为持续推进的研究项目。",
      learn: ["问题定义与资料调研", "实验方案、变量控制和证据记录", "技术文档、汇报与项目复盘"],
      practice: "从嵌入式开发、音视频处理或智能系统等方向提出问题，设计可以验证的实验，并持续记录失败原因和修改过程。",
      result: "形成面对未知问题的研究方法，能够用实验和数据支持结论，并把过程整理成可传承的工程成果。"
    }
  };

  const imagePattern = /\.(?:avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i;
  let detailPanel = null;
  let detailOpener = null;
  let currentDetail = "";
  let viewer = null;
  let viewerItems = [];
  let viewerIndex = 0;
  let viewerOpener = null;

  function make(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function updateModalLock() {
    document.body.classList.toggle("site-modal-open", Boolean(viewer && !viewer.hidden));
  }

  function initTechDetails() {
    const grid = document.getElementById("techGrid");
    const container = document.querySelector("#tech .container");
    if (!grid || !container) return;

    detailPanel = make("section", "tech-detail-panel");
    detailPanel.hidden = true;
    detailPanel.setAttribute("aria-live", "polite");
    container.append(detailPanel);

    grid.querySelectorAll(".tech-card").forEach((card) => {
      const title = card.querySelector(".card-title");
      if (!title || !TECH_DETAILS[title.textContent.trim()]) return;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "查看“" + title.textContent.trim() + "”详细介绍");
      card.append(make("span", "tech-card-action", "查看详细介绍"));
      card.addEventListener("click", () => openTechDetail(title.textContent.trim(), card, true));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openTechDetail(title.textContent.trim(), card, true);
        }
      });
    });

    window.addEventListener("pageview:shown", (event) => {
      if (event.detail && event.detail.id !== "tech" && currentDetail) closeTechDetail(true);
    });
  }

  function openTechDetail(name, opener, addHistory) {
    const item = TECH_DETAILS[name];
    const container = document.querySelector("#tech .container");
    if (!item || !detailPanel || !container) return;
    currentDetail = name;
    detailOpener = opener || detailOpener;
    detailPanel.replaceChildren();

    const back = make("button", "tech-detail-back", "← 上一页");
    back.type = "button";
    back.addEventListener("click", () => closeTechDetail(false));
    const head = make("header", "tech-detail-head");
    const source = Array.from(document.querySelectorAll("#techGrid .tech-card")).find((card) => {
      const title = card.querySelector(".card-title");
      return title && title.textContent.trim() === name;
    });
    const badgeText = source && source.querySelector(".char-badge") ? source.querySelector(".char-badge").textContent : "T";
    const badge = make("div", "char-badge letter tech-detail-badge", badgeText);
    const kicker = make("p", "kicker", "TECHNICAL DIRECTION");
    const title = make("h3", "tech-detail-title", name);
    title.tabIndex = -1;
    const lead = make("p", "tech-detail-lead", item.lead);
    head.append(badge, kicker, title, lead);

    const content = make("div", "tech-detail-grid");
    const learning = make("article", "tech-detail-block");
    learning.append(make("h4", "", "主要学习内容"));
    const list = make("ul", "");
    item.learn.forEach((text) => list.append(make("li", "", text)));
    learning.append(list);
    const practice = make("article", "tech-detail-block");
    practice.append(make("h4", "", "如何开展实践"), make("p", "", item.practice));
    const result = make("article", "tech-detail-block");
    result.append(make("h4", "", "可以形成的能力"), make("p", "", item.result));
    content.append(learning, practice, result);

    const tags = make("div", "tech-detail-tags");
    if (source) source.querySelectorAll(".tag").forEach((tag) => tags.append(make("span", "", tag.textContent)));
    detailPanel.append(back, head, content, tags);
    detailPanel.hidden = false;
    container.classList.add("tech-detail-mode");
    window.scrollTo(0, 0);
    requestAnimationFrame(() => title.focus({ preventScroll: true }));
    if (addHistory) history.pushState(Object.assign({}, history.state || {}, { techDetail: name }), "", location.href);
  }

  function closeTechDetail(fromHistory) {
    if (!currentDetail || !detailPanel) return;
    if (!fromHistory && history.state && history.state.techDetail) {
      history.back();
      return;
    }
    const container = document.querySelector("#tech .container");
    if (container) container.classList.remove("tech-detail-mode");
    detailPanel.hidden = true;
    currentDetail = "";
    if (detailOpener && detailOpener.isConnected) detailOpener.focus({ preventScroll: true });
  }

  function collectImages(section) {
    const seen = new Set();
    return Array.from(section.querySelectorAll("a[href]"))
      .filter((anchor) => imagePattern.test(anchor.getAttribute("href") || ""))
      .map((anchor) => {
        const href = anchor.href;
        if (seen.has(href)) return null;
        seen.add(href);
        const image = anchor.querySelector("img");
        const card = anchor.closest("article, figure, .news-card");
        const heading = card && card.querySelector("h3, h4, strong");
        const label = (image && image.alt) || (heading && heading.textContent) || anchor.getAttribute("aria-label") || "照片预览";
        return { href, label, anchor };
      })
      .filter(Boolean);
  }

  function initPhotoViewer() {
    viewer = make("div", "site-photo-viewer");
    viewer.hidden = true;
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-label", "照片预览");
    const shell = make("div", "photo-viewer-shell");
    const bar = make("div", "photo-viewer-bar");
    const back = make("button", "photo-viewer-back", "← 返回网页");
    back.type = "button";
    const title = make("p", "photo-viewer-title", "照片预览");
    const close = make("button", "photo-viewer-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "关闭照片");
    bar.append(back, title, close);
    const stage = make("div", "photo-viewer-stage");
    const image = make("img", "photo-viewer-image");
    image.decoding = "async";
    const error = make("p", "photo-viewer-error", "照片暂时无法加载，请稍后重试。");
    error.hidden = true;
    image.addEventListener("error", () => { image.hidden = true; error.hidden = false; });
    stage.append(image, error);
    const controls = make("div", "photo-viewer-controls");
    const prev = make("button", "photo-viewer-nav", "← 上一张");
    const count = make("span", "photo-viewer-count", "1 / 1");
    const next = make("button", "photo-viewer-nav", "下一张 →");
    prev.type = next.type = "button";
    controls.append(prev, count, next);
    shell.append(bar, stage, controls);
    viewer.append(shell);
    document.body.append(viewer);

    viewer._ui = { title, image, error, prev, next, count, close, back };
    back.addEventListener("click", () => closeViewer(false));
    close.addEventListener("click", () => closeViewer(false));
    prev.addEventListener("click", () => showViewerItem(viewerIndex - 1));
    next.addEventListener("click", () => showViewerItem(viewerIndex + 1));
    viewer.addEventListener("click", (event) => { if (event.target === viewer) closeViewer(false); });
    document.addEventListener("keydown", (event) => {
      if (viewer.hidden) return;
      if (event.key === "Escape") closeViewer(false);
      if (event.key === "ArrowLeft") showViewerItem(viewerIndex - 1);
      if (event.key === "ArrowRight") showViewerItem(viewerIndex + 1);
    });
    document.addEventListener("click", (event) => {
      const anchor = event.target.closest("#tech a[href], #news a[href]");
      if (!anchor || !imagePattern.test(anchor.getAttribute("href") || "")) return;
      event.preventDefault();
      const section = anchor.closest("#tech, #news");
      openViewer(anchor, section, true);
    });
  }

  function openViewer(anchor, section, addHistory) {
    if (!viewer || !anchor || !section) return;
    viewerItems = collectImages(section);
    viewerIndex = Math.max(0, viewerItems.findIndex((item) => item.href === anchor.href));
    viewerOpener = anchor;
    viewer.hidden = false;
    updateModalLock();
    showViewerItem(viewerIndex);
    requestAnimationFrame(() => viewer._ui.back.focus({ preventScroll: true }));
    if (addHistory) {
      history.pushState(Object.assign({}, history.state || {}, {
        photoViewer: true,
        photoSrc: viewerItems[viewerIndex] ? viewerItems[viewerIndex].href : anchor.href
      }), "", location.href);
    }
  }

  function showViewerItem(index) {
    if (!viewerItems.length || index < 0 || index >= viewerItems.length) return;
    viewerIndex = index;
    const item = viewerItems[index];
    const ui = viewer._ui;
    ui.title.textContent = item.label;
    ui.image.alt = item.label;
    ui.image.hidden = false;
    ui.error.hidden = true;
    ui.image.src = item.href;
    ui.count.textContent = (index + 1) + " / " + viewerItems.length;
    ui.prev.disabled = index === 0;
    ui.next.disabled = index === viewerItems.length - 1;
  }

  function closeViewer(fromHistory) {
    if (!viewer || viewer.hidden) return;
    if (!fromHistory && history.state && history.state.photoViewer) {
      history.back();
      return;
    }
    viewer.hidden = true;
    viewer._ui.image.removeAttribute("src");
    updateModalLock();
    if (viewerOpener && viewerOpener.isConnected) viewerOpener.focus({ preventScroll: true });
  }

  function restoreHistoryState(state) {
    const current = state || {};
    if (current.techDetail && TECH_DETAILS[current.techDetail]) {
      if (currentDetail !== current.techDetail) openTechDetail(current.techDetail, detailOpener, false);
    } else if (currentDetail) {
      closeTechDetail(true);
    }

    if (current.photoViewer && current.photoSrc) {
      const anchor = Array.from(document.querySelectorAll("#tech a[href], #news a[href]"))
        .find((node) => node.href === current.photoSrc);
      if (anchor && viewer && viewer.hidden) openViewer(anchor, anchor.closest("#tech, #news"), false);
    } else {
      closeViewer(true);
    }
  }

  function boot() {
    initTechDetails();
    initPhotoViewer();
    window.addEventListener("popstate", (event) => restoreHistoryState(event.state));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
