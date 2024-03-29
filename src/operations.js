import {Matrix, isMatrix, from} from "./core.js";
import {ROWS,COLS,DATA,METHOD} from "./const.js";
import {rows, cols} from "./conversions.js";
import {mapIter, zipIters, isNum, toList, repeat} from "./tools.js";
import {diag, minor,repmat, hcat, vcat} from "./manipulations.js";
import {eye} from "./create.js";
import * as E from "./errors.js";

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
 * @category operation
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
 * @category operation
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
 * @category operation
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
 * @category operation
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
 * @category operation
 * @returns {Number}
 */
export function trace(matrix){
  return sum(diag(matrix))
}
trace[METHOD]='trace';

// noinspection JSCommentMatchesSignature
/**
 * Creates a new matrix with the results of calling a provided function on every element in the supplied set of matrices.
 * @param matrices {...(Matrix|Number)}
 * @param fn {Function}
 * @category operation
 * @returns {Matrix}
 * @example
 * //Calculate a gaussian function in 2D for a range -3:0.1:3 in x and y.
 * import * as Matrix from 't-matrix';
 * const [Y,X]=Matrix.grid([-3,'::',0.1,3]);
 * const gauss=Matrix.mapMany(Y,X,(y,x)=>Math.exp(-Math.pow(x+y,2)));
 */
export function mapMany(...matrices){
  const fn=matrices.pop();
  return _mapMany(a=>fn.apply(null,a), {}, ...matrices);
}
mapMany[METHOD]='mapMany';

// noinspection JSCommentMatchesSignature
/**
 * Creates a new binary matrix with the results of calling a provided function on every element in the supplied set of one or more matrices.
 * @param matrices {...(Matrix|Number)}
 * @param [fn] {Function} Optional for the special case of a single parameter, mandatory otherwise
 * @category operation
 * @returns {Matrix}
 * @example
 * //Sum only the values of a matrix above a threshold
 * import * as Matrix from 't-matrix';
 * const m = Matrix.magic(10);
 * const selection = Matrix.bin(m, v=>v>0.5);
 * const sum = Matrix.sum(m.get(selection));
 *
 * //If using bin a lot, consider mixing it in
 * Matrix.mixin(Matrix.bin);
 * console.log('count of non-zero values of m:',Matrix.sum(m.bin()));
 *
 */
export function bin(...matrices){
  const fn = matrices.length === 1 ? v=>v : matrices.pop();
  return _mapMany(a=>fn.apply(null,a)?1:0, {binary:true}, ...matrices);
}
bin[METHOD]='bin';

function _mapMany(fn, opts, ...matrices){
  matrices = matrices.map(m=>isNum(m)?from([m]):from(m));
  const [h,w]=matrices.reduce(([h,w],m)=>{
    const [hm,wm]=m.size;
    return [hm>h?hm:h, wm>w?wm:w]
  },[1,1]);
  //ensure the dimensions are all the same
  matrices = matrices.map(m=>matchSize(m,h,w));
  return new Matrix(h,w,mapIter(zipIters(...matrices),fn), opts);
}

