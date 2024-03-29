import {grid,sum,product,bin} from "./operations.js";
import {Matrix, from} from "./core.js";
import {hcat, vcat, reshape} from "./manipulations.js";

/**
 * Creates a magic square of the specified size
 * @param size {Number} The size of the magic square. Must be 1 or an integer 3 or greater.
 * @category creation
 * @returns {Matrix}
 */
export function magic(size){
  if (size===2 || size<1) throw new Error('Matrix::magic size must be one or greater and not equal to two.');
  if (!Number.isInteger(size)) throw new TypeError('Matrix:magic size must be an integer.');
  if (size%2){
    //size is odd
    const [I,J] = grid([1,':',size]);
    const A = sum(I,J,(size-3)>>1).map(v=>v%size);
    const B = sum(I,product(2,J),-2).map(v=>v%size);
    return sum(product(size,A),B,1);
  }
  if (!(size%4)){
    //size is doubly even
    const [I,J] = grid([1,':',size]);
    const M = reshape(from([1,':',size*size]),size,size);
    const K = bin(I, J, (i,j) => Math.floor((i%4)/2) === Math.floor((j%4)/2));
    M.set(K, m => size*size+1-m);
    return M;
  }
  //size is singly even
  const p=size>>1;
  const M=magic(p);
  const O=mcat([[      M     , sum(M,2*p*p)],
                [sum(M,3*p*p),  sum(M,p*p) ]]);
  let k=(size-2)>>2, j=[':',k-1,size+1-k,':'];
  O.set(':',j,O.get([p,':',':',p-1],j));
  j=[0,k];
  O.set([k,k+p],j,O.get([k+p,k],j));
  return O;
}


/**
 * @summary Concatenates a nested array of matrices - horizontally and vertically as required.
 * @description The matrices to be concatenated must be supplied as an array of arrays of matrices.  The inner arrays
 * are concatenated horizontally and the outer arrays are concatenated vertically.
 * @param array {Array<Array<Matrix>>}
 * @returns {Matrix}
 * @example
 * const m = Matrix.mcat([[Matrix.ones(2),Matrix.zeros(2)],[Matrix.zeros(2),Matrix.ones(2)]]);
 * console.log(m.toJSON()); //[[1,1,0,0],[1,1,0,0],[0,0,1,1],[0,0,1,1]]
 * @category manipulation
 */
export function mcat(array){
  return vcat(...array.map(rowArray=>hcat(...rowArray)));
}
