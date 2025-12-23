import { GameManager } from "./store";

export function startLogger() {
    setInterval(()=>{
    console.log(GameManager.getInstance().getGame());
},5000);
}