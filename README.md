[![npm version](https://badge.fury.io/js/t-matrix.svg)](https://www.npmjs.org/package/t-matrix)
[![Build Status](https://travis-ci.com/zakalwe314/t-matrix.svg?branch=master)](https://travis-ci.com/github/zakalwe314/t-matrix)
[![Coverage Status](https://coveralls.io/repos/github/zakalwe314/t-matrix/badge.svg?branch=master)](https://coveralls.io/github/zakalwe314/t-matrix?branch=master)

# t-matrix
- [Installation](#installation)
- [Example Usage](#example-usage)
- [Aims](#aims)
- [Status](#status)
  - [Release Notes](#release-notes)
  - [Roadmap](#roadmap)
- [Guide](#guide)
  - [Creating Matrices](#guide-creating)
  - [Matrix Methods and Properties](#guide-matrix)
    - [Core Methods](#guide-matrix-core)
    - [Iterables](#guide-matrix-iterables)
  - [Operations on matrices](#guide-operations)
  - [Binary matrices](#guide-binary)
  - [Matrix manipulation](#guide-manipulation)
  - [Helpers and Mixins](#guide-other)
- [Tutorial - making magic squares](#tutorial)
- [API reference](#api)

# <a id="installation"></a> Installation
```
npm install t-matrix -S
```

Throughout the examples given I will use ES6 module syntax.  If you prefer CommonJS then just use `const Matrix = require('t-matrix');`
in place of the `import` statement.  If you do want to use ES6 modules then you may find it useful to try [_reify_](https://www.npmjs.com/package/reify).

# <a id="example-usage"></a> Example usage

```js
import * as Matrix from 't-matrix';

//create a 5x5 magic square matrix
const M=Matrix.magic(5);

//and a target vector (column matrix)
const v=Matrix.from([65,65,65,65,65])
//the expected sum of any row of a magic square is (n^3 + n)/2, which for n=5 is 65.

//then solve v = M * a by rearranging to M \ v = a
const a=Matrix.ldiv(M,v);

//the answer should be [1,1,1,1,1] (plus some roundoff);
console.log([...a]);
```

# <a id="aims"></a> Aims
- a small library with no dependencies
- Be a familiar as possible to those used to other tools, in particular [Matlab](https://www.mathworks.com/products/matlab.html)/[Octave](https://www.gnu.org/software/octave/)
- based on linear double (float64) arrays for precision and speed
- use row and column offset arrays so common operations, such as transpose or row/column swaps, are 'free' (no copying of data required)
- an ES6 module - only use the methods you need.  If building with a tree-shaking bundler (e.g. rollup) then you only include what you use.
- provide what you need for most linear algebra work
- matrix construction (zeros, ones, eye, rand, diagonal, from arrays)
- operations (add, multiple, map elements)
- submatrices and transpose without copying data
- a good balance between speed and ease of use (if you need super-fast operations on large matrices you may want to look elsewhere).
- LU decomposition-based operations - inv, div, ldiv, det, solve
- flexible, expressive, extendable.

# <a id="status"></a> Status
V1 now released.  Some changes from the initial 0.x versions are breaking as all of the code has been rewritten.
As of v1.0.7 most of the way through implementing 1.1 - just kron (the Kronecker tensor product) left to do.

## <a id="release-notes"></a> Release Notes
- v1.0.0
  - Refactored to the new API, fully testing implemented and passing, documentation now derived from jsdoc.
- v1.0.1 - v1.0.4
  - Entirely documentation corrections and improvements.
- v1.0.5
  - More doc typo/inconsistency corrections.
  - Added a cross product operation and testing.
  - Updated devDependencies to remove vulnerabilities.
- v1.0.6
  - Added testing and coverage badges
  - Added a dot product operation and testing
- v1.0.7
  - Binary matrices added
  - Binary matrix addressing
  - Texting and docs for binary matrices

## <a id="roadmap"></a> Roadmap
The current plan for future versions. Obviously the version numbers further out are more speculative.
- v1.0
- Breaking from v0.x.x
- `Matrix.from` behaves differently
- Methods built on the base class reduced to a minimum (only include what you need)
- All arithmetic operations separately importable.
- A `mixin` function can be used to add methods to the class prototype.
- Constructors: zeros, ones, eye, rand, diag
- Core methods: get, set, t (transpose), map, clone, size
- expressive get and set methods ([Matlab](https://www.mathworks.com/products/matlab.html)/[Octave](https://www.gnu.org/software/octave/)-like range selection and manipulation)
- Manipulations: reshape, diag, swapRows, swapCols, minor, repmat
- Matrix operations: mult (matrix), div, ldiv, det, inv, trace
- Element-wise operations (within and between matrices): product, sum, max, min
- minimal data copying
- dense matrices and vectors.
- iterables: for val of matrix, for row of rows(matrix) etc.
- composable: mixin functions to the Matrix prototype to customise your preferred usage.
- v1.1
- binary matrices
- binary matrix addressing
- kron, shift
- norm, dot, cross
- v1.2
- conv, grad, trapz, cumsum
- v1.
- LU and QR decomposition
- after v1.3
- eigen, SVD
- fft and supporting methods
- sort, unique

# <a id="guide"></a> Guide

## <a id="guide-creating"></a> Creating matrices
There is no way to create a [Matrix](#Matrix) class instance directly (using a `new` operator), instead there are a few
standard functions which can be used to create matrices.

[`zeros`](#zeros), [`ones`](#ones) and [`rand`](#rand) create matrices of arbitrary dimension initialised in different ways and all have the same general form:
```js
import {zeros,ones,rand} from 't-matrix';
const m1=zeros(3); //a 3x3 square matrix filled with zeros
const m2=ones(4,5); //a matrix with 4 rows and 5 columns filled with ones
const m3=rand([6,5]); //a matrix with 6 rows and 5 columns filled with random values in the range [0,1)
const m4=zeros(m3.size); //a matrix the same size as m3 filled with zeros.
```

[`eye`](#eye) and [`magic`](#magic) both take just one number which is the matrix size as both produce only square matrices:
```js
import {eye,magic} from 't-matrix';
const m5=eye(3); //a 3x3 identity matrix
console.log(JSON.stringify(m5));
//'[[1,0,0],[0,1,0],[0,0,1]]'
const m6=magic(4); //a 4x4 magic square
console.log(JSON.stringify(m6));
//'[[16,2,3,13],[5,11,10,8],[9,7,6,12],[4,14,15,1]]'
```

[`from`](#from) is the more general purpose function and will try and convert arrays into a matrix:
```js
import * as Matrix from 't-matrix';
const m7=Matrix.from([1,2,3]); //An array of numbers becomes a column matrix
const m8=Matrix.from([[1,2,3]]); //An array of arrays assumes row-major order, so this becomes a row matrix
const m9=Matrix.from([[1,2],[3,4]]); //and this is a 2x2 matrix.
```

[`diag`](#diag) can be used to create a diagonal matrix if provided with a single parameter which is an array or a column or row matrix:
```js
import {diag} from 't-matrix';
const m10=Matrix.diag([1,2,3,4]);//a 4x4 matrix with 1,2,3,4 on the diagonal.
```
In addition [`diag`](#diag) can als be used to get or set the diagonal elements of a matrix.  See the API help for more details.

[`grid`](#grid) creates a pair of matrices filled with row and column indices:
```js
import {grid} from 't-matrix';
const [m11,m12]=Matrix.grid(2,3);
//m11 = [[0,0,0],[1,1,1]], m12 = [[0,1,2],[0,1,2]]
```
[`grid`](#grid) the grid parameters can also be [Ranges](#Range) and in general works in a similar way to the 2D case of `ndgrid` in [matlab](https://en.wikipedia.org/wiki/Division_%28mathematics%29#Left_and_right_division) or [octave](https://octave.sourceforge.io/octave/function/ndgrid.html).

## <a id="guide-matrix"></a> Matrix methods and properties

### <a id="guide-matrix-core"></a> Core methods
The [Matrix](#Matrix) class has a few core methods and properties to provide information regarding a matrix and
examine and manipulate its values:
- [matrix.get](#Matrix+get) gets one or more values of a matrix
- [matrix.set](#Matrix+set) sets one or more values
- [matrix.size](#Matrix+size) returns a 2-element array containing the matrix height and width
- [matrix.clone](#Matrix+clone) returns a copy of the matrix
- [matrix.map](#Matrix+map) map the values of a matrix to a new matrix.

You can use the `.get` and `.set` methods to retrieve and assign single values, for example `m.get(0,1)` would get the
value in row 0, column 1, and `m.set(0,1,5)` would set that same value to the number 5.  However `.get` and `.set` become
much more useful when used with a [Range](#Range) to set the row and column indices.

The way to define a range should be (at least somewhat) familiar to those used to [Matlab](https://www.mathworks.com/products/matlab.html)/[Octave](https://www.gnu.org/software/octave/).
For example `m.set(0,':',1)` will set all the values in row 0 to 1, or `m.get([1,2],[':',4])` will return a matrix which
contains all columns up to (and including) column 4 of rows 1 and 2 (a 2x5 matrix).

An important point to note is that `.get`, when it returns a matrix, returns one which maps onto the same underlying data
array as the original matrix - any changes to either matrix will be reflected in the other.  There are many more examples
in the documentation for the [Range](#Range) data type and the [get](#Matrix+get) and [set](#Matrix+set) methods, however
a couple of basic examples:
```js
import * as Matrix from 't-matrix';
const m=Matrix.zeros(4); //a 4x4 matrix filled with zeros
m.set([1,2],':',5)  //fill the middle two rows with fives.
 .set([0,1],[1,2],eye(2)); //set the top three elements of column 2 to ones.
console.log(JSON.stringify(m.get(':',[1,2])));
//'[[1,0],[0,1],[5,5],[0,0]]'

m.set([1,2],':',m.get([2,1],':'));//swap rows 1 and 2
console.log(JSON.stringify(m));
//'[[0,1,0,0],[5,5,5,5],[5,0,1,5],[0,0,0,0]]'
```
Note on that last example that the library is aware when `set`ting a range to a `get` derived from the same data, so it
is safe to use this to (for example) swap or rotate data within a matrix.

To get or set the diagonal of a matrix see [diag](#diag).
### <a id="guide-matrix-iterables"></a> Iterables
A matrix is itself an iterable, iterating in [row-major order](https://en.wikipedia.org/wiki/Row-_and_column-major_order) over all values:
```js
import * as Matrix from 't-matrix';
let t=0;
for(let v of Matrix.magic(3)) t+=v;
console.log('Total of a 3x3 magic square = '+t);
//Total of a 3x3 magic square = 45
```
There are also helper functions, [Matrix.rows](#rows) and [Matrix.cols](#cols), to iterate over rows and columns:
```js
import * as Matrix from 't-matrix';
const tots=[];
for(let r of Matrix.rows(Matrix.magic(3))) tots.push(Matrix.sum(r));
console.log('Row sums = '+tots);
//Row sums = 15,15,15
```
These functions can be mixed-in to become methods
```js
import * as Matrix from 't-matrix';
Matrix.mixin(Matrix.cols);
const tots=[];
for(let r of Matrix.magic(3).cols()) tots.push(Matrix.sum(r));
console.log('Column sums = '+tots);
//Column sums = 15,15,15
```
## <a id="guide-operations"></a> Operations on matrices
So far there are only a small set of the basic matrix arithmetic operations.  More will follow in time.
- [Matrix.sum](#sum), [Matrix.max](#max), [Matrix.min](#min), [Matrix.product](#product) are all element-wise operations.  They can operate:
  - Over an entire matrix, returning a single value.
  - Along the rows of a matrix, returning a column matrix with a result per row.
  - Down the columns of a matrix, returning a row matrix with a result per column.
  - Over a set of matrices and/or scalars (see the API reference for more details).
- [matrix.t](#matrix+t) is the matrix transpose.
- [Matrix.mult](#mult), [Matrix.div](#div), [Matrix.ldiv](#ldiv) and [Matrix.inv](#inv).
  - `inv` is a unary operation.
  - `div` and `ldiv` are binary operations.
    - `div(a,b)` is equivalent to `a/b`.
    - `ldiv(a,b)` is equivalent to `a\b` which is equivalent to `(b'/a')'` where `'` is the transpose.
  - `mult` can take an arbitrary number of matrices and scalars and will multiply them together.  There must be at least
one matrix, and the matrix dimensions must agree with standard matrix multiplication rules.
- [Matrix.det](#det) returns the determinant of a matrix.
- [Matrix.trace](#trace) returns the trace (the sum of the diagonal) of a matrix.
## <a id="guide-binary"></a> Binary matrices
There is just on function required for binary matrices, [Matrix.bin](#bin), which acts as a creation function, a conversion
function or to map the contents of several matrices to a binary matrix.  the standard [matrix.get](#Matrix+get) and
[matrix.set](#Matrix+set) both can be used with binary matrices for indexing into and modifying matrix contents.
## <a id="guide-manipulation"></a> Matrix manipulation
Again just the most essential matrix manipulation methods have been implemented so far.  More will follow, however the flexibility
of the matrix [get](#Matrix+get) and [set](#Matrix+set) methods should allow most others to be composed.
- [Matrix.hcat](#hcat), [Matrix.vcat](#vcat) and [Matrix.mcat](#mcat) concatenate matrices in various ways
  - `hcat` and `vcat` are the expected horizontal and vertical concatentation methods
  - `mcat` is more flexible and allows composition through both horizontal and vertical concatenation.  See the function reference for more details.
  - For all of these functions the matrix dimensions must appropriately agree.
- [Matrix.reshape](#reshape) can change the dimensions of a matrix.  Row-major element order is assumed.
- [Matrix.repmat](#repmat) can repeat a matrix horizontally and vertically.
- [Matrix.minor](#minor) returns a matrix with a specified row and column removed.
- [Matrix.swapRows](#swapRows) and [Matrix.swapCols](#swapCols) does pretty much what you might expect.



## <a id="guide-other"></a> Helpers and Mixins
There are two helper generator functions, [Matrix.rows](#rows) and [Matrix.cols](#cols) which are described with the [matrix iterables](#guide-matrix-iterables).
There is also an [isMatrix](#isMatrix) function to test if an object is a valid matrix.  The potentially most useful helper function is, however, [Matrix.mixin](#mixin).

The `t-matrix` library has intentionally been designed to be tree-shaking friendly.  You can [get the banana without the gorilla holding it](http://ahadb.com/2017/03/08/gorilla-banana/).
However this means that the matrix object is quite light on methods and instead most of the functionality is wrapped up
in many functions, which can make some expressions quite cumbersome.  e.g. you want to calculate `(xA + yB)/C` and you have to
express that as `Matrix.div(Matrix.sum(Matrix.mult(A,x),Matrix.mult(B,y)),C)`. Ugh. Wouldn't it be nicer if you could
do `A.mult(x).sum(B.mult(y)).div(C)` instead?  This is where [Matrix.mixin](#mixin) comes in.

`Matrix.mixin(fn)` adds functions to the Matrix prototype so that `fn(matrix, ...params)` becomes `matrix.fn(...params)`.
`mixin` can take any number of functions as arguments.  Each function is added as a method using the name the function
was originally declared with (using `fn.name`).  Alternatively a string can be included before a function in the list of
parameters and that string will be used as the name.  As well as adding in-built methods this also allows the addition
of custom methods.

For example, to add in the arithmetic operations above, have a file which configures `t-matrix` how you want it:
```js
import {mixin, sum, mult, div, ldiv} from 't-matrix';
mixin(sum,mult,div,ldiv);
```
then from elsewhere in your code:
```js
import * as Matrix from 't-matrix';
//Solve A*x = B
const A = Matrix.magic(3);
const B = Matrix.from([15,15,15]);
const x = A.ldiv(B);
console.log(x.toJSON);
//[ [ 1 ], [ 1 ], [ 1 ] ]
```

Alternatively, to add a custom method:
```js
import * as Matrix from 't-matrix';
Matrix.mixin('sqrt',m=>m.map(Math.sqrt));
console.log(Matrix.from([[1,4,9]]).sqrt().toJSON());
//[ [ 1, 2, 3 ] ]
```

However, if all of this is too much pain, and you really don't care about tree-shaking, or are only every going to run your code in nodejs, then:
```js
import * as Matrix from 't-matrix';
Matrix.mixin(Matrix);
```
will just add every standard function which can be a method as a method.

A final word of caution however.  If what you are building 'owns' the global namespace, the mixin as much as you like.  However
if what is being built is a library, then it is recommended *not* to use the mixin function as it will modify the returned
Matrix class for *all* libraries which use it.

# <a id="tutorial"></a> Tutorial - making magic squares
## Introduction
This will follow some of the code already in the library, however it is a useful example in how to express a matrix algorithm
using this library.  The algorithms used are the same as those used in Matlab as described [here](https://www.mathworks.com/content/dam/mathworks/mathworks-dot-com/moler/exm/chapters/magic.pdf).
## Odd-order magic squares

A vectorised version of [de La Loubere's method](https://en.wikipedia.org/wiki/Siamese_method) is expressed in [Matlab](https://www.mathworks.com/products/matlab.html)/[Octave](https://www.gnu.org/software/octave/) code as:
```matlab
[I,J] = ndgrid(1:n);
A = mod(I+J+(n-3)/2,n);
B = mod(I+2*J-2,n);
M = n*A + B + 1;
```
We will need three methods here, [grid](#grid), [sum](#sum) and [product](#product) (NOTE: mult could be used instead as we are only multiplying by a scalar).
```js
import {grid, sum, product} from 't-matrix';
export function magic(n){
  //code to go here...
}
```
Calculating _I_ and _J_ looks very similar to the matlab:
```js
const [I,J] = grid([1,':',n]);
```
To get _A_ we are summing a number of terms:
```js
const A = sum(I, J, (n-3)/2);
```
however that is incomplete as we need to `mod` all the values of _A_.  This can be done using a [.map](Matrix+map):
```js
const A = sum(I, J, (n-3)/2).map(v => v%n);
```
We can similarly calculate _B_:
```js
const B = sum(I, product(2,J), -2).map(v => v%n);
```
And finally return the magic square
```js
return sum(product(n,A), B, 1);
```
So, now we have some code which deals with odd-order magic squares:
```js
import {grid, sum, product} from 't-matrix';
export function magic(n){
  if (n%2){
    const [I,J] = grid([1,':',n]);
    const A = sum(I, J, (n-3)/2).map(v => v%n);
    const B = sum(I, product(2,J), -2).map(v => v%n);
    return sum(product(n,A), B, 1);
  }
}
```
## Doubly-even-order magic squares

The matlab code for the doubly-even algorithm is:
```matlab
[I,J] = ndgrid(1:n);
M = reshape(1:n^2,n,n)';
K = floor(mod(I,4)/2) == floor(mod(J,4)/2);
M(K) = n^2+1 - M(K);
```
The _I_ and _J_ matrices are the same.  The calculation of the initial matrix _M_ is slightly different as _t-matrix_ uses row-major order whereas Matlab assumes column-major order.
All this means, however, is that we don't need the transpose:
```js
const [I,J] = grid([1,':',n]);
const M = reshape(from([1,':',n*n]),n,n);
```
The final step requires the use of binary (logical in Matlab/Octave terminology) matrices and binary addressing.
The binary matrix function [Matrix.bin](#bin) is used to create _K_ and mapping function is used in set to then modify the matrix values.
```js
import {bin} from 't-matrix'
const K = bin(I, J, (i,j) => Math.floor((i%4)/2) === Math.floor((j%4)/2));
M.set(K, m => n*n+1-m);
return M;
```
The expanded code now looks like this:
```js
import {grid, sum, product, from, bin} from 't-matrix';
export function magic(n){
  if (n%2){
    const [I,J] = grid([1,':',n]);
    const A = sum(I, J, (n-3)/2).map(v => v%n);
    const B = sum(I, product(2,J), -2).map(v => v%n);
    return sum(product(n,A), B, 1);
  } else if (n%4===0) {
    const [I,J] = grid([1,':',n]);
    const M = reshape(from([1,':',n*n]),n,n);
    const K = bin(I, J, (i,j) => Math.floor((i%4)/2) === Math.floor((j%4)/2));
    M.set(K, m => n*n+1-m);
    return M;
  }
}
```

## Singly-even-order magic squares
This is the trickiest case of the three.  In essence the method is to repeat odd-order magic squares in the four quarters
of the matrix with the addition of [0,2;3,1]*n²/4.  This gets the rows adding up correctly.  To get the columns working some swapping of values is required.
```matlab
  p = n/2;   %p is odd.
  M = oddOrderMagicSquare(p);
  M = [M M+2*p^2; M+3*p^2 M+p^2];
  i = (1:p)';
  k = (n-2)/4;
  j = [1:k (n-k+2):n];
  M([i; i+p],j) = M([i+p; i],j);
  i = k+1;
  j = [1 i];
  M([i; i+p],j) = M([i+p; i],j);
```
Forming the M matrix on the third line needs the introduction of another new _t-matrix_ method, [Matrix.mcat](#mcat).
This could be done using separate horizontal and vertical concatenation ([hcat](#hcat) and [vcat](#vcat)), however _mcat_
makes this job a lot simpler:
```js
const p=size>>1;
let M=magic(p);
M=mcat([[      M     , sum(M,2*p*p)],
        [sum(M,3*p*p),  sum(M,p*p) ]]);
```
We need to be careful in the matrix addressing with the next two steps as matlab uses a 1-based index, whereas _t-matrix_
(like JavaScript) is 0-based.  Note also that the [i; i+p] is just addressing the whole range.  Similarly [i+p; i] is
the whole range with a half-way circular shift.  Here the flexibility of [Range](#Range) indexing really helps:
```js
let k=(n-2)>>2, j=[':',k-1,size+1-k,':'];
M.set(':', j, M.get([p,':',':',p-1], j));
j=[0,k];
M.set([k,k+p], j, M.get([k+p,k], j));
return M;
```
The [range](#Range) expressions benefit from a little explanation. `[p,':']` provides a range from `p` to the end of the
dimension concerned (so if there were 10 rows, `[5,':']` would expand to `[5,6,7,8,9]`).  Similarly `[':',p-1]` will
range from `0` up to and including `p-1`.  When taken back-to-back the two ranges will therefore extend to the end of
the dimension and then again back from the start, so `[p,':',':',p-1]` for p=5 and a size of 10 would expand to `[5,6,7,8,9,0,1,2,3,4]`
swapping the left and right halves of a full range.

So, the final code for generating magic squares:
```js
import {grid, sum, product, from, bin, mcat, reshape} from 't-matrix';
//Valid for any integer n of 3 or greater
export function magic(n){
  if (n%2){
    const [I,J] = grid([1,':',n]);
    const A = sum(I, J, (n-3)/2).map(v => v%n);
    const B = sum(I, product(2,J), -2).map(v => v%n);
    return sum(product(n,A), B, 1);
  }
  if (n%4===0) {
    const [I,J] = grid([1,':',n]);
    const M = reshape(from([1,':',n*n]),n,n);
    const K = bin(I, J, (i,j) => Math.floor((i%4)/2) === Math.floor((j%4)/2));
    M.set(K, m => n*n+1-m);
    return M;
  }
  const p=n>>1;
  let M=magic(p);
  M=mcat([[      M     , sum(M,2*p*p)],
          [sum(M,3*p*p),  sum(M,p*p) ]]);
  let k=(n-2)>>2, j=[':',k-1,n+1-k,':',n-1];
  M.set(':', j, M.get([p,':',':',p-1], j));
  j=[0,k];
  M.set([k,k+p], j, M.get([k+p,k], j));
  return M;
}
```


# <a id="api"></a> API
## Matrix Creation

  <dl>
<dt>Matrix.<a href="#from">from(data)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Create a matrix from the supplied data.</p>
</dd>
<dt>Matrix.<a href="#zeros">zeros(rows, [cols])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>creates a new matrix filled with zeros</p>
</dd>
<dt>Matrix.<a href="#ones">ones(rows, [cols])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>creates a new matrix filled with ones</p>
</dd>
<dt>Matrix.<a href="#eye">eye(n)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>creates a new <a href="https://en.wikipedia.org/wiki/Identity_matrix">identity matrix</a> of size n</p>
</dd>
<dt>Matrix.<a href="#rand">rand(rows, [cols])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>creates a new matrix filled with random values between 0 inclusive and 1 exclusive</p>
</dd>
<dt>Matrix.<a href="#magic">magic(size)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Creates a magic square of the specified size</p>
</dd>
<dt>Matrix.<a href="#diag">diag(matrix, [set])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
          <dd><p>gets, sets or creates diagonal matrices</p>
</dd>
</dl>

## Matrix Manipulation

  <dl>
<dt>Matrix.<a href="#mcat">mcat(array)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Concatenates a nested array of matrices - horizontally and vertically as required.</p>
</dd>
<dt>Matrix.<a href="#reshape">reshape(matrix, rows, cols)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Reshape the matrix to the dimensions specified treating the matrix data in <em>row-major order</em></p>
</dd>
<dt>Matrix.<a href="#swapRows">swapRows(matrix, rowsA, rowsB)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Swap the rows of a matrix.</p>
</dd>
<dt>Matrix.<a href="#swapCols">swapCols(matrix, colsA, colsB)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Swap the columns of a matrix.</p>
</dd>
<dt>Matrix.<a href="#minor">minor(matrix, row, col)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Return a matrix with the given row and column removed.</p>
</dd>
<dt>Matrix.<a href="#repmat">repmat(matrix, vRepeat, hRepeat)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Repeat the supplied matrix the specified number of times horizontally and vertically.</p>
</dd>
<dt>Matrix.<a href="#vcat">vcat(matrices)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Vertically concatenate matrices together</p>
</dd>
<dt>Matrix.<a href="#hcat">hcat(matrices)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Horizontally concatenate matrices together</p>
</dd>
<dt>Matrix.<a href="#diag">diag(matrix, [set])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
          <dd><p>gets, sets or creates diagonal matrices</p>
</dd>
</dl>

## Matrix Operations

  <dl>
<dt>Matrix.<a href="#sum">sum(...matrices)</a> ⇒ <code><a href="#Matrix">Matrix</a></code> | <code>Number</code></dt>
    <dd><p>Return the sum of the matrix in the direction specified or the element-wise sum of the set of matrices.</p>
</dd>
<dt>Matrix.<a href="#max">max(...matrices)</a> ⇒ <code><a href="#Matrix">Matrix</a></code> | <code>Number</code></dt>
    <dd><p>Return the maximum of the matrix in the direction specified or the element-wise maximum of the set of matrices.</p>
</dd>
<dt>Matrix.<a href="#min">min(...matrices)</a> ⇒ <code><a href="#Matrix">Matrix</a></code> | <code>Number</code></dt>
    <dd><p>Return the minimum of the matrix in the direction specified or the element-wise minimum of the set of matrices.</p>
</dd>
<dt>Matrix.<a href="#product">product(...matrices)</a> ⇒ <code><a href="#Matrix">Matrix</a></code> | <code>Number</code></dt>
    <dd><p>Return the product of the matrix values in the direction specified or the element-wise product of the set of matrices.</p>
</dd>
<dt>Matrix.<a href="#trace">trace(matrix)</a> ⇒ <code>Number</code></dt>
    <dd><p>Returns the trace of a matrix (the sum of the diagonal elements)</p>
</dd>
<dt>Matrix.<a href="#mapMany">mapMany(...matrices, fn)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Creates a new matrix with the results of calling a provided function on every element in the supplied set of matrices.</p>
</dd>
<dt>Matrix.<a href="#bin">bin(...matrices, [fn])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Creates a new binary matrix with the results of calling a provided function on every element in the supplied set of one or more matrices.</p>
</dd>
<dt>Matrix.<a href="#mult">mult(...matrices)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Performs matrix multiplication on a list of matrices and/or scalars</p>
</dd>
<dt>Matrix.<a href="#det">det(matrix)</a> ⇒ <code>number</code></dt>
    <dd><p>Calculate the determinant of a matrix.</p>
</dd>
<dt>Matrix.<a href="#ldiv">ldiv(A, B)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p><a href="https://en.wikipedia.org/wiki/Division_%28mathematics%29#Left_and_right_division">Left-division</a>. Solve Ax = B for x.</p>
</dd>
<dt>Matrix.<a href="#div">div(A, B)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p><a href="https://en.wikipedia.org/wiki/Division_%28mathematics%29#Left_and_right_division">Right-division</a>. Solve xB = A for x.</p>
</dd>
<dt>Matrix.<a href="#inv">inv(matrix)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Calculate the inverse of a matrix.</p>
</dd>
<dt>Matrix.<a href="#abs">abs(matrix)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Return a new matrix containing the element-wise absolute values of the source matrix.</p>
</dd>
<dt>Matrix.<a href="#grid">grid(rows, [cols])</a> ⇒ <code><a href="#Matrix">Array.&lt;Matrix&gt;</a></code></dt>
    <dd><p>Generate a regular grid in 2D space</p>
</dd>
<dt>Matrix.<a href="#cross">cross(A, B, [dim])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Calculate the cross product(s) of two vectors or sets of vectors.</p>
</dd>
<dt>Matrix.<a href="#dot">dot(A, B, [dim])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Calculate the scalar dot product(s) of two vectors or sets of vectors.</p>
</dd>
</dl>

## Other Matrix Functions

  <dl>
<dt>Matrix.<a href="#rows">rows(matrix)</a> ⇒ <code>IterableIterator.&lt;Array.Number&gt;</code></dt>
    <dd><p>Iterate over the rows.</p>
</dd>
<dt>Matrix.<a href="#cols">cols(matrix)</a> ⇒ <code>IterableIterator.&lt;Array.Number&gt;</code></dt>
    <dd><p>Iterate over the columns.</p>
</dd>
<dt>Matrix.<a href="#isMatrix">isMatrix(val)</a> ⇒ <code>boolean</code></dt>
    <dd><p>Tests if a value is an instance of a Matrix</p>
</dd>
<dt>Matrix.<a href="#isBinary">isBinary(val)</a> ⇒ <code>boolean</code></dt>
    <dd><p>Tests if a value is an instance of a binary Matrix</p>
</dd>
<dt>Matrix.<a href="#mixin">mixin(...methods)</a></dt>
    <dd><p>Add static functions of the form <code>fn(matrix,...args)</code> to the <a href="#Matrix">Matrix</a> prototype as <code>matrix.fn(args)</code></p>
</dd>
</dl>

## Classes

  <dl>
<dt><a href="#Matrix">Matrix</a></dt>
    <dd><p>The core matrix class</p>
</dd>
</dl>

## Typedefs

  <dl>
<dt><a href="#Range">Range</a> : <code>Array.&lt;(Number|String)&gt;</code> | <code>Number</code> | <code>String</code></dt>
    <dd><p>A Specification of indices of the row or column of a matrix, or a range of array values.</p>
</dd>
</dl>

<a name="Matrix"></a>

## Matrix
*The core matrix class*

<br>

* [Matrix](#Matrix)
    * [new Matrix()](#new_Matrix_new)
    * [.toJSON](#Matrix+toJSON) ⇒ <code>Array.Array.Number</code>
    * [.size](#Matrix+size) ⇒ <code>Array.&lt;Number&gt;</code>
    * [.t](#Matrix+t) ⇒ [<code>Matrix</code>](#Matrix)
    * [\[Symbol\.iterator\]()](#Matrix+[Symbol-iterator]) ⇒ <code>IterableIterator.&lt;Number&gt;</code>
    * [.get(rows, [cols])](#Matrix+get) ⇒ [<code>Matrix</code>](#Matrix) \| <code>Number</code>
    * [.set([rows], [cols], val)](#Matrix+set) ⇒ [<code>Matrix</code>](#Matrix)
    * [.clone([rows], [cols])](#Matrix+clone) ⇒ [<code>Matrix</code>](#Matrix)
    * [.map(fn)](#Matrix+map) ⇒ [<code>Matrix</code>](#Matrix)

<a name="new_Matrix_new"></a>

### new Matrix()
This class is not intended to be directly created by a user of this library, rather it is returnedby the various creation functions (such as [zeros](#zeros), [eye](#eye) or [from](#from)) and as a returned result fromvarious operation and manipulation methods and functions.

<br>
<a name="Matrix+toJSON"></a>

### matrix.toJSON ⇒ <code>Array.Array.Number</code>
Convert the matrix to an array of number arrays.

**Example**  
```js
const m=Matrix.from([0,':',5]); //will create a column vectorconsole.log(m.toJSON()); //[0,1,2,3,4,5]console.log(m.t.toJSON()); //[[0,1,2,3,4,5]]console.log(Matrix.reshape(m,2,3).toJSON()); //[[0,1,2],[3,4,5]]//enables a matrix instance to be serialised by JSON.stringifyconsole.log(JSON.stringify(m)); //"[0,1,2,3,4,5]"
```
<br>
<a name="Matrix+size"></a>

### matrix.size ⇒ <code>Array.&lt;Number&gt;</code>
The matrix height and width in an array.

**Example**  
```js
const m=Matrix.from([1,2,3]);console.log(m.size);//[3,1]
```
<br>
<a name="Matrix+t"></a>

### matrix.t ⇒ [<code>Matrix</code>](#Matrix)
The transpose of the matrix

**Example**  
```js
const m=Matrix.from([[1,2],[3,4]]);console.log(m.t.toJSON()); // [[1,3],[2,4]]
```
<br>
<a name="Matrix+[Symbol-iterator]"></a>

### matrix\[Symbol\.iterator\]() ⇒ <code>IterableIterator.&lt;Number&gt;</code>
Iterates through the matrix data in row-major order

**Example** *(Iterating the matrix values in a for..of loop)*  
```js
//Calculate the L²-norm of a matrix
function norm(matrix){
  let tot=0;
  for(let v of matrix) tot+=v*v;
  return Math.sqrt(tot);
}
```
**Example** *(Using the ES6 spread operator with a matrix)*  
```js
const m=Matrix.from([[1,2,3],[4,5,6]]);
console.log([...m]); //=> [1,2,3,4,5,6];
```
<br>
<a name="Matrix+get"></a>

### matrix.get(rows, [cols]) ⇒ [<code>Matrix</code>](#Matrix) \| <code>Number</code>
Return a value or subset of a matrix.  The matrix subset is a view into the current matrix. This means that _any_change to the returned matrix subset will also change the original matrix.  If a copy of the matrix data is desiredthen [clone](clone) should be used.


| Param | Type | Description |
| --- | --- | --- |
| rows | [<code>Matrix</code>](#Matrix) \| [<code>Range</code>](#Range) \| <code>Number</code> | Zero-based row or linear index or indices or a binary matrix |
| [cols] | [<code>Matrix</code>](#Matrix) \| [<code>Range</code>](#Range) \| <code>Number</code> | Zero-based column index or indices or a binary matrix |

**Example**  
```js
const m=Matrix.from([[1,2],[3,4]]);// Specify single indices to return a valuem.get(0,0) //1// The same indices in an array will return a matrixm.get([0],[0]) //Matrix [1]// A general [Range](#Range) can be specified.m.get(':',0) // Matrix [1;3]m.get(':',':') // The original matrix.m.get(['::',-1],':') // Return a matrix flipped vertically// Any sub-matrix returned is a view into the source matrix.const a=zeros(4), b=a.get([1,2],[1,2]);b.set(2);console.log(a.toJSON())  // [[0,0,0,0], [0,2,2,0], [0,2,2,0], [0,0,0,0]]// Binary 1D matrices can also be used to select rows or columnsconst b = Matrix.bin([1,0,1,0]);const m = Matrix.magic(4);console.log(m.get(b,b).toJSON()); // [ [ 16, 3 ], [ 9, 6 ] ]// Linear indices can also be used.  The index is in **row major order**.// A single index returns a single value.const m = Matrix.magic(4);console.log(m.get(3)); // 13,// Ranges or matrices can be used.  A column vector will always be returnedconsole.log(Matrix.magic(4).get([4,':',7]).toJSON()); // [ 5, 11, 10, 8 ]*// A binary matrix can also be used.  This is often derived from the matrix itselfconst m = Matrix.magic(4);const b = Matrix.bin(m,v=>v>12);console.log(m.get(b).toJSON()); // [ 16, 13, 14, 15 ]
```
<br>
<a name="Matrix+set"></a>

### matrix.set([rows], [cols], val) ⇒ [<code>Matrix</code>](#Matrix)
Set a value or range of values of the matrix


| Param | Type | Description |
| --- | --- | --- |
| [rows] | [<code>Range</code>](#Range) \| <code>Number</code> | Row index or indices.  zero-based |
| [cols] | [<code>Range</code>](#Range) \| <code>Number</code> | Column index or indices.  zero-based |
| val | <code>Number</code> \| [<code>Matrix</code>](#Matrix) \| <code>Array</code> \| <code>function</code> \| <code>Boolean</code> | Values to assign to the specified range or a function to modify the values |

**Example**  
```js
const m=Matrix.zeros(3);//Set a single valuem.set(1,1,5); //[0,0,0; 0,5,0; 0,0,0]//Set a range to a single valuem.set(0,':',3); //[3,3,3; 0,5,0; 0,0,0]//The value can also be a matrix of the matching size, or an array which resolves to such.m.set(2,':',[[7,8,6]]); //[3,3,3; 0,5,0; 7,8,6]//If val is an array, [from](#from) will be used to convert it to a matrix.//If no row and column indices are provided, the value will apply to the whole matrixm.set(1); //[1,1,1; 1,1,1; 1,1,1]//Linear indices can be used for single valuesm.set(4,2); //[1,1,1; 1,2,1; 1,1,1]//Or for vectors of values.  Note that the addressing is **row major order** although data must be provided in a column matrixm.set([2,':',6],Matrix.zeros(5,1)); //[1,1,0; 0,0,0; 0,1,1]//A binary matrix can also be used.Matrix.mixin(Matrix.bin);m.set(m.bin(v=>v===0), 2); //[1,1,2; 2,2,2; 2,1,1]
```
<br>
<a name="Matrix+clone"></a>

### matrix.clone([rows], [cols]) ⇒ [<code>Matrix</code>](#Matrix)
Clone the current matrix, or a subset of the current matrix if rows and columns are specified.


| Param | Type | Description |
| --- | --- | --- |
| [rows] | [<code>Range</code>](#Range) \| <code>Number</code> | If specified, the rows to clone |
| [cols] | [<code>Range</code>](#Range) \| <code>Number</code> | If specified, the columns to clone |

<br>
<a name="Matrix+map"></a>

### matrix.map(fn) ⇒ [<code>Matrix</code>](#Matrix)
Creates a new matrix with the results of calling a provided function on every element in the supplied matrix.


| Param | Type |
| --- | --- |
| fn | <code>function</code> | 

**Example**  
```js
const m=Matrix.from([0,':',5]).map(v=>Math.pow(2,v));console.log([...m]); //[1,2,4,8,16,32]
```
<br>
<a name="rows"></a>

## Matrix.rows(matrix) ⇒ <code>IterableIterator.&lt;Array.Number&gt;</code>
Iterate over the rows.


| Param | Type |
| --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | 

**Example**  
```js
//Log each matrix rowfor(let row of Matrix.rows(matrix)){  console.log(row);}
```
<br>
<a name="cols"></a>

## Matrix.cols(matrix) ⇒ <code>IterableIterator.&lt;Array.Number&gt;</code>
Iterate over the columns.


| Param | Type |
| --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | 

**Example**  
```js
//Log the range of each columnfor(let col of Matrix.cols(matrix)){  console.log(`Range [${Math.min(...col)}|${Math.max(...col)}]`);}
```
<br>
<a name="isMatrix"></a>

## Matrix.isMatrix(val) ⇒ <code>boolean</code>
Tests if a value is an instance of a Matrix

**Returns**: <code>boolean</code> - 'true' if `val` is an instance of Matrix, 'false' otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>\*</code> | The value to test. |

<br>
<a name="isBinary"></a>

## Matrix.isBinary(val) ⇒ <code>boolean</code>
Tests if a value is an instance of a binary Matrix

**Returns**: <code>boolean</code> - 'true' if `val` is an instance of a binary Matrix, 'false' otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>\*</code> | The value to test. |

<br>
<a name="mixin"></a>

## Matrix.mixin(...methods)
Add static functions of the form `fn(matrix,...args)` to the [Matrix](#Matrix) prototype as `matrix.fn(args)`


| Param | Type | Description |
| --- | --- | --- |
| ...methods | <code>function</code> \| <code>Object</code> \| <code>Array.&lt;function()&gt;</code> | The method(s) to add |

**Example** *(Adding standard functions)*  
```js
import * as Matrix from 't-matrix';
Matrix.mixin(Matrix.max, Matrix.min);
const m=Matrix.from([[1,2,3],[4,5,6]]);
console.log(m.min() + ', ' + m.max()); //=> 1, 6
```
**Example** *(Adding a custom function)*  
```js
import * as Matrix from 't-matrix';
const sqrt = matrix => matrix.map(Math.sqrt);
Matrix.mixin('sqrt',sqrt);
const m=Matrix.from([1,4,9]);
console.log([...m.sqrt()]); //=> [1,2,3]
```
**Example** *(Using a config file for the Matrix class)*  
```js
// inside 'matrix-setup.js'
import {mixin, reshape} from 't-matrix';
const neg = matrix => matrix.map(v=>-v);
mixin(reshape,'neg',neg);

// inside other modules
import * as Matrix from 't-matrix';
console.log(Matrix.from([1,':',9]).reshape(3,3).neg().toJSON());//[[-1,-2,-3],[-4,-5,-6],[-7,-8,-9]]
```
**Example** *(Just include everything which can be included)*  
```js
import * as Matrix from 't-matrix';
Matrix.mixin(Matrix);
console.log(Matrix.from([1,':',9]).reshape(3,3).mult(2).toJSON());//[[2,4,6],[8,10,12],[14,16,18]]
```
<br>
<a name="Range"></a>

## Range : <code>Array.&lt;(Number\|String)&gt;</code> \| <code>Number</code> \| <code>String</code>
A Specification of indices of the row or column of a matrix, or a range of array values.

**Example**  
```js
//An arbitrary sequence of indices or numbers can be expressed[1,2,3] //=> expands to the same list of indices: 1,2,3[-1,-2,-3] //=> -1,-2,-3//If specifying indices, negative numbers index from the end of an array.[-1,-2,-3] //for an array of length 10, => 9,8,7//Ranges can be expressed with the special character ':'[1,':',5] //=> 1,2,3,4,5//Therefore to express the full range[0,':',-1] // for length 10, => 0,1,2,3,4,5,6,7,8,9//When used at the start of a range definition, the range start is assumed[':',-1] // equivalent to [0,':',-1]//When used at the end of a range definition, the range end is assumed[':'] // equivalent to [0,':'] and [':',-1] and [0,':',-1]//Ranges with a larger step can be expressed using '::'[1,'::',2,5] //=> 1,3,5//Similar to ':' start and end limits can be implied['::',2] // equivalent to [0,'::',2,-1]//Negative steps can also be used[5,'::',-2,1] //=> 5,3,1//Similarly end limits can be implied['::',-1] //=> [-1,'::',-1,0] which for length 10 => 9,8,7,6,5,4,3,2,1,0//However if the step size is missing, an error will be thrown['::'] //will throw an error when used//Many ranges can be used in one definition[5,':',-1,0,':',4] //for length 10=> 5,6,7,8,9,0,1,2,3,4//Wherever a range definition is truncated by a second definition, end points are implied[5,':',':',4] //equivalent to [5,':',-1,0,':',4]//The same is true of the '::' operator[4,'::',-1,'::',-1,5] // for length 10=>4,3,2,1,0,9,8,7,6,5//Where there is only one entry, this can be expressed outside of an array4 //equivalent to [4]':' //specifies the full range
```
<br>
<a name="from"></a>

## Matrix.from(data) ⇒ [<code>Matrix</code>](#Matrix)
Create a matrix from the supplied data.

**Category**: creation  

| Param | Type | Description |
| --- | --- | --- |
| data | [<code>Matrix</code>](#Matrix) \| <code>Array.Number</code> \| <code>Array.Array.Number</code> | If `data` is a matrix then it is just returned. An array of numbers becomes a column matrix. An array of an array of numbers becomes a row matrix. An array of arrays of numbers becomes a general matrix.  The inner arrays must all have the same length. |

**Example** *(Creating a column matrix)*  
```js
Matrix.from([1,2,3,4])
//[1; 2; 3; 4]
```
**Example** *(Creating a row matrix)*  
```js
Matrix.from([[1,2,3,4]])
//[1,2,3,4]
```
**Example** *(Creating an arbitrary matrix)*  
```js
Matrix.from([[1,2],[3,4],[5,6]]);
//a 3x2 matrix [1,2; 3,4; 5,6]
```
**Example** *(A matrix is just passed through)*  
```js
const m = Matrix.from([[1,2],[3,4]]);
check = Matrix.from(m) === m; //true
```
<br>
<a name="zeros"></a>

## Matrix.zeros(rows, [cols]) ⇒ [<code>Matrix</code>](#Matrix)
creates a new matrix filled with zeros

**Category**: creation  

| Param | Type | Description |
| --- | --- | --- |
| rows | <code>number</code> | number of rows |
| [cols] | <code>number</code> | number of columns |

<br>
<a name="ones"></a>

## Matrix.ones(rows, [cols]) ⇒ [<code>Matrix</code>](#Matrix)
creates a new matrix filled with ones

**Category**: creation  

| Param | Type | Description |
| --- | --- | --- |
| rows | <code>number</code> | number of rows |
| [cols] | <code>number</code> | number of columns |

<br>
<a name="eye"></a>

## Matrix.eye(n) ⇒ [<code>Matrix</code>](#Matrix)
creates a new [identity matrix](https://en.wikipedia.org/wiki/Identity_matrix) of size n

**Category**: creation  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>number</code> | number of rows and columns |

<br>
<a name="rand"></a>

## Matrix.rand(rows, [cols]) ⇒ [<code>Matrix</code>](#Matrix)
creates a new matrix filled with random values between 0 inclusive and 1 exclusive

**Category**: creation  

| Param | Type | Description |
| --- | --- | --- |
| rows | <code>number</code> | number of rows |
| [cols] | <code>number</code> | number of columns |

<br>
<a name="magic"></a>

## Matrix.magic(size) ⇒ [<code>Matrix</code>](#Matrix)
Creates a magic square of the specified size

**Category**: creation  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>Number</code> | The size of the magic square. Must be 1 or an integer 3 or greater. |

<br>
<a name="diag"></a>

## Matrix.diag(matrix, [set]) ⇒ [<code>Matrix</code>](#Matrix)
gets, sets or creates diagonal matrices

**Category**: creationAndManipulation  

| Param | Type |
| --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) \| <code>Array</code> | 
| [set] | [<code>Matrix</code>](#Matrix) \| <code>Array</code> \| <code>function</code> \| <code>Number</code> | 

**Example** *(Extract the diagonal elements from a matrix)*  
```js
import * as Matrix from 't-matrix';
//Create a magic square
const mag = Matrix.magic(3);
//Get the sum of the diagonal elements - should add up to 15 for a 3x3 magic square
console.log(Matrix.sum(Matrix.diag(mag))); //15
```
**Example** *(Set the diagonal elements of a matrix)*  
```js
import * as Matrix from 't-matrix';
Matrix.mixin(Matrix); //just add everything in for ease
//Create a new matrix with a diagonal 1,2,3,4
const mDiag = Matrix.zeros(4).diag([1,2,3,4]);
console.log(mDiag.toJSON());//[[1,0,0,0],[0,2,0,0],[0,0,3,0],[0,0,0,4]]
//Create it using the diag call directly
console.log(Matrix.diag([1,2,3,4]).toJSON());//returns the same as above
```
<br>
<a name="mcat"></a>

## Matrix.mcat(array) ⇒ [<code>Matrix</code>](#Matrix)
*Concatenates a nested array of matrices - horizontally and vertically as required.*

The matrices to be concatenated must be supplied as an array of arrays of matrices.  The inner arraysare concatenated horizontally and the outer arrays are concatenated vertically.

**Category**: manipulation  

| Param | Type |
| --- | --- |
| array | <code>Array.&lt;Array.&lt;Matrix&gt;&gt;</code> | 

**Example**  
```js
const m = Matrix.mcat([[Matrix.ones(2),Matrix.zeros(2)],[Matrix.zeros(2),Matrix.ones(2)]]);console.log(m.toJSON()); //[[1,1,0,0],[1,1,0,0],[0,0,1,1],[0,0,1,1]]
```
<br>
<a name="reshape"></a>

## Matrix.reshape(matrix, rows, cols) ⇒ [<code>Matrix</code>](#Matrix)
Reshape the matrix to the dimensions specified treating the matrix data in *row-major order*

**Category**: manipulation  

| Param | Type | Description |
| --- | --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | The matrix to reshape. |
| rows | <code>Number</code> | The row count for the new matrix. |
| cols | <code>Number</code> | The column count for the new matrix. |

**Example**  
```js
const m=Matrix.from([1,':',9]);const m2=Matrix.reshape(m,3,3);console.log(m2.toJSON()); //[[1,2,3],[4,5,6],[7,8,9]]//If reshape is used a lot to form new matrices, consider adding it to the matrix prototype with mixinMatrix.mixin(Matrix.reshape);console.log(Matrix.from([1,':',4]).reshape(2,2).toJSON()); // [[1,2],[3,4]]
```
<br>
<a name="swapRows"></a>

## Matrix.swapRows(matrix, rowsA, rowsB) ⇒ [<code>Matrix</code>](#Matrix)
*Swap the rows of a matrix.*

No data is actually copied here, so this is a very efficient operation.Two lists of indices are supplied, and these can both be [Range](#Range) types.  The pairs of rows from rowsA and rowsBare then swapped in order from the start of each list.  If more indices are specified in one list than the other thenthese additional indices are ignored.This function can be added to the Matrix prototype as a method using Matrix.[mixin](#mixin), it returns the matrix object for chaining.

**Category**: manipulation  

| Param | Type | Description |
| --- | --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) |  |
| rowsA | [<code>Range</code>](#Range) \| <code>Number</code> | The first list of rows to swap |
| rowsB | [<code>Range</code>](#Range) \| <code>Number</code> | The second list of rows to swap, must be the same length as rowsA |

<br>
<a name="swapCols"></a>

## Matrix.swapCols(matrix, colsA, colsB) ⇒ [<code>Matrix</code>](#Matrix)
*Swap the columns of a matrix.*

No data is actually copied here, so this is a very efficient operation.Two lists of indices are supplied, and these can both be [Range](#Range) types.  The pairs of columns from colsA and colsBare then swapped in order from the start of each list.  If more indices are specified in one list than the other thenthese additional indices are ignored.This function can be added to the Matrix prototype as a method using Matrix.[mixin](#mixin), it returns the matrix object for chaining.

**Category**: manipulation  

| Param | Type | Description |
| --- | --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) |  |
| colsA | [<code>Range</code>](#Range) \| <code>Number</code> | The first list of columns to swap |
| colsB | [<code>Range</code>](#Range) \| <code>Number</code> | The second list of columns to swap, must be the same length as rowsA |

<br>
<a name="minor"></a>

## Matrix.minor(matrix, row, col) ⇒ [<code>Matrix</code>](#Matrix)
*Return a matrix with the given row and column removed.*

The minor of a matrix is the matrix with the specified row and column removed.  The matrix returned by this functionis a new matrix, but references the same data.  No data is copied so this is a fast operation.

**Category**: manipulation  

| Param | Type |
| --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | 
| row | <code>Number</code> | 
| col | <code>Number</code> | 

<br>
<a name="repmat"></a>

## Matrix.repmat(matrix, vRepeat, hRepeat) ⇒ [<code>Matrix</code>](#Matrix)
Repeat the supplied matrix the specified number of times horizontally and vertically.

**Category**: manipulation  

| Param | Type |
| --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | 
| vRepeat | <code>Number</code> | 
| hRepeat | <code>Number</code> | 

<br>
<a name="vcat"></a>

## Matrix.vcat(matrices) ⇒ [<code>Matrix</code>](#Matrix)
Vertically concatenate matrices together

**Category**: manipulation  

| Param | Type |
| --- | --- |
| matrices | [<code>Matrix</code>](#Matrix) | 

<br>
<a name="hcat"></a>

## Matrix.hcat(matrices) ⇒ [<code>Matrix</code>](#Matrix)
Horizontally concatenate matrices together

**Category**: manipulation  

| Param | Type |
| --- | --- |
| matrices | [<code>Matrix</code>](#Matrix) | 

<br>
<a name="sum"></a>

## Matrix.sum(...matrices) ⇒ [<code>Matrix</code>](#Matrix) \| <code>Number</code>
*Return the sum of the matrix in the direction specified or the element-wise sum of the set of matrices.*

`Matrix.sum(m)` or `m.sum()` will sum all the values of a matrix, returning a number.`Matrix.sum(m,null,1)` or `m.sum(null,1)` will sum the matrix columns, returning a row matrix.`Matrix.sum(m,null,2)` or `m.sum(null,2)` will sum the matrix rows, returning a column matrix.`Matrix.sum(m1,m2,m3,...)` or `m1.sum(m2,m3,...)` will calculate an element-wise sum over all the matrices.For the last case, the supplied list of matrices must either have the same row count or a row count of 1, and thesame column count or a column count of 1.  This includes scalar values which implicitly are treated as 1x1 matrices.Arrays can also be provided and these will be converted to matrices using Matrix.[from](#from).  Row matrices will beadded to every row, column matrices to every column and scalar values to every matrix element.

**Category**: operation  

| Param | Type |
| --- | --- |
| ...matrices | [<code>Matrix</code>](#Matrix) \| <code>Number</code> | 

**Example**  
```js
import * as Matrix from 't-matrix';Matrix.mixin(Matrix);console.log(Matrix.magic(3).sum(null,1).toJSON());//[[15,15,15]];console.log(Matrix.magic(3).sum());//45console.log(Matrix.sum([[0,1,2]], [6,3,0], 1).toJSON());//[[7,8,9],[4,5,6],[1,2,3]];
```
<br>
<a name="max"></a>

## Matrix.max(...matrices) ⇒ [<code>Matrix</code>](#Matrix) \| <code>Number</code>
*Return the maximum of the matrix in the direction specified or the element-wise maximum of the set of matrices.*

`Matrix.max(m)` or `m.max()` will return the max of all the values of a matrix.`Matrix.max(m,null,1)` or `m.max(null,1)` will return a row matrix containing max of each matrix column.`Matrix.max(m,null,2)` or `m.max(null,2)` will return a column matrix containing max of each matrix row.`Matrix.max(m1,m2,m3,...)` or `m1.max(m2,m3,...)` will calculate an element-wise max over all the matrices.For the last case, the supplied list of matrices must either have the same row count or a row count of 1, and thesame column count or a column count of 1.  This includes scalar values which implicitly are treated as 1x1 matrices.Arrays can also be provided and these will be converted to matrices using Matrix.[from](#from).  An element of thereturned matrix of a given row and column will be the max of that row and column of all regular matrices, of that row of allcolumn matrices, of that column of all row matrices and of all scalar values.

**Category**: operation  

| Param | Type |
| --- | --- |
| ...matrices | [<code>Matrix</code>](#Matrix) \| <code>Number</code> | 

**Example**  
```js
import * as Matrix from 't-matrix';Matrix.mixin(Matrix);console.log(Matrix.magic(3).max(null,1).toJSON());//[[8,9,7]];console.log(Matrix.magic(3).max());//9console.log(Matrix.max([[0,1,2]], [6,3,0], 1).toJSON());//[[6,6,6],[3,3,3],[1,1,2];
```
<br>
<a name="min"></a>

## Matrix.min(...matrices) ⇒ [<code>Matrix</code>](#Matrix) \| <code>Number</code>
*Return the minimum of the matrix in the direction specified or the element-wise minimum of the set of matrices.*

Works the same way as other similar operations.  See Matrix.[max](#max) for more details.

**Category**: operation  

| Param | Type |
| --- | --- |
| ...matrices | [<code>Matrix</code>](#Matrix) \| <code>Number</code> | 

**Example**  
```js
import * as Matrix from 't-matrix';Matrix.mixin(Matrix);console.log(Matrix.magic(3).max(null,1).toJSON());//[[3,1,2]];console.log(Matrix.magic(3).max());//1console.log(Matrix.max([[0,1,2]], [6,3,0], 1).toJSON());//[[0,1,1],[0,1,1],[0,0,0];
```
<br>
<a name="product"></a>

## Matrix.product(...matrices) ⇒ [<code>Matrix</code>](#Matrix) \| <code>Number</code>
*Return the product of the matrix values in the direction specified or the element-wise product of the set of matrices.*

Works the same way as other similar operations.  See Matrix.[sum](#sum) for more details.

**Category**: operation  

| Param | Type |
| --- | --- |
| ...matrices | [<code>Matrix</code>](#Matrix) \| <code>Number</code> | 

**Example**  
```js
import * as Matrix from 't-matrix';Matrix.mixin(Matrix);console.log(Matrix.magic(3).product(null,1).toJSON());//[[96,45,84]];console.log(Matrix.magic(3).product());//362880console.log(Matrix.product([[0,1,2]], [6,3,0], 1).toJSON());//[[0,6,12],[0,3,6],[0,0,0]];
```
<br>
<a name="trace"></a>

## Matrix.trace(matrix) ⇒ <code>Number</code>
Returns the trace of a matrix (the sum of the diagonal elements)

**Category**: operation  

| Param |
| --- |
| matrix | 

<br>
<a name="mapMany"></a>

## Matrix.mapMany(...matrices, fn) ⇒ [<code>Matrix</code>](#Matrix)
Creates a new matrix with the results of calling a provided function on every element in the supplied set of matrices.

**Category**: operation  

| Param | Type |
| --- | --- |
| ...matrices | [<code>Matrix</code>](#Matrix) \| <code>Number</code> | 
| fn | <code>function</code> | 

**Example**  
```js
//Calculate a gaussian function in 2D for a range -3:0.1:3 in x and y.import * as Matrix from 't-matrix';const [Y,X]=Matrix.grid([-3,'::',0.1,3]);const gauss=Matrix.mapMany(Y,X,(y,x)=>Math.exp(-Math.pow(x+y,2)));
```
<br>
<a name="bin"></a>

## Matrix.bin(...matrices, [fn]) ⇒ [<code>Matrix</code>](#Matrix)
Creates a new binary matrix with the results of calling a provided function on every element in the supplied set of one or more matrices.

**Category**: operation  

| Param | Type | Description |
| --- | --- | --- |
| ...matrices | [<code>Matrix</code>](#Matrix) \| <code>Number</code> |  |
| [fn] | <code>function</code> | Optional for the special case of a single parameter, mandatory otherwise |

**Example**  
```js
//Sum only the values of a matrix above a thresholdimport * as Matrix from 't-matrix';const m = Matrix.magic(10);const selection = Matrix.bin(m, v=>v>0.5);const sum = Matrix.sum(m.get(selection));//If using bin a lot, consider mixing it inMatrix.mixin(Matrix.bin);console.log('count of non-zero values of m:',Matrix.sum(m.bin()));
```
<br>
<a name="mult"></a>

## Matrix.mult(...matrices) ⇒ [<code>Matrix</code>](#Matrix)
Performs matrix multiplication on a list of matrices and/or scalars

**Category**: operation  

| Param | Type | Description |
| --- | --- | --- |
| ...matrices | [<code>Matrix</code>](#Matrix) \| <code>Number</code> | At least one parameter must be a matrix or convertible to a matrix through Matrix.[from](#from) |

**Example**  
```js
import * as Matrix from 't-matrix';const mag = Matrix.magic(3);console.log(Matrix.mult(mag,Matrix.inv(mag)).toJSON());//a 3x3 identity matrix (plus some round-off error)
```
<br>
<a name="det"></a>

## Matrix.det(matrix) ⇒ <code>number</code>
*Calculate the determinant of a matrix.*

The determinant is calculated by the standard naive algorithm which**scales really really badly** (the algorithm is O(n!)).  Once LU decomposition has been added to thelibrary then that will provide an O(n^3) method which is **much** faster.

**Category**: operation  

| Param | Type |
| --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | 

<br>
<a name="ldiv"></a>

## Matrix.ldiv(A, B) ⇒ [<code>Matrix</code>](#Matrix)
*[Left-division](https://en.wikipedia.org/wiki/Division_%28mathematics%29#Left_and_right_division). Solve Ax = B for x.*

Solve the system of linear equations Ax = B for x.  In [Matlab](https://www.mathworks.com/products/matlab.html)/[Octave](https://www.gnu.org/software/octave/)this can be expressed as `A\B`.  Equivalent to using [Matrix.div](#div) where `Matrix.ldiv(A,B)` gives the same answer as `Matrix.div(B.t,A.t).t`.

**Category**: operation  

| Param | Type |
| --- | --- |
| A | [<code>Matrix</code>](#Matrix) | 
| B | [<code>Matrix</code>](#Matrix) | 

<br>
<a name="div"></a>

## Matrix.div(A, B) ⇒ [<code>Matrix</code>](#Matrix)
*[Right-division](https://en.wikipedia.org/wiki/Division_%28mathematics%29#Left_and_right_division). Solve xB = A for x.*

Solve the system of linear equations xB = A for x.  In [Matlab](https://www.mathworks.com/products/matlab.html)/[Octave](https://www.gnu.org/software/octave/)this can be expressed as `A/B`.  Equivalent to using [Matrix.div](#ldiv) where `Matrix.div(A,B)` gives the same answer as `Matrix.ldiv(B.t,A.t).t`.

**Category**: operation  

| Param | Type |
| --- | --- |
| A | [<code>Matrix</code>](#Matrix) | 
| B | [<code>Matrix</code>](#Matrix) | 

<br>
<a name="inv"></a>

## Matrix.inv(matrix) ⇒ [<code>Matrix</code>](#Matrix)
*Calculate the inverse of a matrix.*

Uses the [ldiv](#ldiv) operation to calculate the inverse.  NOTE: it is *really not good practice* touse a matrix inverse, instead consider using [div](#div) or [ldiv](#ldiv) directly. For a more thorough exposition onthis see, for example, ["Don't invert that matrix"](https://www.johndcook.com/blog/2010/01/19/dont-invert-that-matrix/)

**Category**: operation  

| Param | Type |
| --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | 

<br>
<a name="abs"></a>

## Matrix.abs(matrix) ⇒ [<code>Matrix</code>](#Matrix)
Return a new matrix containing the element-wise absolute values of the source matrix.

**Category**: operation  

| Param | Type |
| --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | 

<br>
<a name="grid"></a>

## Matrix.grid(rows, [cols]) ⇒ [<code>Array.&lt;Matrix&gt;</code>](#Matrix)
*Generate a regular grid in 2D space*

This is equivalent to the [Matlab](https://www.mathworks.com/products/matlab.html)/[Octave](https://www.gnu.org/software/octave/) function [ndgrid](https://octave.sourceforge.io/octave/function/ndgrid.html) for the 2d case.Once the _rows_ and _cols_ parameters are expanded to arrays, the first returned matrix contains the _rows_ array as a column matrix repeated to match the size of the _cols_ array.Similarly the second returned matrix is the _cols_ array as a row matrix repeated to match the size of the _rows_ array.

**Category**: operation  

| Param | Type | Description |
| --- | --- | --- |
| rows | [<code>Range</code>](#Range) \| <code>Number</code> | If a number *n* this is converted to a range 0:n-1, otherwise a range is expected. |
| [cols] | [<code>Range</code>](#Range) \| <code>Number</code> | If a number *n* this is converted to a range 0:n-1, otherwise a range is expected. |

<br>
<a name="cross"></a>

## Matrix.cross(A, B, [dim]) ⇒ [<code>Matrix</code>](#Matrix)
*Calculate the cross product(s) of two vectors or sets of vectors.*

Both matrices must contain either 1 or N 3-element row vectors or column vectors.  The orientation of the vectorsmust be consistent between the two matrices, and the returned matrix will use the same orientation.  If both containa single vector, the cross product of those vectors will be returned.  If both contain N vectors, then the returnedmatrix will contain the N cross products of each vector pair.  If one matrix has 1 vector and the other N then thereturned matrix will be the N cross products of the single vector with each of N vectors from the other matrix.

**Category**: operation  

| Param | Type |
| --- | --- |
| A | [<code>Matrix</code>](#Matrix) | 
| B | [<code>Matrix</code>](#Matrix) | 
| [dim] | <code>Number</code> | 

**Example**  
```js
import * as Matrix from 't-matrix';console.log([...Matrix.cross([1,0,0],[0,1,0])]); // should be [0,0,1]
```
<br>
<a name="dot"></a>

## Matrix.dot(A, B, [dim]) ⇒ [<code>Matrix</code>](#Matrix)
*Calculate the scalar dot product(s) of two vectors or sets of vectors.*

Both matrices must contain either 1 or N row vectors or column vectors of equal length.  The orientation of the vectorsmust be consistent between the two matrices, and the returned matrix will use the same orientation.  If both containa single vector, the dot product of those vectors will be returned as a scalar value.  If both contain N vectors, then the returnedmatrix will contain the N dot products of each vector pair.  If one matrix has 1 vector and the other N then thereturned matrix will be the N dot products of the single vector with each of N vectors from the other matrix.

**Category**: operation  

| Param | Type |
| --- | --- |
| A | [<code>Matrix</code>](#Matrix) | 
| B | [<code>Matrix</code>](#Matrix) | 
| [dim] | <code>Number</code> | 

<br>
* * *

&copy; 2019, 2020 Euan Smith.
API documentation generated with the help of [jsdoc2md](https://github.com/jsdoc2md/jsdoc-to-markdown).
