export const isNum = v => typeof v === "number";
export const isArray = Array.isArray;
export const isFunction = f => typeof f === "function";

/**
 * A Specification of indices of the row or column of a matrix. For use with `.get` or `.set`.
 * @typeDef Range
 * @type {Array<RangeItem>|RangeItem}
 * @example
 * matrix.get(1,5) //just the number specifies a single index
 * matrix.get([1],[5]) //this does exactly the same thing
 * matrix.get(':',5) //all rows of the 5th column
 * matrix.get([2,':'],[':',5]) //rows 2 to the end of columns up to column 5.
 * matrix.get([':',3,5,':'],':') //all rows up to 3 and from 5 onwards of all columns.
 * matrix.get([1,'::',2,5],['::',-1]) //rows 1,3,5 of all columns in reverse order
 */

/**
 * Either an index or one of `':'` or `'::'` to specify a range of indeces
 * @typeDef RangeItem
 * @type {Number|String}
 */

function fixNum(n,lim,def){
  if (!isNum(n)) n=def;
  if (n<0 && !lim) throw new Error('Matrix:: Invalid range specification.');
  return n<0 ? n+lim : n;
}

export function *range(def, lim){
  if (!isArray(def)) def=[def];
  for (let d of splitRange(def)){
    if (isNum(d)) yield fixNum(d,lim);
    else {
      if (d.step>0){
        let i = fixNum(d.start,lim,0);
        const e = fixNum(d.end,lim,-1);
        for (; i<=e; i+=d.step) yield i;
      } else if (d.step<0) {
        let i = fixNum(d.start,lim,-1);
        const e = fixNum(d.end,lim,0);
        for (; i>=e; i+=d.step) yield i;
      } else {
        throw new Error('Matrix:: Invalid range specification.')
      }
    }
  }
}

const EMPTY=0, NUM=1, GETSTEP=2, GETEND=3;
function *splitRange(def){
  let p=0, state=EMPTY, d, o;
  while(p<def.length){
    d=def[p];
    switch(state){
      case EMPTY:
        if (isNum(d)){
          o=d;
          state=NUM;
        } else if (d===':'){
          o={step:1};
          state=GETEND;
        } else if (d==='::'){
          o={};
          state=GETSTEP;
        }
        p++;
        break;
      case NUM:
        if (isNum(d)){
          yield o;
          o=d;
        } else if (d===':'){
          o={start:o,step:1};
          state=GETEND;
        } else if (d==='::'){
          o={start:o};
          state=GETSTEP;
        } else {
          yield o;
          state=EMPTY;
        }
        p++;
        break;
      case GETSTEP:
        if (isNum(d)){
          o.step=d;
          p++;
          state=GETEND;
        } else {
          //this WILL throw an error further up, so no need to set the state
          yield o;
        }
        break;
      case GETEND:
        if (isNum(d)){
          o.end=d;
          p++;
        }
        yield o;
        state=0;
        break;
    }
  }
  if (state!==EMPTY) yield o;
}

export function *mapIter(iter,fn){
  for(let i of iter){
    yield fn(i);
  }
}

const Si=Symbol.iterator;
export function *zipIters(...iters){
  iters=iters.map(i=>i[Si]());
  let r=iters.map(i=>i.next());
  while(r.every(i=>!i.done)){
    yield r.map(i=>i.value);
    r=iters.map(i=>i.next());
  }
}