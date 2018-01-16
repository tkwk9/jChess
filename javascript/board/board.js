import * as Piece from "./piece";

class Board {
  constructor($innerBoard){
    this.$innerBoard = $innerBoard;
    this.moves = [];
    this.p1Hover = undefined;
    this.p2Hover = undefined;
    this.letThereBeGrid();
    this.update();
  }

  setGame(game) {
    this.game = game;
  }

  setTurn(turn) {
    this.turn = turn;
  }

  letThereBeGrid() {
    this.piecesGrid = [[],[],[],[],[],[],[],[]];
    this.tileGrid = [[],[],[],[],[],[],[],[]];

    for (let i = 63; i >= 0; i--) {
      const $tile = $('<li class="tile"></li>');
      const pos = {x: Math.floor(i/8), y: 7 - (i % 8)};
      $tile.data('pos', pos);
      $tile.click(
        this.handleClick(pos)
      );

      $tile.hover(
        this.handleMouseEnter(pos),
        this.handleMouseLeave()
      );

      if((pos.x + pos.y) % 2 === 0){
        $tile.addClass('dark');
      } else {
        $tile.addClass('light');
      }
      this.tileGrid[pos.x][pos.y] = $tile;
      this.$innerBoard.append($tile);
    }

    this.nullPiece = new Piece.NullPiece();
    let pieceOrder = [
      Piece.Rook,
      Piece.Knight,
      Piece.Bishop,
      Piece.Queen,
      Piece.King,
      Piece.Bishop,
      Piece.Knight,
      Piece.Rook
    ];
    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        if (i === 0){
          this.piecesGrid[i][j] =
            new pieceOrder[j]({x: i, y: j}, this, "white");
        } else if (i === 1){
          this.piecesGrid[i][j] =
            new Piece.Pawn({x: i, y: j}, this, "white");
        } else if (i === 6){
          this.piecesGrid[i][j] =
            new Piece.Pawn({x: i, y: j}, this, "black");
        } else if (i === 7){
          this.piecesGrid[i][j] =
            new pieceOrder[j]({x: i, y: j}, this, "black");
        } else {
          this.piecesGrid[i][j] = this.nullPiece;
        }
      }
    }
  }

  getPiece(position) {
    return this.piecesGrid[position.x][position.y];
  }

  getTile(position) {
    return this.tileGrid[position.x][position.y];
  }

  isInMoves(pos){
    return this.moves.filter( move => move.x === pos.x && move.y === pos.y).length > 0;
  }

  isPieceTurn(pos) {
    return this.turn === this.getPiece(pos).color;
  }

  handleClick(pos) {
    return () => {
      if (this.startPos) {
        if(this.isInMoves(pos)){
          this.movePiece(this.startPos, pos);
          this.removeMoves();
          this.update();
        } else {
          this.removeMoves();
          this.update();
        }
      } else {
        if(this.isPieceTurn(pos)){
          this.showMoves(pos);
          this.startPos = pos;
        }
      }
    };
  }

  handleMouseEnter(pos) {
    return () => {
      if(!this.startPos){
        if(this.isPieceTurn(pos)){
          this.showMoves(pos);
        }
      } else {
        if (this.isInMoves(pos)){
          this.p2Hover = pos;
        } else {
          this.p2Hover = undefined;
        }
      }
      this.update();
    };
  }

  handleMouseLeave() {
    return () => {
      if(!this.startPos){
        this.removeMoves();
        this.update();
      }
    };
  }

  placePiece(piece, pos){
    this.piecesGrid[pos.x][pos.y] = piece;
    piece.position = pos;
  }

  movePiece(startPos, destPos) {
    const startPiece = this.getPiece(startPos);
    const destPiece = this.getPiece(destPos);
    if (this.isOpponentTile(startPiece, destPos)) {
      this.placePiece(startPiece, destPos);
      this.placePiece(this.nullPiece, startPos);
    } else {
      this.placePiece(startPiece, destPos);
      this.placePiece(this.nullPiece, startPos);
    }
    this.game.changeTurns();
  }

  removePiece(pos) {
    this.piecesGrid[pos.x][pos.y] = this.nullPiece;
  }

  isEmptyTile(pos) {
    return (this.piecesGrid[pos.x][pos.y] === this.nullPiece);
  }

  isOpponentTile(piece, pos){
    return !this.isEmptyTile(pos) && piece.color
      !== this.piecesGrid[pos.x][pos.y].color;
  }

  isInBound(position) {
    return (position.x >=0 && position.x <= 7) &&
      (position.y >=0 && position.y <= 7);
  }





  showMoves(pos) {
    this.moves = this.getPiece(pos).getMoves();
    this.p1Hover = pos;
  }

  removeMoves() {
    this.moves = [];
    this.p1Hover = undefined;
    this.p2Hover = undefined;
    this.startPos = undefined;
    this.update();
  }

  clearBoard() {
    this.tileGrid.forEach(row => {
      row.forEach(tile => {
        tile.removeClass('path');
        tile.removeClass('p1-hover');
        tile.removeClass('p2-hover');
        tile.empty();
      });
    });
  }


  update() {
    this.clearBoard();

    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        this.tileGrid[i][j].html(this.piecesGrid[i][j].unicode);
      }
    }

    this.moves.forEach((move) => {
      this.getTile(move).addClass('path');
    });
    if (this.p1Hover) {
      this.getTile(this.p1Hover).addClass('p1-hover');
    }
    if (this.p2Hover) {
      this.getTile(this.p2Hover).addClass('p2-hover');
    }
  }
}

export default Board;
