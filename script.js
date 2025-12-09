// 全局数据
const data = {
  year: new Date().getFullYear().toString(),
  penName: "",
  totalWords: "",
  tags: "",
  reflection: "",
  headerStyle: "a",  // a/b/c
  months: [] // {id, month, title, tags, write, note}
};

/* 绑定基础文本字段（year / penName / totalWords / tags / reflection） */
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

/* 绑定头部样式下拉 */
function bindHeaderStyle() {
  const select = document.getElementById("headerStyle");
  select.value = data.headerStyle;
  select.addEventListener("change", () => {
    data.headerStyle = select.value;
    renderHeader();
  });
}

/* 添加月份记录 */
function bindMonthForm() {
  const form = document.getElementById("monthForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const month = document.getElementById("monthName").value.trim();
    const title = document.getElementById("monthTitle").value.trim();
    const tags = document.getElementById("monthTags").value.trim();
    const write = document.getElementById("monthWrite").value;
    const note = document.getElementById("monthNote").value;

    if (!month) return; // 必须填月份

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

/* 左侧月份列表 */
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

/* 渲染头部三种样式 */
function renderHeader() {
  const header = document.getElementById("posterHeader");
  const l1 = document.getElementById("headerLine1");
  const l2 = document.getElementById("headerLine2");
  const l3 = document.getElementById("headerLine3");
  const year = data.year || "2025";

  header.classList.remove("header-style-a", "header-style-b", "header-style-c");

  if (data.headerStyle === "a") {
    header.classList.add("header-style-a");
    l1.textContent = "YEAR-END SUMMARY";
    l2.textContent = "文手年度总结";
    l3.textContent = `${year} · Annual Writing Review`;
  } else if (data.headerStyle === "b") {
    header.classList.add("header-style-b");
    l1.textContent = "YEAR  END";
    l2.textContent = "SUMMARY";
    l3.textContent = `${year}`;
  } else {
    header.classList.add("header-style-c");
    l1.textContent = "THE ANNUAL REVIEW OF LITERARY WORKS";
    l2.textContent = `— ${year} —`;
    l3.textContent = "Fanfic & Original Writing";
  }
}

/* 渲染整张海报（除了 header 已抽出） */
function renderPoster() {
  renderHeader();

  // 基本信息
  document.getElementById("pv-year").textContent = data.year || "";
  document.getElementById("pv-penName").textContent = data.penName || "";
  document.getElementById("pv-totalWords").textContent = data.totalWords || "";
  document.getElementById("pv-reflection").textContent =
    data.reflection || "";

  // 标签
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

    // 左列
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

    // 右列正文
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

  // 落款区
  const footerWritten = document.getElementById("pv-footer-written");
  const footerDesigned = document.getElementById("pv-footer-designed");
  footerWritten.textContent = data.penName
    ? `written by ${data.penName}`
    : "";
  footerDesigned.textContent = "card designed by Morinorane";
}

/* 主题配色切换 */
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

/* 导出 PNG */
function bindDownload() {
  const btn = document.getElementById("btn-download");
  btn.addEventListener("click", () => {
    if (typeof html2canvas === "undefined") {
      alert("导出功能依赖的库未加载成功，请检查网络后刷新页面再试。");
      return;
    }
    const poster = document.getElementById("poster");
    html2canvas(poster, {
      scale: 2,
      backgroundColor: null
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "year-end-summary.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }).catch((err) => {
      console.error(err);
      alert("导出时出了点问题，可以稍后再试一次。");
    });
  });
}

/* 初始化 */
document.addEventListener("DOMContentLoaded", () => {
  bindBaseFields();
  bindHeaderStyle();
  bindMonthForm();
  bindThemeToggle();
  bindDownload();
  renderPoster();
  renderMonthList();
});






