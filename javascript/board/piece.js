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
  }

  addDirection(position, direction) {
    return {
      x: position.x + direction.x,
      y: position.y + direction.y
    };
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
  }
}

export class Rook extends SlidingPiece {
  constructor(...args) {
    super(...args);
    this.unicode = (this.color === "black") ? "\u265C" : "\u2656";
    this.type = "Rook";
    this.directions = LINES;
  }
}

export class Queen extends SlidingPiece {
  constructor(...args) {
    super(...args);
    this.unicode = (this.color === "black") ? "\u265B" : "\u2655";
    this.type = "Queen";
    this.directions = LINES.concat(DIAGONALS);
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
  }
}

export class King extends SteppingPiece {
  constructor(...args) {
    super(...args);
    this.unicode = (this.color === "black") ? "\u265A" : "\u2654";
    this.type = "King";
    this.directions = LINES.concat(DIAGONALS);
  }
}

export class Pawn extends Piece {
  constructor(position, board, color) {
    super(position, board, color);
    this.unicode = (this.color === "black") ? "\u265F" : "\u2659";
    this.startingPosition = position;
    this.type = "Pawn";

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

  getMoves() {
    let allMoves = [];
    let tempPos = this.addDirection(this.position, this.direction);

    if (this.board.isInBound(tempPos)) {
      allMoves.push(tempPos);
      if (this.startingPosition === this.position){
        allMoves.push(this.addDirection(tempPos, this.direction));
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
