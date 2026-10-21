/** Apply the theme before CSS paints; never depend on storage availability. */
(function () {
  "use strict";
  const root = document.documentElement;
  const key = "nchu-theme";
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  let choice = null;
  try { choice = localStorage.getItem(key); } catch (_) {}
  if (choice !== "light" && choice !== "dark") choice = null;
  function apply(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    const dark = theme === "dark";
    const button = document.getElementById("themeToggle");
    if (button) {
      button.setAttribute("aria-label", dark ? "切换到日间模式" : "切换到夜间模式");
      button.title = dark ? "当前：夜间模式，点击切换日间模式" : "当前：日间模式，点击切换夜间模式";
      document.getElementById("themeLabel").textContent = dark ? "日间模式" : "夜间模式";
      document.getElementById("themeIcon").textContent = dark ? "☀" : "☾";
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? "#05070b" : "#f4f7fb";
  }
  apply(choice || (system.matches ? "dark" : "light"));
  document.addEventListener("DOMContentLoaded", function () {
    apply(root.dataset.theme);
    document.getElementById("themeToggle").addEventListener("click", function () {
      choice = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(key, choice); } catch (_) {}
      apply(choice);
    });
  });
  system.addEventListener("change", function (event) {
    if (!choice) apply(event.matches ? "dark" : "light");
  });
  window.addEventListener("storage", function (event) {
    if (event.key !== key && event.key !== null) return;
    choice = event.newValue === "light" || event.newValue === "dark" ? event.newValue : null;
    apply(choice || (system.matches ? "dark" : "light"));
  });
})();
