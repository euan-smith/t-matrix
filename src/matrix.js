// /**
//  *
//  * @class Matrix
//  * @property rows Number the row count
//  * @property cols Number the oolumn count
//  * @private _data Float64Array the matrix data
//  * @private _span Number the column span in the array
//  * @private _skip Number the entries to skip at the end of a column
//  */
// exports.Matrix= class Matrix{
//   /**
//    *
//    * @param rows Number the row count
//    * @param cols Number the column count
//    * @param [data] Array|TypedArray|Float64Array|Buffer initial matrix data or, if a buffer, the data source to use
//    * @param [span] Number the offset between columns of data.  Ignored if data is not defined.
//    * @param [offset] Number the offset to the start of the data to use.  Ignored if data is not defined
//    * @example Initialise a new zero-filled 4x4 matrix
//    * new Matrix(4,4)
//    * @example Initialise a new matrix with supplied content
//    * new Matrix(2,2,[1,2,4,3]);
//    * @example Get a 2x2 array which references into the data of a 4x4 array
//    * let a1=new Matrix(4,4);
//    * let a2=new Matrix(2,2,a1._data.buffer,4,2);
//    */
//   constructor(rows,cols,data,span,offset){
//     let skip;
//     let _data;
//     if(data){
//       if (!span){
//         span=rows; skip=0;
//       } else skip=span-rows;
//       if (!offset)offset=0;
//       if (data instanceof Matrix){
//         const byteOffset = data._data.byteOffset + offset*8;
//         data = data._data.buffer;
//         if (data.byteLength<(span*cols-skip)*8+byteOffset)throw new TypeError('data length insufficient for matrix size');
//         _data = new Float64Array(data, byteOffset);
//       } else {
//         if (data.length<span*cols+offset-skip) throw new TypeError('data length insufficient for matrix size');
//         if (offset) data = data.slice(offset);
//         _data = new Float64Array(data);
//       }
//     } else {
//       span = rows;
//       skip = 0;
//       _data = new Float64Array(rows*cols);
//     }
//     Object.defineProperties(this,{
//       rows:{value:rows, enumerable:true},
//       cols:{value:cols, enumerable:true},
//       _span:{value:span},
//       _skip:{value:skip},
//       _data:{value:_data}
//     });
//   }
//   get(r,c){
//     return this._data[r+c*this._span];
//   }
//   set(r,c,v){
//     this._data[r+c*this._span]=v;
//     return this;
//   }
//   map(fn){
//     return this.clone().setEach(fn);
//   }
//   setEach(fn){
//     for(let i=0,c=0;c<this.cols;c++,i+=this._skip)
//       for(let r=0;r<this.rows;r++,i++)
//         this._data[i]=fn(this._data[i],r,c,i);
//     return this;
//   }
//   setTo(a){
//     if (a instanceof Matrix){
//       a = a.toArray();
//     }
//     this.setEach((v,r,c,i)=>a[i]);
//   }
//   forEach(fn){
//     for(let i=0,c=0;c<this.cols;c++,i+=this._skip)
//       for(let r=0;r<this.rows;r++,i++)
//         fn(this._data[i],r,c,i);
//     return this;
//   }
//   toArray(){
//     if (!this._skip){
//       return this._data.slice(this.offset,this.offset+this.rows*this.cols);
//     }
//     const rtn=new Float64Array(this.rows*this.cols);
//     for (let i=this.offset,j=0,c=0;c<this.cols;i+=this._span,j+=this.rows,c++){
//       const toCopy = new Float64Array(this._data.buffer,i*8,this.rows);
//       rtn.set(toCopy,j);
//     }
//     return rtn;
//   }
//   clone(){
//     return new Matrix(this.rows,this.cols,this.toArray());
//   }
//   setDiag(fn){
//     const step=this._span+1, lim=Math.min(this.rows,this.cols);
//     for(let r=0,i=0;r<lim;r++,i+=step)
//       this._data[i]=fn(this._data[i],r,i);
//     return this;
//   }
//   transpose(){
//     const rtn=new Matrix(this.cols, this.rows);
//     const step=this.cols*this.rows-1;
//     for(let i=0,j=0,c=0;c<this.cols; c++,i+=this._skip,j-=step)
//       for(let r=0; r<this.rows; r++,i++,j+=this.cols){
//       rtn._data[j]=this._data[i];
//       }
//     return rtn;
//   }
//   to2dArray(){
//     const data=this.transpose()._data;
//     const rtn=[];
//     for(let i=0,r=0;r<this.rows;r++)
//       rtn.push(data.slice(i,i+=this.cols));
//     return rtn;
//   }
//   mult(m){
//     const rtn = new Matrix(this.rows, m.cols);
//     const kEl=this.rows*m.cols, iEl=this.rows*this.cols;
//     for(let i=0,j=0,k=0; k<kEl;i-=this.rows,j+=m.rows)
//       for(;i<this.rows;i-=iEl-1, j-=m.rows,k++)
//         for(;i<iEl;i+=this.rows,j++)
//           rtn._data[k]+=this._data[i]*m._data[j];
//     return rtn;
//   }
//   scale(s){
//     return this.setEach(v=>v*s);
//   }
//   times(s){
//     return this.clone().scale(s);
//   }
//   column(c){
//     return new Matrix(this.rows,1,this,this._span,c*this._span);
//   }
//   row(r){
//     return new Matrix(1,this.cols,this,this._span,r);
//   }
//   subMatrix(r,c,rows,cols){
//     return new Matrix(rows,cols,this,this._span,r+c*this._span);
//   }
//   fill(v){
//     this.setEach(()=>v);
//     return this;
//   }
//   minor(row, col){
//     const rows = this.rows - 1;
//     const cols = this.cols - 1;
//     const rtn = new Matrix(rows, cols);
//     for(let i=0, c=0, j=0; c<cols;c++) {
//       if (col===c) i+=this._span;
//       for (let r = 0; r < rows; r++, i++, j++){
//         if (row===r) i++;
//         rtn._data[j]=this._data[i];
//       }
//       if (row===rows) i++;
//     }
//     return rtn;
//   }
//   det(){
//     if (this.rows !== this.cols) return 0;
//     const d=this._data;
//     if (this.rows === 2) return d[0] * d[3] - d[1] * d[2];
//     if (this.rows === 3) return d[0]*(d[4]*d[8]-d[7]*d[5]) + d[1]*(d[5]*d[6]-d[8]*d[3]) + d[2]*(d[3]*d[7]-d[6]*d[4]);
//     let det = 0;
//     for(let i = 1; i <= this.cols; i += 2)
//       if (i < this.cols)
//         det += d[i-1]*this.minor(i - 1, 0).det() - d[i]*this.minor(i, 0).det();
//       else det += d[i-1]*this.minor(i - 1, 0).det();
//     return det;
//   }
//   inv(){
//     return this.ldiv(Matrix.eye(this.rows));
//   }
//   ldiv(m){
//     const working = this.clone(), {_data:wd,_span:ws,rows}=working;
//     const rtn = m.clone(), {_data:rd, _span:rs, cols}=rtn;
//     const wels=rows*rows, rels=rows*cols;
//
//     for (let r=0,d=0;r<rows;r++,d+=ws+1) {
//       if (Math.abs(wd[d]) < 0.0000000001) {
//         for (let r2 = r + 1, d2 = d + 1; r2 < this.rows; r2++, d2++) {
//           if (Math.abs(wd[d2]) > 0.0000000001) {
//             for (let k = 0; k < wels; k += ws) wd[k + r] += wd[k + r2];
//             for (let k = 0; k < rels; k += rs) rd[k + r] += rd[k + r2];
//             break;
//           }
//         }
//       }
//       const p = 1 / wd[d];
//       for (let k = r; k < wels; k += ws) wd[k] *= p;
//       for (let k = r; k < rels; k += rs) rd[k] *= p;
//
//       for (let r2 = 0; r2 < rows; r2++) {
//         if (r2 === r) continue;
//         const q = wd[r2 + r * ws];
//         for (let k = 0; k < wels; k += ws) wd[k + r2] -= q * wd[k + r];
//         for (let k = 0; k < rels; k += rs) rd[k + r2] -= q * rd[k + r];
//       }
//     }
//     return rtn;
//   }
//
//
//   static zeros(rows,cols){
//     return new Matrix(rows,cols||rows)
//   }
//   static ones(rows,cols){
//     return new Matrix(rows,cols||rows).fill(1);
//   }
//   static eye(n){
//     return new Matrix(n,n).setDiag(()=>1);
//   }
//   static diag(a){
//     return new Matrix(a.length,a.length).setDiag((v,i)=>a[i]);
//   }
//   static vect(a){
//     return new Matrix(a.length,1,a);
//   }
//   static rowVect(a){
//     return new Matrix(1,a.length,a);
//   }
//   static rand(rows,cols){
//     return new Matrix(rows,cols||rows).setEach(()=>Math.random());
//   }
// };

export * from './create';