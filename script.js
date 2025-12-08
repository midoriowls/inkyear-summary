/* -------------------------
   数据结构
------------------------- */
const data = {
  year: new Date().getFullYear().toString(),
  penName: "",
  totalWords: "",
  tags: "",
  reflection: "",
  months: []  // {id, month, title, tags, write, note}
};

/* -------------------------
   基本信息同步
------------------------- */
function bindBaseFields() {
  document.querySelectorAll("[data-field]").forEach(el => {
    const key = el.dataset.field;
    el.value = data[key] || "";
    el.addEventListener("input", () => {
      data[key] = el.value;
      renderPoster();
    });
  });
}

/* -------------------------
   月份记录添加
------------------------- */
function bindMonthForm() {
  const form = document.getElementById("monthForm");
  form.addEventListener("submit", e => {
    e.preventDefault();

    const item = {
      id: Date.now(),
      month: document.getElementById("monthName").value.trim(),
      title: document.getElementById("monthTitle").value.trim(),
      tags: document.getElementById("monthTags").value.trim(),
      write: document.getElementById("monthWrite").value,
      note: document.getElementById("monthNote").value
    };

    if (!item.month) return;

    data.months.push(item);
    renderMonthList();
    renderPoster();

    form.reset();
  });
}

/* -------------------------
   左侧列表显示
------------------------- */
function renderMonthList() {
  const list = document.getElementById("monthList");
  list.innerHTML = "";

  data.months.forEach(m => {
    const row = document.createElement("div");
    row.className = "month-item-row";

    row.innerHTML = `
      <span>${m.month}：${m.title || "未命名"}</span>
      <button class="btn-remove">删除</button>
    `;

    row.querySelector(".btn-remove").onclick = () => {
      data.months = data.months.filter(i => i.id !== m.id);
      renderMonthList();
      renderPoster();
    };

    list.appendChild(row);
  });
}

/* -------------------------
   海报主渲染
------------------------- */
function renderPoster() {
  document.getElementById("pv-year").textContent = data.year || "";
  document.getElementById("pv-penName").textContent = data.penName || "";
  document.getElementById("pv-totalWords").textContent = data.totalWords || "";
  document.getElementById("pv-reflection").textContent = data.reflection || "";

  /* tags */
  const tagsWrap = document.getElementById("pv-tags");
  tagsWrap.innerHTML = "";
  data.tags.split(/[,，\s]+/).filter(Boolean).forEach(t => {
    const span = document.createElement("span");
    span.textContent = t;
    tagsWrap.appendChild(span);
  });

  /* months */
  const container = document.getElementById("pv-months");
  container.innerHTML = "";

  data.months.forEach(m => {
    const row = document.createElement("div");
    row.className = "month-row";

    /* 左列 */
    const left = document.createElement("div");
    left.className = "month-left";

    left.innerHTML = `
      <div class="month-label">${m.month}</div>
      ${m.title ? `<div class="month-title">${m.title}</div>` : ""}
    `;

    /* tags */
    if (m.tags) {
      const wrap = document.createElement("div");
      wrap.className = "month-tags";
      m.tags.split(/[,，\s]+/).filter(Boolean).forEach(t => {
        const pill = document.createElement("span");
        pill.className = "month-tag-pill";
        pill.textContent = t;
        wrap.appendChild(pill);
      });
      left.appendChild(wrap);
    }

    /* note */
    if (m.note) {
      const note = document.createElement("div");
      note.className = "month-note";
      note.textContent = m.note;
      left.appendChild(note);
    }

    /* 中间点 */
    const dot = document.createElement("div");
    dot.className = "month-dot";

    /* 右列正文 */
    const right = document.createElement("div");
    right.className = "month-right";
    const write = document.createElement("div");
    write.className = "month-write";
    write.textContent = m.write;
    right.appendChild(write);

    /* 合成行 */
    row.appendChild(left);
    row.appendChild(dot);
    row.appendChild(right);
    container.appendChild(row);
  });
}

/* -------------------------
   主题切换
------------------------- */
let themeState = 0;
const themes = ["theme-vintage", "theme-sepia", "theme-dark"];

document.getElementById("btn-theme").onclick = () => {
  themeState = (themeState + 1) % themes.length;
  document.body.className = themes[themeState];
};

/* -------------------------
   导出 PNG
------------------------- */
document.getElementById("btn-download").onclick = async () => {
  const poster = document.getElementById("poster");

  html2canvas(poster, {
    scale: 2,
    backgroundColor: null
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = `year-end-summary.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
};

/* -------------------------
   初始化
------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  bindBaseFields();
  bindMonthForm();
  renderPoster();
  renderMonthList();
});


