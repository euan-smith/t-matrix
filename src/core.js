import {DATA,ROWS,COLS,METHOD} from "./const";

import {isNum, range, isFunction, isArray, mapIter} from "./tools";

import {rows} from "./conversions";

import 'array-flat-polyfill';



/**
 * Tests if a value is an instance of a Matrix
 * @function
 * @param val {*} The value to test.
 * @returns {boolean} 'true' if `val` is an instance of Matrix, 'false' otherwise.
 */
export const isMatrix = val => val instanceof Matrix;


/**
 * @summary The core matrix class
 * @description This class is not intended to be directly created by a user of this library, rather it is returned
 * by the various creation functions (such as {@link zeros}, {@link eye} or {@link from}) and as a returned result from
 * various operation and manipulation methods and functions.
 */
class Matrix{
  /**
   * @hideconstructor
   */
  constructor(rows,cols,data){
    if (isNum(cols)) cols = [':',cols-1];
    if (Array.isArray(cols)) cols = Uint32Array.from([...range(cols)]);
    const span = cols[cols.length-1]+1;
    if (isNum(rows)) rows = ['::',span,span*(rows-1)];
    if (Array.isArray(rows)) rows = Uint32Array.from([...range(rows)]);
    const size = span + rows[rows.length-1];
    if (!data) data = new Float64Array(size);
    else if (isNum(data)) data = new Float64Array(size).fill(data);
    else if (!(data instanceof Float64Array)) data = Float64Array.from(data);
    if (data.length<size){
      throw new Error('Matrix:: Data array too small for specified rows and columns');
    }
    Object.defineProperties(this,{
      [DATA]:{value:data},
      [ROWS]:{value:rows},
      [COLS]:{value:cols},
    })
  }

  /**
   * Iterates through the matrix data in row-major order
   * @generator
   * @function Matrix#[Symbol-iterator]
   * @returns {IterableIterator<Number>}
   * @example <caption>Iterating the matrix values in a for..of loop</caption>
   * //Calculate the L²-norm of a matrix
   * function norm(matrix){
   *   let tot=0;
   *   for(let v of matrix) tot+=v*v;
   *   return Math.sqrt(tot);
   * }
   * @example <caption>Using the ES6 spread operator with a matrix</caption>
   * const m=Matrix.from([[1,2,3],[4,5,6]]);
   * console.log([...m]); //=> [1,2,3,4,5,6];
   */
  * [Symbol.iterator](){
    for(let r of this[ROWS])
      for(let c of this[COLS])
        yield this[DATA][r+c];
  }

  /**
   * The matrix height and width in an array.
   * @returns {Array<Number>}
   * @example
   * const m=Matrix.from([1,2,3]);
   * console.log(m.size);
   * //[3,1]
   */
  get size(){return [this[ROWS].length,this[COLS].length]}

  /**
   * The transpose of the matrix
   * @returns {Matrix}
   * @example
   * const m=Matrix.from([[1,2],[3,4]]);
   * console.log(m.t.toJSON()); // [[1,3],[2,4]]
   */
  get t(){return new Matrix(this[COLS],this[ROWS],this[DATA])}

  /**
   * Return a value or subset of a matrix.  The matrix subset is a view into the current matrix.
   * @param rows {Range|Number} Row index or indices.  zero-based
   * @param cols {Range|Number} Column index or indices.  zero-based
   * @returns {Matrix|Number}
   * @example
   * const m=Matrix.from([[1,2],[3,4]]);
   * //Specify single indices to return a value
   * m.get(0,0) //1
   *
   * //The same indices in an array will return a matrix
   * m.get([0],[0]) //Matrix [1]
   *
   * //A general {@link Range} can be specified.
   * m.get(':',0) //Matrix [1;3]
   * m.get(':',':') //The original matrix.
   * m.get(['::',-1],':') //Return a matrix flipped vertically
   *
   * //Any sub-matrix returned is a view into the source matrix.
   * const a=zeros(4), b=a.get([1,2],[1,2]);
   * b.set(2);
   * console.log(a.toJSON()) //[[0,0,0,0], [0,2,2,0], [0,2,2,0], [0,0,0,0]]
   */
  get(rows,cols){
    const D=this[DATA], R=this[ROWS], C=this[COLS], Rl=R.length, Cl=C.length;
    if (isNum(rows) && isNum(cols)) return D[R[(rows+Rl)%Rl]+C[(cols+Cl)%Cl]];
    return new Matrix(
      Uint32Array.from([...range(rows,Rl)].map(r=>R[r])),
      Uint32Array.from([...range(cols,Cl)].map(c=>C[c])),
      D);
  }

