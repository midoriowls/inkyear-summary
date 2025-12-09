// 全局数据
const data = {
  year: new Date().getFullYear().toString(),
  penName: "",
  totalWords: "",
  tags: "",
  reflection: "",
  months: [] // {id, month, title, tags, write, note}
};

// 绑定基础字段
function bindBaseFields() {
  document.querySelectorAll("[data-field]").forEach((el) => {
    const key = el.dataset.field;
    el.value = data[key] || "";
    el.addEventListener("input", () => {
      data[key] = el.value;
      renderPoster();
    });
  });
}

// 绑定月份表单
function bindMonthForm() {
  const form = document.getElementById("monthForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const month = document.getElementById("monthName").value.trim();
    const title = document.getElementById("monthTitle").value.trim();
    const tags = document.getElementById("monthTags").value.trim();
    const write = document.getElementById("monthWrite").value;
    const note = document.getElementById("monthNote").value;

    if (!month) return; // 没填月份就不加

    data.months.push({
      id: Date.now() + Math.random(),
      month,
      title,
      tags,
      write,
      note
    });

    form.reset();
    renderMonthList();
    renderPoster();
  });
}

// 左侧月份列表
function renderMonthList() {
  const list = document.getElementById("monthList");
  list.innerHTML = "";
  data.months.forEach((m) => {
    const row = document.createElement("div");
    row.className = "month-item-row";
    const span = document.createElement("span");
    span.textContent = `${m.month}：${m.title || "未命名"}`;
    const btn = document.createElement("button");
    btn.className = "btn-remove";
    btn.textContent = "删除";
    btn.onclick = () => {
      data.months = data.months.filter((x) => x.id !== m.id);
      renderMonthList();
      renderPoster();
    };
    row.appendChild(span);
    row.appendChild(btn);
    list.appendChild(row);
  });
}

// 渲染海报
function renderPoster() {
  // 基本信息
  document.getElementById("pv-year").textContent = data.year || "";
  document.getElementById("pv-penName").textContent = data.penName || "";
  document.getElementById("pv-totalWords").textContent = data.totalWords || "";
  document.getElementById("pv-reflection").textContent =
    data.reflection || "";

  // 年度标签
  const tagsWrap = document.getElementById("pv-tags");
  tagsWrap.innerHTML = "";
  (data.tags || "")
    .split(/[,，\s]+/)
    .filter(Boolean)
    .forEach((t) => {
      const span = document.createElement("span");
      span.textContent = t;
      tagsWrap.appendChild(span);
    });

  // 月份时间线
  const container = document.getElementById("pv-months");
  container.innerHTML = "";

  data.months.forEach((m) => {
    if (!m.month) return;

    const row = document.createElement("div");
    row.className = "month-row";

    // 左列：月份 + 标题 + tag + note
    const left = document.createElement("div");
    left.className = "month-left";

    const monthLabel = document.createElement("div");
    monthLabel.className = "month-month";
    monthLabel.textContent = m.month;
    left.appendChild(monthLabel);

    if (m.title) {
      const titleEl = document.createElement("div");
      titleEl.className = "month-title";
      titleEl.textContent = m.title;
      left.appendChild(titleEl);
    }

    if (m.tags) {
      const tagsBox = document.createElement("div");
      tagsBox.className = "month-tags";
      m.tags
        .split(/[,，\s]+/)
        .filter(Boolean)
        .forEach((t) => {
          const pill = document.createElement("span");
          pill.className = "month-tag-pill";
          pill.textContent = t;
          tagsBox.appendChild(pill);
        });
      left.appendChild(tagsBox);
    }

    if (m.note) {
      const noteEl = document.createElement("div");
      noteEl.className = "month-note";
      noteEl.textContent = m.note;
      left.appendChild(noteEl);
    }

    // 圆点
    const dot = document.createElement("div");
    dot.className = "month-dot";

    // 右列：正文
    const right = document.createElement("div");
    right.className = "month-right";
    const writeEl = document.createElement("div");
    writeEl.className = "month-write";
    writeEl.textContent = m.write;
    right.appendChild(writeEl);

    row.appendChild(left);
    row.appendChild(dot);
    row.appendChild(right);
    container.appendChild(row);
  });
}

// 主题切换（两种复古味道）
function bindThemeToggle() {
  const btn = document.getElementById("btn-theme");
  btn.addEventListener("click", () => {
    if (document.body.classList.contains("theme-vintage")) {
      document.body.classList.remove("theme-vintage");
      document.body.classList.add("theme-vintage-alt");
    } else {
      document.body.classList.remove("theme-vintage-alt");
      document.body.classList.add("theme-vintage");
    }
  });
}

// PNG 导出
function bindDownload() {
  const btn = document.getElementById("btn-download");
  btn.addEventListener("click", () => {
    const poster = document.getElementById("poster");
    html2canvas(poster, {
      scale: 2,
      backgroundColor: null
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `year-end-summary.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });
}

// 初始化
document.addEventListener("DOMContentLoaded", () => {
  bindBaseFields();
  bindMonthForm();
  bindThemeToggle();
  bindDownload();
  renderPoster();
  renderMonthList();
});



