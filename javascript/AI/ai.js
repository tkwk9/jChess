import Node from 'tree-node';

class AI {
  constructor(board, color) {
    this.aiColor = color;
    this.color = color;
    this.board = board;
    this.root = new Node();
    this.depth = 3;
  }

  swapColor() {
    if (this.color === "black") {
      this.color = "white";
    } else {
      this.color = "black";
    }
  }

  abPrune(node, depth, alpha, beta, color) {
    let board = node.data("Board");
    if (depth === this.depth) {
      node.data("val", node.data("Board").points());
      node.data("best", node);
      return node;
    }
    let dups = node.data("Board").getAllMoves(color);
    if (dups.length === 0 ) {
      node.data("val", color === "black" ? 9999 : -9999);
      node.data("best", node);
      return node;
    }
    let val;
    let leafNode;
    if (color === "white"){
      val = -9999;
      for (let i = 0; i < dups.length; i++){
        let childNode = new Node();
        childNode.data("Board", dups[i]);
        node.appendChild(childNode);
        leafNode = this.abPrune(childNode, depth + 1, alpha, beta, "black");

        if (val < leafNode.data("val")){
          val = leafNode.data("val");
          node.data("best", childNode);
        }

        if (val > alpha){
          alpha = val;
        }
        if (beta <= alpha) break;
      }
    } else {
      val = +9999;
      for (let i = 0; i < dups.length; i++){
        let childNode = new Node();
        childNode.data("Board", dups[i]);
        node.appendChild(childNode);
        leafNode = this.abPrune(childNode, depth + 1, alpha, beta, "white");

        if (val > leafNode.data("val")){
          val = leafNode.data("val");
          node.data("best", childNode);
        }

        if (val < beta){
          beta = val;
        }
        if (beta <= alpha) break;
      }
    }
    node.data("val", val);
    return node;
  }
  // abPrune(node, depth, color) {
  //   let board = node.data("Board");
  //   if (depth === this.depth) {
  //     node.data("val", node.data("Board").points());
  //     node.data("best", node);
  //     return node;
  //   }
  //   let dups = node.data("Board").getAllMoves(color);
  //   if (dups.length === 0 ) {
  //     node.data("val", node.data("Board").points());
  //     node.data("best", node);
  //     return node;
  //   }
  //   let val;
  //   let leafNode;
  //   if (color === "white"){
  //     val = -9999;
  //     for (let i = 0; i < dups.length; i++){
  //       let childNode = new Node();
  //       childNode.data("Board", dups[i]);
  //       node.appendChild(childNode);
  //       leafNode = this.abPrune(childNode, depth + 1, this.alpha, this.beta, "black");
  //       // val = Math.max(val, leafNode.data("val"));
  //       if (val < leafNode.data("val")){
  //         val = leafNode.data("val");
  //         node.data("best", childNode);
  //       }
  //       // this.alpha = Math.max(this.alpha, val);
  //       if (val > this.alpha){
  //         this.alpha = val;
  //       }
  //       if (this.beta <= this.alpha) break;
  //     }
  //   } else {
  //     val = +9999;
  //     for (let i = 0; i < dups.length; i++){
  //       let childNode = new Node();
  //       childNode.data("Board", dups[i]);
  //       node.appendChild(childNode);
  //       leafNode = this.abPrune(childNode, depth + 1, this.alpha, this.beta, "white");
  //       if (val > leafNode.data("val")){
  //         val = leafNode.data("val");
  //         node.data("best", childNode);
  //       }
  //       if (val < this.beta){
  //         this.beta = val;
  //       }
  //       if (this.beta <= this.alpha) break;
  //     }
  //   }
  //   node.data("val", val);
  //   return node;
  // }

  getMove() {
    let start = Date.now();
    this.root = new Node();
    this.root.data("Board", this.board).data("Points", this.board.points(this.aiColor));
    this.color = "black";
    this.abPrune(this.root, 0, -9999, 9999, "black");
    // this.alpha = -9999;
    // this.beta = 9999;
    // this.abPrune(this.root, 0, "black");
    // window.root = this.root;
    // this.alpha = -9999;
    // this.beta = 9999;
    console.log(Date.now() - start);
    return this.root.data("best").data("Board").lastMove;

    // let tempRoots = [this.root];
    //
    // for (let i = 0; i < 1; i++) {
    //   let newRoots = [];
    //   tempRoots.forEach( tempRoot => {
    //     tempRoot.data("Board").getAllMoves(this.color).forEach((dup => {
    //       let tempNode = new Node();
    //       tempNode.data("Board", dup).data("Points", dup.points(this.aiColor));
    //       tempRoot.appendChild(tempNode);
    //     }));
    //     newRoots = newRoots.concat(tempRoot.childIds.map( id => tempRoot.getChild(id)));
    //   });
    //   tempRoots = newRoots;
    //   this.swapColor();
    // }
    // this.color = this.aiColor;
    // window.root = this.root;
  }
}

export default AI;
