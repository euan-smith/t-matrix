//1 - standard class
// import {Matrix} from './src/matrix';
//
// const m = new Matrix(2,2,[1,2,3,4]);
//
// const inv = m.ldiv(Matrix.eye(2));
//
// console.log(inv.to2dArray());

//2 - all namespaced
// import * as Matrix from './src/matrix';
//
// const m=Matrix.fromArray(2,2,[1,2,3,4]);
//
// const inv = Matrix.ldiv(m,Matrix.eye(2));
//
// console.log(Matrix.to2dArray(inv));
//3 - mixture
import * as Matrix from './src/matrix';

Matrix.zeros(h,w=h)
Matrix.ones(h,w=h)
Matrix.rand(h,w=h)
Matrix.eye(h)
Matrix.vector([1,2,3,4])
Matrix.rowVector([1,2,3,4])
Matrix.diag([1,2,3,4])
Matrix.cat(m1,m2,m3)
Matrix.rowCat(m1,m2,m3)
//from will try to make a square matrix if no row count is specified
Matrix.from([1,2,3,4])//make a 2x2
Matrix.from([1,2,3])//throw error
Matrix.from([1,2,3],1)//makes a row vector

Matrix.mult(m1,m2,m3)

m.rows
m.cols
m.get(r,c)//if r or c are negative, count from the end
m.row(r)
m.col(c)
m.sub(r,c,h,w)//if h or w are negative, count from the full width and height
m.mult(m2)
m.mult(n)
m.add(m2)
m.sub(m2)
m.div(m2)
m.ldiv(m2)
m.inv()

Matrix.LU(m).ldiv(m2)
Matrix.QR(m).ldiv(m2)
Matrix.conv(m1,m2,{options})

