/**
 * 南昌航空大学智能车队官网 —— 动效引擎（v3）
 * 1) 多层滚动视差：所有带 data-plx 属性的元素以不同速率错层移动
 * 2) 首屏细星尘背景（轻微闪烁 + 偶发细流星）
 * 3) 顶部进度线 / 返回顶部按钮
 * 系统开启“减少动态效果”或窄屏设备时，视差与粒子自动停用。
 */

(function () {
  "use strict";

  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = window.innerWidth >= 860;

  /* ========== 1. 多层滚动视差 ========== */
  function initParallax() {
    const els = Array.prototype.slice.call(document.querySelectorAll("[data-plx]"));
    if (!els.length) return;
    if (reduceMotion || !isDesktop) {
      els.forEach((el) => { el.style.transform = ""; });
      return;
    }
    let ticking = false;
    function update() {
      ticking = false;
      const sy = window.scrollY;
      for (let i = 0; i < els.length; i++) {
        const d = parseFloat(els[i].dataset.plx) || 0;
        els[i].style.transform = d === 0 ? "" : "translate3d(0," + (sy * d).toFixed(1) + "px,0)";
      }
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  }

  /* ========== 2. 首屏细星尘 ========== */
  function initStars() {
    const canvas = document.getElementById("starCanvas");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1, stars = [];
    let visible = true;
    let running = false;
    let lastMeteor = 0;
    const meteors = [];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    }

    function spawn() {
      const n = Math.min(130, Math.max(55, Math.round((W * H) / 9000)));
      stars = [];
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 0.4 + Math.random() * 0.8,
          a: 0.1 + Math.random() * 0.35,       // 低亮度，克制
          tw: 0.3 + Math.random() * 1.2,
          ph: Math.random() * Math.PI * 2,
        });
      }
    }

    function frame(now) {
      if (!running) return;
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const alpha = s.a * (0.55 + 0.45 * Math.sin(t * s.tw + s.ph));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(226, 238, 250, " + alpha.toFixed(3) + ")";
        ctx.fill();
      }

      /* 偶发细流星（低频、细线） */
      if (now - lastMeteor > 6000 + Math.random() * 8000) {
        lastMeteor = now;
        const ang = Math.PI * (0.2 + Math.random() * 0.08);
        const sp = 5.5 + Math.random() * 3;
        meteors.push({
          x: W * (0.15 + Math.random() * 0.6),
          y: H * (0.02 + Math.random() * 0.22),
          vx: Math.sin(ang) * sp,
          vy: Math.cos(ang) * sp,
          len: 70 + Math.random() * 110,
          a: 0.5,
        });
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx; m.y += m.vy; m.a -= 0.006;
        if (m.a <= 0 || m.x > W + 200 || m.y > H + 200) { meteors.splice(i, 1); continue; }
        ctx.strokeStyle = "rgba(190, 220, 245, " + m.a.toFixed(3) + ")";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * m.len, m.y - m.vy * m.len);
        ctx.stroke();
      }

      requestAnimationFrame(frame);
    }

    /* 视野内才运行动画 */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible && !running) { running = true; requestAnimationFrame(frame); }
      }, { threshold: 0.02 }).observe(canvas.parentElement);
    }
    if (!("IntersectionObserver" in window)) { running = true; requestAnimationFrame(frame); }

    window.addEventListener("resize", resize, { passive: true });
    resize();
  }

  /* ========== 3. 顶部进度线 ========== */
  function initProgress() {
    const bar = document.getElementById("progressBar");
    if (!bar) return;
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = p + "%";
      bar.classList.toggle("show", window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ========== 4. 返回顶部 ========== */
  function initTopBtn() {
    const btn = document.getElementById("topBtn");
    if (!btn) return;
    function onScroll() { btn.classList.toggle("show", window.scrollY > 700); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function boot() {
    initParallax();
    initStars();
    initProgress();
    initTopBtn();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
