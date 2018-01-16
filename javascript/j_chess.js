import Board from "./board/board";

class jChess {
  constructor() {
    this.board = new Board();
    window.board = this.board;
    this.turn = "white";
    this.board.setGame(this);
    this.board.setTurn(this.turn);
  }

  getBoard() {
    return this.board;
  }

  changeTurns() {
    if (this.turn === "white") {
      this.turn = "black";
      this.board.setTurn(this.turn);
    } else {
      this.turn = "white";
      this.board.setTurn(this.turn);
    }
  }
}

export default jChess;
