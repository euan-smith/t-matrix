import {Matrix} from './core';
import {diag} from "./manipulations";
import {isArray} from "./tools";

export const
  /**
   * creates a new matrix filled with zeros
   * @function zeros
   * @category creation
   * @param rows {number} number of rows
   * @param [cols] {number} number of columns
   * @returns {Matrix}
   */
  zeros = (rows = 1, cols = rows) => isArray(rows) ? new Matrix(rows[0],rows[1]): new Matrix(rows, cols),

  /**
   * creates a new matrix filled with ones
   * @function ones
   * @category creation
   * @param rows {number} number of rows
   * @param [cols] {number} number of columns
   * @returns {Matrix}
   */
  ones = (rows = 1, cols = rows) => isArray(rows) ? new Matrix(rows[0],rows[1],1): new Matrix(rows, cols,1),

  /**
   * creates a new [identity matrix](https://en.wikipedia.org/wiki/Identity_matrix) of size n
   * @function eye
   * @category creation
   * @param n {number} number of rows and columns
   * @returns {Matrix}
   */
  eye = n => diag(zeros(n),1),

  /**
   * creates a new matrix filled with random values [0|1)
   * @function rand
   * @category creation
   * @param rows {number} number of rows
   * @param [cols] {number} number of columns
   * @returns {Matrix}
   */
  rand = (rows, cols) => zeros(rows, cols).set(() => Math.random());



