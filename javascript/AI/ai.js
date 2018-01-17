import Node from 'tree-node';

class AI {
  constructor(board, color) {
    this.color = color;
    this.board = board;
    this.root = new Node();
  }

  swapColor() {
    if (this.color === "black") {
      this.color = "white";
    } else {
      this.color = "black";
    }
  }

  letThereBeTree() {
    this.root = new Node();
    this.root.data("Board", this.board);
    this.color = "black";
    let tempRoots = [this.root];

    for (let i = 0; i < 3; i++) {
      let newRoots = [];
      tempRoots.forEach( tempRoot => {
        tempRoot.data("Board").getAllMoves(this.color).forEach((dup => {
          let tempNode = new Node();
          tempNode.data("Board", dup);
          tempRoot.appendChild(tempNode);
        }));
        newRoots = newRoots.concat(tempRoot.childIds.map( id => tempRoot.getChild(id)));
      });
      tempRoots = newRoots;
      this.swapColor();
    }
    let x = 1;
  }
}

export default AI;
