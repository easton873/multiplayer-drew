export class GameOverScreen {
    // join room screen
    public div = document.getElementById("gameOverScreen") as HTMLDivElement;
    public winnerLabel = document.getElementById("winnerLabel") as HTMLLabelElement;
    public backButton = document.getElementById("returnToWaitingButton") as HTMLButtonElement;

    constructor(manager : NextScreener) {
        this.backButton.onclick = () => {
            manager.toWaitingScreen();
        }
    }

    displayWinner(winner : string) {
        this.winnerLabel.innerHTML = `${winner} is the winner!`;
    }
}

export interface NextScreener {
    toWaitingScreen();
}