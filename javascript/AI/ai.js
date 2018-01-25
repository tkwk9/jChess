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
    node.data("best", node);
    if (depth === this.depth) {
      node.data("val", node.data("Board").points());
      return node;
    }
    let dups = node.data("Board").getAllMoves(color);
    if (dups.length === 0 ) {
      node.data("val", color === "black" ? 9999 : -9999);
      return node;
    }
    let val;
    let leafNode;
    if (color === "white"){
      val = -9999;
      for (let i = 0; i < dups.length; i++){
        let childNode = new Node();
        let dup = dups[i]();
        // childNode.data("Board", dups[i]);
        childNode.data("Board", dup);
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
        let dup = dups[i]();
        childNode.data("Board", dup);
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


  getMove() {
    let start = Date.now();
    this.root = new Node();
    this.root.data("Board", this.board).data("Points", this.board.points(this.aiColor));
    this.color = "black";
    this.abPrune(this.root, 0, -9999, 9999, "black");
    console.log(Date.now() - start);
    return this.root.data("best").data("Board").lastMove;
  }
}

export default AI;
