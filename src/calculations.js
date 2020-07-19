import {from} from "./core";
import {bin, mapMany} from "./operations";
import {zeros} from "./create";

/**
 * @summary 1D interpolation of uniformly spaced data.
 * @description
 * The first parameter, _v_, is the data to be interpolated
 * and the second parameter, _q_, indicates 0-based fractional index positions into _v_.  If _v_ is a column vector then the
 * returned matrix will be the size of _q_.  Alternatively _v_ can contain multiple columns of data in which case _q_ must be
 * a column vector and the output matrix will have the row count of _q_ and the column count of _v_.
 * @param v {Matrix}
 * @param q {Matrix}
 * @category calculation
 */
export function gridInterp1(v, q){
  v = from(v);
  const [vR, vC] = v.size;
  q = from(q);
  const [qR, qC] = q.size;
  if (qC>1 && vC>1) throw new Error('Matrix:: gridInterp1 - either the first or second parameter must be a column vector');
  const sel = bin(q, x => x >=0 && x <= vR);
  const x = q.get(sel), i0 = x.map(Math.floor), i1 = i0.map(i=>i+1), ir = x.map(x=>x%1);
  if (qC === 1) {
    return zeros(qR, vC)
      .set(Number.NaN)
      .set(sel, ':',
        mapMany(
          v.get(i0, ':'),
          v.get(i1, ':'),
          ir,
          (v0, v1, r) => (1 - r) * v0 + r * v1)
      );
  } else {
    return zeros(qR, qC)
      .set(Number.NaN)
      .set(sel,
        mapMany(
          v.get(i0),
          v.get(i1),
          ir,
          (v0, v1, r) => (1 - r) * v0 + r * v1)
      );
  }
}

/**
 * X  V   C0   C1
 * x1 v1  v1   0
 * x2 v2
 *
 *
 * v = c0 + x.c1 + x.x.c2
 * v1 = c0 + x1.c1
 * v2 = c0 + x2.c1
 * v1 - x1.c1 = v2 - x2.c1
 * c1 = (v2-v1)/(x2-x1)
 * c0 = v1 - x1.c1
 *
 *
 */


