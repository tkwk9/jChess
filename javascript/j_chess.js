class jChess {
  constructor(board) {
    this.board = board;
    this.turn = "white";
    this.board.setGame(this);
    this.board.setTurn(this.turn);
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
