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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__j_chess__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__j_chess_view__ = __webpack_require__(2);



$( () => {
  const $mainDiv = $('#j-chess');

  const game = new __WEBPACK_IMPORTED_MODULE_0__j_chess__["a" /* default */]();
  const view = new __WEBPACK_IMPORTED_MODULE_1__j_chess_view__["a" /* default */]($mainDiv, game.getBoard());
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__board_board__ = __webpack_require__(3);


class jChess {
  constructor() {
    this.board = new __WEBPACK_IMPORTED_MODULE_0__board_board__["a" /* default */]();
    window.board = this.board;
    this.turn = "white";
    this.board.setGame(this);
    this.board.setTurn(this.turn);
  }

  getBoard() {
    return this.board;
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

/* harmony default export */ __webpack_exports__["a"] = (jChess);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__board_board__ = __webpack_require__(3);


class jChessView {
  constructor($mainDiv, board) {
    this.$mainDiv = $mainDiv;
    this.board = board;
    this.moves = [];
    this.p1Hover = undefined;
    this.p2Hover = undefined;
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
          this.board.game.changeTurns();
          this.removeMoves();
          this.update();
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

    this.$mainDiv.append(this.$outerBoard);
  }

  setupBoard() {
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


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__piece__ = __webpack_require__(6);


class Board {
  constructor(starting = true){
    this.piecesGrid = [[],[],[],[],[],[],[],[]];
    if(starting){
      this.letThereBeGrid();
    }
  }

  setGame(game) {
    this.game = game;
  }

  setTurn(turn) {
    this.turn = turn;
  }

  dup() {
    const newBoard = new Board(false);

    for (let i = 0; i < 8; i++){
      for (let j = 0; j < 8; j++){
        let pos = {x:i, y:j};
        newBoard.nullPiece = this.nullPiece;
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
    return this.getPieces(color).filter(piece => piece.getValidMoves().length > 0).length <= 0;
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
          return true;
        }
      }
    }
    return false;
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
    if (this.isOpponentTile(startPiece, destPos)) {
      this.placePiece(startPiece, destPos);
      this.placePiece(this.nullPiece, startPos);
    } else {
      this.placePiece(startPiece, destPos);
      this.placePiece(this.nullPiece, startPos);
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
}

/* harmony default export */ __webpack_exports__["a"] = (Board);


/***/ }),
/* 4 */,
/* 5 */,
/* 6 */
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
  }

  addDirection(position, direction) {
    return {
      x: position.x + direction.x,
      y: position.y + direction.y
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
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Bishop;


class Rook extends SlidingPiece {
  constructor(...args) {
    super(...args);
    this.unicode = (this.color === "black") ? "\u265C" : "\u2656";
    this.type = "Rook";
    this.directions = LINES;
  }
}
/* harmony export (immutable) */ __webpack_exports__["g"] = Rook;


class Queen extends SlidingPiece {
  constructor(...args) {
    super(...args);
    this.unicode = (this.color === "black") ? "\u265B" : "\u2655";
    this.type = "Queen";
    this.directions = LINES.concat(DIAGONALS);
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
  }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = Knight;


class King extends SteppingPiece {
  constructor(...args) {
    super(...args);
    this.unicode = (this.color === "black") ? "\u265A" : "\u2654";
    this.type = "King";
    this.directions = LINES.concat(DIAGONALS);
  }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = King;


class Pawn extends Piece {
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



/***/ })
/******/ ]);