import {DATA, SPAN, SKIP, Matrix} from './base';

export function setDiag(matrix, fn){
  const step=matrix[SPAN]+1, lim=Math.min(matrix.rows,matrix.cols);
  for(let r=0,i=0;r<lim;r++,i+=step)
    matrix[DATA][i]=fn(matrix[DATA][i],r,i);
  return matrix;
}

export function to2dArray(){
  const data=this.transpose()[DATA];
  const rtn=[];
  for(let i=0,r=0;r<this.rows;r++)
    rtn.push(data.slice(i,i+=this.cols));
  return rtn;
}

export function det(matrix){
  if (matrix.rows !== matrix.cols) return 0;
  const d=matrix[DATA];
  if (matrix.rows === 2) return d[0] * d[3] - d[1] * d[2];
  if (matrix.rows === 3) return d[0]*(d[4]*d[8]-d[7]*d[5]) + d[1]*(d[5]*d[6]-d[8]*d[3]) + d[2]*(d[3]*d[7]-d[6]*d[4]);
  let tot = 0;
  for(let i = 1; i <= matrix.cols; i += 2)
    if (i < matrix.cols)
      tot += det(d[i-1]*matrix.minor(i - 1, 0)) - det(d[i]*matrix.minor(i, 0));
    else tot += det(d[i-1]*matrix.minor(i - 1, 0));
  return tot;
}

export function inverse(matrix){
  return matrix.ldiv(Matrix.eye(matrix.rows));
}



