export default class Entity {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
  }

  drawEntity(entity) {
    this.ctx.fillStyle = entity.color;
    this.ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
  }

  clearEntity(entity) {
    const clearX = Math.floor(entity.x - entity.speed - 1);
    const clearY = Math.floor(entity.y - entity.speed - 1);
    const clearWidth = entity.width + entity.speed * 2 + 2;
    const clearHeight = entity.height + entity.speed * 2 + 2;
    this.ctx.clearRect(clearX, clearY, clearWidth, clearHeight);
  }
}
