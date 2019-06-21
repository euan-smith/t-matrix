import {COLS, DATA, ROWS} from "./const";
import {from} from "./core";

/**
 * Iterate over the rows.
 * @param matrix {Matrix}
 * @returns {IterableIterator<Array<Number>>}
 * @example
 * //Log each matrix row
 * for(let row of Matrix.rows(matrix)){
 *   console.log(row);
 * }
 */
export function *rows(matrix){
  matrix=from(matrix);
  const cols = Array.from(matrix[COLS]);
  for(let r of matrix[ROWS])
    yield cols.map(c=>matrix[DATA][r+c]);
}

/**
 * Iterate over the columns.
 * @param matrix {Matrix}
 * @returns {IterableIterator<Array<Number>>}
 * @example
 * //Log the range of each column
 * for(let col of Matrix.cols(matrix)){
 *   console.log(`Range [${Math.min(...col)}|${Math.max(...col)}]`);
 * }
 */
export function *cols(matrix){
  matrix=from(matrix);
  const rows = Array.from(matrix[ROWS]);
  for(let c of matrix[COLS])
    yield rows.map(r=>matrix[DATA][r+c]);
}