  /**
   * Set a value or range of values of the matrix
   * @param [rows] {Range|Number} Row index or indices.  zero-based
   * @param [cols] {Range|Number} Column index or indices.  zero-based
   * @param val {Number|Matrix|Array} Values to assign to the specified range
   * @returns {Matrix}
   * @example
   * const m=Matrix.zeros(3);
   * //Set a single value
   * m.set(1,1,5) //[0,0,0; 0,5,0; 0,0,0]
   *
   * //Set a range to a single value
   * m.set(0,':',3) //[3,3,3; 0,5,0; 0,0,0]
   *
   * //The value can also be a matrix of the matching size, or an array which resolves to such.
   * m.set(2,':',[[7,8,6]]) //[3,3,3; 0,5,0; 7,8,6]
   * //If val is an array, {@link from} will be used to convert it to a matrix.
   *
   * //If no row and column indices are provided, the value will apply to the whole matrix
   * m.set(1) //[1,1,1; 1,1,1; 1,1,1]
   */
  set(rows,cols,val){
    let R=this[ROWS], C=this[COLS], Rl=R.length, Cl=C.length;
    const D=this[DATA];
    if (isNum(rows) && isNum(cols) && isNum(val)) D[R[rows]+C[cols]]=val;
    if (arguments.length===1){
      val=rows;
    } else {
      R = Uint32Array.from([...range(rows,Rl)].map(r=>R[r]));
      Rl = R.length;
      C = Uint32Array.from([...range(cols,Cl)].map(c=>C[c]));
      Cl = C.length;
    }
    if (isNum(val)){
      for(let r of R) for(let c of C)
        D[r+c] = val;
      return this;
    }
    if (isFunction(val)){
      for (let i=0;i<Rl;i++) for (let j=0;j<Cl;j++)
        D[R[i]+C[j]] = val(D[R[i]+C[j]],i,j);
      return this;
    }
    if (!isMatrix(val)) val = from(val);
    const [vRl,vCl] = val.size;
    if (Rl!==vRl || Cl!==vCl) throw new Error('Matrix::set Assignment error, matrix dimensions must agree');
    let vD = val[DATA], vR=val[ROWS], vC = val[COLS];
    //if this is the same matrix, avoid issues with swaps by copying the data first
    if (vD===D)vD=D.slice();
    for (let i=0;i<Rl;i++) for (let j=0;j<Cl;j++)
      D[R[i]+C[j]] = vD[vR[i]+vC[j]];
    return this;
  }

  /**
   * Clone the current matrix, or a subset of the current matrix if rows and columns are specified.
   * @param [rows] {Range|Number} If specified, the rows to clone
   * @param [cols] {Range|Number} If specified, the columns to clone
   * @returns {Matrix}
   */
  clone(rows,cols){
    if (rows) return this.get(rows,cols).clone();
    return new Matrix(this[ROWS].length, this[COLS].length, this);
  }

  /**
   * Creates a new matrix with the results of calling a provided function on every element in the supplied matrix.
   * @param fn {Function}
   * @returns {Matrix}
   * @example
   * const m=Matrix.from([0,':',5]).map(v=>Math.pow(2,v));
   * console.log([...m]); //[1,2,4,8,16,32]
   */
  map(fn){
    return new Matrix(this[ROWS].length,this[COLS].length,mapIter(this,fn))
  }

