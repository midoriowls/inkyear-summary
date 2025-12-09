// 全局数据
const data = {
  year: new Date().getFullYear().toString(),
  penName: "",
  totalWords: "",
  tags: "",
  reflection: "",
  headerStyle: "a",
  layoutStyle: "magazine",
  months: []
};

/* -------- 工具：收集所有关键词（全局 + 各月） -------- */
function collectAllTags() {
  const set = new Set();
  (data.tags || "")
    .split(/[,，\s]+/)
    .filter(Boolean)
    .forEach((t) => set.add(t));
  data.months.forEach((m) => {
    (m.tags || "")
      .split(/[,，\s]+/)
      .filter(Boolean)
      .forEach((t) => set.add(t));
  });
  return Array.from(set);
}

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

/* -------- 主体 + 月份 + 落款 + 印章 -------- */
function renderPoster() {
  document.getElementById("pv-year").textContent = data.year || "";
  document.getElementById("pv-penName").textContent = data.penName || "";
  document.getElementById("pv-totalWords").textContent = data.totalWords || "";
  document.getElementById("pv-reflection").textContent =
    data.reflection || "";

  // 标签
  // 标签（只用顶部 tags，不再把每月的都汇总进来）
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

  // 月份
  const container = document.getElementById("pv-months");
  container.innerHTML = "";

  data.months.forEach((m) => {
    if (!m.month) return;

    const row = document.createElement("div");
    row.className = "month-row";

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

    const dot = document.createElement("div");
    dot.className = "month-dot";

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

  // 印章
  const stamp = document.getElementById("pv-stamp");
  const year = data.year || "";
  const name = data.penName || "";
  stamp.textContent = year
    ? `${year}\n${name || "writer"}`
    : name || "writer";
}

/* -------- 封面：关键词云 -------- */
function renderCover() {
  const yearEl = document.getElementById("cover-year");
  const authorEl = document.getElementById("cover-author");
  const quoteEl = document.getElementById("cover-quote");
  const metaEl = document.getElementById("cover-meta");

  const year = data.year || "2025";
  const pen = data.penName || "";
  const words = data.totalWords || "";

  yearEl.textContent = year;
  authorEl.textContent = pen ? `by ${pen}` : "";

  // 从年度总结里截一小段做封面文案
  let ref = (data.reflection || "").trim();
  let quote = "";

  if (ref) {
    // 按换行或句号/问号/感叹号切一段
    const parts = ref.split(/[\n。？！!?]/).filter(Boolean);
    quote = parts[0] || ref;
    // 太长的话截一下
    if (quote.length > 42) {
      quote = quote.slice(0, 42) + "…";
    }
  } else {
    // 没写总结就给一条默认文案
    quote = "这一年，你写下了很多故事。";
  }
  quoteEl.textContent = quote;

  // 底部 meta：笔名 + 字数
  let meta = "";
  if (pen) meta += `written by ${pen}`;
  if (words) {
    if (meta) meta += " · ";
    meta += `words ${words}`;
  }
  metaEl.textContent = meta;
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

/* -------- 导出：小红书分图（尽量在月份边界切） -------- */
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
    const width = canvas.width;
    const totalHeight = canvas.height;

    const posterDomHeight = poster.offsetHeight || 1;
    const scale = totalHeight / posterDomHeight;

    const rows = Array.from(
      document.querySelectorAll("#pv-months .month-row")
    );

    // 如果没有月份，就按老办法等距切
    if (!rows.length) {
      simpleSlice(canvas, width, totalHeight);
      return;
    }

    const bounds = rows.map((r) => {
      const top = r.offsetTop * scale;
      const bottom = (r.offsetTop + r.offsetHeight) * scale;
      return { top, bottom };
    });

    const pageHeight = Math.round(width * 1.25); // 4:5 比例
    const segments = [];

    let currentStart = 0;
    let lastBottom = bounds[0].bottom;

    bounds.forEach((b) => {
      if (b.bottom - currentStart > pageHeight) {
        // 在上一行结束的位置切
        segments.push({ y: currentStart, h: lastBottom - currentStart });
        currentStart = lastBottom;
      }
      lastBottom = b.bottom;
    });

    // 最后一页
    segments.push({ y: currentStart, h: totalHeight - currentStart });

    let index = 1;
    segments.forEach((seg) => {
      if (seg.h <= 0) return;
      const c = document.createElement("canvas");
      c.width = width;
      c.height = seg.h;
      const ctx = c.getContext("2d");
      ctx.drawImage(
        canvas,
        0,
        seg.y,
        width,
        seg.h,
        0,
        0,
        width,
        seg.h
      );
      const link = document.createElement("a");
      link.download = `year-end-summary-xhs-${index}.png`;
      link.href = c.toDataURL("image/png");
      link.click();
      index++;
    });
  }).catch((err) => {
    console.error(err);
    alert("导出小红书分图时出了点问题，可以稍后再试一次。");
  });
}

// 备用：没有月份时的简单等距切图
function simpleSlice(canvas, width, totalHeight) {
  const pageHeight = Math.round(width * 1.25);
  let index = 1;
  for (let y = 0; y < totalHeight; y += pageHeight) {
    const h = Math.min(pageHeight, totalHeight - y);
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
}

/* -------- 导出：封面图 -------- */
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

/* -------- 分享链接：只展示成品页 -------- */
function bindShareLink() {
  const btn = document.getElementById("btn-share");
  btn.addEventListener("click", async () => {
    try {
      const jsonStr = JSON.stringify(data);
      const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
      const url = `${location.origin}${location.pathname}?view=read&d=${encodeURIComponent(
        encoded
      )}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        alert("当前卡片的浏览链接已复制到剪贴板！");
      } else {
        prompt("复制下面这条链接：", url);
      }
    } catch (e) {
      console.error(e);
      alert("生成分享链接时出了点问题。");
    }
  });
}

/* -------- 从 URL 中恢复 data + 进入只读模式 -------- */
function restoreFromURL() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("d");
  const view = params.get("view");
  if (view === "read") {
    document.body.classList.add("read-only");
  }
  if (!encoded) return;
  try {
    const jsonStr = decodeURIComponent(
      escape(atob(decodeURIComponent(encoded)))
    );
    const obj = JSON.parse(jsonStr);
    Object.assign(data, obj);

    // 把数据写回表单（如果不是只读模式）
    if (view !== "read") {
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
    }

    renderMonthList();
    renderAll();
  } catch (e) {
    console.error("解析分享链接失败：", e);
  }
}

/* -------- 绑定导出按钮 -------- */
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








