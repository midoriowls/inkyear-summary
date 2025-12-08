document.addEventListener('DOMContentLoaded', () => {
    const penNameInput = document.getElementById('penName');
    const writtenContentTextarea = document.getElementById('writtenContent');
    const thoughtsTextarea = document.getElementById('thoughts');
    const generateBtn = document.getElementById('generateBtn');
    const summaryOutput = document.getElementById('summaryOutput');
    const copyBtn = document.getElementById('copyBtn');

    generateBtn.addEventListener('click', generateSummary);
    copyBtn.addEventListener('click', copySummary);

    /**
     * 生成年终总结报告
     */
    function generateSummary() {
        const penName = penNameInput.value.trim() || '不具名的神秘写手';
        const writtenContent = writtenContentTextarea.value.trim() || '（此处未填写具体内容，但您的努力已被记录。）';
        const thoughts = thoughtsTextarea.value.trim() || '（此处是对过去一年的留白，请用文字填满它。）';

        const summaryText = `
=============================================
           🏆 ${penName} 年度写作报告 🏆
=============================================

【 ✍️ 笔名留念 】
  **${penName}**

【 📚 2024年主要成就回顾 】
  过去的一年，您在文字的疆域上留下了深刻的足迹。
  记录如下：
  -----------------------------------------
  ${writtenContent}
  -----------------------------------------

【 💡 写手心得与未来展望 】
  您的所思所想，是下一段旅程的火种。
  -----------------------------------------
  ${thoughts}
  -----------------------------------------

恭喜您完成这一年的写作挑战！
新的一年，愿灵感如泉涌，笔耕不辍。

[报告生成日期: ${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}]
`;

        // 将生成的纯文本转换为HTML格式，以便在summaryOutput中显示高亮
        const formattedSummary = summaryText
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // 粗体标记
            .replace(/\n/g, '<br>'); // 将换行符转为<br>

        summaryOutput.innerHTML = formattedSummary;
        copyBtn.classList.remove('hidden'); // 显示复制按钮
    }

    /**
     * 复制总结报告文本
     */
    function copySummary() {
        // 为了确保复制的是纯文本，我们从summaryOutput的innerText获取
        const summaryText = summaryOutput.innerText;

        navigator.clipboard.writeText(summaryText).then(() => {
            // 复制成功提示
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✅ 已复制!';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 1500);

        }).catch(err => {
            console.error('复制失败: ', err);
            alert('复制失败，请手动选择复制。');
        });
    }
});