  /**
   * Convert the matrix to an array of number arrays.
   * @returns {Array.Array.Number}
   * @example
   * const m=Matrix.from([0,':',5]); //will create a column vector
   * console.log(m.toJSON()); //[[0],[1],[2],[3],[4],[5]]
   * console.log(m.t.toJSON()); //[0,1,2,3,4,5]
   * console.log(Matrix.reshape(m,2,3).toJSON()); //[[0,1,2],[3,4,5]]
   * //enables a matrix instance to be serialised by JSON.stringify
   * console.log(JSON.stringify(m)); //"[[0],[1],[2],[3],[4],[5]]"
   */
  toJSON(){
    return [...rows(this)];
  }
}

/**
 * Create a matrix from the supplied data.
 * @param data {(Matrix|Array.Number|Array.Array.Number)}
 * If `data` is a matrix then it is just returned.
 * An array of numbers becomes a column matrix.
 * An array of an array of numbers becomes a row matrix.
 * An array of arrays of numbers becomes a general matrix.  The inner arrays must all have the same length.
 * @returns {Matrix}
 * @category creation
 * @example <caption>Creating a column matrix</caption>
 * Matrix.from([1,2,3,4])
 * //[1; 2; 3; 4]
 * @example <caption>Creating a row matrix</caption>
 * Matrix.from([[1,2,3,4]])
 * //[1,2,3,4]
 * @example <caption>Creating an arbitrary matrix</caption>
 * Matrix.from([[1,2],[3,4],[5,6]]
 * //a 3x2 matrix [1,2; 3,4; 5,6]
 * @example <caption>A matrix is just passed through</caption>
 * const m = Matrix.from([[1,2],[3,4]]);
 * Matrix.from(m) === m; //true
 */
export function from(data){
  if (isMatrix(data)) return data;
  if (isArray(data) && data.length){
    if (isNum(data[0])) {
      data = [...range(data)];
      return new Matrix(data.length, [0], data);
    }
    if (isArray(data[0])){
      const rows = data.length, cols = data[0].length;
      if (data.every(a=>a.length===cols)) return new Matrix(rows,cols,data.flat());
    }
  }
  throw new TypeError('Matrix::from Unsupported data type');
}

/**
 * Add static functions of the form `fn(matrix,...args)` to the {@link Matrix} prototype as `matrix.fn(args)`
 * @param methods {...(Function|Object|Function[])} The method(s) to add
 * @example <caption>Adding standard functions</caption>
 * import * as Matrix from 't-matrix';
 * Matrix.mixin(Matrix.max, Matrix.min);
 * const m=Matrix.from([[1,2,3],[4,5,6]]);
 * console.log(m.min() + ', ' + m.max()); //=> 1, 6
 * @example <caption>Adding a custom function</caption>
 * import * as Matrix from 't-matrix';
 * const sqrt = matrix => matrix.map(Math.sqrt);
 * Matrix.mixin('sqrt',sqrt);
 * const m=Matrix.from([1,4,9]);
 * console.log([...m.sqrt()]); //=> [1,2,3]
 * @example <caption>Using a config file for the Matrix class</caption>
 * // inside 'matrix-setup.js'
 * import {mixin, reshape} from 't-matrix';
 * const neg = matrix => matrix.map(v=>-v);
 * mixin(reshape,'neg',neg);
 *
 * // inside other modules
 * import * as Matrix from 't-matrix';
 * console.log(Matrix.from([1,':',9]).reshape(3,3).neg().toJSON());//[[-1,-2,-3],[-4,-5,-6],[-7,-8,-9]]
 * @example <caption>Just include everything which can be included</caption>
 * import * as Matrix from 't-matrix';
 * Matrix.mixin(Matrix);
 * console.log(Matrix.from([1,':',9]).reshape(3,3).mult(2).toJSON());//[[2,4,6],[8,10,12],[14,16,18]]
 */
export function mixin(...methods){
  let prev=null;
  for(let method of _mixin(methods)){
    if (typeof method === "function" && (prev || method[METHOD])){
      Matrix.prototype[method[METHOD]||prev]=function(...args){
        return method(this, ...args);
      };
    }
    prev = typeof method === "string" ? method : null;
  }
}

function * _mixin(methods){
  for (let method of methods){
    if (typeof method === "function" || typeof method === "string") yield method;
    else{
      for (let k of Object.keys(method)) if (typeof method[k] === "function") yield method[k];
    }
  }
}

export {Matrix}