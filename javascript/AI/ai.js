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

    // Basecases
    if (depth === this.depth) { // if leaf node
      if (board.isInCheckMate()) {
        node.data("val", board.points());
      } else {
        node.data("val", color === "black" ? 9999 : -9999);
      }
      return node;
    }


    let val = color === "black" ? 9999 : -9999;

    let pump = board.pumpMoves(color);
    let move = pump();

    while (move){
      let childNode = new Node();
      childNode.data("Board", move);
      node.appendChild(childNode);
      childNode = color === "black" ?
        this.abPrune(childNode, depth + 1, alpha, beta, "white") :
        this.abPrune(childNode, depth + 1, alpha, beta, "black");

      if (color === "black") {
        if (val > childNode.data("val")){
          val = childNode.data("val");
          node.data("best", childNode);
        }
        if (val < beta){
          beta = val;
        }
        if (beta <= alpha) break;
      } else {
        if (val < childNode.data("val")){
          val = childNode.data("val");
          node.data("best", childNode);
        }
        if (val > alpha){
          alpha = val;
        }
        if (beta <= alpha) break;
      }
      move = pump();
    }

    if(node.childIds.length === 0) {
      node.data("val", color === "black" ? 9999 : -9999);
      return node;
    }

    node.data("val", val);
    return node;
    // let board = node.data("Board");
    // node.data("best", node);
    //
    // // Basecases
    // // let dups = node.data("Board").getAllMoves(color);
    // // if (dups.length === 0 ) { // if in checkmate
    // //   node.data("val", color === "black" ? 9999 : -9999);
    // //   return node;
    // // } else
    // if (depth === this.depth) { // if leaf node
    //   if (node.data("Board").isInCheckMate()) {
    //     node.data("val", node.data("Board").points());
    //   } else {
    //     node.data("val", color === "black" ? 9999 : -9999);
    //   }
    //   return node;
    // }
    //
    //
    // let val = color === "black" ? 9999 : -9999;
    //
    // for (let i = 0; i < dups.length; i++){
    //   let childNode = new Node();
    //   childNode.data("Board", dups[i]());
    //   node.appendChild(childNode);
    //   childNode = color === "black" ?
    //     this.abPrune(childNode, depth + 1, alpha, beta, "white") :
    //     this.abPrune(childNode, depth + 1, alpha, beta, "black");
    //
    //   if (color === "black") {
    //     if (val > childNode.data("val")){
    //       val = childNode.data("val");
    //       node.data("best", childNode);
    //     }
    //     if (val < beta){
    //       beta = val;
    //     }
    //     if (beta <= alpha) break;
    //   } else {
    //     if (val < childNode.data("val")){
    //       val = childNode.data("val");
    //       node.data("best", childNode);
    //     }
    //     if (val > alpha){
    //       alpha = val;
    //     }
    //     if (beta <= alpha) break;
    //   }
    // }
    //
    // node.data("val", val);
    // return node;
  }
  // abPrune(node, depth, alpha, beta, color) {
  //   let board = node.data("Board");
  //   node.data("best", node);
  //
  //   // Basecases
  //   let dups = node.data("Board").getAllMoves(color);
  //   if (dups.length === 0 ) { // if in checkmate
  //     node.data("val", color === "black" ? 9999 : -9999);
  //     return node;
  //   } else if (depth === this.depth) { // if leaf node
  //     node.data("val", node.data("Board").points());
  //     return node;
  //   }
  //
  //
  //   let val = color === "black" ? 9999 : -9999;
  //
  //   for (let i = 0; i < dups.length; i++){
  //     let childNode = new Node();
  //     childNode.data("Board", dups[i]());
  //     node.appendChild(childNode);
  //     childNode = color === "black" ?
  //       this.abPrune(childNode, depth + 1, alpha, beta, "white") :
  //       this.abPrune(childNode, depth + 1, alpha, beta, "black");
  //
  //     if (color === "black") {
  //       if (val > childNode.data("val")){
  //         val = childNode.data("val");
  //         node.data("best", childNode);
  //       }
  //       if (val < beta){
  //         beta = val;
  //       }
  //       if (beta <= alpha) break;
  //     } else {
  //       if (val < childNode.data("val")){
  //         val = childNode.data("val");
  //         node.data("best", childNode);
  //       }
  //       if (val > alpha){
  //         alpha = val;
  //       }
  //       if (beta <= alpha) break;
  //     }
  //   }
  //
  //   node.data("val", val);
  //   return node;
  // }


  getMove() {
    let start = Date.now();
    this.root = new Node();
    this.root.data("Board", this.board).data("Points", this.board.points(this.aiColor));
    this.color = "black";
    this.abPrune(this.root, 0, -9999, 9999, "black");
    window.root = this.root;
    console.log(Date.now() - start);
    return this.root.data("best").data("Board").lastMove;
  }
}

export default AI;