function pOp(opFn,...matrices){
  return matrices[1] == null?
    op(matrices[0], matrices[2], opFn):
    _mapMany(opFn, {}, ...matrices);
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
 * @category operation
 * @returns {Matrix}
 * @example
 * import * as Matrix from 't-matrix';
 * const mag = Matrix.magic(3);
 * console.log(Matrix.mult(mag,Matrix.inv(mag)).toJSON());//a 3x3 identity matrix (plus some round-off error)
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

/**
 * @summary Calculate the determinant of a matrix.
 * @description The determinant is calculated by the standard naive algorithm which
 * **scales really really badly** (the algorithm is O(n!)).  Once LU decomposition has been added to the
 * library then that will provide an O(n^3) method which is **much** faster.
 * @param matrix {Matrix}
 * @category operation
 * @returns {number}
 */
export function det(matrix){
  matrix=from(matrix);
  const [h,w] = matrix.size;
  if (h!==w) return 0;
  if (h<4){
    const d=[...matrix];
    if (h===2) return d[0] * d[3] - d[1] * d[2];
    return d[0]*(d[4]*d[8]-d[7]*d[5]) + d[1]*(d[5]*d[6]-d[8]*d[3]) + d[2]*(d[3]*d[7]-d[6]*d[4]);
  }
  let dt=0;
  for(let c=1;c<=w;c+=2){
    dt += matrix.get(0,c-1)*det(minor(matrix,0,c-1));
    if (c<w) dt -= matrix.get(0,c)*det(minor(matrix,0,c));
  }
  return dt;
}
det[METHOD]='det';

/**
 * @summary [Left-division](https://en.wikipedia.org/wiki/Division_%28mathematics%29#Left_and_right_division). Solve Ax = B for x.
 * @description Solve the system of linear equations Ax = B for x.  In [Matlab](https://www.mathworks.com/products/matlab.html)/[Octave](https://www.gnu.org/software/octave/)
 * this can be expressed as `A\B`.  Equivalent to using [Matrix.div](#div) where `Matrix.ldiv(A,B)` gives the same answer as `Matrix.div(B.t,A.t).t`.
 * @category operation
 * @param A {Matrix}
 * @param B {Matrix}
 * @returns {Matrix}
 */
export function ldiv(A,B){
  A=from(A);B=from(B);
  const working = A.clone(), {[ROWS]:Rw,[COLS]:Cw,[DATA]:Dw}=working;
  const rtn = B.clone(), {[ROWS]:Rr,[COLS]:Cr,[DATA]:Dr}=rtn;
  const [h,] = B.size;
  const [hc,wc] = A.size;
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

/**
 * @summary [Right-division](https://en.wikipedia.org/wiki/Division_%28mathematics%29#Left_and_right_division). Solve xB = A for x.
 * @description Solve the system of linear equations xB = A for x.  In [Matlab](https://www.mathworks.com/products/matlab.html)/[Octave](https://www.gnu.org/software/octave/)
 * this can be expressed as `A/B`.  Equivalent to using [Matrix.div](#ldiv) where `Matrix.div(A,B)` gives the same answer as `Matrix.ldiv(B.t,A.t).t`.
 * @category operation
 * @param A {Matrix}
 * @param B {Matrix}
 * @returns {Matrix}
 */
export function div(A,B){
  return ldiv(B.t,A.t).t;
}
div[METHOD]='div';

/**
 * @summary Calculate the inverse of a matrix.
 * @description Uses the {@link ldiv} operation to calculate the inverse.  NOTE: it is *really not good practice* to
 * use a matrix inverse, instead consider using {@link div} or {@link ldiv} directly. For a more thorough exposition on
 * this see, for example, ["Don't invert that matrix"](https://www.johndcook.com/blog/2010/01/19/dont-invert-that-matrix/)
 * @param matrix {Matrix}
 * @category operation
 * @returns {Matrix}
 */
export function inv(matrix){
  return ldiv(matrix,eye(matrix.size[0]));
}
inv[METHOD]='inv';

/**
 * Return a new matrix containing the element-wise absolute values of the source matrix.
 * @param matrix {Matrix}
 * @category operation
 * @returns {Matrix}
 */
export function abs(matrix){
  return from(matrix).map(Math.abs);
}
abs[METHOD]='abs';

/**
 * @summary Generate a regular grid in 2D space
 * @description This is equivalent to the [Matlab](https://www.mathworks.com/products/matlab.html)/[Octave](https://www.gnu.org/software/octave/) function [ndgrid](https://octave.sourceforge.io/octave/function/ndgrid.html) for the 2d case.
 * Once the _rows_ and _cols_ parameters are expanded to arrays, the first returned matrix contains the _rows_ array as a column matrix repeated to match the size of the _cols_ array.
 * Similarly the second returned matrix is the _cols_ array as a row matrix repeated to match the size of the _rows_ array.
 * @category operation
 * @param rows {Range|Number} If a number *n* this is converted to a range 0:n-1, otherwise a range is expected.
 * @param [cols] {Range|Number} If a number *n* this is converted to a range 0:n-1, otherwise a range is expected.
 * @returns {Matrix[]}
 */
export function grid(rows,cols){
  if (isNum(rows)) rows = [':',rows-1];
  rows = toList(rows);
  if (isNum(cols)) cols = [':',cols-1];
  if (!cols) cols=rows;
  else cols = toList(cols);
  return [
    repmat(new Matrix(rows.length,1,rows),1,cols.length),
    repmat(new Matrix(1,cols.length,cols),rows.length,1),
  ]
}

/**
 * @summary Calculate the cross product(s) of two vectors or sets of vectors.
 * @description Both matrices must contain either 1 or N 3-element row vectors or column vectors.  The orientation of the vectors
 * must be consistent between the two matrices, and the returned matrix will use the same orientation.  If both contain
 * a single vector, the cross product of those vectors will be returned.  If both contain N vectors, then the returned
 * matrix will contain the N cross products of each vector pair.  If one matrix has 1 vector and the other N then the
 * returned matrix will be the N cross products of the single vector with each of N vectors from the other matrix.
 * @category operation
 * @param A {Matrix}
 * @param B {Matrix}
 * @param [dim] {Number}
 * @returns {Matrix}
 * @example
 * import * as Matrix from 't-matrix';
 * console.log([...Matrix.cross([1,0,0],[0,1,0])]); // should be [0,0,1]
 *
 */
export function cross(A,B,dim){
  A=from(A);
  B=from(B);
  const [ah,aw]=A.size, [bh,bw]=B.size;
  if (!dim){
    if (ah===3 && bh===3) dim=1;
    else if (aw===3 && bw===3) dim=2;
    else throw E.MatrixError(E.InvalidDimensions);
  }
  if ((dim===1 && (ah!==3 || bh!==3)) || (dim===2 && (aw!==3 || bw!==3))) throw E.MatrixError(E.InvalidDimensions);
  if ((dim===1 && aw!==bw && aw>1 && bw>1) || (dim===2 && ah!==bh && ah>1 && bh>1)) throw E.MatrixError(E.InvalidDimensions);

  if (dim===1){
    const w = Math.max(aw,bw);
    const ai = aw===1?repeat(A,w):cols(A);
    const bi = bw===1?repeat(B,w):cols(B);
    return (new Matrix(w,3,_cross(ai,bi))).t;
  } else {
    const h = Math.max(ah,bh);
    const ai = ah===1?repeat(A,h):rows(A);
    const bi = bh===1?repeat(B,h):rows(B);
    return new Matrix(h,3,_cross(ai,bi));
  }
}
cross[METHOD]="cross";

function* _cross(a,b){
  for (let [ar,br] of zipIters(a,b)){
    const [arx,ary,arz]=ar, [brx,bry,brz]=br;
    yield ary*brz-arz*bry;
    yield brx*arz-arx*brz;
    yield arx*bry-brx*ary;
  }
}

/**
 * @summary Calculate the scalar dot product(s) of two vectors or sets of vectors.
 * @description Both matrices must contain either 1 or N row vectors or column vectors of equal length.  The orientation of the vectors
 * must be consistent between the two matrices, and the returned matrix will use the same orientation.  If both contain
 * a single vector, the dot product of those vectors will be returned as a scalar value.  If both contain N vectors, then the returned
 * matrix will contain the N dot products of each vector pair.  If one matrix has 1 vector and the other N then the
 * returned matrix will be the N dot products of the single vector with each of N vectors from the other matrix.
 * @category operation
 * @param A {Matrix}
 * @param B {Matrix}
 * @param [dim] {Number}
 * @returns {Matrix}
 */
export function dot(A,B,dim){
  A=from(A);
  B=from(B);
  const [ah,aw]=A.size, [bh,bw]=B.size;
  if (!dim){
    if (ah>1 && bh>1 && ah===bh) dim=1;
    else if (aw>1 && bw>1 && aw===bw) dim=2;
    else throw E.MatrixError(E.InvalidDimensions);
  } else if (
    (dim===1 && (ah===1 || bh===1 || ah!==bh)) ||
    (dim===2 && (aw===1 || bw===1 || aw!==bw))
  ) throw E.MatrixError(E.InvalidDimensions);
  return sum(product(A,B),null,dim);
}

/**
 * @summary Calculate the [Kronecker tensor product](https://en.wikipedia.org/wiki/Kronecker_product) of two matrices
 * @description If the two matrices have the dimensions m x n and p x q then the returned matrix will have dimensions
 * m*p x n*q and will be a block matrix containing all possible products of the elements of two matrices.
 * @param A {Matrix}
 * @param B {Matrix}
 * @returns {Matrix}
 * @category operation
 * @example
 * const A = Matrix.eye(2);
 * const B = Matrix.ones(2);
 * K = Matrix.kron(A,B);
 * console.log(K.toJSON());
 * // [[ 1, 1, 0, 0 ],
 * //  [ 1, 1, 0, 0 ],
 * //  [ 0, 0, 1, 1 ],
 * //  [ 0, 0, 1, 1 ]]
 */
export function kron(A,B){
  A=from(A);
  B=from(B);
  const m2cat=[];
  for(let row of rows(A)){
    m2cat.push(hcat(...row.map(a=>B.map(b=>a*b))));
  }
  return vcat(...m2cat);
}
