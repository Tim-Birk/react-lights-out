import React, { useState } from 'react';
import Cell from './Cell';
import './Board.css';

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = 0.25 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    // create array-of-arrays of true/false values
    for (let r = 0; r < nrows; r++) {
      const rowArray = [];
      for (let c = 0; c < ncols; c++) {
        rowArray.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(rowArray);
    }
    return initialBoard;
  }

  function hasWon() {
    // check the board in state to determine whether the player has won.
    // check every row and every column within each row for false (not lit)
    return board.every((r) => r.every((c) => !c));
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split('-').map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      const newBoard = oldBoard.map((r) => [...r]);

      // in the copy, flip this cell and the cells around it
      //// current:
      flipCell(y, x, newBoard);
      //// below:
      flipCell(y - 1, x, newBoard);
      //// above
      flipCell(y + 1, x, newBoard);
      //// left
      flipCell(y, x - 1, newBoard);
      //// right
      flipCell(y, x + 1, newBoard);

      // return the copy
      return newBoard;
    });
  }

  if (hasWon()) {
    return <div>Winner Winner!</div>;
  }

  const boardRows = () => {
    return board.map((r, rowIdx) => (
      <tr key={rowIdx}>
        {r.map((c, colIdx) => (
          <Cell
            key={`${rowIdx}-${colIdx}`}
            coords={`${rowIdx}-${colIdx}`}
            flipCellsAroundMe={flipCellsAround}
            isLit={c}
          />
        ))}
      </tr>
    ));
  };

  return (
    // if the game is won, just show a winning msg & render nothing else

    <table className='Board'>
      <tbody>{boardRows()}</tbody>
    </table>
  );
}

export default Board;
