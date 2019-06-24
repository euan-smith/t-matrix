import {grid,sum,product} from "./operations";
import {Matrix} from "./core";
import {range,mapIter,zipIters} from "./tools";
import {mcat} from "./manipulations";

/**
 * Creates a magic square of the specified size
 * @param size {Number} The size of the magic square. Must be 1 or an integer 3 or greater.
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
    const vals = range([1,':',size*size]);
    const [I,J] = grid([1,':',size]);
    return new Matrix(size,size,mapIter(zipIters(vals,I,J),([v,i,j])=>{
      return (i%4)>>1===(j%4)>>1 ? size*size+1-v : v
    }));
  }
  //size is singly even
  const p=size>>1;
  const M=magic(p);
  const O=mcat([[      M     , sum(M,2*p*p)],
                [sum(M,3*p*p),  sum(M,p*p) ]]);
  let k=(size-2)>>2, j=[':',k-1,size+1-k,':',size-1];
  O.set(':',j,O.get([p,':',':',p-1],j));
  j=[0,k];
  O.set([k,k+p],j,O.get([k+p,k],j));
  return O;
}
