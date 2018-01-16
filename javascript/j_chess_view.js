import Board from './board/board';

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
    this.moves = this.board.getPiece(pos).getMoves();
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

export default jChessView;
