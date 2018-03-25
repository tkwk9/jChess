import Board from './board/board';
import AI from './AI/ai';

class jChess {
  constructor() {
    this.board = new Board();

    this.receiveMoves = this.receiveMoves.bind(this);

    this.turn = 'white';
    this.opponent = {};
    this.opponent['black'] = 'white';
    this.opponent['white'] = 'black';

    this.board.setGame(this);
    this.evaluateGameStatus();
    this.ai = new AI(this.board, 'black');
  }

  changeTurns() {
    this.turn = this.opponent[this.turn];
    this.board.turn = this.turn;
    this.evaluateGameStatus();
    if (this.turn === 'black' && !this.board.isInCheckMate('black')) {
      setTimeout(this.fetchMoves.bind(this), 500);
    }
  }

  fetchMoves() {
    this.ai.getMove().then(this.receiveMoves);
  }

  receiveMoves(move) {
    this.board.movePiece(move[0], move[1]);
    this.view.setAiMove(move[0], move[1]);
    this.view.update();
    this.changeTurns();
  }

  evaluateGameStatus() {
    let msg;
    if (this.board.isInCheckMate(this.turn)) {
      msg =
        this.opponent[this.turn] === 'black'
          ? 'Checkmate! Computer wins!'
          : 'Checkmate! You win!';
    } else if (this.board.isInCheck(this.turn)) {
      msg = this.turn === 'black' ? 'Computer is in check!' : 'Check!';
    } else {
      msg = this.turn === 'black' ? 'Computer is thinking...' : 'Your turn';
    }
    $('#game-status').empty();
    $('#game-status').html(msg);
    if (this.turn === 'black') {
      $('#game-status').append(
        $(
          "<div class='sk-cube-grid'>" +
            "<div class='sk-cube sk-cube1'></div>" +
            "<div class='sk-cube sk-cube2'></div>" +
            "<div class='sk-cube sk-cube3'></div>" +
            "<div class='sk-cube sk-cube4'></div>" +
            "<div class='sk-cube sk-cube5'></div>" +
            "<div class='sk-cube sk-cube6'></div>" +
            "<div class='sk-cube sk-cube7'></div>" +
            "<div class='sk-cube sk-cube8'></div>" +
            "<div class='sk-cube sk-cube9'></div>" +
            '</div>'
        )
      );
    }
  }
}

export default jChess;
