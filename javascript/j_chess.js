class jChess {
  constructor(board) {
    this.board = board;
    this.turn = "white";
    this.board.setGame(this);
    this.board.setTurn(this.turn);
  }


}

export default jChess;
