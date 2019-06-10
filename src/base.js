/**
 * The aim is to have a static method 'mixin' of Matrix
 *
 * import {Matrix, det} from 't-matrix';
 * Matrix.mixin(det);
 *
 * const m=new Matrix([1,2,3,4]);
 * m.det();
 * det(m);
 * //both will do the same thing
 *
 * Change the matrix definitions to
 * Matrix.from([1,2,3,4]) // column matrix
 * Matrix.from([[1,2,3,4]]) // row matrix
 * Matrix.from([[1,2,3,4],[5,6,7,8]]) // 2x4 matrix
 *
 * core methods:
 * get(r,c) => number
 * get([r1,r2,r3],c) => Matrix
 * get([1,':',5,-1],c)
 * get([1,'::',2,5,-1],c)
 * get([':'],c) === get(':',c)
 * get(i) => number
 * get([0,3,-1]) => Matrix (column vector)
 * get(':') => Matrix (column vector)
 *
 * set(r,c,v)
 * set([r1,r2,r3],c,v)
 * set([r1,r2,r3],c,[v1,v2,v3])
 * set([r1,r2,r3],c,matrix)
 * set([],[],array | typedArray)
 * set(':',array | matrix | typedArray);
 *
 * [Symbol.iterator] *
 *
 * pMult(m|v,inPlace),
 * transpose() / t (accessor property   mult(a, b.t)
 *
 *
 * core properties:
 * rows, cols
 * core static method:
 * from
 * diag
 * mixin
 *
 * mixins
 * map(matrix,function[,inPlace]) => matrix.map(function)
 * forEach
 * diag
 * setDiag
 * to2dArray
 * mult(...m)
 * add(...m)
 */


export const DATA=Symbol(), SPAN=Symbol(), SKIP=Symbol();

/**
 *
 * @class Matrix
 * @property rows Number the row count
 * @property cols Number the column count
 * @private [DATA] Float64Array the matrix data
 * @private [SPAN] Number the column span in the array
 * @private [SKIP] Number the entries to skip at the end of a column
 */
