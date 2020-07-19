import {from} from "./core";
import {bin, mapMany} from "./operations";
import {zeros} from "./create";
import {Matrix} from "./core";
import {mapIter} from "./tools";
import {rows} from "./conversions";

/**
 * @summary 1D interpolation of uniformly spaced data.
 * @description
 * The first parameter, _v_, is the data to be interpolated
 * and the second parameter, _q_, indicates 0-based fractional index positions into _v_.  If _v_ is a column vector then the
 * returned matrix will be the size of _q_.  Alternatively _v_ can contain multiple columns of data in which case _q_ must be
 * a column vector and the output matrix will have the row count of _q_ and the column count of _v_.
 * @param v {Matrix}
 * @param q {Matrix}
 * @returns {Matrix}
 * @category calculation
 */
export function gridInterp1(v, q){
  v = from(v);
  const [vR, vC] = v.size;
  q = from(q);
  const [qR, qC] = q.size;
  if (qC>1 && vC>1) throw new Error('Matrix:: gridInterp1 - either the first or second parameter must be a column vector');
  const sel = bin(q, x => x >=0 && x <= vR), x = q.get(sel);
  let is, rs, fn;

  // Linear case (no other case right now)
  const i0 = x.map(Math.floor), i1 = i0.map(i=>i+1), ir = x.map(x=>x%1);
  is=[i0, i1];
  rs=[ir];
  fn=(v0, v1, r) => (1 - r) * v0 + r * v1;

  const [oC, prms] = vC > 1 ? [vC, [':']] : [qC, []];
  const rtn = zeros(qR, oC).set(Number.NaN);
  const mapParams = is.map(i => v.get(i, ...prms));
  return rtn.set(sel, ...prms, mapMany(...mapParams, ...rs, fn));
}

/**
 * @summary Calculate the cumulative sum along the rows or down the columns of a matrix.
 * @param m {Matrix}
 * @param dim {Number}
 * @returns {Matrix}
 * @category calculation
 */
export function cumsum(m, dim){
  const rtn = from(m).clone();
  const [R,C] = rtn.size;
  if (dim===2){
    for (let r=0; r<R; r++){
      let t=0;
      rtn.set(r,':',v=>t+=v);
    }
  } else {
    for (let c=0; c<C; c++){
      let t=0;
      rtn.set(':',c,v=>t+=v);
    }
  }
  return rtn;
}

