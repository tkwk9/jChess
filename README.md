# jChess

[jChess](http://www.timkwak.com/jChess) is a classic game of Chess, made from scratch with jQuery. jChess features a medium difficulty ai opponent that utilizes a/b pruning technique to efficiently traverse a minimax tree to achieve the depth of 3 (looks 3 moves ahead).

## The Game

The game of chess was developed from scratch using OOP in JavaScript, using ES6 syntax. Doing so allowed me to leverage class inheritance to keep the code DRY for the individual pieces.

### Pieces

All pieces (`Rook`, `Pawn`, `Bishop`, etc.) extends the `Piece` class, but not always directly. In most cases, individual piece extends another abstract class (i.e. `SlidingPiece` or `SteppingPiece`) that extends the `Piece` class.

```
NullPiece << Piece
Pawn << Piece
Rook << SlidingPiece << Piece
Bishop << SlidingPiece << Piece
Queen << SlidingPiece << Piece
Knight << SteppingPiece << Piece
King << SteppingPiece << Piece
```

#### `SteppingPiece`
A piece extends a `SteppingPiece` if it has a finite number of positions it can "step into", relative to its current position. For instance, a Knight has, at maximum, 8 positions it can move into. From there, those relative positions are evaluated (e.g. checks if the position is out of bounds, if the position is already occupied by a piece of same color, etc.) to generate an initial set of valid moves. Later in the README, we will revisit this moveset to remove those that puts the current user in check (i.e. invalid move).

#### `SlidingPiece`
A piece extends a `SlidingPiece` if it has a finite number of directions that it can "slide to", until it no longer can. For instance, a rook can slide horizontally or vertically until it encounters another piece or runs out of bounds of the board.

#### Valid Moves
In the game of Chess, a player cannot make a move that puts him or herself in check. In order to enforce this rule, any move that would result in a player in check is filtered from the original set of moves derived above. The board class has following methods to accommodate this:

* `dup`: duplicates the board's current state, including all the pieces at the correct position
* `isInCheck(color)`: determines if a given color (side) is in check at a given state of the board

Each move that was derived above is then individually evaluated using these two helper functions:

```
function getValideMoves():
  get all moveset
  for each move in a moveset:
    duplicate the board
    make the move in the duplicated board
    discard the move if the duplicated board is in check
  return resulting moveset
```

### Checkmate
Using the methods described above, `board#isInCheckmate(color)` can be implemented:

```
function isInCheckmate(color):
  get all pieces of the color
  instantiate an empty array "moves"
  for each piece in pieces:
    push all valid move to the "moves" array
  return true if the moves array is empty; false if not
```

## AI
The AI for jChess makes it's decision by looking `n` moves ahead, and determining its best option. In order to accomplish this, the AI requires two things:

1. A way to evaluate a board at a given moment
2. A way to foresee all possible results `n` moves ahead

### Board Evaluation

A board is evaluated using a point system that ranges from `-Infinity` to `+Infinity`. If a number is below 0, black is considered to be in favor, and when above 0, white is considered to be in favor. Each piece on the board have a base-point that contributes to the overall point. In addition, a piece is either given additional points and penalized some points depending on its position on the board. For example:

A Knight is given a base-point of 320 (or -320 for black pieces).

Additional points to be added to the basepoint is then evaluated based on based on its position, using the following array:
```
[-50,-40,-30,-30,-30,-30,-40,-50]
[-40,-20,  0,  0,  0,  0,-20,-40]
[-30,  0, 10, 15, 15, 10,  0,-30]
[-30,  5, 15, 20, 20, 15,  5,-30]
[-30,  0, 15, 20, 20, 15,  0,-30]
[-30,  5, 10, 15, 15, 10,  5,-30]
[-40,-20,  0,  5,  5,  0,-20,-40]
[-50,-40,-30,-30,-30,-30,-40,-50]
```
In this example, if a Knight is in one of the corners of the board, its overall value will be 270. However, if it were in one of the center tiles, it would be valued at 340 points.

The overall point value of a board is then the sum of all pieces points, where black pieces are worth negative values, and white pieces are worth positive values.

This approach of board evaluation was inspired by [this article.](https://chessprogramming.wikispaces.com/Simplified+evaluation+function?responseToken=cda81a4b2d19165b82279fd17e7f048d)

### Looking Ahead

Now that the AI has a means to evaluate a board condition, it needs a way to look ahead several moves. jChess employs a alpha-beta pruning, Maximin algorithm to do this.

#### Maximin Algorithm

Minimax is a decision algorithm that seeks to minimize the potential loss. Since jChess AI plays with black pieces (i.e. lower the points the better), the algorithm used is Maximin algorithm, but the principle is essentially the same.

Maximin algorithm is best represented by a tree, where nodes represent the states of the board, and edges represent potential moves made from that board. Since turns alternate every time a move is made, each level of the tree has a distinct player who's turn it is to make a move.


#### Alpha-Beta Pruning

Even when looking only 3 moves ahead, it would not be feasible to evaluate every single leaf node. This is where alpha-beta pruning comes into play.
