
export const DATA=Symbol(), ROWS=Symbol(), COLS=Symbol();

import {isNum, range, isFunction, isArray} from "./tools";

export const isMatrix = (m)=> m instanceof Matrix;

export class Matrix{
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
      throw new Error('Matrix: Data array too small for specified rows and columns');
    }
    Object.defineProperties(this,{
      [DATA]:{value:data},
      [ROWS]:{value:rows},
      [COLS]:{value:cols},
    })
  }

  * [Symbol.iterator](){
    for(let r of this[ROWS])
      for(let c of this[COLS])
        yield this[DATA][r+c];
  }

  get size(){return [this[ROWS].length,this[COLS].length]}

  get t(){return new Matrix(this[COLS],this[ROWS],this[DATA])}

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
    if (Rl!==vRl || Cl!==vCl) throw new Error('Assignment error, matrix dimensions must agree');
    const vD = val[DATA], vR=val[ROWS], vC = val[COLS];
    for (let i=0;i<Rl;i++) for (let j=0;j<Cl;j++)
      D[R[i]+C[j]] = vD[vR[i]+vC[j]];
    return this;
  }

  clone(rows,cols){
    if (rows) return this.get(rows,cols).clone();
    return new Matrix(this[ROWS].length, this[COLS].length, this);
  }

  map(fn){return this.clone().set(fn)}
}

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
  if (isMatrix(data)) return data;
  if (isArray(data) && data.length){
    if (isNum(data[0])) return new Matrix(data.length, [0], data);
    if (isArray(data[0])){
      const rows = data.length, cols = data[0].length;
      if (data.every(a=>a.length===cols)) return new Matrix(rows,cols,data.flat());
    }
  }
  throw new Error('Unsupported data for Matrix::from');
}

export function mixin(...methods){
  for(let method of methods.flat()){
    Matrix.prototype[method.name]=method;
  }
}