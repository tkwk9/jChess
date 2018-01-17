import Board from "./board/board";
import AI from "./AI/ai";

class jChess {
  constructor() {
    this.board = new Board();
    this.ai = new AI(this.board, "black");
    // this.ai.letThereBeTree();
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
      if (this.board.isInCheckMate("black")){
        $('#game-status').html(`Checkmate! White wins!`);
      }
    } else {
      this.turn = "white";
      this.board.setTurn(this.turn);
      $('#game-status').html("White's Turn");
      if (this.board.isInCheckMate("white")){
        $('#game-status').html(`Checkmate! Black wins!`);
      }
    }
  }
}

export default jChess;