export class Matrix{
  /**
   *
   * @param rows Number the row count
   * @param cols Number the column count
   * @param [dataIn] Array|TypedArray|Float64Array|Buffer initial matrix data or, if a buffer, the data source to use
   * @param [span] Number the offset between columns of data.  Ignored if data is not defined.
   * @param [offset] Number the offset to the start of the data to use.  Ignored if data is not defined
   * @example Initialise a new zero-filled 4x4 matrix
   * new Matrix(4,4)
   * @example Initialise a new matrix with supplied content
   * new Matrix(2,2,[1,2,4,3]);
   * @example Get a 2x2 array which references into the data of a 4x4 array
   * let a1=new Matrix(4,4);
   * let a2=new Matrix(2,2,a1[DATA].buffer,4,2);
   */
  constructor(rows,cols,dataIn,span,offset){
    let skip;
    let data;
    if(dataIn){
      if (!span){
        span=rows; skip=0;
      } else skip=span-rows;
      if (!offset)offset=0;
      if (dataIn instanceof Matrix){
        const byteOffset = dataIn[DATA].byteOffset + offset*8;
        dataIn = dataIn[DATA].buffer;
        if (dataIn.byteLength<(span*cols-skip)*8+byteOffset)throw new TypeError('data length insufficient for matrix size');
        data = new Float64Array(dataIn, byteOffset);
      } else {
        if (dataIn.length<span*cols+offset-skip) throw new TypeError('data length insufficient for matrix size');
        if (offset) dataIn = dataIn.slice(offset);
        data = new Float64Array(dataIn);
      }
    } else {
      span = rows;
      skip = 0;
      data = new Float64Array(rows*cols);
    }
    Object.defineProperties(this,{
      rows:{value:rows, enumerable:true},
      cols:{value:cols, enumerable:true},
      [SPAN]:{value:span},
      [SKIP]:{value:skip},
      [DATA]:{value:data}
    });
  }
  get(r,c){
    return this[DATA][r+c*this[SPAN]];
  }
  set(r,c,v){
    this[DATA][r+c*this[SPAN]]=v;
    return this;
  }
  map(fn){
    return this.clone().setEach(fn);
  }
  setEach(fn){
    for(let i=0,c=0;c<this.cols;c++,i+=this[SKIP])
      for(let r=0;r<this.rows;r++,i++)
        this[DATA][i]=fn(this[DATA][i],r,c,i);
    return this;
  }
  setTo(a){
    if (a instanceof Matrix){
      a = a.toArray();
    }
    this.setEach((v,r,c,i)=>a[i]);
  }
  forEach(fn){
    for(let i=0,c=0;c<this.cols;c++,i+=this[SKIP])
      for(let r=0;r<this.rows;r++,i++)
        fn(this[DATA][i],r,c,i);
    return this;
  }
  toArray(){
    if (!this[SKIP]){
      return this[DATA].slice(0,this.rows*this.cols);
    }
    const rtn=new Float64Array(this.rows*this.cols);
    //i is the BYTE position in the source buffer, j is the INDEX position in the destination array
    //hence adding SPAN*8 to i but just rows to j
    for (let i=this[DATA].byteOffset,j=0,c=0;c<this.cols;i+=this[SPAN]*8,j+=this.rows,c++){
      const toCopy = new Float64Array(this[DATA].buffer,i,this.rows);
      rtn.set(toCopy,j);
    }
    return rtn;
  }
  clone(){
    return new Matrix(this.rows,this.cols,this.toArray());
  }
  setDiag(fn){
    const step=this[SPAN]+1, lim=Math.min(this.rows,this.cols);
    for(let r=0,i=0;r<lim;r++,i+=step)
      this[DATA][i]=fn(this[DATA][i],r,i);
    return this;
  }
  transpose(){
    const rtn=new Matrix(this.cols, this.rows);
    const step=this.cols*this.rows-1;
    for(let i=0,j=0,c=0;c<this.cols; c++,i+=this[SKIP],j-=step)
      for(let r=0; r<this.rows; r++,i++,j+=this.cols){
        rtn[DATA][j]=this[DATA][i];
      }
    return rtn;
  }
  to2dArray(){
    const data=this.transpose()[DATA];
    const rtn=[];
    for(let i=0,r=0;r<this.rows;r++)
      rtn.push(data.slice(i,i+=this.cols));
    return rtn;
  }
  mult(m){
    if (typeof m === "number") return this.clone().scale(m);
    const rtn = new Matrix(this.rows, m.cols);
    const kEl=this.rows*m.cols, iEl=this.rows*this.cols;
    for(let i=0,j=0,k=0; k<kEl;i-=this.rows,j+=m.rows)
      for(;i<this.rows;i-=iEl-1, j-=m.rows,k++)
        for(;i<iEl;i+=this.rows,j++)
          rtn[DATA][k]+=this[DATA][i]*m[DATA][j];
    return rtn;
  }
  pmult(m){
    return this.map((v,r,c)=>v*m.get(r,c));
  }
  scale(s){
    return this.setEach(v=>v*s);
  }
  neg(){
    return this.clone().setEach(v=>-v);
  }
  column(c){
    return new Matrix(this.rows,1,this,this[SPAN],c*this[SPAN]);
  }
  row(r){
    return new Matrix(1,this.cols,this,this[SPAN],r);
  }
  diag(){
    const s=Math.max(this.rows,this.cols);
    return new Matrix(1,s,this,this[SPAN]+1);
  }
  subMatrix(r=0,c=0,rEnd=0,cEnd=0){
    if (r<=0) r+=this.rows;
    if (c<=0) c+=this.cols;
    if (rEnd<=0) rEnd+=this.rows;
    if (cEnd<=0) cEnd+=this.cols;
    return new Matrix(rEnd-r,cEnd-c,this,this[SPAN],r+c*this[SPAN]);
  }
  fill(v){
    this.setEach(()=>v);
    return this;
  }
  minor(row, col){
    const rows = this.rows - 1;
    const cols = this.cols - 1;
    const rtn = new Matrix(rows, cols);
    for(let i=0, c=0, j=0; c<cols;c++) {
      if (col===c) i+=this[SPAN];
      for (let r = 0; r < rows; r++, i++, j++){
        if (row===r) i++;
        rtn[DATA][j]=this[DATA][i];
      }
      if (row===rows) i++;
    }
    return rtn;
  }
  det(){
    if (this.rows !== this.cols) return 0;
    const d=this[DATA];
    if (this.rows === 2) return d[0] * d[3] - d[1] * d[2];
    if (this.rows === 3) return d[0]*(d[4]*d[8]-d[7]*d[5]) + d[1]*(d[5]*d[6]-d[8]*d[3]) + d[2]*(d[3]*d[7]-d[6]*d[4]);
    let det = 0;
    for(let i = 1; i <= this.cols; i += 2)
      if (i < this.cols)
        det += d[i-1]*this.minor(i - 1, 0).det() - d[i]*this.minor(i, 0).det();
      else det += d[i-1]*this.minor(i - 1, 0).det();
    return det;
  }
  inv(){
    return this.ldiv(Matrix.eye(this.rows));
  }
  ldiv(m){
    const working = this.clone(), {[DATA]:wd,[SPAN]:ws,rows}=working;
    const rtn = m.clone(), {[DATA]:rd, [SPAN]:rs, cols}=rtn;
    const wels=rows*rows, rels=rows*cols;

    for (let r=0,d=0;r<rows;r++,d+=ws+1) {
      if (Math.abs(wd[d]) < 0.0000000001) {
        for (let r2 = r + 1, d2 = d + 1; r2 < this.rows; r2++, d2++) {
          if (Math.abs(wd[d2]) > 0.0000000001) {
            for (let k = 0; k < wels; k += ws) wd[k + r] += wd[k + r2];
            for (let k = 0; k < rels; k += rs) rd[k + r] += rd[k + r2];
            break;
          }
        }
      }
      const p = 1 / wd[d];
      for (let k = r; k < wels; k += ws) wd[k] *= p;
      for (let k = r; k < rels; k += rs) rd[k] *= p;

      for (let r2 = 0; r2 < rows; r2++) {
        if (r2 === r) continue;
        const q = wd[r2 + r * ws];
        for (let k = 0; k < wels; k += ws) wd[k + r2] -= q * wd[k + r];
        for (let k = 0; k < rels; k += rs) rd[k + r2] -= q * rd[k + r];
      }
    }
    return rtn;
  }
}


//curiosity, a dual pass gaussian filter,  useful when considering convolutions etc.
/**
 qFactor = 5;

 b0Coeff = 1.57825 + (2.44413 * qFactor) + (1.4281 * qFactor * qFactor) + (0.422205 * qFactor * qFactor * qFactor);
 b1Coeff = (2.44413 * qFactor) + (2.85619 * qFactor * qFactor) + (1.26661 * qFactor * qFactor * qFactor);
 b2Coeff = (-1.4281 * qFactor * qFactor) + (-1.26661 * qFactor * qFactor * qFactor);
 b3Coeff = 0.422205 * qFactor * qFactor * qFactor;

 normalizationCoeff = 1 - ((b1Coeff + b2Coeff + b3Coeff) / b0Coeff);

 vDenCoeff = [b0Coeff, -b1Coeff, -b2Coeff, -b3Coeff] / b0Coeff;


 vXSignal = zeros(61, 1);
 vXSignal(31) = 10;

 vYSignal = filter(normalizationCoeff, vDenCoeff, vXSignal);
 vYSignal = filter(normalizationCoeff, vDenCoeff, vYSignal(end:-1:1));
 **/