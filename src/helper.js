import {DATA, SPAN, SKIP, Matrix} from './base';

export function toFloatArray(matrix){
  if (!matrix[SKIP]){
    return matrix[DATA].slice(matrix.offset,matrix.offset+matrix.rows*matrix.cols);
  }
  const rtn=new Float64Array(matrix.rows*matrix.cols);
  for (let i=matrix.offset,j=0,c=0;c<matrix.cols;i+=matrix[SPAN],j+=matrix.rows,c++){
    const toCopy = new Float64Array(matrix[DATA].buffer,i*8,matrix.rows);
    rtn.set(toCopy,j);
  }
  return rtn;
}

export function clone(matrix){
  return new Matrix(matrix.rows, matrix.cols, toFloatArray(matrix));
}

