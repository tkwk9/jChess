import Board from './board/board';

class jChessView {
  constructor($mainDiv) {
    this.$mainDiv = $mainDiv;
    this.setupMarkers();

    this.board = new Board(this.$innerBoard);
  }

  getBoard() {
    return this.board;
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
