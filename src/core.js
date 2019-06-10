
export const DATA=Symbol(), ROWS=Symbol(), COLS=Symbol();

export function *range(def, lim){
  if (!lim) lim=65536;
  let state=0, i, step;
  for (let d of def){
    switch(state){
      case 0:
        if (d===':'){
          i+=step=1;
          state=2;
        } else if (d==='::'){
          state=1;
        } else yield i=(d+lim)%lim;
        break;
      case 1:
        i+=step=d;
        state=2;
        break;
      case 2:
        d=(d+lim)%lim;
        if (step>0) for(;i<=d;i+=step) yield i;
        else if (step<0) for(;i>=d;i+=step) yield i;
        state=0;
        break;
    }
  }
}

export class Matrix{
  constructor(rows,cols,data){
    if (typeof rows === "number") rows = [0,':',rows-1];
    if (Array.isArray(rows)) rows = Uint32Array.from([...range(rows)]);
    const span = rows[rows.length-1]+1;
    if (typeof cols === "number") cols = [0,'::',span,span*(cols-1)];
    if (Array.isArray(cols)) cols = Uint32Array.from([...range(cols)]);
    const size = span + cols[cols.length-1];
    if (!data) data = new Float64Array(size);
    if (!(data instanceof Float64Array)) data = Float64Array.from(data);
    else if (data.length<size){
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
    const rIsNum = typeof rows === "number";
    const cIsNum = typeof rows === "number";
    const D=this[DATA], R=this[ROWS], C=this[COLS], Rl=R.length, Cl=C.length;
    if (rIsNum && cIsNum) return D[R[(rows+Rl)%Rl]+C[(cols+Cl)%Cl]];
    if (rIsNum)rows=[rows];
    if (cIsNum)cols=[cols];
    return new Matrix(
      Uint32Array.from([...range(rows,Rl)].map(r=>R[r])),
      Uint32Array.from([...range(cols,Cl)].map(c=>C[c])),
      D);
  }

  //val can be a number, a function, a matrix, an array or an array of arrays
  set(rows,cols,val){}
}