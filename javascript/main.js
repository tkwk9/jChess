import jChess from './j_chess';
import jChessView from './j_chess_view';

$( () => {
  const $mainDiv = $('#j-chess');
  const game = new jChess();
  const view = new jChessView($mainDiv, game, game.board);
  window.board = game.board;
  game.view = view;
});
