/**
 * 南昌航空大学智能车队官网 —— 内容渲染 + 整版页面切换（v3.2）
 * 切换模式仿照 Genesis 车队官网：每个板块是一整页（.page-view），
 * 点击导航在页面间切换，URL 带 #hash 支持前进 / 后退 / 直接访问。
 * 日常维护无需修改本文件；内容仍全部来自 js/data.js。
 */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  function tag(name, cls, text) {
    const el = document.createElement(name);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  /* ---------- 线性图标库（data.js 中 icon 字段填关键字） ---------- */
  const ICON_PATH = {
    plane: '<path d="M21.5 2.5 10.8 13.2"/><path d="M21.5 2.5 14.5 21.5l-3.7-7.8-7.8-3.7z"/>',
    book: '<path d="M12 6.2C10 4.4 7.2 3.6 3.5 3.6v14.6c3.7 0 6.5.8 8.5 2.6 2-1.8 4.8-2.6 8.5-2.6V3.6c-3.7 0-6.5.8-8.5 2.6Z"/><path d="M12 6.2v14.6"/>',
    shield: '<path d="M12 21.5s7.5-3.4 7.5-9.4V5.6L12 2.5 4.5 5.6v6.5c0 6 7.5 9.4 7.5 9.4Z"/><path d="m8.8 11.6 2.2 2.3 4.2-4.4"/>',
    target: '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
    pin: '<path d="M12 21.2c-4.2-3.6-6.6-6.9-6.6-10.6A6.6 6.6 0 0 1 12 4a6.6 6.6 0 0 1 6.6 6.6c0 3.7-2.4 7-6.6 10.6Z"/><circle cx="12" cy="10.4" r="2.3"/>',
    cap: '<path d="M12 4 2.6 9.4 12 14.8l9.4-5.4L12 4Z"/><path d="M6 12.2v4.3c0 1.6 2.7 2.9 6 2.9s6-1.3 6-2.9v-4.3"/><path d="M21.4 9.4V15"/>',
    flag: '<path d="M5.5 21.5V3.5"/><path d="M5.5 4.8h11.6l-2.1 4.3 2.1 4.3H5.5"/>',
    users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20.3c.7-3.3 3.2-5.2 6.2-5.2s5.5 1.9 6.2 5.2"/><circle cx="17" cy="9.5" r="2.5"/><path d="M16.4 15.3c2.5.4 4.3 2 5 4.7"/>',
    spark: '<path d="M12 3.5c.8 4.2 2.4 5.8 9 6.7-6.6.9-8.2 2.5-9 6.7-.8-4.2-2.4-5.8-9-6.7 6.6-.9 8.2-2.5 9-6.7Z"/>',
    camera: '<path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h2.1L9.6 3.8h4.8L16.4 6h2.1A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.4"/>',
    dot: '<circle cx="12" cy="12" r="4"/>',
  };
  function iconSvg(key) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICON_PATH[key] || ICON_PATH.dot) + "</svg>";
  }

  /* ---------- 示例提示胶囊 ---------- */
  function renderNotice() {
    const box = $("#siteNotice");
    if (!box || !DATA.status || !DATA.status.enabled) return;
    box.hidden = false;
    box.querySelector(".notice-text").textContent = DATA.status.text || "示例站点";
    const close = box.querySelector(".notice-close");
    const hide = () => box.classList.add("hide");
    close.addEventListener("click", hide);
    setTimeout(hide, 16000);
  }

  /* ---------- 首页内容 ---------- */
  function renderHero() {
    if (DATA.hero && DATA.hero.motto) {
      $("#heroMotto").textContent = DATA.hero.motto;
      if (DATA.hero.mottoNote) {
        $("#heroMotto").appendChild(tag("span", "hero-motto-note", DATA.hero.mottoNote));
      }
    }
    const strip = $("#heroStats");
    (DATA.hero && DATA.hero.stats || []).forEach((s, i) => {
      const item = tag("div", "stat");
      const num = tag("span", "stat-num", s.num);
      num.dataset.raw = s.num;
      num.dataset.delay = String(i * 120);
      item.appendChild(num);
      item.appendChild(tag("span", "stat-label", s.label));
      strip.appendChild(item);
    });
  }

  let statsDone = false;
  function animateStats() {
    if (statsDone) return;
    statsDone = true;
    document.querySelectorAll(".stat-num").forEach((el) => {
      const raw = el.dataset.raw || "";
      const m = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
      if (!m) { el.textContent = raw; return; }
      const target = parseFloat(m[1]);
      const suffix = m[2];
      const dur = 1400;
      const start = performance.now() + (parseInt(el.dataset.delay || "0", 10));
      function tick(now) {
        const t = Math.min(1, Math.max(0, (now - start) / dur));
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------- 滚动字幕 ---------- */
  function renderTicker() {
    const track = $("#tickerTrack");
    const items = DATA.ticker || [];
    if (!track || !items.length) return;
    let html = "";
    items.forEach((t) => { html += '<span class="tick-it">' + t + "</span>"; });
    track.innerHTML = html + html;
  }

  /* ---------- 通用卡片渲染 ---------- */
  function renderCards(targetId, list, build) {
    const grid = $(targetId);
    (list || []).forEach((it, i) => {
      const el = build(it, i);
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 3) * 90 + "ms";
      grid.appendChild(el);
    });
  }

  function infoCard(c) {
    const card = tag("div", "card");
    const ic = tag("div", "card-icon");
    ic.innerHTML = iconSvg(c.icon);
    card.appendChild(ic);
    card.appendChild(tag("h4", "card-title", c.title));
    card.appendChild(tag("p", "card-text", c.text));
    return card;
  }

  /* ---------- 关于页 ---------- */
  function renderAbout() {
    if (!DATA.about) return;
    $("#aboutSub").textContent = DATA.about.sub || "";
    const intro = $("#aboutIntro");
    (DATA.about.intro || []).forEach((p) => intro.appendChild(tag("p", "about-p", p)));
    renderCards("#geneGrid", DATA.about.genes, infoCard);
    renderCards("#aboutCards", DATA.about.cards, infoCard);
  }

  /* ---------- 组织架构页 ---------- */
  function renderTeam() {
    if (!DATA.team) return;
    const groupCard = (g) => {
      const card = tag("div", "card group-card");
      const head = tag("div", "group-head");
      head.appendChild(tag("div", "char-badge", g.tag));
      head.appendChild(tag("h4", "card-title", g.name));
      card.appendChild(head);
      card.appendChild(tag("p", "card-text", g.duty));
      const tags = tag("div", "tags");
      (g.skills || []).forEach((s) => tags.appendChild(tag("span", "tag", s)));
      card.appendChild(tags);
      return card;
    };
    renderCards("#groupGrid", DATA.team.groups, groupCard);
  }

  /* ---------- 技术方向页 ---------- */
  function renderTech() {
    const techCard = (it) => {
      const card = tag("div", "card tech-card");
      card.appendChild(tag("div", "char-badge letter", it.tag));
      card.appendChild(tag("h4", "card-title", it.name));
      card.appendChild(tag("p", "card-text", it.desc));
      const tags = tag("div", "tags");
      (it.skills || []).forEach((s) => tags.appendChild(tag("span", "tag", s)));
      card.appendChild(tags);
      return card;
    };
    renderCards("#techGrid", DATA.tech, techCard);
  }

  /* ---------- 荣誉页 ---------- */
  function renderHonors() {
    const row = $("#honorChips");
    ((DATA.honors && DATA.honors.chips) || []).forEach((c, i) => {
      const chip = tag("div", "honor-chip reveal");
      chip.style.transitionDelay = i * 110 + "ms";
      chip.appendChild(tag("b", "", c.value));
      chip.appendChild(tag("span", "", c.label));
      row.appendChild(chip);
    });
  }

  /* ---------- 赛历页 ---------- */
  function renderCompetition() {
    $("#compSub").textContent = (DATA.competition && DATA.competition.sub) || "";
    const tbody = $("#historyRows");
    ((DATA.competition && DATA.competition.rows) || []).forEach((r) => {
      const tr = document.createElement("tr");
      [r.year, r.event, r.group, r.result].forEach((v) => tr.appendChild(tag("td", "", v)));
      tbody.appendChild(tr);
    });
  }

  /* ---------- 动态页（img 为单图，images 为同一动态的多图） ---------- */
  function renderNews() {
    const grid = $("#newsGrid");
    (DATA.news || []).forEach((n, i) => {
      const card = tag("article", "news-card reveal");
      card.style.transitionDelay = (i % 3) * 100 + "ms";

      const images = Array.isArray(n.images) && n.images.length
        ? n.images
        : (n.img ? [{ src: n.img, alt: n.title || "" }] : []);

      if (images.length) {
        const media = tag("div", "news-media" + (images.length > 1 ? " news-gallery" : ""));
        images.forEach((image, imageIndex) => {
          const link = document.createElement("a");
          link.href = image.src;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.setAttribute("aria-label", "查看大图：" + (image.alt || n.title || ("动态配图 " + (imageIndex + 1))));

          const im = document.createElement("img");
          im.className = "news-img";
          im.src = image.src;
          im.alt = image.alt || n.title || "";
          im.loading = "lazy";
          im.decoding = "async";
          link.appendChild(im);
          media.appendChild(link);
        });
        card.appendChild(media);
      } else {
        const ph = tag("div", "news-media news-ph");
        ph.innerHTML = iconSvg("camera");
        card.appendChild(ph);
      }

      const body = tag("div", "news-body");
      const meta = tag("div", "news-meta");
      meta.appendChild(tag("span", "news-tag", n.tag));
      meta.appendChild(tag("span", "news-date", n.date));
      body.appendChild(meta);
      body.appendChild(tag("h4", "news-title", n.title));
      body.appendChild(tag("p", "news-text", n.text));
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  /* ---------- 问答页 ---------- */
  function renderFaq() {
    const list = $("#faqList");
    (DATA.faq || []).forEach((f, i) => {
      const det = document.createElement("details");
      det.className = "faq-item reveal";
      det.style.transitionDelay = (i % 3) * 70 + "ms";
      det.appendChild(tag("summary", "", f.q));
      det.appendChild(tag("p", "faq-a", f.a));
      list.appendChild(det);
    });
  }

  /* ---------- 加入页 ---------- */
  function renderJoin() {
    const list = $("#joinList");
    (DATA.join.items || []).forEach((it) => {
      const row = tag("div", "join-item");
      row.appendChild(tag("b", "", it.t));
      row.appendChild(tag("span", "", it.d));
      list.appendChild(row);
    });
    const actions = $("#joinActions");
    (DATA.join.buttons || []).forEach((b) => {
      const a = tag("a", "btn " + (b.primary ? "btn-primary" : "btn-outline"), b.text);
      a.href = b.href;
      actions.appendChild(a);
    });
    const qrBox = $("#joinQr");
    const q = DATA.join.qr;
    if (q && q.hasImage) {
      const img = document.createElement("img");
      img.src = q.image;
      img.alt = "报名二维码";
      qrBox.appendChild(img);
      qrBox.appendChild(tag("p", "qr-tip", "SCAN TO JOIN"));
    } else {
      const ph = tag("div", "qr-ph");
      ph.appendChild(tag("b", "", "QR 占位"));
      ph.appendChild(tag("span", "", (q && q.tip) || ""));
      qrBox.appendChild(ph);
    }
  }

  /* ---------- 页脚 ---------- */
  function renderFooter() {
    const c = DATA.contact || {};
    if (c.lab) $("#fcLab").textContent = c.lab;
    if (c.qq) $("#fcQQ").textContent = c.qq;
    if (c.email) $("#fcEmail").textContent = c.email;
    if (c.wechat) $("#fcWechat").textContent = c.wechat;
    $("#copyrightLine").textContent =
      "© " + new Date().getFullYear() +
      " 南昌航空大学智能车队（智能车平台）· 页面由车队成员维护 · 以赛促学，笃行致远";
  }

  /* ---------- 整版页面切换（仿 Genesis：page-view 体系） ---------- */
  function initViews() {
    const views = Array.prototype.slice.call(document.querySelectorAll(".page-view"));
    const navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));

    function show(id) {
      if (!id) id = "home";
      const target = document.getElementById(id);
      if (!target || !target.classList.contains("page-view")) return;
      views.forEach((v) => v.classList.toggle("is-active", v === target));
      navLinks.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + id);
      });
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      /* 关闭移动端展开菜单 */
      const links = $("#navLinks");
      links.classList.remove("open");
      $("#navToggle").setAttribute("aria-expanded", "false");
      $("#siteHeader").classList.remove("menu-open");
    }

    /* 点击任意指向 page-view 的锚点 → 整版切换（导航 / 按钮 / 页脚链接 / 返回顶部） */
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (href === "#") { e.preventDefault(); return; }
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el && el.classList.contains("page-view")) {
        e.preventDefault();
        if (location.hash !== href) history.pushState(null, "", href);
        show(id);
      }
    });

    window.addEventListener("hashchange", () => {
      show(location.hash ? location.hash.slice(1) : "home");
    });

    show(location.hash ? location.hash.slice(1) : "home");
  }

  /* ---------- 移动端菜单 / 吸顶 ---------- */
  function initHeader() {
    const header = $("#siteHeader");
    const toggle = $("#navToggle");
    const links = $("#navLinks");

    function onScroll() { header.classList.toggle("scrolled", window.scrollY > 10); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      header.classList.toggle("menu-open", open);
    });
  }

  /* ---------- 显现动画：首次进入某页时才淡入 ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- 首页统计数字滚动 ---------- */
  function initCounter() {
    const strip = $("#heroStats");
    if (!strip) return;
    if (!("IntersectionObserver" in window)) { animateStats(); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { animateStats(); io.disconnect(); }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(strip);
    /* 兜底：切回首页且统计条已在视野时也触发一次 */
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href="#home"]');
      if (a) setTimeout(() => {
        const r = strip.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) animateStats();
      }, 350);
    }, true);
  }

  /* ---------- 启动 ---------- */
  function boot() {
    renderNotice();
    renderHero();
    renderTicker();
    renderAbout();
    renderTeam();
    renderTech();
    renderHonors();
    renderCompetition();
    renderNews();
    renderFaq();
    renderJoin();
    renderFooter();
    initViews();
    initHeader();
    initReveal();
    initCounter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();


