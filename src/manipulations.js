import {Matrix, DATA, COLS, ROWS} from "./core";
import {zeros} from './create';
import {range, zipIters} from "./tools";

/**
 * gets, sets or creates diagonal matrices
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
    matrix = zeros(Rl);
  }
  if (set) {
    diag(matrix).set(set);
    return matrix;
  }
  return Rl < Cl ?
    new Matrix(R.map((r, i) => r + C[i]), [0], D) :
    new Matrix(C.map((c, i) => R[i] + c), [0], D);
}

export function reshape(matrix, rows, cols) {
  return new Matrix(rows, cols, matrix);
}

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