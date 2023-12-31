const bullets = [
  "前方高能",
  "原来如此",
  "这么简单",
  "学到了",
  "学费了",
  "666666",
  "111111",
  "workerman",
  "学习了",
  "别走，奋斗到天明",
];

/**
 * @description 根据 bulletConfig 配置在 videoEle 元素最右边生成弹幕，并移动到最左边，弹幕最后消失
 * @param {typeof bulletConfig} bulletConfig 弹幕配置
 * @param {Element} videoEle 视频元素
 * @param {boolean} isCreate 是否为新增发送的弹幕，为 true 表示为新增的弹幕
 *
 */
function renderBullet(bulletConfig, videoEle, isCreate = false) {
  const spanEle = document.createElement("SPAN");
  spanEle.classList.add(`bullet${index}`);
  if (isCreate) {
    spanEle.classList.add("create-bullet");
  }
  // TODO：控制弹幕的显示颜色和移动，每隔 bulletConfig.time 时间，弹幕移动的距离  bulletConfig.speed
  const { isHide, speed, time, value } = bulletConfig;
  const videoPos = getEleStyle(videoEle);
  /**绝对定位left值 */
  let leftPos = videoPos.width;
  spanEle.innerText = value;
  spanEle.style.position = "absolute";
  spanEle.style.display = isHide ? "none" : "block";
  //随机颜色
  spanEle.style.color = `rgb(${getRandomNum(255)},${getRandomNum(
    255
  )},${getRandomNum(255)})`;
  spanEle.style.left = leftPos + "px";
  videoEle.appendChild(spanEle);

  /**弹幕位置，需要在span加入父元素后获取 */
  const spanPos = getEleStyle(spanEle);
  /**y轴随机位置 */
  spanEle.style.top = getRandomNum(videoPos.height - spanPos.height) + "px";
  const interval = setInterval(() => {
    spanEle.style.left = (leftPos -= speed) + "px";
    //看不见时销毁弹幕，清除定时器
    if (leftPos <= -spanPos.width) {
      videoEle.removeChild(spanEle);
      clearInterval(interval);
    }
  }, time);
}
/**获取input元素 */
const bulletContent = document.querySelector("#bulletContent");
document.querySelector("#sendBulletBtn").addEventListener("click", () => {
  // TODO:点击发送按钮，输入框中的文字出现在弹幕中
  renderBullet(
    Object.assign({}, bulletConfig, { value: bulletContent.value }),
    videoEle,
    true
  );
  bulletContent.value = "";
});

function getEleStyle(ele) {
  // 获得元素的width,height,left,right,top,bottom
  return ele.getBoundingClientRect();
}

function getRandomNum(end, start = 0) {
  // 获得随机数，范围是 从start到 end
  return Math.floor(start + Math.random() * (end - start + 1));
}

// 设置 index 是为了弹幕数组循环滚动
let index = 0;
const videoEle = document.querySelector("#video");
// 弹幕配置
const bulletConfig = {
  isHide: false, // 是否隐藏
  speed: 5, // 弹幕的移动距离
  time: 50, // 弹幕每隔多少ms移动一次
  value: "", // 弹幕的内容
};
let isPlay = false;
let timer; // 保存定时器
document.querySelector("#vd").addEventListener("play", () => {
  // 监听视频播放事件，当视频播放时，每隔 1000s 加载一条弹幕
  isPlay = true;
  bulletConfig.value = bullets[index++];
  renderBullet(bulletConfig, videoEle);
  timer = setInterval(() => {
    bulletConfig.value = bullets[index++];
    renderBullet(bulletConfig, videoEle);
    if (index >= bullets.length) {
      index = 0;
    }
  }, 1000);
});

document.querySelector("#vd").addEventListener("pause", () => {
  isPlay = false;
  clearInterval(timer);
});

document.querySelector("#switchButton").addEventListener("change", (e) => {
  if (e.target.checked) {
    bulletConfig.isHide = false;
  } else {
    bulletConfig.isHide = true;
  }
});
