import {grid,sum,product} from "./operations";
import {Matrix} from "./core";
import {range,mapIter,zipIters} from "./tools";
import {zeros} from "./create";

export function magic(n){
  if (n%2){
    //n is odd
    const [I,J] = grid([1,':',n]);
    const A = sum(I,J,(n-3)>>1).map(v=>v%n);
    const B = sum(I,product(2,J),-2).map(v=>v%n);
    return sum(product(n,A),B,1);
  }
  if (!(n%4)){
    //n is doubly even
    const vals = range([1,':',n*n]);
    const [I,J] = grid([1,':',n]);
    return new Matrix(n,n,mapIter(zipIters(vals,I,J),([v,i,j])=>{
      return (i%4)>>1===(j%4)>>1 ? n*n+1-v : v
    }));
  }
  //n is singly even
  const p=n>>1;
  const M=magic(p);
  const O=zeros(n,n);
  O.set([0,':',p-1],[0,':',p-1],M);
  O.set([p,':',2*p-1],[0,':',p-1],sum(M,3*p*p));
  O.set([0,':',p-1],[p,':',2*p-1],sum(M,2*p*p));
  O.set([p,':',2*p-1],[p,':',2*p-1],sum(M,p*p));
  if (n===2) return O;
  let k=(n-2)>>2, j=[':',k-1,n+1-k,':',n-1];
  O.set(':',j,O.get([p,':',':',p-1],j).clone());
  j=[0,k];
  O.set([k,k+p],j,O.get([k+p,k],j).clone());
  return O;
}
