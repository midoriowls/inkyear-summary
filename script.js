// 数据模型
const data = {
  year: new Date().getFullYear().toString(),
  penName: "不羡仙",
  totalWords: "320,000",
  tags: "同人 文手 年度总结",
  reflection: "这一年写得跌跌撞撞，但也收到了很多意想不到的喜欢。",
  months: [
    // { id, month, title, tags, text }
  ],
};

// 渲染整张海报
function renderPoster() {
  // 年份 & 基本信息
  document.getElementById("pv-year").textContent = data.year || "2025";
  document.getElementById("pv-penName").textContent = data.penName || "不羡仙";
  document.getElementById("pv-totalWords").textContent =
    data.totalWords || "320,000";
  document.getElementById("pv-reflection").textContent =
    data.reflection ||
    "这一年写得跌跌撞撞，但也收到了很多意想不到的喜欢。";

  // 标签
  const tagsContainer = document.getElementById("pv-tags");
  tagsContainer.innerHTML = "";
  const tags = (data.tags || "").split(/[,，\s]+/).filter(Boolean);
  if (tags.length === 0) {
    tags.push("同人", "文手", data.year || "2025");
  }
  tags.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "tag-pill";
    span.textContent = tag;
    tagsContainer.appendChild(span);
  });

  // 月份时间线
  const monthsContainer = document.getElementById("pv-months");
  monthsContainer.innerHTML = "";

  data.months.forEach((item) => {
    if (!item.month) return; // 没填月份就不渲染

    const row = document.createElement("div");
    row.className = "month-row";

    const label = document.createElement("div");
    label.className = "month-label";
    label.textContent = item.month;

    const dot = document.createElement("div");
    dot.className = "month-dot";

    const content = document.createElement("div");
    content.className = "month-content";

    // 标题（可选）
    if (item.title) {
      const titleEl = document.createElement("div");
      titleEl.className = "month-title";
      titleEl.textContent = item.title;
      content.appendChild(titleEl);
    }

    // 月份内的 tag（可选）
    const tagText = (item.tags || "").trim();
    if (tagText) {
      const tagsWrap = document.createElement("div");
      tagsWrap.className = "month-tags";
      tagText
        .split(/[,，\s]+/)
        .filter(Boolean)
        .forEach((t) => {
          const pill = document.createElement("span");
          pill.className = "month-tag-pill";
          pill.textContent = t;
          tagsWrap.appendChild(pill);
        });
      content.appendChild(tagsWrap);
    }

    // 节选 / 想说的话（可选，稍微截断一点防止太长撑爆）
    if (item.text) {
      const excerptEl = document.createElement("div");
      excerptEl.className = "month-excerpt";
      const maxLen = 80;
      const txt =
        item.text.length > maxLen
          ? item.text.slice(0, maxLen) + "..."
          : item.text;
      excerptEl.textContent = txt;
      content.appendChild(excerptEl);
    }

    row.appendChild(label);
    row.appendChild(dot);
    row.appendChild(content);
    monthsContainer.appendChild(row);
  });
}

// 左侧“已添加月份”列表
function renderMonthList() {
  const list = document.getElementById("monthList");
  list.innerHTML = "";
  if (data.months.length === 0) return;

  data.months.forEach((item) => {
    const row = document.createElement("div");
    row.className = "month-item-row";

    const titlePreview = item.title || "未命名记录";
    const textSnippet = item.text
      ? item.text.slice(0, 12) + (item.text.length > 12 ? "..." : "")
      : "";

    const span = document.createElement("span");
    span.textContent = `${item.month || "（未填月份）"}：${titlePreview}${
      textSnippet ? "｜" + textSnippet : ""
    }`;

    const btn = document.createElement("button");
    btn.className = "btn-remove";
    btn.textContent = "删除";
    btn.addEventListener("click", () => {
      data.months = data.months.filter((m) => m.id !== item.id);
      renderMonthList();
      renderPoster();
    });

    row.appendChild(span);
    row.appendChild(btn);
    list.appendChild(row);
  });
}

// 绑定基本字段输入事件
function bindBaseFields() {
  const inputs = document.querySelectorAll("[data-field]");
  inputs.forEach((el) => {
    const key = el.dataset.field;
    el.value = data[key] || "";
    el.addEventListener("input", () => {
      data[key] = el.value.trim();
      renderPoster();
    });
  });
}

// 添加月份记录
function bindMonthForm() {
  const form = document.getElementById("monthForm");
  const monthInput = document.getElementById("monthName");
  const titleInput = document.getElementById("monthTitle");
  const tagsInput = document.getElementById("monthTags");
  const textInput = document.getElementById("monthText");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const month = monthInput.value.trim();
    const title = titleInput.value.trim();
    const tags = tagsInput.value.trim();
    const text = textInput.value.trim();

    if (!month) return; // 没填月份就不添加

    data.months.push({
      id: Date.now() + Math.random(),
      month,
      title,
      tags,
      text,
    });

    monthInput.value = "";
    titleInput.value = "";
    tagsInput.value = "";
    textInput.value = "";

    renderMonthList();
    renderPoster();
  });
}

// 初始化
document.addEventListener("DOMContentLoaded", () => {
  bindBaseFields();
  bindMonthForm();
  renderPoster();
  renderMonthList();
});

