import {DATA,ROWS,COLS} from "./const";

import {isNum, range, isFunction, isArray, mapIter} from "./tools";

import {rows} from "./conversions";


/**
 * Tests if a value is an instance of a Matrix
 * @function
 * @param val {*} The value to test.
 * @returns {boolean} 'true' if `val` is an instance of Matrix, 'false' otherwise.
 */
export const isMatrix = val => val instanceof Matrix;


/**
 * The core matrix class
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
   * @function Matrix#\[Symbol-Iterator\]
   * @yields {Number}
   * @example
   * //Calculate the L²-norm of a matrix
   * function norm(matrix){
   *   let tot=0;
   *   for(let v of matrix) tot+=v*v;
   *   return Math.sqrt(tot);
   * }
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
   * The a value or subset of a matrix
   * @param rows
   * @param cols
   * @returns {Matrix|Number}
   */
  get(rows,cols){
    const D=this[DATA], R=this[ROWS], C=this[COLS], Rl=R.length, Cl=C.length;
    if (isNum(rows) && isNum(cols)) return D[R[(rows+Rl)%Rl]+C[(cols+Cl)%Cl]];
    return new Matrix(
      Uint32Array.from([...range(rows,Rl)].map(r=>R[r])),
      Uint32Array.from([...range(cols,Cl)].map(c=>C[c])),
      D);
  }

  //val can be a number, a function, a matrix, an array or an array of arrays
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
    const vD = val[DATA], vR=val[ROWS], vC = val[COLS];
    for (let i=0;i<Rl;i++) for (let j=0;j<Cl;j++)
      D[R[i]+C[j]] = vD[vR[i]+vC[j]];
    return this;
  }

  clone(rows,cols){
    if (rows) return this.get(rows,cols).clone();
    return new Matrix(this[ROWS].length, this[COLS].length, this);
  }

  map(fn){
    return new Matrix(this[ROWS].length,this[COLS].length,mapIter(this,fn))
  }

  toJSON(){
    return [...rows(this)];
  }
}

/**
 * A range specifies indices of the row or column of a matrix.  In general this is just an array of number, however
 * there are two special elements which can be used, `':'` and `'::'`.  `':'` indicates a range from the previous
 * index to the subsequent index. If `':'` is at the start of the array, then a range from the start of the indices
 * is assumed, similarly if at the end then to the end is assumed.  `[':']` thus indicates the entire range.
 * @summary A range specifier.
 * @typeDef Range
 * @type {Array<Number|String>|Number|String}
 */

/**
 * Create a matrix from the supplied data.
 * @param data {(Matrix|Array<Number>|Array<Array<Number>>)}
 * If `data` is a matrix then it is just returned.
 * An array of numbers becomes a column matrix.
 * An array of an array of numbers becomes a row matrix.
 * An array of arrays of numbers becomes a general matrix.  The inner arrays must all have the same length.
 * @returns {Matrix}
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
    if (isNum(data[0])) return new Matrix(data.length, [0], data);
    if (isArray(data[0])){
      const rows = data.length, cols = data[0].length;
      if (data.every(a=>a.length===cols)) return new Matrix(rows,cols,data.flat());
    }
  }
  throw new TypeError('Matrix::from Unsupported data type');
}

export function mixin(...methods){
  for(let method of methods){
    Matrix.prototype[method.name]=function(...args){
      return method(this, ...args);
    };
  }
}

export {Matrix}