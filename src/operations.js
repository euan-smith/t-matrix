import {Matrix, isMatrix, from} from "./core";
import {ROWS,COLS,DATA,METHOD} from "./const";
import {rows, cols} from "./conversions";
import {mapIter, zipIters, isNum, toList} from "./tools";
import {diag, minor,repmat} from "./manipulations";
import {eye} from "./create";
import * as E from "./errors";

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
 * @summary Return the sum of the matrix in the direction specified or the element-wise sum of the set of matrices.
 * @description
 * `Matrix.sum(m)` or `m.sum()` will sum all the values of a matrix, returning a number.
 *
 * `Matrix.sum(m,null,1)` or `m.sum(null,1)` will sum the matrix columns, returning a row matrix.
 *
 * `Matrix.sum(m,null,2)` or `m.sum(null,2)` will sum the matrix rows, returning a column matrix.
 *
 * `Matrix.sum(m1,m2,m3,...)` or `m1.sum(m2,m3,...)` will calculate an element-wise sum over all the matrices.
 *
 * For the last case, the supplied list of matrices must either have the same row count or a row count of 1, and the
 * same column count or a column count of 1.  This includes scalar values which implicitly are treated as 1x1 matrices.
 * Arrays can also be provided and these will be converted to matrices using Matrix.{@link from}.  Row matrices will be
 * added to every row, column matrices to every column and scalar values to every matrix element.
 * @param matrices {...(?Matrix|Number)}
 * @returns {Matrix|Number}
 * @example
 * import * as Matrix from 't-matrix';
 * Matrix.mixin(Matrix);
 * console.log(Matrix.magic(3).sum(null,1).toJSON());//[[15,15,15]];
 * console.log(Matrix.magic(3).sum());//45
 * console.log(Matrix.sum([[0,1,2]], [6,3,0], 1).toJSON());//[[7,8,9],[4,5,6],[1,2,3]];
 */
export function sum(...matrices){
  return pOp(sumFn, ...matrices);
}
sum[METHOD]='sum';

/**
 * @summary Return the maximum of the matrix in the direction specified or the element-wise maximum of the set of matrices.
 * @description
 * `Matrix.max(m)` or `m.max()` will return the max of all the values of a matrix.
 *
 * `Matrix.max(m,null,1)` or `m.max(null,1)` will return a row matrix containing max of each matrix column.
 *
 * `Matrix.max(m,null,2)` or `m.max(null,2)` will return a column matrix containing max of each matrix row.
 *
 * `Matrix.max(m1,m2,m3,...)` or `m1.max(m2,m3,...)` will calculate an element-wise max over all the matrices.
 *
 * For the last case, the supplied list of matrices must either have the same row count or a row count of 1, and the
 * same column count or a column count of 1.  This includes scalar values which implicitly are treated as 1x1 matrices.
 * Arrays can also be provided and these will be converted to matrices using Matrix.{@link from}.  An element of the
 * returned matrix of a given row and column will be the max of that row and column of all regular matrices, of that row of all
 * column matrices, of that column of all row matrices and of all scalar values.
 * @param matrices {...(?Matrix|Number)}
 * @returns {Matrix|Number}
 * @example
 * import * as Matrix from 't-matrix';
 * Matrix.mixin(Matrix);
 * console.log(Matrix.magic(3).max(null,1).toJSON());//[[8,9,7]];
 * console.log(Matrix.magic(3).max());//9
 * console.log(Matrix.max([[0,1,2]], [6,3,0], 1).toJSON());//[[6,6,6],[3,3,3],[1,1,2];
 */
export function max(...matrices){
  return pOp(maxFn, ...matrices);
}
max[METHOD]='max';

/**
 * @summary Return the minimum of the matrix in the direction specified or the element-wise minimum of the set of matrices.
 * @description
 * Works the same way as other similar operations.  See Matrix.{@link max} for more details.
 * @param matrices {...(?Matrix|Number)}
 * @returns {Matrix|Number}
 * @example
 * import * as Matrix from 't-matrix';
 * Matrix.mixin(Matrix);
 * console.log(Matrix.magic(3).max(null,1).toJSON());//[[3,1,2]];
 * console.log(Matrix.magic(3).max());//1
 * console.log(Matrix.max([[0,1,2]], [6,3,0], 1).toJSON());//[[0,1,1],[0,1,1],[0,0,0];
 */
