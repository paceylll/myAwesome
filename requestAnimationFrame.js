/**
 * 问题：需要渲染10000个div，使得页面不卡住
 * 思路：重点是递归使用requestAnimationFrame来渲染
 * 另外也使用了DocumentFragment来增加性能
 */
const total = 100;
let i = 0, once = 1700;
function render() {
  const fragment = document.createDocumentFragment();
  let povint = i + once;
  povint = Math.min(povint, total);
  while (i < povint) {
    const div = document.createElement("div");
    div.innerText = i++;
    fragment.appendChild(div);
  }
  document.body.appendChild(fragment);
  loop();
}

function loop() {
  if (i < total) {
    requestAnimationFrame(render);
  }
}

render();