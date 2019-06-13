import {Matrix, isMatrix} from './core';

export const
  /**
   * @function zeros
   * creates a new matrix filled with zeros
   * @param rows {number} number of rows
   * @param [cols] {number} number of columns
   * @returns {Matrix}
   */
  zeros = (rows = 1, cols) => new Matrix(rows, cols || rows),

  /**
   * @function ones
   * creates a new matrix filled with ones
   * @param rows {number} number of rows
   * @param [cols] {number} number of columns
   * @returns {Matrix}
   */
  ones = (rows, cols) => new Matrix(rows, cols || rows, 1),

  /**
   * @function eye
   * creates a new identity matrix of size n
   * @param n {number} number of rows and columns
   * @returns {Matrix}
   */
  eye = n => zeros(n).diag(1),

  /**
   * @function diag
   * creates a new diagonal matrix from the provided array
   * @param a {Array|Matrix} An array of values or a column matrix
   * @returns {Matrix}
   */
  diag = a => zeros(isMatrix(a)?a.size[0]:a.length).diag(a),

  /**
   * @function rand
   * creates a new matrix filled with random values [0|1)
   * @param rows {number} number of rows
   * @param [cols] {number} number of columns
   * @returns {Matrix}
   */
  rand = (rows, cols) => zeros(rows, cols).setEach(() => Math.random());

/**
 * @function from
 * creates a matrix from the given array.
 * If only array is provided then the matrix will be square (if array has a square number size) or a column vector.
 * If the row count is provided, then the matrix will have enough columns to hold all of the array data
 * @param array {Array}
 * @param [rows] {number}
 * @param [cols] {number}
 * @returns {Matrix}
 */
function from(array, rows, cols){
  if (!rows){
    rows=Math.sqrt(array.length);
    if (rows%1){
      rows=array.length;
    }
  }
  if (!cols){
    cols=Math.ceil(array.length/rows);
  }
  return new Matrix(rows,cols,array);
}

export {from};
