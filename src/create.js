import {Matrix} from './core';
import {diag} from "./manipulations";

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
  ones = (rows = 1, cols) => new Matrix(rows, cols || rows, 1),

  /**
   * @function eye
   * creates a new identity matrix of size n
   * @param n {number} number of rows and columns
   * @returns {Matrix}
   */
  eye = n => diag(zeros(n),1),

  /**
   * @function rand
   * creates a new matrix filled with random values [0|1)
   * @param rows {number} number of rows
   * @param [cols] {number} number of columns
   * @returns {Matrix}
   */
  rand = (rows, cols) => zeros(rows, cols).set(() => Math.random());



