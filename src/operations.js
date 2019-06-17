import {Matrix} from "./core";
import {rows, cols} from "./conversions";
import {mapIter} from "./tools";
import {diag} from "./manipulations";

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
  };

/**
 * Sum the matrix in the direction specified.
 * @param m {Matrix}
 * @param [dir] {Number} If 1 then sum down the columns, if 2 then sum along the rows, otherwise by default sum the whole matrix.
 * @returns {Matrix|Number}
 */
export function sum(m, dir){
  return op(m, dir, sumFn)
}

export function max(m, dir){
  return op(m, dir, maxFn)
}

export function min(m, dir){
  return op(m, dir, minFn)
}

export function trace(m){
  return sum(diag(m))
}