export function min(...matrices){
  return pOp(minFn, ...matrices);
}
min[METHOD]='min';

/**
 * @summary Return the product of the matrix values in the direction specified or the element-wise product of the set of matrices.
 * @description
 * Works the same way as other similar operations.  See Matrix.{@link sum} for more details.
 * @param matrices {...(?Matrix|Number)}
 * @returns {Matrix|Number}
 * @example
 * import * as Matrix from 't-matrix';
 * Matrix.mixin(Matrix);
 * console.log(Matrix.magic(3).product(null,1).toJSON());//[[96,45,84]];
 * console.log(Matrix.magic(3).product());//362880
 * console.log(Matrix.product([[0,1,2]], [6,3,0], 1).toJSON());//[[0,6,12],[0,3,6],[0,0,0]];
 */
export function product(...matrices){
  return pOp(prodFn, ...matrices);
}
product[METHOD]='product';

/**
 * Returns the trace of a matrix (the sum of the diagonal elements)
 * @param matrix
 * @returns {Number}
 */
export function trace(matrix){
  return sum(diag(matrix))
}
trace[METHOD]='trace';

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
  const [hm,wm]=m.size;
  //size is the same, just yield the matrix
  if (hm===h && wm===w) yield* m;
  //1x1 matrix, yield it's value h*w times
  else if (hm===1 && wm===1) for(let i=h*w,v=m.get(0,0);i--;) yield v;
  //A row matrix, yield the row h times
  else if (hm===1 && wm===w) for(let i=h;i--;) yield* m;
  //A column matrix, yield each value w times
  else if (hm===h && wm===1) for(let v of m) for(let i=w;i--;) yield v;
  //none of the above, so throw an error
  else throw new E.MatrixError(E.InvalidDimensions);
}

/**
 * Performs matrix multiplication on a list of matrices and/or scalars
 * @param matrices {...(Matrix|Number)} At least one parameter must be a matrix or convertible to a matrix through Matrix.{@link from}
 * @returns {Matrix}
 * @example
 * import * as Matrix from 't-matrix';
 * const mag = Matrix.magic(3);
 * console.log(mag.mult(mag.inv()).toJSON());//a 3x3 identity matrix (plus some round-off error)
 */
export function mult(...matrices){
  let m,h,k,s=1;
  // let m=matrices[0],[h,k]=m.size;
  for(let matrix of matrices){
    if (isNum(matrix)) s*=matrix;
    else {
      matrix=from(matrix);
      if (!m){
        m=matrix;
        [h,k]=m.size;
      } else {
        const [k2,w]=matrix.size;
        //ensure dimensions agree
        if (k!==k2) throw new E.MatrixError(E.InvalidDimensions);
        //and chain multiply the matrices together (note: unoptimised order)
        m=new Matrix(h,w,_mult(m,matrix,k));
        k=w;
      }
    }
  }
  return s===1?m:product(m,s);
}
mult[METHOD]='mult';


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
  m=from(m);
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
det[METHOD]='det';


export function ldiv(a,b){
  a=from(a);b=from(b);
  const working = a.clone(), {[ROWS]:Rw,[COLS]:Cw,[DATA]:Dw}=working;
  const rtn = b.clone(), {[ROWS]:Rr,[COLS]:Cr,[DATA]:Dr}=rtn;
  const [h,w] = b.size;
  const [hc,wc] = a.size;
  if (hc!==wc || hc!==h) throw new E.MatrixError(E.InvalidDimensions);
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
      if (r2>=h) throw new E.MatrixError(E.IsSingular);
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
ldiv[METHOD]='ldiv';


export function div(a,b){
  return ldiv(b.t,a.t).t;
}
div[METHOD]='div';

export function inv(a){
  return ldiv(a,eye(a.size[0]));
}
inv[METHOD]='inv';

export function abs(m){
  return from(m).map(Math.abs);
}
abs[METHOD]='abs';

export function grid(rows,cols){
  rows = toList(rows);
  if (!cols) cols=rows;
  else cols = toList(cols);
  return [
    repmat(new Matrix(rows.length,1,rows),1,cols.length),
    repmat(new Matrix(1,cols.length,cols),rows.length,1),
  ]
}
