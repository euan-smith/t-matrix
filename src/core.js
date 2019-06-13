
export const DATA=Symbol(), ROWS=Symbol(), COLS=Symbol();

import {isNum} from "./tools";
const isArray = Array.isArray;

export function *range(def, lim){
  let state=-1, i, step;
  if (!isArray(def)) def=[def];
  for (let d of def){
    switch(state){
      case -1:
        if (d===':' || d==='::'){
          yield i=0;
        }
        state=0;
      // noinspection FallThroughInSwitchStatementJS
      case 0:
        if (d===':'){
          i+=step=1;
          state=2;
        } else if (d==='::'){
          state=1;
        } else yield i=lim?(d+lim)%lim:d;
        break;
      case 1:
        i+=step=d;
        state=2;
        break;
      case 2:
        yield* rng(i,step,lim?(d+lim)%lim:d);
        state=0;
        break;
    }
  }
  if (state === 2) {
    if (!lim) throw new Error('Invalid range specification.');
    yield* rng(i,step,lim-1);
  }
}

function *rng(i,step,end){
  if (step>0) for(;i<=end;i+=step) yield i;
  else for(;i>=end;i+=step) yield i;
}

export function from(data){
  if (isArray(data) && data.length){
    if (isNum(data[0])) return new Matrix(data.length, [0], data);
    if (isArray(data[0])){
      const rows = data.length, cols = data[0].length;
      if (data.every(a=>a.length===cols)) return new Matrix(rows,cols,data.flat());
    }
  }
  throw new Error('Unsupported data for Matrix::from');
}

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
    for(let c of this[COLS])
      for(let r of this[ROWS])
        yield this[DATA][r+c];
  }

  get size(){return [this[ROWS].length,this[COLS].length]}

  *rows(){
    for(let r of this[ROWS])
      yield this[COLS].map(c=>this[DATA][r+c]);
  }

  *cols(){
    for(let c of this[COLS])
      yield this[ROWS].map(r=>this[DATA][r+c]);
  }

  get t(){return new Matrix(this[COLS],this[ROWS],this[DATA])}

  get(rows,cols){
    const D=this[DATA], R=this[ROWS], C=this[COLS], Rl=R.length, Cl=C.length;
    if (isNum(rows) && isNum(cols)) return D[R[(rows+Rl)%Rl]+C[(cols+Cl)%Cl]];
    return new Matrix(
      Uint32Array.from([...range(rows,Rl)].map(r=>R[r])),
      Uint32Array.from([...range(cols,Cl)].map(c=>C[c])),
      D);
  }

  diag(set){
    if (set) return this.diag().set(set);
    const R=this[ROWS],C=this[COLS],D=this[DATA];
    return R.length<C.length?
      new Matrix(R.map((r,i)=>r+C[i]),[0],D):
      new Matrix(C.map((c,i)=>R[i]+c),[0],D);
  }

  //val can be a number, a function, a matrix, an array or an array of arrays
  set(rows,cols,val){
    let R=this[ROWS], C=this[COLS], Rl=R.length, Cl=C.length;
    const D=this[DATA];
    if (arguments.length===1){
      val=rows;
    } else {
      R = Uint32Array.from([...range(rows,Rl)].map(r=>R[r]));
      Rl = R.length;
      C = Uint32Array.from([...range(cols,Cl)].map(c=>C[c]));
      Cl = C.length;
    }
    if (isNum(val)){
      for(let c of this[COLS])
        for(let r of this[ROWS])
          this[DATA][r+c] = val;
    }
    if (!isMatrix(val)) val = from(val);
    const [vRl,vCl] = val.size();
    if (Rl!==vRl || Cl!==vCl) throw new Error('Assignment error, matrix dimensions must agree');
    const vD = val[DATA], vR=val[ROWS], vC = val[COLS];
    for (let i=0;i<Rl;i++)
      for (let j=0;j<Cl;j++)
        D[R[i]+C[j]] = vD[vR[i]+vC[j]];
  }
}