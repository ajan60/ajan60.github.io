const canvas = document.getElementById("drawingCanvas");
const context = canvas.getContext("2d");

let drawingMode = false;
let lastEvent = null;
let lastSize = 0;
let maxSize = 15;
let minSize = 2;
let color = "#0aadff";

function resizeCanvas() {
  const wrapper = canvas.parentElement;
  const container = wrapper.parentElement;
  const containerRect = container.getBoundingClientRect();

  canvas.width = wrapper.offsetWidth;
  canvas.height = wrapper.offsetHeight;

  if (containerRect.width > containerRect.height) {
    wrapper.style.width = `${
      (32 * containerRect.height) / containerRect.width
    }%`;
    wrapper.style.height = "42%";
  } else {
    wrapper.style.width = "32%";
    wrapper.style.height = `${
      (42 * containerRect.width) / containerRect.height
    }%`;
  }
}

function drawCircle(x, y, radius, color) {
  context.fillStyle = color;
  context.beginPath();
  const canvasRect = canvas.getBoundingClientRect();
  const canvasScale = canvas.width / canvasRect.width;
  context.save();
  context.scale(canvasScale, canvasScale);
  context.arc(x - canvasRect.x, y - canvasRect.y, radius, 0, Math.PI * 2);
  context.fill();
  context.closePath();
  context.restore();
}

function onMouseDown(e) {
  if (e.touches) {
    e = e.touches[0];
  }

  lastEvent = e;
  drawingMode = true;
}

function onMouseUp() {
  drawingMode = false;
}

function onMouseMove(e) {
  if (!drawingMode) {
    return;
  }
  if (e.touches) {
    e.preventDefault();
    e = e.touches[0];
  }
  let size = 1;

  const deltaX = e.pageX - lastEvent.pageX;
  const deltaY = e.pageY - lastEvent.pageY;
  const distanceToLastMousePosition = Math.sqrt(deltaX ** 2 + deltaY ** 2);

  size = Math.max(minSize, Math.min(maxSize, distanceToLastMousePosition / 3));

  if (drawingMode) {
    drawCircle(e.pageX, e.pageY, size, color);
  }

  if (lastSize) {
    const deltaSize = size - lastSize;

    for (let i = 0; i < distanceToLastMousePosition; i += 1) {
      const shift = i / distanceToLastMousePosition;

      drawCircle(
        e.pageX - deltaX * shift,
        e.pageY - deltaY * shift,
        size - deltaSize * shift,
        color
      );
    }
  }

  lastEvent = e;
  lastSize = size;
}

const canvasContainer = document.querySelector(".canvas-container");

canvasContainer.ondragstart = () => false;

resizeCanvas();

canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("touchstart", onMouseDown);

canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("touchmove", onMouseMove);

window.addEventListener("mouseup", onMouseUp);
window.addEventListener("touchend", onMouseUp);

window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", resizeCanvas);
