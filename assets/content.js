// 合同会社Link コンテンツ読み込み（触らないでください）
// 文章は content/*.json にあり、Pages CMSのフォームから編集できます。
// 読み込みに失敗した場合は、HTMLに書かれた文章がそのまま表示されます。
(function () {
  var script = document.currentScript;
  var name = script && script.getAttribute("data-content");
  if (!name) return;
  fetch("content/" + name + ".json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      Object.keys(data).forEach(function (key) {
        if (key === "items") return;
        var value = data[key];
        if (typeof value !== "string") return;
        if (key === "bannerImage") {
          var bgEl = document.querySelector(".ph-bg");
          var b = value.trim();
          if (bgEl && b && !/^(https?:)?\/\//.test(b)) {
            if (b.charAt(0) !== "/") b = "/" + b.replace(/^\.\//, "");
            bgEl.style.backgroundImage = "url('" + b.replace(/'/g, "") + "')";
          }
          return;
        }
        document.querySelectorAll('[data-bind="' + key + '"]').forEach(function (el) {
          el.textContent = value;
        });
      });
      if (name === "news") {
        var box = document.querySelector("[data-news-list]");
        if (!box) return;
        var items = Array.isArray(data.items) ? data.items : [];
        box.innerHTML = "";
        if (items.length === 0) {
          items = [{ date: "—", tag: "お知らせ", title: "現在、お知らせはありません。" }];
        }
        items.forEach(function (item) {
          var row = document.createElement("div");
          row.className = "newsline";
          var d = document.createElement("span"); d.textContent = item.date || "";
          var t = document.createElement("span"); t.className = "tag"; t.textContent = item.tag || "";
          var s = document.createElement("strong"); s.textContent = item.title || "";
          row.appendChild(d); row.appendChild(t); row.appendChild(s);
          box.appendChild(row);
        });
      }
    })
    .catch(function () { /* フォールバック: HTMLの文章を表示 */ });
})();

// デザイン設定の読み込み（content/settings.json）
// 値が範囲外・不正な場合は安全な初期値に丸めます（レイアウトが崩れないためのガード）。
(function () {
  fetch("content/settings.json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (s) {
      var root = document.documentElement.style;
      function num(key, min, max, fallback) {
        var v = parseFloat(s[key]);
        if (!isFinite(v)) return fallback;
        return Math.min(max, Math.max(min, v));
      }
      function pick(key, allowed, fallback) {
        return allowed.indexOf(String(s[key])) >= 0 ? String(s[key]) : fallback;
      }
      function color(key, fallback) {
        var v = String(s[key] || "");
        return /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;
      }
      root.setProperty("--text-size", num("textSize", 12, 20, 14) + "px");
      root.setProperty("--body-lh", pick("bodyLineHeight", ["1.6", "1.75", "1.9", "2.05", "2.2"], "1.9"));
      root.setProperty("--hero-size", num("heroTitleSize", 40, 110, 78) + "px");
      root.setProperty("--title-size", num("titleSize", 26, 64, 48) + "px");
      root.setProperty("--title-lh", pick("titleLineHeight", ["1.2", "1.35", "1.5"], "1.35"));
      root.setProperty("--section-pad", pick("sectionPadding", ["76", "100", "120"], "100") + "px");
      root.setProperty("--ink", color("textColor", "#17314d"));
      root.setProperty("--heading", color("headingColor", "#17314d"));
      root.setProperty("--blue", color("accentColor", "#1478bd"));
      var bg = String(s.heroBgImage || "").trim();
      if (bg && !/^(https?:)?\/\//.test(bg) && bg.charAt(0) !== "/") bg = "/" + bg.replace(/^\.\//, "");
      if (bg) {
        var hero = document.querySelector(".hero");
        if (hero) {
          root.setProperty("--hero-bg", "url('" + bg.replace(/'/g, "") + "')");
          hero.classList.add("has-bg");
        }
      }
    })
    .catch(function () { /* 設定が読めない場合は初期デザインで表示 */ });
})();
