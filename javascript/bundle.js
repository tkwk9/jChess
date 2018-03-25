/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__piece__ = __webpack_require__(3);


class Board {
  constructor(starting = true, boardState){
    this.piecesGrid = [[],[],[],[],[],[],[],[]];
    this.isRealBoard = starting;
    if(starting){
      this.letThereBeGrid();
      window.pieces = this.getPieces.bind(this);
      window.points = this.points.bind(this);
    }
    if(boardState) {

    }
    this.points = this.points.bind(this);
    this.deathCount = 0;
    this.inCheck = {
      "black": false,
      "white": false
    };
  }

  toString() {

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
      } else if (destPos.y === 2) {
        this.movePiece({x: startPos.x, y: 0}, {x: startPos.x, y: 3});
      }
    }

    if (
      (startPos.x === 1 || startPos.x === 6) &&
      (destPos.x === 0 || destPos.x === 7) &&
      startPiece.type === "Pawn"
    ) {
      this.placePiece(this.nullPiece, startPos);
      this.placePiece(new __WEBPACK_IMPORTED_MODULE_0__piece__["f" /* Queen */](destPos, this, this.turn), destPos);
    } else {
      this.lastMove = [startPos, destPos];
      if (this.isOpponentTile(startPiece, destPos) && this.isRealBoard) {
        this.deathCout++;
        if (this.deathCount === 20) {
          this.game.ai.depth = 5;
          this.game.ai.passRate1 = 0.2;
          this.game.ai.passRate1 = 1;
        }
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
    this.nullPiece = new __WEBPACK_IMPORTED_MODULE_0__piece__["d" /* NullPiece */]();
    let pieceOrder = [
      __WEBPACK_IMPORTED_MODULE_0__piece__["g" /* Rook */],
      __WEBPACK_IMPORTED_MODULE_0__piece__["c" /* Knight */],
      __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* Bishop */],
      __WEBPACK_IMPORTED_MODULE_0__piece__["f" /* Queen */],
      __WEBPACK_IMPORTED_MODULE_0__piece__["b" /* King */],
      __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* Bishop */],
      __WEBPACK_IMPORTED_MODULE_0__piece__["c" /* Knight */],
      __WEBPACK_IMPORTED_MODULE_0__piece__["g" /* Rook */]
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
            new __WEBPACK_IMPORTED_MODULE_0__piece__["e" /* Pawn */]({x: i, y: j}, this, "white");
        } else if (i === 6){
          this.piecesGrid[i][j] =
            new __WEBPACK_IMPORTED_MODULE_0__piece__["e" /* Pawn */]({x: i, y: j}, this, "black");
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

/* harmony default export */ __webpack_exports__["a"] = (Board);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__j_chess__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__j_chess_view__ = __webpack_require__(13);



$( () => {
  const $mainDiv = $('#j-chess');

  // make game
  // create view with game
  // create ai with view
  const game = new __WEBPACK_IMPORTED_MODULE_0__j_chess__["a" /* default */]();
  const view = new __WEBPACK_IMPORTED_MODULE_1__j_chess_view__["a" /* default */]($mainDiv, game, game.board);
  game.view = view;
});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__board_board__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AI_ai__ = __webpack_require__(4);



class jChess {
  constructor() {
    this.board = new __WEBPACK_IMPORTED_MODULE_0__board_board__["a" /* default */]();

    this.receiveMoves = this.receiveMoves.bind(this);

    this.turn = 'white';
    this.opponent = {};
    this.opponent['black'] = 'white';
    this.opponent['white'] = 'black';

    this.board.setGame(this);
    this.evaluateGameStatus();
    this.ai = new __WEBPACK_IMPORTED_MODULE_1__AI_ai__["a" /* default */](this.board, 'black');
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

/* harmony default export */ __webpack_exports__["a"] = (jChess);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

class Bishop extends SlidingPiece {
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
    this.points = 330;
    this.updatePoints();

  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Bishop;


class Rook extends SlidingPiece {
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
    this.points = 500;

    this.updatePoints();

  }
}
/* harmony export (immutable) */ __webpack_exports__["g"] = Rook;


class Queen extends SlidingPiece {
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
    this.points = 900;

    this.updatePoints();

  }
}
/* harmony export (immutable) */ __webpack_exports__["f"] = Queen;


class Knight extends SteppingPiece {
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
    this.pointsArray =[[-50,-40,-30,-30,-30,-30,-40,-50],
                      [-40,-20,  0,  0,  0,  0,-20,-40],
                      [-30,  0, 10, 15, 15, 10,  0,-30],
                      [-30,  5, 15, 20, 20, 15,  5,-30],
                      [-30,  0, 15, 20, 20, 15,  0,-30],
                      [-30,  5, 10, 15, 15, 10,  5,-30],
                      [-40,-20,  0,  5,  5,  0,-20,-40],
                      [-50,-40,-30,-30,-30,-30,-40,-50]];
    this.points = 320;
    this.updatePoints();

  }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = Knight;


class King extends SteppingPiece {
  constructor(...args) {
    super(...args);
    this.unicode = (this.color === "black") ? "\u265A" : "\u2654";
    this.type = "King";

    this.castleLeft = {x: 0, y: -2};
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
    this.points = 20000;
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
        ) === this.board.nullPiece &&
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
/* harmony export (immutable) */ __webpack_exports__["b"] = King;


class Pawn extends Piece {
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
    this.points = 100;

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
/* harmony export (immutable) */ __webpack_exports__["e"] = Pawn;


class NullPiece extends Piece {
  constructor() {
    super();
    this.unicode = " ";
  }

  getMoves(){
    return [];
  }
}
/* harmony export (immutable) */ __webpack_exports__["d"] = NullPiece;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tree_node__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tree_node___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tree_node__);


class AI {
  constructor(board, color) {
    this.aiColor = color;
    this.color = color;
    this.board = board;
    this.root = new __WEBPACK_IMPORTED_MODULE_0_tree_node___default.a();
    this.nodeCount = 0;
    this.depth = 3;
    this.passRate1 = 1;
    this.passRate2 = 0.1;
  }

  swapColor() {
    if (this.color === 'black') {
      this.color = 'white';
    } else {
      this.color = 'black';
    }
  }

  advanceDenied(depth) {
    if (this.nodeCount > 12000) {
      this.runtimeDepth = 2;
    }
    if (depth >= this.runtimeDepth) {
      return true;
    } else if (depth <= 2) {
      return false;
    } else if (depth % 2 === 1) {
      if (Math.random() > this.passRate1) {
        return true;
      }
    } else {
      if (Math.random() > this.passRate2) {
        return true;
      }
    }
    return false;
  }

  abPrunePromise(node, depth, alpha, beta, color) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.depthHash.node[depth]++;
        this.nodeCount++;

        let board = node.data('Board');
        node.data('best', node);
        if (this.advanceDenied(depth)) {
          if (board.isInCheckMate(color)) {
            node.data('val', color === 'black' ? 9999 : -9999);
          } else {
            node.data('val', board.points());
          }
          return resolve(node);
        }

        let val =
          color === 'black'
            ? Number.POSITIVE_INFINITY
            : Number.NEGATIVE_INFINITY;

        let pump = board.pumpMoves(color);
        let move = pump();

        const resolveNode = () => {
          if (node.childIds.length === 0) {
            node.data('val', color === 'black' ? 9999 : -9999);
          } else {
            node.data('val', val);
          }
          return resolve(node);
        };

        const processChildNode = (resolve, reject, childNode, iterateMove) => {
          return () => {
            if (color === 'black') {
              if (val > childNode.data('val')) {
                val = childNode.data('val');
                node.data('best', childNode);
              }
              if (val < beta) {
                beta = val;
              }
              if (beta <= alpha) {
                this.depthHash.cuts[depth] += 1;
                return resolveNode();
              }
            } else {
              if (val < childNode.data('val')) {
                val = childNode.data('val');
                node.data('best', childNode);
              }
              if (val > alpha) {
                alpha = val;
              }
              if (beta <= alpha) {
                this.depthHash.cuts[depth] += 1;
                return resolveNode();
              }
            }
            move = pump();
            iterateMove();
          };
        };

        const iterateMove = () => {
          if (move) {
            let childNode = new __WEBPACK_IMPORTED_MODULE_0_tree_node___default.a();
            childNode.data('Board', move);
            node.appendChild(childNode);

            let prunePromise =
              color === 'black'
                ? this.abPrunePromise(
                    childNode,
                    depth + 1,
                    alpha,
                    beta,
                    'white'
                  )
                : this.abPrunePromise(
                    childNode,
                    depth + 1,
                    alpha,
                    beta,
                    'black'
                  );
            prunePromise.then(
              processChildNode(resolve, reject, childNode, iterateMove)
            );
          } else {
            return resolveNode();
          }
        };
        iterateMove();
      });
    });
  }

  abPrune(node, depth, alpha, beta, color) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.depthHash.node[depth] += 1;
        this.nodeCount += 1;

        let board = node.data('Board');
        node.data('best', node);

        if (this.advanceDenied(depth)) {
          if (board.isInCheckMate(color)) {
            node.data('val', color === 'black' ? 9999 : -9999);
          } else {
            node.data('val', board.points());
          }
          return node;
        }

        let val =
          color === 'black'
            ? Number.POSITIVE_INFINITY
            : Number.NEGATIVE_INFINITY;

        let pump = board.pumpMoves(color);
        let move = pump();

        while (move) {
          let childNode = new __WEBPACK_IMPORTED_MODULE_0_tree_node___default.a();
          childNode.data('Board', move);
          node.appendChild(childNode);

          if (color === 'black') {
            this.abPrune(childNode, depth + 1, alpha, beta, 'white');
          } else {
            this.abPrune(childNode, depth + 1, alpha, beta, 'black');
          }

          if (color === 'black') {
            if (val > childNode.data('val')) {
              val = childNode.data('val');
              node.data('best', childNode);
            }
            if (val < beta) {
              beta = val;
            }
            if (beta <= alpha) {
              this.depthHash.cuts[depth] += 1;
              break;
            }
          } else {
            if (val < childNode.data('val')) {
              val = childNode.data('val');
              node.data('best', childNode);
            }
            if (val > alpha) {
              alpha = val;
            }
            if (beta <= alpha) {
              this.depthHash.cuts[depth] += 1;
              break;
            }
          }
          move = pump();
        }

        if (node.childIds.length === 0) {
          node.data('val', color === 'black' ? 9999 : -9999);
          return node;
        }

        node.data('val', val);
        resolve(node);
      });
    });
  }

  getMove() {
    this.start = Date.now();
    this.nodeCount = 0;
    this.runtimeDepth = this.depth;
    this.depthHash = {
      node: {},
      cuts: {}
    };
    for (let i = 0; i <= this.depth; i++) {
      this.depthHash.node[i] = 0;
      if (i < this.depth) this.depthHash.cuts[i] = 0;
    }

    this.root = new __WEBPACK_IMPORTED_MODULE_0_tree_node___default.a();
    this.root.data('Board', this.board);
    this.color = 'black';

    return this.abPrunePromise(
      this.root,
      0,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      'black'
    ).then(response => {
      return this.sendMove.bind(this)();
    });
  }

  sendMove() {
    return new Promise((resolve, reject) => {
      window.root = this.root;
      window.dh = this.depthHash;
      console.log('### THOUGHTS ###');
      console.log(
        `Total Node Count: ${this.nodeCount} ${
          this.nodeCount > 12000 ? '(CAPPED)' : ''
        }`
      );
      console.log(`Time: ${(Date.now() - this.start) / 1000}s`);

      console.log(`Hash: ${JSON.stringify(this.depthHash, null, '\t')}`);
      resolve(this.root.data('best').data('Board').lastMove);
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = (AI);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var isBrowser = this.window ? true : false,
objectId =  __webpack_require__(6),
inherits =  __webpack_require__(7).inherits,
EventEmitter =  __webpack_require__(12);

module.exports = Node;

function Node(id) {
	EventEmitter.call(this);
	this._id = id || objectId();
	this._childs = {};
	this._childIdsList = [];
	this._parent = null;
	this._data = {};
}

EventEmitter(Node.prototype);

Node.reborn = function(jsonObj) {
	var root = new Node();
	root.reborn(jsonObj);
	return root;
}

var o = Node.prototype;

o.getChild = function (childId) {
	var child = this._childs[childId];
	if (child) {
		return child;
	} else {
		for (var cid in this._childs) {
			if ((child = this._childs[cid].getChild(childId))) {
				return child;
			}
		}
		return null;
	}
}

/**
 * @member Node#createChild
 * @return {Node} , return new child node.
 */
o.createChild = function (id) {
	var child = new Node(id);
	child._parent = this;
	this._childs[child.id] = child;
	this._childIdsList.push(child.id);
    
    this.emit("add",child,this);
    this.emit("child list changed",this,this._childIdsList.concat());
    
    var root = this.root;
    if(root !== this){
        root.emit("add",child,this);
        root.emit("child list changed",this,this._childIdsList.concat()); 
		
    }

	return child;
}

/**
 * @member Node#appendChild
 * @param {Node} child , child can't contain root.
 * @return {Node} , self.
 */
o.appendChild = function (child) {
	if (this.root.getChild(child.id) || child._childIdsList.length !== 0) {
		return this;
	} else if (child.parent) {
		child.parent.removeChild(child.id);
	}
	child._parent = this;
	this._childs[child.id] = child;
	this._childIdsList.push(child.id);

    this.emit("add",child,this);
    this.emit("child list changed",this,this._childIdsList.concat()); 
    
    var root = this.root;
    if(root !== this){
        root.emit("add",child,this);
        root.emit("child list changed",this,this._childIdsList.concat()); 
    }
    
	return this;
}

o.removeChild = function (childId) {

	child = this.getChild(childId);

	var parent;

	if (child && (parent = child.parent)) {
		delete parent._childs[childId];
		child._parent = null;
		var index = parent._childIdsList.indexOf(childId);
		parent._childIdsList.splice(index, 1);
        
        parent.emit("remove",child,parent);
        parent.emit("child list changed",parent,parent._childIdsList.concat());    
        
        var root = this.root;
        if(root !== this){
            root.emit("remove",child,parent);
            root.emit("child list changed",parent,parent._childIdsList.concat());  
        }

	}
    
	return this;

}

o.replaceNode = function (child, targetId) {

	var target = this.getChild(targetId);

	if (!child || !target || target.getChild(this.id) || child.getChild(this.id) || target.getChild(child.id)) {
		return this;
	}

	var parent = child.parent;
	if (parent) {
		parent.removeChild(child.id);
	}

	var index = target.position();
    parent = target.parent;
	parent._childIdsList.splice(index, 1, child);
	child._parent = parent;
	delete parent._childs[target.id];
	target._parent = null;
   
    parent.emit("remove",target,parent);
    parent.emit("add",child,parent);
    parent.emit("child list changed",parent,parent._childIdsList.concat());    
    
    var root = this.root;
    if(root !== this){
        root.emit("remove",target,parent);
        root.emit("add",child,parent);
        root.emit("child list changed",parent,parent._childIdsList.concat());
    }

	return this;
}

o.position = function (childId) {

	var child = this._getNode(childId);

	if (child) {
		var parent = child.parent;
		return parent ? parent._childIdsList.indexOf(child.id) : null;
	} else {
		return null;
	}

}

o.layer = function (childId) {
	var child = this._getNode(childId),
	layer = 0;

	if (child) {
		var parent = child.parent;
		while (parent) {
			layer += 1;
			parent = parent.parent;
		}
		return layer;
	} else {
		return 0;
	}
}

o.getNode = o._getNode = function (childId) {

	var child;

	if (childId) {
		if (childId === this.id) {
			child = this;
		} else {
			child = this.getChild(childId);
		}
	} else {
		child = this;
	}

	return child;

}

o.top = function (childId) {

	var child = this._getNode(childId),
	parent;
	if (child && (parent = child.parent)) {
		var index = parent._childIdsList.indexOf(child.id);
		parent._childIdsList.splice(index, 1);
		parent._childIdsList.unshift(child.id);
        
        parent.emit("child list changed",parent,parent._childIdsList.concat());
        var root = this.root;
        if(root !== this){
            root.emit("child list changed",parent,parent._childIdsList.concat());
        }  

	}

	return this;
}

o.up = function (childId) {
	var child = this._getNode(childId),
	parent;
	if (child && (parent = child.parent)) {
		var index = parent._childIdsList.indexOf(child.id);
		if (index !== 0) {
			parent._childIdsList.splice(index, 1);
			parent._childIdsList.splice(index - 1, 0, child.id);
		}
        parent.emit("child list changed",parent,parent._childIdsList.concat());
        var root = this.root;
        if(root !== this){
            root.emit("child list changed",parent,parent._childIdsList.concat());
        }  

	}
	return this;
}

o.down = function (childId) {
	var child = this._getNode(childId),
	parent;
	if (child && (parent = child.parent)) {
		var nextNode = child.nextNode();
		if (nextNode) {
			nextNode.up();
		}
	}
	return this;
}


o.nextNode = function (childId) {
	var child = childId? this._getNode(childId) : this;
		var parent = child.parent;
		if(parent){
		var index = child.position(),
		nextChildId = parent._childIdsList[index + 1];

		if (nextChildId) {
			return parent.getChild(nextChildId);
		}
		}
}

o.nextDepthNode = function nextDeepNode(childId) {
	var node = childId? this._getNode(childId) : this;
	var firstChild = node.firstChild();
	if(firstChild){
		return firstChild;
	}else{
		firstChild = node.nextNode();
		if(firstChild){
			return firstChild;
		}else{
			return node.parent.nextNode();
		}
	}
}

o.prevNode = function (childId) {
	var child = childId ? this._getNode(childId) : this;
		var parent = child.parent;
		if(parent){
            var index = child.position(),
            prevChildId = parent._childIdsList[index - 1];

            if (prevChildId) {
                return parent.getChild(prevChildId);
            }
		}
}

o.prevDepthNode = function prevDeepNode(childId) {
	var child = childId ? this._getNode(childId) : this;
	var prevNode = child.prevNode();
	if(prevNode){
		return prevNode.depthLastChild() || prevNode.parent;
	}else{
		return child.parent;
	}
}

o.firstChild = function(childId){
    var root = childId ? this._getNode(childId) : this;
    if(root && root._childIdsList[0]){
        return root.getNode(root._childIdsList[0]);
    }
}

o.lastChild = function(childId){
    var root = childId ? this._getNode(childId) : this;
    if(root){
        var list = root._childIdsList,len = list.length;
        if(list[len-1]){
            return root.getNode(list[len-1]);
        }
    }
}

o.depthFirstChild = function(childId){
    var rs = null;
    var root = childId ? this._getNode(childId) : this;
    if(root){
        rs = root;goFind = true;
        for(;goFind;){
            var r = rs.firstChild();
            if(!r){
                goFind = false;
            }else{
                rs = r;
            }
        }
    }
    return rs;
}

o.depthLastChild = function(childId){
    var rs = null;
    var root = childId ? this._getNode(childId) : this;
    if(root){
        rs = root;goFind = true;
        for(;goFind;){
            var r = rs.lastChild();
            if(!r){
                goFind = false;
            }else{
                rs = r;
            }
        }
    }
    return rs;
}

// move childId node to  parentId node.
o.move = function (childId, parentId) {

	var child = this.getChild(childId),
	parent = parentId === this.parent ? this : this.getChild(parentId);

	if (child && parent && !child.getChild(parentId)) {
		var childParent = child.parent;
		childParent.removeChild(child.id);
		parent.appendChild(child);        
	}

	return this;

}

o.isRoot = function () {
	return this.parent ? false : true;
}

o.data = function () {

	var obj = {}

	if (arguments.length === 2) {
		obj[arguments[0]] = arguments[1];
	} else if (arguments.length === 1) {
		if (typeof arguments[0] === "string") {
			return this._data[arguments[0]];
		} else {
			obj = arguments[0];
		}
	} else {
		return this._data;
	}

	for (var k in obj) {
		this._data[k] = obj[k];
	}
    
    Object.freeze(obj);
    this.emit("data change",this,obj);
    var root = this.root;
    if(root !== this){
        root.emit("data change",this,obj);
    }

    return this;

}

o.reborn = function (jsonObj) {

	if (this.isRoot()) {
		var self = this;
		this._id = jsonObj.id;
		this._childs = {};
		this._childIdsList = jsonObj.childIdsList;
		this._parent = jsonObj.parent;
		this._data = jsonObj.data;

		jsonObj.childIdsList.forEach(function (cid) {
			console.log(cid)
			var child = new Node();
			child.reborn(jsonObj.childs[cid]);
			child._parent = self;
			self._childs[cid] = child;
		});
        
    this.emit("reborn",jsonObj);
	}
	return this;

}

o.toJSON = function(){
	return this.json;
}

Object.defineProperties(o, {

	parent : {
		get : function () {
			return this._parent;
		}
	},

	id : {
		get : function () {
			return this._id;
		}
	},

	route : {
		get : function () {
			var route = [this.id],
			parent = this.parent;
			while (parent) {
				route.unshift(parent.id);
				parent = parent.parent;
			}
			return route;
		}
	},

	root : {
		get : function () {
			var root = this.parent;
			while (root) {
                var parent = root.parent;
				if(parent){
                    root = parent;
                }else{
                    return root;
                }
			}
			return this;
		}
	},

	json : {
		get : function () {

			var jsonObj = {
				id : this._id,
				childs : {},
				childIdsList : this._childIdsList,
				parent : this.parent ? this.parent.id : null,
				data : this._data
			},
			self = this;

			this._childIdsList.forEach(function (cid) {
				jsonObj.childs[cid] = self._childs[cid].json;
			})

			return JSON.parse(JSON.stringify(jsonObj));

		}
	},
    
    allChildIds:{
        get:function(){
            var ids = this._childIdsList.concat(),self = this;
            
            this._childIdsList.forEach(function(id){
                ids = ids.concat(self.getChild(id).allChildIds);
            });
            return ids;
        }
    },
    
    childIds:{
        get:function(){
            return this._childIdsList.concat();
        }
    }

});


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Implementation of ObjectId generator
 * http://docs.mongodb.org/manual/core/object-id/
 */

var increment = 0x1000000;
var localId1  = ((1+Math.random())*0x100000 | 0).toString(16).substring(1);
var localId2  = ((1+Math.random())*0x100000 | 0).toString(16).substring(1);

function objectId() {
  var dateNow = ((new Date()).getTime()/100 | 0).toString(16);
  return dateNow + localId1 + localId2 + (++increment).toString(16).substring(1);
}

// Expose `objectId`
module.exports = objectId;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(10);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(11);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8), __webpack_require__(9)))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {


/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__board_board__ = __webpack_require__(0);


class jChessView {
  constructor($mainDiv, game, board) {
    this.$mainDiv = $mainDiv;
    this.game = game;
    this.board = board;
    this.tileGrid = [[],[],[],[],[],[],[],[]];

    this.moves = [];
    this.p1Hover = undefined;
    this.p2Hover = undefined;
    this.aiStart = undefined;
    this.aiDest = undefined;
    this.setupMarkers();
    this.setupBoard();
    this.update();
  }

  getTile(position) {
    return this.tileGrid[position.x][position.y];
  }

  isInMoves(pos){
    return this.moves.filter( move => move.x === pos.x &&
      move.y === pos.y).length > 0;
  }

  setAiMove(startPos, endPos) {
    this.aiStart = startPos;
    this.aiDest = endPos;
  }

  removeAiMoves() {
    this.aiStart = undefined;
    this.aiDest = undefined;
  }

  showMoves(pos) {
    this.moves = this.board.getPiece(pos).getValidMoves();
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
        tile.removeClass('ai-start');
        tile.removeClass('ai-dest');
        tile.empty();
      });
    });
  }

  update() {
    this.clearBoard();
    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        this.tileGrid[i][j].html(this.board.piecesGrid[i][j].unicode);
      }
    }
    this.moves.forEach((move) => {
      this.getTile(move).addClass('path');
    });
    if (this.aiStart) {
      this.getTile(this.aiStart).addClass('ai-start');
    }
    if (this.aiDest) {
      this.getTile(this.aiDest).addClass('ai-dest');
    }
    if (this.p1Hover) {
      this.getTile(this.p1Hover).addClass('p1-hover');
    }
    if (this.p2Hover) {
      this.getTile(this.p2Hover).addClass('p2-hover');
    }
  }

  handleClick(pos) {
    return () => {
      if (this.startPos) {
        if(this.isInMoves(pos)){
          this.board.movePiece(this.startPos, pos);
          this.removeMoves();
          this.removeAiMoves();
          this.update();
          setTimeout(this.game.changeTurns.bind(this.game), 0);
        } else {
          this.removeMoves();
          this.update();
        }
      } else {
        if(this.board.isPieceTurn(pos)){
          this.showMoves(pos);
          this.startPos = pos;
        }
      }
    };
  }

  handleMouseEnter(pos) {
    return () => {
      if(!this.startPos){
        if(this.board.isPieceTurn(pos)){
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

  setupMarkers() {
    this.$outerBoard = $(`<div class="outer-board"></div>`);
    this.$innerBoard = $('<ul class="inner-board"></ul>');

    this.$outerBoard.append(this.makeMarkers("alphabet").addClass("flipped"));
    this.$outerBoard.append(this.makeMarkers("num"));
    this.$outerBoard.append(this.$innerBoard);
    this.$outerBoard.append(this.makeMarkers("num").addClass("flipped"));
    this.$outerBoard.append(this.makeMarkers("alphabet"));

    this.$mainDiv.append($("<div class='captures white'></div>"));
    this.$mainDiv.append(this.$outerBoard);
    this.$mainDiv.append($("<div class='captures black'></div>"));
  }

  setupBoard() {
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
  }

  makeMarkers(mode) {
    let marks;
    let classType;
    switch (mode){
      case 'num':
        marks = [8,7,6,5,4,3,2,1];
        classType = "num";
        break;
      case 'alphabet':
        marks = ["a","b","c","d","e","f","g","h"];
        classType = "alphabet";
        break;
    }
    const markDivs = marks.map( mark => $(`<div class="mark">${mark}</div>`));
    const $markerDiv = $(`<div class="markers ${classType}"></div>`);
    markDivs.forEach( $markDiv => $markerDiv.append($markDiv));
    return $markerDiv;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (jChessView);


/***/ })
/******/ ]);