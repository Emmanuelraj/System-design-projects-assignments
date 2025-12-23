import { startLogger } from "./logger";
import { GameManager } from "./store";

startLogger();

setInterval(() => {
  GameManager.getInstance().addGame({
    id: crypto.randomUUID(),
    whitePlayerName: "Alice",
    blackPlayerName: "Bob",
    moves: []
  });
}, 5000);
