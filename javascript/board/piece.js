const DIAGONALS = [
    {x: -1, y: 1},
    {x: 1, y: -1},
    {x: -1, y: -1},
    {x: 1, y: 1}
  ];

const LINES = [
    {x: 0, y: 1},
    {x: 0, y: -1},
    {x: -1, y: 0},
    {x: 1, y: 0}
  ];

class Piece {
  constructor(position, board, color){
    this.position = position;
    this.board = board;
    this.color = color;
    this.isPiece = true;
  }

  updatePoints() {
    if (this.color === "white")
      this.pointsArray = this.pointsArray.reverse();
  }

  addDirection(position, direction) {
    return {
      x: position.x + direction.x,
      y: position.y + direction.y
    };
  }

  getPoints() {
    // let points = this.pointsArray[this.position.x][this.position.y];
    let points = this.pointsArray[this.position.x][this.position.y] + this.points;
    return (this.color === "black") ? -1 * points : points;
  }

  pumpValidMove() {
    let moves = this.getMoves();
    moves.unshift(false);
    return () => {
      let move = moves.pop();
      if (!move) {
        return false;
      }
      let newBoard = this.board.dup();
      newBoard.movePiece(this.position, move);
      while (newBoard.isInCheck(this.color)) {
        move = moves.pop();
        if (!move) {
          return false;
        }
        newBoard = this.board.dup();
        newBoard.movePiece(this.position, move);
      }
      return newBoard;
    };
  }

  getValidMoves() {
    let moves = this.getMoves();
    return moves.filter(move => {
      let newBoard = this.board.dup();
      newBoard.movePiece(this.position, move);
      return !newBoard.isInCheck(this.color);
    });
  }

  dup(board) {
    return new this.constructor(this.position, board, this.color);
  }
}

class SteppingPiece extends Piece {
  constructor(...args){
    super(...args);
  }

  getMoves() {
    let allMoves = [];

    this.directions.forEach(direction => {
      let tempPos = this.addDirection(this.position, direction);
      if (this.board.isInBound(tempPos) &&
        (this.board.isEmptyTile(tempPos) ||
          this.board.isOpponentTile(this, tempPos))) {
        allMoves.push(tempPos);
      }
    });

    return allMoves;
  }
}

class SlidingPiece extends Piece {
  constructor(...args){
    super(...args);
  }

  getMoves() {
    let allMoves = [];
    let tempPos;

    this.directions.forEach(direction => {
      tempPos = this.addDirection(this.position, direction);
      while (this.board.isInBound(tempPos) && this.board.isEmptyTile(tempPos)){ //and if theres no piece
        allMoves.push(tempPos);
        tempPos = this.addDirection(tempPos, direction);
      }
      if (this.board.isInBound(tempPos) && this.board.isOpponentTile(this, tempPos)){ // and is an opponent
        allMoves.push(tempPos);
      }
    });
    return allMoves;
  }
}

export class Bishop extends SlidingPiece {
  constructor(...args) {
    super(...args);
    this.unicode = (this.color === "black") ? "\u265D" : "\u2657";
    this.type = "Bishop";
    this.directions = DIAGONALS;
    this.pointsArray =[[-20,-10,-10,-10,-10,-10,-10,-20],
                      [-10,  0,  0,  0,  0,  0,  0,-10],
                      [-10,  0,  5, 10, 10,  5,  0,-10],
                      [-10,  5,  5, 10, 10,  5,  5,-10],
                      [-10,  0, 10, 10, 10, 10,  0,-10],
                      [-10, 10, 10, 10, 10, 10, 10,-10],
                      [-10,  5,  0,  0,  0,  0,  5,-10],
                      [-20,-10,-10,-10,-10,-10,-10,-20]];
    this.points = 80;
    this.updatePoints();

  }
}

export class Rook extends SlidingPiece {
  constructor(...args) {
    super(...args);
    this.unicode = (this.color === "black") ? "\u265C" : "\u2656";
    this.type = "Rook";
    this.directions = LINES;
    this.pointsArray = [[0,  0,  0,  0,  0,  0,  0,  0],
                        [5, 10, 10, 10, 10, 10, 10,  5],
                        [-5,  0,  0,  0,  0,  0,  0, -5],
                        [-5,  0,  0,  0,  0,  0,  0, -5],
                        [-5,  0,  0,  0,  0,  0,  0, -5],
                        [-5,  0,  0,  0,  0,  0,  0, -5],
                        [-5,  0,  0,  0,  0,  0,  0, -5],
                        [0,  0,  0,  5,  5,  0,  0,  0]];
    this.points = 55;

    this.updatePoints();

  }
}

export class Queen extends SlidingPiece {
  constructor(...args) {
    super(...args);
    this.unicode = (this.color === "black") ? "\u265B" : "\u2655";
    this.type = "Queen";
    this.directions = LINES.concat(DIAGONALS);
    this.pointsArray = [[-20,-10,-10, -5, -5,-10,-10,-20],
                        [-10,  0,  0,  0,  0,  0,  0,-10],
                        [-10,  0,  5,  5,  5,  5,  0,-10],
                        [ -5,  0,  5,  5,  5,  5,  0, -5],
                        [  0,  0,  5,  5,  5,  5,  0, -5],
                        [-10,  5,  5,  5,  5,  5,  0,-10],
                        [-10,  0,  5,  0,  0,  0,  0,-10],
                        [-20,-10,-10, -5, -5,-10,-10,-20]];
    this.points = 100;

    this.updatePoints();

  }
}

