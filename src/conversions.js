import {COLS, DATA, ROWS, METHOD} from "./const.js";
import {from, mixin} from "./core.js";
// import {mapIter} from "./tools";

/**
 * Iterate over the rows.
 * @param matrix {Matrix}
 * @generator
 * @returns {IterableIterator<Array.Number>}
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
rows[METHOD]='rows';

/**
 * Iterate over the columns.
 * @param matrix {Matrix}
 * @generator
 * @returns {IterableIterator<Array.Number>}
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
cols[METHOD]='cols';

/**
 * Convert the matrix to an array of number arrays.
 * @memberOf Matrix#
 * @name toJSON
 * @returns {Array.Array.Number}
 * @example
 * const m=Matrix.from([0,':',5]); //will create a column vector
 * console.log(m.toJSON()); //[0,1,2,3,4,5]
 * console.log(m.t.toJSON()); //[[0,1,2,3,4,5]]
 * console.log(Matrix.reshape(m,2,3).toJSON()); //[[0,1,2],[3,4,5]]
 * //enables a matrix instance to be serialised by JSON.stringify
 * console.log(JSON.stringify(m)); //"[0,1,2,3,4,5]"
 */
mixin('toJSON',m=>m[COLS].length===1?[...m]:[...rows(m)]);


//Need to consider if these should map arrays=>arrays, matrices=>matrices or what
//I worry that, while what I am doing is expressive, it is not very efficient
// export function mapRows(m,fn){
//   return from([...mapIter(rows(m),fn)]);
// }
// mapRows[METHOD]='mapRows';
//
// export function mapCols(m,fn){
//   return from([...mapIter(cols(m),fn)]).t;
// }
// mapCols[METHOD]='mapCols';
