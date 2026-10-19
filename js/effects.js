/** 南昌航空大学智能车队官网：视差、星空与页面辅助动效。 */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = window.innerWidth >= 860;

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
      els.forEach((el) => {
        const d = parseFloat(el.dataset.plx) || 0;
        el.style.transform = d === 0 ? "" : "translate3d(0," + (sy * d).toFixed(1) + "px,0)";
      });
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("homeview:show", update);
    update();
  }

  function initStars() {
    const canvas = document.getElementById("starCanvas");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1, stars = [];
    let running = false;
    let lastMeteor = 0;
    const meteors = [];

    function spawn() {
      const n = Math.min(130, Math.max(55, Math.round((W * H) / 9000)));
      stars = [];
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 0.4 + Math.random() * 0.8,
          a: 0.1 + Math.random() * 0.35,
          tw: 0.3 + Math.random() * 1.2,
          ph: Math.random() * Math.PI * 2,
        });
      }
    }

    function resize() {
      const parent = canvas.parentElement;
      if (!parent || !parent.classList.contains("is-active")) return false;
      const rect = parent.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return false;
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      meteors.length = 0;
      spawn();
      return true;
    }

    function frame(now) {
      if (!running) return;
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);
      stars.forEach((s) => {
        const alpha = s.a * (0.55 + 0.45 * Math.sin(t * s.tw + s.ph));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(226, 238, 250, " + alpha.toFixed(3) + ")";
        ctx.fill();
      });

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
        if (m.a <= 0 || m.x > W + 200 || m.y > H + 200) {
          meteors.splice(i, 1);
          continue;
        }
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

    function startOrRefresh() {
      requestAnimationFrame(() => {
        if (!resize()) return;
        if (!running) {
          running = true;
          requestAnimationFrame(frame);
        }
      });
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) startOrRefresh();
        else running = false;
      }, { threshold: 0.02 }).observe(canvas.parentElement);
    } else {
      startOrRefresh();
    }
    window.addEventListener("resize", startOrRefresh, { passive: true });
    window.addEventListener("homeview:show", startOrRefresh);
    startOrRefresh();
  }

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

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
