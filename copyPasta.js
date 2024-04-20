const root = document.getElementById("root");
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

root.appendChild(canvas);
requestAnimationFrame(renderLoop);

const ctx = canvas.getContext("2d");
const rndI = (min, max) => Math.random() * (max - min) + min;
const rndSize = (size) => [rndI(size * 0.2, size), rndI(size * 0.2, size)];
const Vec2 = (x, y) => ({ x, y });
const view = [1, 0, 0, 1, 0, 0]; // Matrix representing the view.
const Obj = (position, color, width, height) => ({
  position,
  color,
  width,
  height,
});
const character = Obj(Vec2(0, 0), "#000", 20, 20); // position of character

function setView(position) {
  view[4] = -position.x + canvas.width * 0.5;
  view[5] = -position.y + canvas.height * 0.5;
}
function applyView(view) {
  ctx.setTransform(...view);
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
  const pAngA = time / 1000;
  const pAngB = time / 337;
  character.position.x = Math.sin(pAngA) * 600 + Math.sin(pAngB) * 400;
  character.position.y = Math.cos(pAngA) * 600 + Math.cos(pAngB) * 400;

  setView(character.position);
  applyView(view);
  drawWorld(world);

  requestAnimationFrame(renderLoop);
}

function createEntity() {
  const colors = ["#0AF", "#CA0", "#0A0", "#580"];
  const randomColorIdx = Math.trunc(Math.random() * colors.length);

  return Obj(
    Vec2(rndI(-1500, 1500), rndI(-1500, 1500)),
    colors[randomColorIdx],
    ...rndSize(630)
  );
}

const world = [
  ...Array.from({ length: 60 }).map(() => createEntity()),
  character,
];
