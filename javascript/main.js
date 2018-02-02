import jChess from './j_chess';
import jChessView from './j_chess_view';

$( () => {
  const $mainDiv = $('#j-chess');

  // make game
  // create view with game
  // create ai with view
  const game = new jChess();
  const view = new jChessView($mainDiv, game, game.board);
  game.view = view;
});
