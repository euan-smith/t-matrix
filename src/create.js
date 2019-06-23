import {Matrix} from './core';
import {diag} from "./manipulations";

export const
  /**
   * creates a new matrix filled with zeros
   * @function zeros
   * @param rows {number} number of rows
   * @param [cols] {number} number of columns
   * @returns {Matrix}
   */
  zeros = (rows = 1, cols) => new Matrix(rows, cols || rows),

  /**
   * creates a new matrix filled with ones
   * @function ones
   * @param rows {number} number of rows
   * @param [cols] {number} number of columns
   * @returns {Matrix}
   */
  ones = (rows = 1, cols) => new Matrix(rows, cols || rows, 1),

  /**
   * creates a new identity matrix of size n
   * @function eye
   * @param n {number} number of rows and columns
   * @returns {Matrix}
   */
  eye = n => diag(zeros(n),1),

  /**
   * creates a new matrix filled with random values [0|1)
   * @function rand
   * @param rows {number} number of rows
   * @param [cols] {number} number of columns
   * @returns {Matrix}
   */
  rand = (rows, cols) => zeros(rows, cols).set(() => Math.random());



