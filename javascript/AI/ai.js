import Node from 'tree-node';

class AI {
  constructor(board, color) {
    this.aiColor = color;
    this.color = color;
    this.board = board;
    this.root = new Node();
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
            let childNode = new Node();
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
          let childNode = new Node();
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

    this.root = new Node();
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

export default AI;
