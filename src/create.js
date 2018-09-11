import {Matrix} from './base';

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
  ones = (rows, cols) => zeros(rows, cols).fill(1),

  /**
   * @function eye
   * creates a new identity matrix of size n
   * @param n {number} number of rows and columns
   * @returns {Matrix}
   */
  eye = n => zeros(n).setDiag(() => 1),

  /**
   * @function diag
   * creates a new diagonal matrix from the provided array
   * @param a {Array} An array of values
   * @returns {Matrix}
   */
  diag = a => zeros(a.length).setDiag((v, i) => a[i]),

  /**
   * @function vect
   * creates a new column vector from the provided array
   * @param a {Array} An array of values
   * @returns {Matrix}
   */
  vect = a => new Matrix(a.length, 1, a),

  /**
   * @function rowVect
   * creates a new row vector from the provided array
   * @param a {Array} An array of values
   * @returns {Matrix}
   */
  rowVect = a => new Matrix(1, a.length, a),

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
