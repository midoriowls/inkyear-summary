// 默认文本，用于当输入为空时展示
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
  readerComment: "“谢谢你写了这样一篇故事，让我在很糟糕的一周里睡得很好。”"
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
        const tagContainer = document.getElementById("pv-tags");
        tagContainer.innerHTML = "";
        (text.split(/[,，\s]+/).filter(Boolean)).forEach((tag) => {
          const span = document.createElement("span");
          span.className = "chip";
          span.textContent = tag;
          tagContainer.appendChild(span);
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
      default:
        break;
    }
  });
}

// 监听输入
document.addEventListener("input", (e) => {
  if (e.target.matches("[data-bind]")) {
    updatePreview();
  }
});

// 初次渲染一下默认值
document.addEventListener("DOMContentLoaded", () => {
  updatePreview();
});

// 导出按钮（之后实现）
document.getElementById("exportBtn").addEventListener("click", () => {
  alert("导出功能我们之后再加！现在先把排版调舒服～");
});
