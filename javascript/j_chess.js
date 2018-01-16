import Board from "./board/board";

class jChess {
  constructor() {
    this.board = new Board();
    window.board = this.board;
    this.turn = "white";
    $('#game-status').html("White's Turn");
    this.board.setGame(this);
    this.board.setTurn(this.turn);
  }

  getBoard() {
    return this.board;
  }

  changeTurns() {
    if (this.turn === "white") {
      this.turn = "black";
      $('#game-status').html("Black's Turn");
      this.board.setTurn(this.turn);
    } else {
      this.turn = "white";
      this.board.setTurn(this.turn);
      $('#game-status').html("White's Turn");
    }
  }

}

export default jChess;
