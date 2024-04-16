import Game from "./game.js";
import Player from "./player.js";

const game = new Game();
const player = new Player(game);

game.addEntity(player);
