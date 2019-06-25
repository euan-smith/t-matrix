import {Matrix,from} from "./core";
import {DATA,ROWS,COLS} from "./const";
import {range, zipIters, isArray} from "./tools";
import {rows} from "./conversions";

/**
 * gets, sets or creates diagonal matrices
 * @category Matrix manipulation
 * @param matrix {Matrix}
 * @param [set] {Matrix|Array|Function|Number}
 * @returns {Matrix}
 * @example
 * //Create a random matrix
 * const mRand = random(20);
 * //Extract the diagonal of the matrix (as a column vector)
 * const vect = diag(mRand);
 * //Create a new matrix with the same diagonal
 * const mDiag = diag(vect);
 * //Set the diagonal of the original to zero
 * diag(mRand,0);
 */
export function diag(matrix, set) {
  const R = matrix[ROWS], C = matrix[COLS], D = matrix[DATA], Cl = C.length, Rl = R.length;
  if (Cl === 1) {
    if (Rl === 1) {
      if (set) return matrix.set(set);
      else return matrix;
    }
    set = matrix;
    matrix = new Matrix(Rl,Rl);
  }
  if (set) {
    diag(matrix).set(set);
    return matrix;
  }
  return Rl < Cl ?
    new Matrix(R.map((r, i) => r + C[i]), [0], D) :
    new Matrix(C.map((c, i) => R[i] + c), [0], D);
}

/**
 * Reshape the matrix to the dimensions specified treating the matrix data in *row-major order*
 * @param matrix {Matrix} The matrix to reshape.
 * @param rows {Number} The row count for the new matrix.
 * @param cols {Number} The column count for the new matrix.
 * @returns {Matrix}
 * @example
 * const m=Matrix.from([1,':',9]);
 * const m2=Matrix.reshape(m,3,3);
 * console.log(m2.toJSON()); //[[1,2,3],[4,5,6],[7,8,9]]
 * //If reshape is used a lot to form new matrices, consider adding it to the matrix prototype with mixin
 * Matrix.mixin(Matrix.reshape);
 * console.log(Matrix.from([1,':',4]).reshape(2,2).toJSON()); // [[1,2],[3,4]]
 */
export function reshape(matrix, rows, cols) {
  return new Matrix(rows, cols, matrix);
}

/**
 * Swap the rows of a matrix.  No data is actually copied here, so this is a very efficient operation.
 * Two lists of indices are supplied, and these can both be {@link Range} types.  The pairs of rows from rowsA and rowsB
 * are then swapped in order from the start of each list.  If more indices are specified in one list than the other then
 * these additional indices are ignored.
 * @summary Swap the rows of a matrix.
 * @param matrix {Matrix}
 * @param rowsA {Range|Number} The first list of rows to swap
 * @param rowsB {Range|Number} The second list of rows to swap, must be the same length as rowsA
 * @returns {Matrix}
 */
export function swapRows(matrix, rowsA, rowsB) {
  const R = matrix[ROWS];
  for (let i of zipIters(range(rowsA), range(rowsB))) {
    [R[i[0]], R[i[1]]] = [R[i[1]], R[i[0]]];
  }
  return matrix;
}

export function swapCols(matrix, colsA, colsB) {
  const C = matrix[COLS];
  for (let i of zipIters(range(colsA), range(colsB))) {
    [C[i[0]], C[i[1]]] = [C[i[1]], C[i[0]]];
  }
  return matrix;
}

export function minor(m, row, col){
  return new Matrix(
    m[ROWS].filter((v,r)=>r!==row),
    m[COLS].filter((v,c)=>c!==col),
    m[DATA]);
}

export function repmat(m,r=1,c=1){
  const size=m.size;
  return new Matrix(size[0]*r,size[1]*c,_repmat(m,r,c));
}

function *_repmat(m,r,c){
  for (let i=0;i<r;i++)
    for(let row of rows(m))
      for (let j=0;j<c;j++) yield* row;
}

/**
 * Vertically concatenate matrices together
 * @param matrices {Matrix}
 * @returns {Matrix}
 */
export function vcat(...matrices){
  matrices=matrices.map(m=>from(m));
  const sizes = matrices.map(m=>m.size);
  const width = sizes[0][1];
  if (sizes.some(s=>s[1]!==width)) throw new Error('Matrix::vcat Matrices must have the same width.');
  const height = sizes.reduce((h,s)=>h+s[0],0);
  return new Matrix(height, width, _vcat(matrices));
}

/**
 * @param matrices {Array<Matrix>}
 * @returns {IterableIterator<Number>}
 * @private
 */
function * _vcat(matrices){
  for(let matrix of matrices) yield* matrix;
}

/**
 * Horizontally concatenate matrices together
 * @param matrices {Matrix}
 * @returns {Matrix}
 */
export function hcat(...matrices){
  matrices=matrices.map(m=>from(m));
  const sizes = matrices.map(m=>m.size);
  const height = sizes[0][0];
  if (sizes.some(s=>s[0]!==height)) throw new Error('Matrix::vcat Matrices must have the same width.');
  const width = sizes.reduce((w,s)=>w+s[1],0);
  return new Matrix(height, width, _hcat(matrices));
}

/**
 * @param matrices {Array<Matrix>}
 * @returns {IterableIterator<Number>}
 * @private
 */
function * _hcat(matrices){
  for(let mRows of zipIters(...matrices.map(m=>rows(m))))
    for(let row of mRows) yield*row;
}

export function mcat(array){
  return vcat(...array.map(rowArray=>hcat(...rowArray)));
}