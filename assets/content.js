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
