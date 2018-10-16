import {SKIP, DATA, SPAN} from "./base";
import * as Matrix from './create';

/**
 * Produce a row vector which is the sum of all matrix rows
 * @param matrix {Matrix}
 * @returns {Matrix} a row vector
 */
export function sumRows(matrix){
  return Matrix
    .zeros(1, matrix.cols)
    .setEach((tot, r, c) => {
      matrix.column(c).forEach(v => tot += v);
      return tot;
    });
}

/**
 * Produce a column vector which is the sum of all matrix columns
 * @param matrix {Matrix}
 * @returns {Matrix} a column vector
 */
export function sumColumns(matrix){
  return Matrix
    .zeros(matrix.rows, 1)
    .setEach((tot, r) => {
      matrix.row(r).forEach(v => tot += v);
      return tot;
    });
}

/**
 * sum all elements in a matrix
 * @param matrix {Matrix}
 * @returns {number}
 */
export function sum(matrix){
  let tot=0;
  matrix.forEach(v=>tot+=v);
  return tot;
}

/**
 * calculate the trace of a matrix (the sum of the diagonal elements).
 * @param matrix {Matrix}
 * @returns {number} the calculated trace
 */
export function trace(matrix){
  return sum(matrix.diag());
}