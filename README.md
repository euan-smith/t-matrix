# t-matrix

# Aims
- a small library with no dependencies
- based on linear double (float64) arrays for precision and speed
- an ES6 module - only use the methods you need.  If building with a tree-shaking bundler (e.g. rollup) then you only include what you use.
- provide what you need for most linear algebra work
  - matrix construction (zeros, ones, eye, rand, diagonal, from arrays)
  - operations (add, multiple, map elements)
  - submatrices and transpose without copying data
  - LU decomposition-based operations - inv, div, ldiv, det, solve
  - provide simple means of extension

# Status
NOT PRODUCTION READY.  The base class is there and works.  div, ldiv, inv based on Gaussian elimination, so results are less re-usable.
Det is the dumb simple algorithm - complexity scales very very badly.

# example usage

```
import * as Matrix from 't-matrix';

//create a 4x4 square matrix
const m=Matrix.from([1,2,3,4,2,3,4,1,3,4,1,2,4,1,2,3]);

//and a target vector
const v=Matrix.vect([2,-2,2,-2])

//then solve v = M * a by rearranging to M \ v = a
const a=m.ldiv(v);

//the answer should be [-1,1,-1,1];
console.log(a.toArray());
```

# Todo
Reduce the core methods to:
* get
* set
* forEach
* setEach
* toFloatArray
* clone
* map