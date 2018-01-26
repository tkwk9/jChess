import * as Piece from "./piece";

class Board {
  constructor(starting = true){
    this.piecesGrid = [[],[],[],[],[],[],[],[]];
    this.isRealBoard = starting;
    if(starting){
      this.letThereBeGrid();
      window.pieces = this.getPieces.bind(this);
      window.points = this.points.bind(this);
    }
    this.points = this.points.bind(this);
    this.deathCount = 0;
    this.inCheck = {
      "black": false,
      "white": false
    };
  }

  setGame(game) {
    this.game = game;
    this.turn = game.turn;
  }

  dup() {
    const newBoard = new Board(false);
    newBoard.nullPiece = this.nullPiece;

    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        let pos = {x:i, y:j};
        if (this.isEmptyTile(pos)) {
          newBoard.piecesGrid[i][j] = this.nullPiece;
        } else {
          newBoard.piecesGrid[i][j] = this.piecesGrid[i][j].dup(newBoard);
          if (this.piecesGrid[i][j] === this.blackKing){
            newBoard.blackKing = newBoard.piecesGrid[i][j];
          } else if (this.piecesGrid[i][j] === this.whiteKing){
            newBoard.whiteKing = newBoard.piecesGrid[i][j];
          }
        }
      }
    }
    return newBoard;
  }

  isInCheckMate(color){
    return this.getPieces(color).filter(piece =>
      piece.getValidMoves().length > 0).length <= 0;
  }

  points() {
    return this.getAllPieces().map(piece => piece.getPoints()).reduce((acc, el) => acc + el, 0);
  }

  getPieces(color) {
    let pieces = [];
    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        let pos = {x:i, y:j};
        if (this.getPiece(pos).color === color){
          pieces.push(this.getPiece(pos));
        }
      }
    }
    return pieces;
  }

  isInCheck(color) {
    let opponent;
    let king;
    if (color === 'white'){
      opponent = 'black';
      king = this.whiteKing;
    } else {
      opponent = 'white';
      king = this.blackKing;
    }

    let pieces = this.getPieces(opponent);

    for (let i = 0; i < pieces.length; i++){
      let moves = pieces[i].getMoves();
      for (let j = 0; j < moves.length; j++){
        if (moves[j].x === king.position.x && moves[j].y === king.position.y){
          this.inCheck[color] = true;
          return true;
        }
      }
    }
    this.inCheck[color] = false;
    return false;
  }

  pumpMoves(color) {
    let pieces = this.getPieces(color);
    let piece = pieces.pop();
    let pump = piece.pumpValidMove();
    pieces.unshift(false);
    return () => {
      let move = pump();
      while (!move){ // ran out of moves
        piece = pieces.pop();
        if (!piece) { // and out of pieces
          return false;
        }
        pump = piece.pumpValidMove();
        move = pump();
      }
      return move;
    };
  }

  getAllMoves(color) {
    let pieces = this.getPieces(color);
    let duplications = [];
    pieces.forEach( piece => {
      piece.getValidMoves().forEach( move => {
        let dupFunction = () => {
          let dup = this.dup();
          dup.movePiece(piece.position, move);
          return dup;
        };
        duplications.push(dupFunction);
      });
    });
    return duplications;
  }



  getPiece(position) {
    return this.piecesGrid[position.x][position.y];
  }

  isPieceTurn(pos) {
    return this.turn === this.getPiece(pos).color;
  }

  placePiece(piece, pos){
    this.piecesGrid[pos.x][pos.y] = piece;
    piece.position = pos;
  }

  movePiece(startPos, destPos) {
    const startPiece = this.getPiece(startPos);
    const destPiece = this.getPiece(destPos);

    if (startPos.x === 0) {
      if (startPos.y === 0) {
        this.whiteKing.castleLeft = false;
      } else if (startPos.y === 4) {
        this.whiteKing.castleLeft = false;
        this.whiteKing.castleRight = false;
      } else if (startPos.y === 7) {
        this.whiteKing.castleRight = false;
      }
    } else if (startPos.x === 7) {
      if (startPos.y === 0) {
        this.blackKing.castleLeft = false;
      } else if (startPos.y === 4) {
        this.blackKing.castleLeft = false;
        this.blackKing.castleRight = false;
      } else if (startPos.y === 7) {
        this.blackKing.castleRight = false;
      }
    }

    if (
      (startPos.x === 0 || startPos.x === 7) &&
      startPos.y === 4 &&
      (destPos.x === 0 || destPos.x === 7) &&
      startPiece.type === "King"
    ) {
      if (destPos.y === 6) {
        this.movePiece({x: startPos.x, y: 7}, {x: startPos.x, y: 5});
      } else if (destPos.y === 1) {
        this.movePiece({x: startPos.x, y: 0}, {x: startPos.x, y: 2});
      }
    }

    if (
      (startPos.x === 1 || startPos.x === 6) &&
      (destPos.x === 0 || destPos.x === 7) &&
      startPiece.type === "Pawn"
    ) {
      this.placePiece(this.nullPiece, startPos);
      this.placePiece(new Piece.Queen(destPos, this, this.turn), destPos);
    } else {
      this.lastMove = [startPos, destPos];
      if (this.isOpponentTile(startPiece, destPos) && this.isRealBoard) {
        $(`.captures.${destPiece.color}`).
        append(`<div class="captured">${destPiece.unicode}</div>`);
        this.placePiece(startPiece, destPos);
        this.placePiece(this.nullPiece, startPos);
      } else {
        this.placePiece(startPiece, destPos);
        this.placePiece(this.nullPiece, startPos);
      }
    }

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

  letThereBeGrid() {
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
          if (j === 4) {
            this.whiteKing = this.piecesGrid[i][j];
          }
        } else if (i === 1){
          this.piecesGrid[i][j] =
            new Piece.Pawn({x: i, y: j}, this, "white");
        } else if (i === 6){
          this.piecesGrid[i][j] =
            new Piece.Pawn({x: i, y: j}, this, "black");
        } else if (i === 7){
          this.piecesGrid[i][j] =
            new pieceOrder[j]({x: i, y: j}, this, "black");
            if (j === 4) {
              this.blackKing = this.piecesGrid[i][j];
            }
        } else {
          this.piecesGrid[i][j] = this.nullPiece;
        }
      }
    }
  }

  // helperMethods
  getAllPieces() {
    let myArr = [];
    this.piecesGrid.forEach(row => {
      myArr = myArr.concat(row);
    });
    return myArr.filter((piece) => piece !== this.nullPiece);
  }
}

export default Board;
