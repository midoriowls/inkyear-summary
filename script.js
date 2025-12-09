// 全局数据
const data = {
  year: new Date().getFullYear().toString(),
  penName: "",
  totalWords: "",
  tags: "",
  reflection: "",
  headerStyle: "a",   // 头部样式 a/b/c
  layoutStyle: "magazine", // 布局 magazine/poster/stack
  months: []          // {id, month, title, tags, write, note}
};

/* -------- 基础字段绑定 -------- */
function bindBaseFields() {
  document.querySelectorAll("[data-field]").forEach((el) => {
    const key = el.dataset.field;
    el.value = data[key] || "";
    el.addEventListener("input", () => {
      data[key] = el.value;
      renderAll();
    });
  });
}

/* -------- 头部样式选择 -------- */
function bindHeaderStyle() {
  const select = document.getElementById("headerStyle");
  select.value = data.headerStyle;
  select.addEventListener("change", () => {
    data.headerStyle = select.value;
    renderAll();
  });
}

/* -------- 布局样式选择 -------- */
function bindLayoutStyle() {
  const select = document.getElementById("layoutStyle");
  select.value = data.layoutStyle;
  select.addEventListener("change", () => {
    data.layoutStyle = select.value;
    renderAll();
  });
}

/* -------- 添加月份 -------- */
function bindMonthForm() {
  const form = document.getElementById("monthForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const month = document.getElementById("monthName").value.trim();
    const title = document.getElementById("monthTitle").value.trim();
    const tags = document.getElementById("monthTags").value.trim();
    const write = document.getElementById("monthWrite").value;
    const note = document.getElementById("monthNote").value;

    if (!month) return;

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
    renderAll();
  });
}

/* -------- 左侧月份列表 -------- */
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
      renderAll();
    };
    row.appendChild(span);
    row.appendChild(btn);
    list.appendChild(row);
  });
}

/* -------- 头部文字渲染 -------- */
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
    l3.textContent = year;
  } else {
    header.classList.add("header-style-c");
    l1.textContent = "THE ANNUAL REVIEW OF LITERARY WORKS";
    l2.textContent = `— ${year} —`;
    l3.textContent = "Fanfic & Original Writing";
  }
}

/* -------- 主体+月份+落款+印章 渲染 -------- */
function renderPoster() {
  // 基本信息
  document.getElementById("pv-year").textContent = data.year || "";
  document.getElementById("pv-penName").textContent = data.penName || "";
  document.getElementById("pv-totalWords").textContent = data.totalWords || "";
  document.getElementById("pv-reflection").textContent = data.reflection || "";

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

  // 布局 class
  const poster = document.getElementById("poster");
  poster.classList.remove("layout-magazine", "layout-poster", "layout-stack");
  poster.classList.add(`layout-${data.layoutStyle}`);

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

    // 圆点（海报块状版不需要，但用 CSS 控制显隐）
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

  // 落款
  const footerWritten = document.getElementById("pv-footer-written");
  const footerDesigned = document.getElementById("pv-footer-designed");
  footerWritten.textContent = data.penName
    ? `written by ${data.penName}`
    : "";
  footerDesigned.textContent = "card designed by Morinorane";

  // 复古印章
  const stamp = document.getElementById("pv-stamp");
  const year = data.year || "";
  const name = data.penName || "";
  stamp.textContent = year
    ? `${year}\n${name || "writer"}`
    : name || "writer";
}

/* -------- 关键词封面渲染（tag cloud） -------- */
function renderCover() {
  const yearEl = document.getElementById("cover-year");
  const authorEl = document.getElementById("cover-author");
  const tagsWrap = document.getElementById("cover-tags");

  yearEl.textContent = data.year || "2025";
  authorEl.textContent = data.penName ? `by ${data.penName}` : "";

  tagsWrap.innerHTML = "";
  const tags = (data.tags || "")
    .split(/[,，\s]+/)
    .filter(Boolean);

  if (!tags.length) return;

  const sizes = ["0.95rem", "1.05rem", "1.15rem", "1.25rem", "1.35rem"];

  tags.forEach((t, idx) => {
    const span = document.createElement("span");
    span.className = "cover-tag";
    const size = sizes[idx % sizes.length];
    span.style.fontSize = size;
    // 随机一点透明度 & 字距，做出“云”的感觉
    span.style.opacity = 0.85 + Math.random() * 0.15;
    span.textContent = t;
    tagsWrap.appendChild(span);
  });
}

/* -------- 整体渲染 -------- */
function renderAll() {
  renderHeader();
  renderPoster();
  renderCover();
}

/* -------- 主题切换 -------- */
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

