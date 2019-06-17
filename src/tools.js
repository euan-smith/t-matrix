export const isNum = v => typeof v === "number";
export const isArray = Array.isArray;
export const isFunction = f => typeof f === "function";
export function *range(def, lim){
  let state=-1, i, step;
  if (!isArray(def)) def=[def];
  for (let d of def){
    switch(state){
      case -1:
        if (d===':' || d==='::'){
          yield i=0;
        }
        state=0;
      // noinspection FallThroughInSwitchStatementJS
      case 0:
        if (d===':'){
          i+=step=1;
          state=2;
        } else if (d==='::'){
          state=1;
        } else yield i=lim?(d+lim)%lim:d;
        break;
      case 1:
        i+=step=d;
        state=2;
        break;
      case 2:
        yield* rng(i,step,lim?(d+lim)%lim:d);
        state=0;
        break;
    }
  }
  if (state === 2) {
    if (!lim) throw new Error('Invalid range specification.');
    yield* rng(i,step,lim-1);
  }
}

function *rng(i,step,end){
  if (step>0) for(;i<=end;i+=step) yield i;
  else for(;i>=end;i+=step) yield i;
}

export function *mapIter(iter,fn){
  for(let i of iter){
    yield fn(i);
  }
}

const Si=Symbol.iterator;
export function *zipIters(...iters){
  iters=iters.map(i=>i[Si]?i[Si]():i);
  let r=iters.map(i=>i.next());
  while(r.every(i=>!i.done)){
    yield r.map(i=>i.value);
    r=iters.map(i=>i.next());
  }
}