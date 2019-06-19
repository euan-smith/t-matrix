import {Matrix, isMatrix, from} from "./core";
import {ROWS,COLS,DATA} from "./const";
import {rows, cols} from "./conversions";
import {mapIter, zipIters, isNum} from "./tools";
import {diag, minor} from "./manipulations";
import {eye} from "./create";

const
  op = (m, dir, opFn) => {
    switch(dir){
      case 1:
        return new Matrix(1,m.size[1],mapIter(cols(m),opFn));
      case 2:
        return new Matrix(m.size[0],1,mapIter(rows(m),opFn));
      default:
        return opFn(m);
    }
  },
  sumFn = a => {
    let v, t = 0;
    for (v of a) t += v;
    return t;
  },
  maxFn = a => {
    let v, r = -Number.MAX_VALUE;
    for (v of a) if (v>r) r=v;
    return r;
  },
  minFn = a => {
    let v, r = Number.MAX_VALUE;
    for (v of a) if (v<r) r=v;
    return r;
  },
  prodFn = a => {
    let v, p = 1;
    for (v of a) p *= v;
    return p;
  };

/**
 * Sum the matrix in the direction specified or sum the set of matrices.
 * @param matrices {...Matrix|Number|null}
 * @returns {Matrix|Number}
 */
export function sum(...matrices){
  return pOp(sumFn, ...matrices);
}

export function max(...matrices){
  return pOp(maxFn, ...matrices);
}

export function min(...matrices){
  return pOp(minFn, ...matrices);
}

export function product(...matrices){
  return pOp(prodFn, ...matrices);
}

export function trace(m){
  return sum(diag(m))
}

function pOp(opFn,...matrices){
  if (matrices[1] == null) return op(matrices[0], matrices[2], opFn);
  matrices = matrices.map(m=>isMatrix(m)?m:isNum(m)?from([m]):from(m));
  const [h,w]=matrices.reduce(([h,w],m)=>{
    const [hm,wm]=m.size;
    return [hm>h?hm:h, wm>w?wm:w]
  },[1,1]);
  //ensure the dimensions are all the same
  matrices = matrices.map(m=>matchSize(m,h,w));
  return new Matrix(h,w,mapIter(zipIters(...matrices),opFn));
}

function *matchSize(m,h,w){
  if (!isMatrix(m)) m=from(m);
  const [hm,wm]=m.size;
  //size is the same, just yield the matrix
  if (h===hm && w===wm) yield* m;
  //1x1 matrix, yield it's value h*w times
  else if (hm===1 && wm===1) for(let i=h*w,v=m.get(0,0);i--;) yield v;
  //A row matrix, yield the row h times
  else if (hm===1) for(let i=h;i--;) yield* m;
  //A column matrix, yield each value w times
  else if (wm===1) for(let v of m) for(let i=w;i--;) yield v;
  //none of the above, so throw an error
  else throw new Error('Matrix:: Matrix dimensions must match.');
}

export function mult(...matrices){
  let m,h,k,s=1;
  // let m=matrices[0],[h,k]=m.size;
  for(let matrix of matrices){
    if (isNum(matrix)) s*=matrix;
    else {
      if (!m){
        m=matrix;
        [h,k]=m.size;
      } else {
        const [k2,w]=matrix.size;
        //ensure dimensions agree
        if (k!==k2) throw new Error('Matrix::mult invalid matrix dimensions');
        //and chain multiply the matrices together (note: unoptimised order)
        m=new Matrix(h,w,_mult(m,matrix,k));
        k=w;
      }
    }
  }
  return s===1?m:product(m,s);
}

function *_mult(a,b,K){
  const Ca=a[COLS],Da=a[DATA];
  const Rb=b[ROWS],Db=b[DATA];
  for (let r of a[ROWS]) for (let c of b[COLS]){
    let t=0;
    for (let k=0;k<K;k++) t+=Da[r+Ca[k]]*Db[Rb[k]+c];
    yield t;
  }
}

export function det(m){
  const [h,w] = m.size;
  if (h!==w) return 0;
  if (h<4){
    const d=[...m];
    if (h===2) return d[0] * d[3] - d[1] * d[2];
    return d[0]*(d[4]*d[8]-d[7]*d[5]) + d[1]*(d[5]*d[6]-d[8]*d[3]) + d[2]*(d[3]*d[7]-d[6]*d[4]);
  }
  let dt=0;
  for(let c=1;c<=w;c+=2){
    dt += m.get(0,c-1)*det(minor(m,0,c-1));
    if (c<w) dt -= m.get(0,c)*det(minor(m,0,c));
  }
  return dt;
}

export function ldiv(a,b){
  const working = a.clone(), {[ROWS]:Rw,[COLS]:Cw,[DATA]:Dw}=working;
  const rtn = b.clone(), {[ROWS]:Rr,[COLS]:Cr,[DATA]:Dr}=rtn;
  const [h,w] = b.size;
  const [hc,wc] = a.size;
  if (hc!==wc || hc!==h) throw new Error('Matrix::div matrix dimensions incompatible with operation');
  for (let r=0;r<h;r++){
    //ensure that the pivot element is not too small
    if (Math.abs(Dw[Rw[r]+Cw[r]])< 1e-10){
      //find a value in the column which is large enough
      let r2;
      for (r2=r+1;r2<h;r2++){
        if (Math.abs(Dw[Rw[r2]+Cw[r]])> 1e-10){
          //found it, so swap the rows
          [Rw[r],Rw[r2]] = [Rw[r2],Rw[r]];
          [Rr[r],Rr[r2]] = [Rr[r2],Rr[r]];
          break;
        }
      }
      if (r2>=h) throw new Error('Matrix::div matrix is singular to working precision.')
    }
    const rw=Rw[r],rr=Rr[r];
    const p = 1 / Dw[rw+Cw[r]];
    for (let cw of Cw) Dw[rw+cw] *= p;
    for (let cr of Cr) Dr[rr+cr] *= p;

    for (let r2=0; r2<h; r2++){
      if (r2===r) continue;
      const rw2=Rw[r2],rr2=Rr[r2],q=Dw[rw2+Cw[r]];
      for (let cw of Cw) Dw[rw2+cw] -= q*Dw[rw+cw];
      for (let cr of Cr) Dr[rr2+cr] -= q*Dr[rr+cr];
    }
  }
  return rtn;
}

export function div(a,b){
  return ldiv(b.t,a.t).t;
}

export function inv(a){
  return ldiv(a,eye(a.size[0]));
}

export function abs(m){
  return m.map(Math.abs);
}
