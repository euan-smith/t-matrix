
export const DATA=Symbol(), ROWS=Symbol(), COLS=Symbol();

import {isNum, range, isArray, isFunction} from "./tools";

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

export function zeros(r,c){
  if (!c) c=r;
  return new Matrix(r,c,0);
}

export function ones(r,c){
  if (!c) c=r;
  return new Matrix(r,c,1);
}

export function eye(s){
  return new Matrix(s,s,0).diag(1);
}

export function sum(m){
  return [...m].reduce((a,b)=>a+b);
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
    for(let r of this[ROWS])
      for(let c of this[COLS])
        yield this[DATA][r+c];
  }

  get size(){return [this[ROWS].length,this[COLS].length]}

  *rows(){
    const cols = Array.from(this[COLS]);
    for(let r of this[ROWS])
      yield cols.map(c=>this[DATA][r+c]);
  }

  *cols(){
    const rows = Array.from(this[ROWS]);
    for(let c of this[COLS])
      yield rows.map(r=>this[DATA][r+c]);
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
    if (set) {
      this.diag().set(set);
      return this;
    }
    const R=this[ROWS],C=this[COLS],D=this[DATA];
    return R.length<C.length?
      new Matrix(R.map((r,i)=>r+C[i]),[0],D):
      new Matrix(C.map((c,i)=>R[i]+c),[0],D);
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

  toString(){
    return '[ '+[...this.rows()].map(row=>row.join(', ')).join(';\n  ')+' ]\n';
  }

}