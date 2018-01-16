import jChess from './j_chess';
import jChessView from './j_chess_view';

$( () => {
  const $mainDiv = $('#j-chess');

  const view = new jChessView($mainDiv);
  const game = new jChess(view.getBoard());
  // Your code here
});
