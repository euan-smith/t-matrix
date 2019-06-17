import {Matrix, isMatrix} from './core';
import {isArray, isNum} from "./tools";

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
 * If a matrix is given, this is cloned.
 * If an array of numbers, a column matrix is created.
 * If an array of arrays of numbers these must all be the same length and a matrix is created.
 * @param data {Array<Number>|Array<Array<Number>>|Matrix}
 * @returns {Matrix}
 * @example
 * Matrix.from([1,2,3,4])
 * //a column matrix [1;2;3;4]
 * @example
 * Matrix.from([[1,2,3,4]])
 * //a row matrix [1,2,3,4]
 * @example
 * Matrix.from([[1,2],[3,4]]
 * //a 2x2 matrix [1,2;3,4]
 */
export function from(data){
  if (isMatrix(data)) return data.clone();
  if (isArray(data) && data.length){
    if (isNum(data[0])) return new Matrix(data.length, [0], data);
    if (isArray(data[0])){
      const rows = data.length, cols = data[0].length;
      if (data.every(a=>a.length===cols)) return new Matrix(rows,cols,data.flat());
    }
  }
  throw new Error('Unsupported data for Matrix::from');
}


