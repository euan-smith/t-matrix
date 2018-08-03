exports.Matrix= class Matrix{
  /**
   *
   * @param rows Number the row count
   * @param cols Number the column count
   * @param [data] Array|TypedArray|Float64Array|Buffer initial matrix data or, if a buffer, the data source to use
   * @param [span] Number the offset between columns of data.  Ignored if data is not defined.
   * @param [offset] Number the offset to the start of the data to use.  Ignored if data is not defined
   * @example Initialise a new zero-filled 4x4 matrix
   * new Matrix(4,4)
   * @example Initialise a new matrix with supplied content
   * new Matrix(2,2,[1,2,4,3]);
   * @example Get a 2x2 array which references into the data of a 4x4 array
   * let a1=new Matrix(4,4);
   * let a2=new Matrix(2,2,a1._data.buffer,4,2);
   */
  constructor(rows,cols,data,span,offset){
    let skip;
    let _data;
    if(data){
      if (!span){
        span=rows; skip=0;
      } else skip=span-rows;
      if (!offset)offset=0;
      if (data instanceof ArrayBuffer){
        if (data.byteLength<(span*cols+offset-skip)*8)throw new TypeError('data length insufficient for matrix size');
        _data = new Float64Array(data, offset*8);
      } else {
        if (data.length<span*cols+offset-skip) throw new TypeError('data length insufficient for matrix size');
        if (offset) data = data.slice(offset);
        _data = new Float64Array(data);
      }
    } else {
      span = rows;
      skip = 0;
      _data = new Float64Array(rows*cols);
    }
    Object.defineProperties(this,{
      rows:{value:rows, enumerable:true},
      cols:{value:cols, enumerable:true},
      _span:{value:span},
      _skip:{value:skip},
      _data:{value:_data}
    });
  }
  get(r,c){
    return this._data[r+c*this._span];
  }
  set(r,c,v){
    this._data[r+c*this._span]=v;
    return this;
  }
  map(fn){
    return this.clone().setEach(fn);
  }
  setEach(fn){
    for(let i=0,c=0;c<this.cols;c++,i+=this._skip)
      for(let r=0;r<this.rows;r++,i++)
        this._data[i]=fn(this._data[i],r,c,i);
    return this;
  }
  forEach(fn){
    for(let i=0,c=0;c<this.cols;c++,i+=this._skip)
      for(let r=0;r<this.rows;r++,i++)
        fn(this._data[i],r,c,i);
    return this;
  }
  toArray(){
    if (!this._skip){
      return this._data.slice(this.offset,this.offset+this.rows*this.cols);
    }
    const rtn=new Float64Array(this.rows*this.cols);
    for (let i=this.offset,j=0,c=0;c<this.cols;i+=this._span,j+=this.rows,c++){
      const toCopy = new Float64Array(this._data.buffer,i*8,this.rows);
      rtn.set(toCopy,j);
    }
    return rtn;
  }
  clone(){
    return new Matrix(this.rows,this.cols,this._data);
  }
  setDiag(fn){
    const step=this._span+1, lim=Math.min(this.rows,this.cols);
    for(let r=0,i=0;r<lim;r++,i+=step)
      this._data[i]=fn(this._data[i],r,i);
    return this;
  }
  transpose(){
    const rtn=new Matrix(this.cols, this.rows);
    const step=this.cols*this.rows-1;
    for(let i=0,j=0,c=0;c<this.cols; c++,i+=this._skip,j-=step)
      for(let r=0; r<this.rows; r++,i++,j+=this.cols){
      rtn._data[j]=this._data[i];
      }
    return rtn;
  }
  to2dArray(){
    const data=this.transpose()._data;
    const rtn=[];
    for(let i=0,r=0;r<this.rows;r++)
      rtn.push(data.slice(i,i+=this.cols));
    return rtn;
  }
  mult(m){
    const rtn = new Matrix(this.rows, m.cols);
    const kEl=this.rows*m.cols, iEl=this.rows*this.cols;
    for(let i=0,j=0,k=0; k<kEl;i-=this.rows,j+=m.rows)
      for(;i<this.rows;i-=iEl-1, j-=m.rows,k++)
        for(;i<iEl;i+=this.rows,j++)
          rtn._data[k]+=this._data[i]*m._data[j];
    return rtn;
  }
  scale(s){
    return this.setEach(v=>v*s);
  }
  column(c){
    return new Matrix(this.rows,1,this._data.buffer,this._span,c*this._span);
  }
  row(r){
    return new Matrix(1,this.cols,this._data.buffer,this._span,r);
  }
  subMatrix(r,c,rows,cols){
    return new Matrix(rows,cols,this._data.buffer,this._span,r+c*this._span);
  }
  fill(v){
    this._data.fill(v);
    return this;
  }
  static zeros(rows,cols){
    return new Matrix(rows,cols||rows)
  }
  static ones(rows,cols){
    return new Matrix(rows,cols||rows).fill(1);
  }
  static eye(n){
    return new Matrix(n,n).setDiag(()=>1);
  }
  static diag(a){
    return new Matrix(a.length,a.length).setDiag((v,i)=>a[i]);
  }
  static vect(a){
    return new Matrix(a.length,1,a);
  }
  static rowVect(a){
    return new Matrix(1,a.length,a);
  }
  static rand(rows,cols){
    return new Matrix(rows,cols||rows).setEach(()=>Math.random());
  }
};