/* -------- 导出：长图 -------- */
function exportLongImage() {
  const poster = document.getElementById("poster");
  if (typeof html2canvas === "undefined") {
    alert("导出功能依赖的库未加载成功，请检查网络后刷新页面再试。");
    return;
  }
  html2canvas(poster, {
    scale: 2,
    backgroundColor: null
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "year-end-summary-long.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }).catch((err) => {
    console.error(err);
    alert("导出长图时出了点问题，可以稍后再试一次。");
  });
}

/* -------- 导出：小红书分图（切割长图） -------- */
function exportXHS() {
  const poster = document.getElementById("poster");
  if (typeof html2canvas === "undefined") {
    alert("导出功能依赖的库未加载成功，请检查网络后刷新页面再试。");
    return;
  }
  html2canvas(poster, {
    scale: 2,
    backgroundColor: null
  }).then((canvas) => {
    const totalHeight = canvas.height;
    const width = canvas.width;
    // 小红书常见竖图比例接近 4:5，这里取 height ≈ 1.25 * width
    const segHeight = Math.round(width * 1.25);

    let index = 1;
    for (let y = 0; y < totalHeight; y += segHeight) {
      const h = Math.min(segHeight, totalHeight - y);
      const c = document.createElement("canvas");
      c.width = width;
      c.height = h;
      const ctx = c.getContext("2d");
      ctx.drawImage(canvas, 0, y, width, h, 0, 0, width, h);

      const link = document.createElement("a");
      link.download = `year-end-summary-xhs-${index}.png`;
      link.href = c.toDataURL("image/png");
      link.click();
      index++;
    }
  }).catch((err) => {
    console.error(err);
    alert("导出小红书分图时出了点问题，可以稍后再试一次。");
  });
}

/* -------- 导出：关键词封面图 -------- */
function exportCoverImage() {
  const cover = document.getElementById("coverPoster");
  if (typeof html2canvas === "undefined") {
    alert("导出功能依赖的库未加载成功，请检查网络后刷新页面再试。");
    return;
  }
  html2canvas(cover, {
    scale: 2,
    backgroundColor: null
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "year-end-summary-cover.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }).catch((err) => {
    console.error(err);
    alert("导出封面时出了点问题，可以稍后再试一次。");
  });
}

/* -------- 分享链接生成：把 data 编进 URL -------- */
function bindShareLink() {
  const btn = document.getElementById("btn-share");
  btn.addEventListener("click", async () => {
    try {
      const jsonStr = JSON.stringify(data);
      // 解决中文编码：先转 UTF-8 再 btoa
      const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
      const url = `${location.origin}${location.pathname}?d=${encodeURIComponent(
        encoded
      )}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        alert("当前卡片的分享链接已复制到剪贴板！");
      } else {
        // 兜底
        prompt("复制下面这条链接：", url);
      }
    } catch (e) {
      console.error(e);
      alert("生成分享链接时出了点问题。");
    }
  });
}

/* -------- 从 URL 中恢复 data -------- */
function restoreFromURL() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("d");
  if (!encoded) return;
  try {
    const jsonStr = decodeURIComponent(
      escape(atob(decodeURIComponent(encoded)))
    );
    const obj = JSON.parse(jsonStr);
    Object.assign(data, obj);

    // 把数据写回表单
    document.querySelector('[data-field="year"]').value = data.year || "";
    document.querySelector('[data-field="penName"]').value =
      data.penName || "";
    document.querySelector('[data-field="totalWords"]').value =
      data.totalWords || "";
    document.querySelector('[data-field="tags"]').value = data.tags || "";
    document.querySelector('[data-field="reflection"]').value =
      data.reflection || "";
    document.getElementById("headerStyle").value =
      data.headerStyle || "a";
    document.getElementById("layoutStyle").value =
      data.layoutStyle || "magazine";

    renderMonthList();
    renderAll();
  } catch (e) {
    console.error("解析分享链接失败：", e);
  }
}

/* -------- 绑定按钮 -------- */
function bindExportButtons() {
  document
    .getElementById("btn-download-long")
    .addEventListener("click", exportLongImage);
  document
    .getElementById("btn-download-xhs")
    .addEventListener("click", exportXHS);
  document
    .getElementById("btn-download-cover")
    .addEventListener("click", exportCoverImage);
}

/* -------- 初始化 -------- */
document.addEventListener("DOMContentLoaded", () => {
  bindBaseFields();
  bindHeaderStyle();
  bindLayoutStyle();
  bindMonthForm();
  bindThemeToggle();
  bindExportButtons();
  bindShareLink();
  restoreFromURL();
  renderAll();
  renderMonthList();
});







