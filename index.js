// https://stackoverflow.com/questions/73736370/is-it-better-to-translate-to-whole-canvas-or-to-change-the-position-of-elements

function generateRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function createWorldEntity() {
  const colors = ["#0AF", "#CA0", "#0A0", "#580"];
  const randomColorIdx = Math.trunc(Math.random() * colors.length);

  const size = generateRandomNumber(50, 1500); // px

  return {
    position: {
      x: generateRandomNumber(-1500, 1500),
      y: generateRandomNumber(-1500, 1500),
    },
    color: colors[randomColorIdx],
    width: generateRandomNumber(size * 0.2, size),
    height: generateRandomNumber(size * 0.2, size),
  };
}

(function initialize() {
  const root = document.getElementById("root");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // current view of canvas
  const view = {
    scaleX: 1,
    skewX: 0,
    skewY: 0,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
  };

  // position of character
  const character = {
    position: { x: 0, y: 0 },
    color: "#000",
    width: 20,
    height: 20,
    speed: 5,
  };

  const world = [
    ...Array.from({ length: 60 }).map(() => createWorldEntity()),
    character,
  ];

  const keysPressed = new Set();

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  root.appendChild(canvas);

  requestAnimationFrame(renderLoop);

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  window.addEventListener("keyup", (e) => {
    keysPressed.delete(e.key);
  });
  window.addEventListener("keydown", (e) => {
    keysPressed.add(e.key);
  });

  function setView(position) {
    view.translateX = -position.x + canvas.width * 0.5;
    view.translateY = -position.y + canvas.height * 0.5;
  }

  function applyView(view) {
    ctx.setTransform(
      view.scaleX,
      view.skewY,
      view.skewX,
      view.scaleY,
      view.translateX,
      view.translateY
    );
  }

  function drawWorld(entities) {
    for (const entity of entities) {
      ctx.fillStyle = entity.color;
      ctx.fillRect(
        entity.position.x - entity.width * 0.5,
        entity.position.y - entity.height * 0.5,
        entity.width,
        entity.height
      );
    }
  }

  function renderLoop(time) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // set default transform to clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time *= 0.3;

    let dx = character.position.x;
    let dy = character.position.y;

    if (keysPressed.has("ArrowUp")) dy -= character.speed;
    if (keysPressed.has("ArrowDown")) dy += character.speed;
    if (keysPressed.has("ArrowLeft")) dx -= character.speed;
    if (keysPressed.has("ArrowRight")) dx += character.speed;

    character.position.x = dx;
    character.position.y = dy;

    setView(character.position);
    applyView(view);
    drawWorld(world);

    requestAnimationFrame(renderLoop);
  }
})();
