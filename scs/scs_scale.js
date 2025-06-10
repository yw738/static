// 监听窗口大小变化
function handleResize() {
  let data = { width: 1905 };
  let minWidth = 750,
    maxWidth = 1850;
  let windowWidth = window.outerWidth - 15;
  let scaleN = windowWidth / data.width;
  let bodyBox = document.querySelector("#wrap_all"); // 主渲染容器
  bodyBox.style["transform-origin"] = "0 0";
  bodyBox.style.height = "auto";
  bodyBox.style.top = "0";
  bodyBox.style.left = "0";
  // =================缩放=================
  let fybox = document.querySelector(
    "#header_main .gt_container--x0qfhx>.gt_switcher"
  );
  if (fybox) {
    if (window.innerWidth <= minWidth) {
      fybox.style.display = "none";
    } else {
      fybox.style.display = "block";
    }
  }
  // ========================================
  // 不适用缩放的宽度
  if (window.innerWidth <= minWidth || window.innerWidth >= maxWidth) {
    // 应用 其他自适应方案
    bodyBox.style.position = "relative";
    bodyBox.style.width = `auto`;
    bodyBox.style.transform = `none`;
  } else {
    // 应用缩放
    bodyBox.style.position = "absolute";
    bodyBox.style.width = `${data.width}px`;
    bodyBox.style.transform = `scale(${scaleN}, ${scaleN})`;
  }
}
window.onresize = throttle(handleResize, 100);
// 节流函数
function throttle(func, delay) {
  let lastCall = 0; // 上次调用的时间戳
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      lastCall = now; // 更新上次调用时间
      func.apply(this, args); // 执行目标函数
    }
  };
}
