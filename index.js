// https://stackoverflow.com/questions/73736370/is-it-better-to-translate-to-whole-canvas-or-to-change-the-position-of-elements

function generateRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function createWorldEntity() {
  const colors = ["#0AF", "#CA0", "#558800"];
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

  // details of canvas view
  const view = {
    scaleX: 1,
    skewX: 0,
    skewY: 0,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
  };

  // details of character
  const character = {
    position: { x: 0, y: 0 },
    color: "#F7F4EA",
    width: 20,
    height: 20,
    speed: 2.5,
    health: 100,
  };

  // details of monster
  const monster = {
    position: {
      x: generateRandomNumber(1, 1000),
      y: generateRandomNumber(1, 1000),
    },
    color: "#134611",
    width: 20,
    height: 20,
    speed: 0.5,
  };

  // array of world entities (objects)
  const world = [
    ...Array.from({ length: 60 }).map(() => createWorldEntity()),
    monster,
    character,
  ];

  // set of e.key values
  const keysPressed = new Set();

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  root.appendChild(canvas);

  // start game render loop
  requestAnimationFrame(renderLoop);

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  window.addEventListener("keyup", function (e) {
    keysPressed.delete(e.key);
  });
  window.addEventListener("keydown", function (e) {
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

  function renderLoop() {
    // set default transform to clear the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const curPlayerX = character.position.x;
    const curPlayerY = character.position.y;
    let dx = curPlayerX;
    let dy = curPlayerY;

    if (keysPressed.has("ArrowUp")) dy -= character.speed;
    if (keysPressed.has("ArrowDown")) dy += character.speed;
    if (keysPressed.has("ArrowLeft")) dx -= character.speed;
    if (keysPressed.has("ArrowRight")) dx += character.speed;

    character.position.x = dx;
    character.position.y = dy;

    const curMonsterX = monster.position.x;
    const curMonsterY = monster.position.y;
    let mdx = curMonsterX;
    let mdy = curMonsterY;

    const characterIsToLeft = curPlayerX - curMonsterX < 0;
    const characterIsAbove = curPlayerY - curMonsterY < 0;

    // monster run towards
    if (characterIsToLeft) mdx -= monster.speed;
    if (!characterIsToLeft) mdx += monster.speed;
    if (characterIsAbove) mdy -= monster.speed;
    if (!characterIsAbove) mdy += monster.speed;

    // monster run away
    // if (characterIsToLeft) mdx += monster.speed;
    // if (!characterIsToLeft) mdx -= monster.speed;
    // if (characterIsAbove) mdy += monster.speed;
    // if (!characterIsAbove) mdy -= monster.speed;

    monster.position.x = mdx;
    monster.position.y = mdy;

    setView(character.position);
    applyView(view);
    drawWorld(world);

    const fps = 1000 / 60; // 1 second divided by 60 frames
    setTimeout(() => requestAnimationFrame(renderLoop), fps);
  }
})();
