interface Game{
    id: string;
    whitePlayerName: string;
    blackPlayerName: string;
    moves:[]
}



//export const games:Game[] = [];


// Basically we are going to achieve SingletonPattern
export class GameManager{

      
    private games: Game[] = [];
    private static instance: GameManager;

    private constructor(){
        
    }

    public static getInstance():GameManager{

        if(!GameManager.instance){
            // we are going to new object
            GameManager.instance = new GameManager();
        }
        return GameManager.instance
    }

    public addGame(game:Game){
        this.games.push(game);
    }


    public getGame(){
        return this.games;
    }



    public addMove(gameId: string, move: string){

        const game = this.games.find(game => game.id === gameId);
        if(game){
           game.moves.push()
        } 
    }
}


