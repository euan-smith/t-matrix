import {COLS, DATA, ROWS} from "./const";

/**
 * Iterate over the rows.
 * @param matrix {Matrix}
 * @returns {IterableIterator<Array<Number>>}
 * @example
 * //Return the L2 Norm of each row
 * function rowNorm(matrix){
 *   const norms=[];
 *   for(let row of Matrix.rows(matrix)){
 *     let tot;
 *     for(let v of row) tot+=v*v;
 *     norms.push(Math.sqrt(tot));
 *   }
 *   return Matrix.from(norms);
 * }
 * //A second implementation of the same function using aa more functional approach
 * function rowNoemV2(matrix){
 *   return Matrix.from([...Matrix.rows(matrix)]
 *     .map(row=>row.reduce((tot,v)=>tot+v*v,0))
 *     .map(tot=>Math.sqrt(tot)));
 * }
 */
export function *rows(matrix){
  const cols = Array.from(matrix[COLS]);
  for(let r of matrix[ROWS])
    yield cols.map(c=>matrix[DATA][r+c]);
}

export function *cols(m){
  const rows = Array.from(m[ROWS]);
  for(let c of m[COLS])
    yield rows.map(r=>m[DATA][r+c]);
}

