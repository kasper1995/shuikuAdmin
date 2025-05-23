export const encodeHTML = (str) => {
  const div = document.createElement("div");
  div.textContent = str; // 设置纯文本内容（浏览器会自动转义）
  return div.innerHTML; // 获取转义后的 HTML
}
