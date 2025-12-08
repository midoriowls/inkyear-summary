// 默认文本
const defaults = {
  year: "2024",
  penname: "不羡仙",
  title: "在修文与截稿线之间摇摆的一年",
  tags: "同人 文手 2024",
  worksCount: "12",
  totalWords: "320,000",
  highlightTitle: "《开封府地契》",
  highlightCP: "赵光义 x 原创少侠",
  selfComment: "这一年写得跌跌撞撞，但也收到了很多意想不到的喜欢。",
  readerComment: "“谢谢你写了这样一篇故事，让我在糟糕的一周里睡得很好。”",
};

function updatePreview() {
  const inputs = document.querySelectorAll("[data-bind]");

  inputs.forEach((el) => {
    const key = el.dataset.bind;
    const value = el.value.trim();
    const text = value || defaults[key];

    switch (key) {
      case "year":
        document.getElementById("pv-year").textContent = text;
        break;
      case "penname":
        document.getElementById("pv-penname").textContent = text;
        break;
      case "title":
        document.getElementById("pv-title").textContent = text;
        break;
      case "tags":
        const container = document.getElementById("pv-tags");
        container.innerHTML = "";
        text.split(/[,，\s]+/).filter(Boolean).forEach((tag) => {
          const span = document.createElement("span");
          span.className = "chip";
          span.textContent = tag;
          container.appendChild(span);
        });
        break;
      case "worksCount":
        document.getElementById("pv-worksCount").textContent = text;
        break;
      case "totalWords":
        document.getElementById("pv-totalWords").textContent = text;
        break;
      case "highlightTitle":
        document.getElementById("pv-highlightTitle").textContent = text;
        break;
      case "highlightCP":
        document.getElementById("pv-highlightCP").textContent = text;
        break;
      case "selfComment":
        document.getElementById("pv-selfComment").textContent = text;
        break;
      case "readerComment":
        document.getElementById("pv-readerComment").textContent = text;
        break;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updatePreview();

  // 年份按钮
  const yearButtons = document.querySelectorAll(".year-btn");
  const yearInput = document.querySelector('[data-bind="year"]');

  yearButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const year = btn.dataset.year;
      yearInput.value = year;
      updatePreview();
      yearButtons.forEach((b) => b.classList.remove("pill-secondary"));
      btn.classList.add("pill-secondary");
    });
  });

  // 主题切换
  const themeSelect = document.getElementById("themeSelect");
  themeSelect.addEventListener("change", () => {
    document.body.classList.remove("theme-ink", "theme-rose", "theme-night");
    document.body.classList.add("theme-" + themeSelect.value);
  });

  // 版式切换
  const layoutSelect = document.getElementById("layoutSelect");
  const card = document.getElementById("previewCard");

  layoutSelect.addEventListener("change", () => {
    if (layoutSelect.value === "compact") {
      card.classList.add("card--compact");
    } else {
      card.classList.remove("card--compact");
    }
  });
});

// 隐藏功能
document.addEventListener("change", (e) => {
  if (!e.target.matches(".toggle")) return;
  const key = e.target.dataset.target;
  const visible = e.target.checked;

  const map = {
    worksCount: ".stat-works",
    totalWords: ".stat-words",
    selfComment: ".block-self",
    readerComment: ".block-reader",
  };

  const selector = map[key];
  if (selector) {
    const el = document.querySelector(selector);
    if (el) el.style.display = visible ? "" : "none";
  }
});

// 实时输入刷新
document.addEventListener("input", (e) => {
  if (e.target.matches("[data-bind]")) updatePreview();
});


// 实时输入刷新
document.addEventListener("input", (e) => {
  if (e.target.matches("[data-bind]")) updatePreview();
});
