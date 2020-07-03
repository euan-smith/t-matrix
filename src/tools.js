export const isNum = v => typeof v === "number" || typeof v === "boolean";
export const isArray = Array.isArray;
export const isFunction = f => typeof f === "function";

/**
 * A Specification of indices of the row or column of a matrix, or a range of array values.
 * @typeDef Range
 * @type {Array<Number|String>|Number|String}
 * @example
 * //An arbitrary sequence of indices or numbers can be expressed
 * [1,2,3] //=> expands to the same list of indices: 1,2,3
 * [-1,-2,-3] //=> -1,-2,-3
 *
 * //If specifying indices, negative numbers index from the end of an array.
 * [-1,-2,-3] //for an array of length 10, => 9,8,7
 *
 * //Ranges can be expressed with the special character ':'
 * [1,':',5] //=> 1,2,3,4,5
 *
 * //Therefore to express the full range
 * [0,':',-1] // for length 10, => 0,1,2,3,4,5,6,7,8,9
 *
 * //When used at the start of a range definition, the range start is assumed
 * [':',-1] // equivalent to [0,':',-1]
 *
 * //When used at the end of a range definition, the range end is assumed
 * [':'] // equivalent to [0,':'] and [':',-1] and [0,':',-1]
 *
 * //Ranges with a larger step can be expressed using '::'
 * [1,'::',2,5] //=> 1,3,5
 *
 * //Similar to ':' start and end limits can be implied
 * ['::',2] // equivalent to [0,'::',2,-1]
 *
 * //Negative steps can also be used
 * [5,'::',-2,1] //=> 5,3,1
 *
 * //Similarly end limits can be implied
 * ['::',-1] //=> [-1,'::',-1,0] which for length 10 => 9,8,7,6,5,4,3,2,1,0
 *
 * //However if the step size is missing, an error will be thrown
 * ['::'] //will throw an error when used
 *
 * //Many ranges can be used in one definition
 * [5,':',-1,0,':',4] //for length 10=> 5,6,7,8,9,0,1,2,3,4
 *
 * //Wherever a range definition is truncated by a second definition, end points are implied
 * [5,':',':',4] //equivalent to [5,':',-1,0,':',4]
 *
 * //The same is true of the '::' operator
 * [4,'::',-1,'::',-1,5] // for length 10=>4,3,2,1,0,9,8,7,6,5
 *
 * //Where there is only one entry, this can be expressed outside of an array
 * 4 //equivalent to [4]
 * ':' //specifies the full range
 */

function fixNum(n,lim,def){
  if (!isNum(n)) n=def;
  return n<0 && lim ? n+lim : n;
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

export function *repeat(val, count){
  for (let i=0;i<count;i++) yield val;
}

export function *zipIters(...iters){
  iters=iters.map(i=>i[Si]());
  let r=iters.map(i=>i.next());
  while(r.every(i=>!i.done)){
    yield r.map(i=>i.value);
    r=iters.map(i=>i.next());
  }
}

export function toList(o){
  return [...range([...o])];
}

export function *flatten(a){
  for (let v of a) if (v[Symbol.iterator]) yield* flatten(v); else yield v;
}