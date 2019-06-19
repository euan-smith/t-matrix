[![view on npm](http://img.shields.io/npm/v/example.svg)](https://www.npmjs.org/package/example)
# t-matrix

# Aims
- a small library with no dependencies
- based on linear double (float64) arrays for precision and speed
- an ES6 module - only use the methods you need.  If building with a tree-shaking bundler (e.g. rollup) then you only include what you use.
- provide what you need for most linear algebra work
- matrix construction (zeros, ones, eye, rand, diagonal, from arrays)
- operations (add, multiple, map elements)
- submatrices and transpose without copying data
- a good balance between speed and ease of use (if you need super-fast operations on large matrices you may want to look elsewhere).
- LU decomposition-based operations - inv, div, ldiv, det, solve
- provide simple means of extension

# Status
Nearing a V1 release.  Some changes from the initial version are breaking as all of the code has been rewritten.
## Roadmap
The current plan for future versions. Obviously the version numbers further out are more speculative.
- v1.0
  - Breaking from v0.x.x
    - `Matrix.from` behaves differently
    - Methods built on the base class reduced to a minimum (only include what you need)
    - All arithmetic operations separately importable.
    - A `mixin` function can be used to add methods to the class prototype.
  - Constructors: zeros, ones, eye, rand, diag
  - Core methods: get, set, t (transpose), map, clone, size
  - expressive get and set methods (Matlab/Octave-like range selection and manipulation)
  - Manipulations: reshape, diag, swapRows, swapCols, minor
  - Matrix operations: mult (matrix), div, ldiv, det, inv, trace
  - Element-wise operations (within and between matrices): product, sum, max, min
  - minimal data copying
  - dense matrices and vectors.
  - iterables: for val of matrix, for row of rows(matrix) etc.
  - composable: mixin functions to the Matrix prototype to customise your preferred usage.
- v1.1
  - logical matrices
  - logical matrix addressing
  - logical operations (gt, gte, lt, lte, eq, neq, not)
  - repmat, kron, shift
  - norm, dot, cross
- v1.2
  - conv, grad, trapz, cumsum
- v1.3
  - LU and QR decomposition
- v1.4
  - eigen, SVD
# example usage

```
import * as Matrix from 't-matrix';

//create a 4x4 square matrix
const m=Matrix.from([[1,2,3,4],[2,3,4,1],[3,4,1,2],[4,1,2,3]]);

//and a target vector
const v=Matrix.vect([2,-2,2,-2])

//then solve v = M * a by rearranging to M \ v = a
const a=Matrix.ldiv(m,v);

//the answer should be [-1,1,-1,1];
console.log([...a]);
```

# API
## Classes

<dl>
<dt><a href="#Matrix">Matrix</a></dt>
<dd><p>The core matrix class</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#isMatrix">isMatrix(m)</a> ⇒ <code>boolean</code></dt>
<dd><p>Tests if a value is an instance of a Matrix</p>
</dd>
<dt><a href="#from">from(data)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
<dd><p>Create a matrix from the supplied data.</p>
</dd>
<dt><a href="#zeroscreates a new matrix filled with zeros">zeroscreates a new matrix filled with zeros(rows, [cols])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
<dd></dd>
<dt><a href="#onescreates a new matrix filled with ones">onescreates a new matrix filled with ones(rows, [cols])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
<dd></dd>
<dt><a href="#eyecreates a new identity matrix of size n">eyecreates a new identity matrix of size n(n)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
<dd></dd>
<dt><a href="#randcreates a new matrix filled with random values [0|1)">randcreates a new matrix filled with random values [0|1)(rows, [cols])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
<dd></dd>
<dt><a href="#diag">diag(matrix, [set])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
<dd><p>gets, sets or creates diagonal matrices</p>
</dd>
<dt><a href="#sum">sum(matrices)</a> ⇒ <code><a href="#Matrix">Matrix</a></code> | <code>Number</code></dt>
<dd><p>Sum the matrix in the direction specified or sum the set of matrices.</p>
</dd>
</dl>

<a name="Matrix"></a>

## Matrix
The core matrix class

**Kind**: global class  

* [Matrix](#Matrix)
    * [.t](#Matrix+t) ⇒ [<code>Matrix</code>](#Matrix)
    * [.size](#Matrix+size) : <code>Array.&lt;Number&gt;</code>
    * [.@@Iterator()](#Matrix+@@Iterator) ⇒ <code>IterableIterator.&lt;Number&gt;</code>

<a name="Matrix+t"></a>

### matrix.t ⇒ [<code>Matrix</code>](#Matrix)
The transpose of the matrix

**Kind**: instance property of [<code>Matrix</code>](#Matrix)  
<a name="Matrix+size"></a>

### matrix.size : <code>Array.&lt;Number&gt;</code>
The matrix height and width in an array.

**Kind**: instance constant of [<code>Matrix</code>](#Matrix)  
<a name="Matrix+@@Iterator"></a>

### matrix.@@Iterator() ⇒ <code>IterableIterator.&lt;Number&gt;</code>
Iterates through the matrix data in row-major order

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
**Example**  
```js
//Calculate the 2-norm of a matrixfunction norm(matrix){  let tot=0;  for(let v of matrix) tot+=v*v;  return Math.sqrt(tot);}
```
<a name="isMatrix"></a>

## isMatrix(m) ⇒ <code>boolean</code>
Tests if a value is an instance of a Matrix

**Kind**: global function  
**Returns**: <code>boolean</code> - 'true' if `m` is an instance of Matrix, 'false' otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| m | <code>\*</code> | The value to test. |

<a name="from"></a>

## from(data) ⇒ [<code>Matrix</code>](#Matrix)
Create a matrix from the supplied data.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | [<code>Matrix</code>](#Matrix) \| <code>Array.&lt;Number&gt;</code> \| <code>Array.&lt;Array.&lt;Number&gt;&gt;</code> | If `data` is a matrix then it is just returned. An array of numbers becomes a column matrix. An array of an array of numbers becomes a row matrix. An array of arrays of numbers becomes a general matrix.  The inner arrays must all have the same length. |

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
Matrix.from([[1,2],[3,4],[5,6]]
//a 3x2 matrix [1,2; 3,4; 5,6]
```
**Example** *(A matrix is just passed through)*  
```js
const m = Matrix.from([[1,2],[3,4]]);
Matrix.from(m) === m; //true
```
<a name="zeroscreates a new matrix filled with zeros"></a>

## zeroscreates a new matrix filled with zeros(rows, [cols]) ⇒ [<code>Matrix</code>](#Matrix)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| rows | <code>number</code> | number of rows |
| [cols] | <code>number</code> | number of columns |

<a name="onescreates a new matrix filled with ones"></a>

## onescreates a new matrix filled with ones(rows, [cols]) ⇒ [<code>Matrix</code>](#Matrix)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| rows | <code>number</code> | number of rows |
| [cols] | <code>number</code> | number of columns |

<a name="eyecreates a new identity matrix of size n"></a>

## eyecreates a new identity matrix of size n(n) ⇒ [<code>Matrix</code>](#Matrix)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>number</code> | number of rows and columns |

<a name="randcreates a new matrix filled with random values [0|1)"></a>

## randcreates a new matrix filled with random values [0\|1)(rows, [cols]) ⇒ [<code>Matrix</code>](#Matrix)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| rows | <code>number</code> | number of rows |
| [cols] | <code>number</code> | number of columns |

<a name="diag"></a>

## diag(matrix, [set]) ⇒ [<code>Matrix</code>](#Matrix)
gets, sets or creates diagonal matrices

**Kind**: global function  

| Param | Type |
| --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | 
| [set] | [<code>Matrix</code>](#Matrix) \| <code>Array</code> \| <code>function</code> \| <code>Number</code> | 

**Example**  
```js
//Create a random matrixconst mRand = random(20);//Extract the diagonal of the matrix (as a column vector)const vect = diag(mRand);//Create a new matrix with the same diagonalconst mDiag = diag(vect);//Set the diagonal of the original to zerodiag(mRand,0);
```
<a name="sum"></a>

## sum(matrices) ⇒ [<code>Matrix</code>](#Matrix) \| <code>Number</code>
Sum the matrix in the direction specified or sum the set of matrices.

**Kind**: global function  

| Param | Type |
| --- | --- |
| matrices | [<code>Matrix</code>](#Matrix) \| <code>Number</code> \| <code>null</code> | 


* * *

&copy; 2019 Euan Smith