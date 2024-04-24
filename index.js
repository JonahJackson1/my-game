// https://stackoverflow.com/questions/73736370/is-it-better-to-translate-to-whole-canvas-or-to-change-the-position-of-elements

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

  const character = createPlayerEntity();
  let monsters = [
    ...Array.from({ length: 15 }).map(() => createMonsterEntity()),
  ];
  let world = [
    ...Array.from({ length: 60 }).map(() => createWorldEntity()),
    character,
    ...monsters,
  ];

  // set of e.key values
  const keysPressed = new Set();

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  root.appendChild(canvas);

  // start game loop
  requestAnimationFrame(gameLoop);

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  window.addEventListener("keyup", function (e) {
    keysPressed.delete(e.key);
  });
  window.addEventListener("keydown", function (e) {
    if (keysPressed.has(e.key)) return;
    keysPressed.add(e.key);
  });

  function generateRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createWorldEntity() {
    const colors = ["#62cd47", "#50A4DA", "#ddc62e", "#877568"];
    const randomColorIdx = Math.trunc(Math.random() * colors.length);

    const size = generateRandomNumber(50, 1500); // px

    return {
      id: generateRandomNumber(1, 99999),
      position: {
        x: generateRandomNumber(-1500, 1500),
        y: generateRandomNumber(-1500, 1500),
      },
      color: colors[randomColorIdx],
      width: generateRandomNumber(size * 0.2, size),
      height: generateRandomNumber(size * 0.2, size),
    };
  }

  function createMonsterEntity() {
    const randomSize = generateRandomNumber(10, 75);
    return {
      id: generateRandomNumber(1, 99999),
      position: {
        x: generateRandomNumber(-1000, 1000),
        y: generateRandomNumber(-1000, 1000),
      },
      color: "#155c12",
      width: randomSize,
      height: randomSize,
      size: randomSize,
      speed: generateRandomNumber(0.5, 2.4),
      chase: true,
    };
  }

  function createPlayerEntity() {
    return {
      id: generateRandomNumber(1, 99999),
      position: { x: 0, y: 0 },
      color: "#F7F4EA",
      width: 20,
      height: 20,
      size: 20,
      speed: 2.5,
      health: 100,
    };
  }

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

  function updatePosition(entity, dx, dy, speed) {
    // normalize movement if diagonal to maintain consistent speed
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length > 0) {
      dx = (dx / length) * speed;
      dy = (dy / length) * speed;
    }

    entity.position.x += dx;
    entity.position.y += dy;
  }

  function determineDirection(keysPressed) {
    let dx = 0;
    let dy = 0;
    if (keysPressed.has("ArrowUp")) dy -= 1;
    if (keysPressed.has("ArrowDown")) dy += 1;
    if (keysPressed.has("ArrowLeft")) dx -= 1;
    if (keysPressed.has("ArrowRight")) dx += 1;
    return { dx, dy };
  }

  function isIntersecting(entity1, entity2) {
    const distance = Math.sqrt(
      (entity1.position.x - entity2.position.x) ** 2 +
        (entity1.position.y - entity2.position.y) ** 2
    );
    const threshold = entity1.size / 2 + entity2.size / 2;
    return distance < threshold;
  }

  function gameLoop() {
    // set default transform to clear the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // character movement
    const { dx, dy } = determineDirection(keysPressed);
    updatePosition(character, dx, dy, character.speed);

    // monster movement
    for (const monster of monsters) {
      const mdx = character.position.x - monster.position.x;
      const mdy = character.position.y - monster.position.y;
      const monsterSpeed = monster.chase ? monster.speed : -monster.speed;

      if (isIntersecting(character, monster)) {
        const newMonster = createMonsterEntity();

        monsters = monsters.map((curMonster) =>
          curMonster.id === monster.id ? newMonster : curMonster
        );

        world = world.map((entity) =>
          entity.id === monster.id ? newMonster : entity
        );
        continue;
      }

      updatePosition(monster, mdx < 0 ? -1 : 1, mdy < 0 ? -1 : 1, monsterSpeed);
    }

    setView(character.position);
    applyView(view);
    drawWorld(world);

    const fps = 1000 / 60; // 1 second divided by 60 frames
    setTimeout(() => requestAnimationFrame(gameLoop), fps);
  }
})();