export class Knight extends SteppingPiece {
  constructor(...args) {
    super(...args);
    this.unicode = (this.color === "black") ? "\u265E" : "\u2658";
    this.type = "Knight";
    this.directions = [
      {x: -2, y:-1},
      {x: -2, y:1},
      {x: 2, y:-1},
      {x: 2, y:1},
      {x: 1, y:-2},
      {x: 1, y:2},
      {x: -1, y:-2},
      {x: -1, y:2}
    ];
    this.pointsArray =[[-30,-40,-30,-30,-30,-30,-40,-50],
                      [-40,-20,  0,  0,  0,  0,-20,-40],
                      [-30,  0, 10, 15, 15, 10,  0,-30],
                      [-30,  5, 15, 20, 20, 15,  5,-30],
                      [-30,  0, 15, 20, 20, 15,  0,-30],
                      [-30,  5, 10, 15, 15, 10,  5,-30],
                      [-40,-20,  0,  5,  5,  0,-20,-40],
                      [-50,-40,-30,-30,-30,-30,-40,-50]];
    this.points = 80;
    this.updatePoints();

  }
}

export class King extends SteppingPiece {
  constructor(...args) {
    super(...args);
    this.unicode = (this.color === "black") ? "\u265A" : "\u2654";
    this.type = "King";

    this.castleLeft = {x: 0, y: -3};
    this.castleRight = {x: 0, y: 2};

    this.directions = LINES.concat(DIAGONALS);
    this.pointsArray = [[-30,-40,-40,-50,-50,-40,-40,-30],
                        [-30,-40,-40,-50,-50,-40,-40,-30],
                        [-30,-40,-40,-50,-50,-40,-40,-30],
                        [-30,-40,-40,-50,-50,-40,-40,-30],
                        [-20,-30,-30,-40,-40,-30,-30,-20],
                        [-10,-20,-20,-20,-20,-20,-20,-10],
                        [ 20, 20,  0,  0,  0,  0, 20, 20],
                        [ 20, 30, 10,  0,  0, 10, 30, 20]];
    this.points = 950;
    this.updatePoints();

  }

  dup(board) {
    let copy = new this.constructor(this.position, board, this.color);
    copy.startingPosition = this.startingPosition;
    copy.castleLeft = this.castleLeft;
    copy.castleRight = this.castleRight;
    return copy;
  }

  getMoves() {
    let allMoves = [];

    let directions = this.directions.slice();
    if (!this.board.inCheck[this.color]){
      if (this.castleLeft &&
        this.board.getPiece(
          this.addDirection(this.position, {x: 0, y: -1})
        ) === this.board.nullPiece ||
        this.board.getPiece(
          this.addDirection(this.position, {x: 0, y: -2})
        ) === this.board.nullPiece
      ) directions.push(this.castleLeft);
      if (this.castleRight &&
        this.board.getPiece(
          this.addDirection(this.position, {x: 0, y: 1})
        ) === this.board.nullPiece
      ) directions.push(this.castleRight);
    }

    directions.forEach(direction => {
      let tempPos = this.addDirection(this.position, direction);
      if (this.board.isInBound(tempPos) &&
        (this.board.isEmptyTile(tempPos) ||
          this.board.isOpponentTile(this, tempPos))) {
        allMoves.push(tempPos);
      }
    });

    return allMoves;

  }
}

export class Pawn extends Piece {
  constructor(position, board, color) {
    super(position, board, color);
    this.unicode = (this.color === "black") ? "\u265F" : "\u2659";
    this.startingPosition = position;
    this.type = "Pawn";
    this.pointsArray = [[0,  0,  0,  0,  0,  0,  0,  0],
                        [50, 50, 50, 50, 50, 50, 50, 50],
                        [10, 10, 20, 30, 30, 20, 10, 10],
                        [5,  5, 10, 25, 25, 10,  5,  5],
                        [0,  0,  0, 20, 20,  0,  0,  0],
                        [5, -5,-10,  0,  0,-10, -5,  5],
                        [5, 10, 10,-20,-20, 10, 10,  5],
                        [0,  0,  0,  0,  0,  0,  0,  0]];
    this.updatePoints();
    this.points = 30;

    if (color === 'black') {
      this.direction = {
        x: -1,
        y: 0
      };
      this.attackingDirections = [
        { x: -1, y: -1},
        { x: -1, y: 1}
      ];
    } else {
      this.direction = {
        x: 1,
        y: 0
      };
      this.attackingDirections = [
        { x: 1, y: -1},
        { x: 1, y: 1}
      ];
    }
  }

  dup(board) {
    let copy = new this.constructor(this.position, board, this.color);
    copy.startingPosition = this.startingPosition;
    return copy;
  }

  getMoves() {
    let allMoves = [];
    let tempPos = this.addDirection(this.position, this.direction);

    if (this.board.isInBound(tempPos) && this.board.isEmptyTile(tempPos)) {
      allMoves.push(tempPos);
      if (this.startingPosition === this.position){
        tempPos = this.addDirection(tempPos, this.direction);
        if (this.board.isEmptyTile(tempPos)){
          allMoves.push(tempPos);
        }
      }
    }

    this.attackingDirections.forEach(attackingDirection => {
      tempPos = this.addDirection(this.position, attackingDirection);
      if (this.board.isInBound(tempPos)){
        if(this.board.isOpponentTile(this, tempPos)){
          allMoves.push(tempPos);
        }
      }
    });
    return allMoves;
  }
}

export class NullPiece extends Piece {
  constructor() {
    super();
    this.unicode = " ";
  }

  getMoves(){
    return [];
  }
}
