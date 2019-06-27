[![view on npm](http://img.shields.io/npm/v/example.svg)](https://www.npmjs.org/package/example)
# t-matrix

# Aims
- a small library with no dependencies
- based on linear double (float64) arrays for precision and speed
- use row and column offset arrays so common operations, such as transpose or row/column swaps, are 'free' (no copying of data required)
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
  - Manipulations: reshape, diag, swapRows, swapCols, minor, repmat
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
  - kron, shift
  - norm, dot, cross
- v1.2
  - conv, grad, trapz, cumsum
- v1.3
  - LU and QR decomposition
- after v1.3
  - eigen, SVD
  - fft and supporting methods
  - sort, unique
# example usage

```
import * as Matrix from 't-matrix';

//create a 4x4 square matrix
const m=Matrix.from([[1,2,3,4],[2,3,4,1],[3,4,1,2],[4,1,2,3]]);

//and a target vector (column matrix)
const v=Matrix.vect([2,-2,2,-2])

//then solve v = M * a by rearranging to M \ v = a
const a=Matrix.ldiv(m,v);

//the answer should be [-1,1,-1,1];
console.log([...a]);
```

# tutorial

## Creating matrices

## Operations on matrices

# API
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
    <dd><p>creates a new identity matrix of size n</p>
</dd>
  <dt>Matrix.<a href="#rand">rand(rows, [cols])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>creates a new matrix filled with random values [0|1)</p>
</dd>
  <dt>Matrix.<a href="#magic">magic(size)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Creates a magic square of the specified size</p>
</dd>
  </dl>

## Matrix Manipulation

  <dl>
<dt>Matrix.<a href="#diag">diag(matrix, [set])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>gets, sets or creates diagonal matrices</p>
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
    <dd><p>Get the minor of a matrix</p>
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
  <dt>Matrix.<a href="#mcat">mcat(array)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Concatenate matrices horizontally and vertically</p>
</dd>
  </dl>

## Functions

  <dl>
<dt>Matrix.<a href="#rows">rows(matrix)</a> ⇒ <code>IterableIterator.&lt;Array.&lt;Number&gt;&gt;</code></dt>
    <dd><p>Iterate over the rows.</p>
</dd>
  <dt>Matrix.<a href="#cols">cols(matrix)</a> ⇒ <code>IterableIterator.&lt;Array.&lt;Number&gt;&gt;</code></dt>
    <dd><p>Iterate over the columns.</p>
</dd>
  <dt>Matrix.<a href="#isMatrix">isMatrix(val)</a> ⇒ <code>boolean</code></dt>
    <dd><p>Tests if a value is an instance of a Matrix</p>
</dd>
  <dt>Matrix.<a href="#mixin">mixin(methods)</a></dt>
    <dd><p>Add static functions of the form <code>fn(matrix,...args)</code> to the <a href="#Matrix">Matrix</a> prototype as <code>matrix.fn(args)</code></p>
</dd>
  <dt>Matrix.<a href="#sum">sum(matrices)</a> ⇒ <code><a href="#Matrix">Matrix</a></code> | <code>Number</code></dt>
    <dd><p>Sum the matrix in the direction specified or sum the set of matrices.</p>
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
  The core matrix class

<br>
  
* [Matrix](#Matrix)
    * [.size](#Matrix+size) ⇒ <code>Array.&lt;Number&gt;</code>
    * [.t](#Matrix+t) ⇒ [<code>Matrix</code>](#Matrix)
    * [\[Symbol\.iterator\]()](#Matrix+[Symbol-iterator])
    * [.get(rows, cols)](#Matrix+get) ⇒ [<code>Matrix</code>](#Matrix) \| <code>Number</code>
    * [.set([rows], [cols], val)](#Matrix+set) ⇒
    * [.clone([rows], [cols])](#Matrix+clone) ⇒ [<code>Matrix</code>](#Matrix)
    * [.map(fn)](#Matrix+map) ⇒ [<code>Matrix</code>](#Matrix)
    * [.toJSON()](#Matrix+toJSON) ⇒ <code>Array.&lt;Array.&lt;Number&gt;&gt;</code>

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

### matrix\[Symbol\.iterator\]()
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

### matrix.get(rows, cols) ⇒ [<code>Matrix</code>](#Matrix) \| <code>Number</code>
Return a value or subset of a matrix.  The matrix subset is a view into the current matrix.


| Param | Type | Description |
| --- | --- | --- |
| rows | [<code>Range</code>](#Range) \| <code>Number</code> | Row index or indices.  zero-based |
| cols | [<code>Range</code>](#Range) \| <code>Number</code> | Column index or indices.  zero-based |

**Example**  
```js
const m=Matrix.from([[1,2],[3,4]]);//Specify single indices to return a valuem.get(0,0) //1//The same indices in an array will return a matrixm.get([0],[0]) //Matrix [1]//A general [Range](#Range) can be specified.m.get(':',0) //Matrix [1;3]m.get(':',':') //The original matrix.m.get(['::',-1],':') //Return a matrix flipped vertically//Any sub-matrix returned is a view into the source matrix.const a=zeros(4), b=a.get([1,2],[1,2]);b.set(2);console.log(a.toJSON()) //[[0,0,0,0], [0,2,2,0], [0,2,2,0], [0,0,0,0]]
```
<br>
    <a name="Matrix+set"></a>

### matrix.set([rows], [cols], val) ⇒
Set a value or range of values of the matrix

**Returns**: this  

| Param | Type | Description |
| --- | --- | --- |
| [rows] | [<code>Range</code>](#Range) \| <code>Number</code> | Row index or indices.  zero-based |
| [cols] | [<code>Range</code>](#Range) \| <code>Number</code> | Column index or indices.  zero-based |
| val | <code>Number</code> \| [<code>Matrix</code>](#Matrix) \| <code>Array</code> | Values to assign to the specified range |

**Example**  
```js
const m=Matrix.zeros(3);//Set a single valuem.set(1,1,5) //[0,0,0; 0,5,0; 0,0,0]//Set a range to a single valuem.set(0,':',3) //[3,3,3; 0,5,0; 0,0,0]//The value can also be a matrix of the matching size, or an array which resolves to such.m.set(2,':',[[7,8,6]]) //[3,3,3; 0,5,0; 7,8,6]//If val is an array, [from](#from) will be used to convert it to a matrix.//If no row and column indices are provided, the value will apply to the whole matrixm.set(1) //[1,1,1; 1,1,1; 1,1,1]
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
    <a name="Matrix+toJSON"></a>

### matrix.toJSON() ⇒ <code>Array.&lt;Array.&lt;Number&gt;&gt;</code>
Convert the matrix to an array of number arrays.

**Example**  
```js
const m=Matrix.from([0,':',5]); //will create a column vectorconsole.log(m.toJSON()); //[[0],[1],[2],[3],[4],[5]]console.log(m.t.toJSON()); //[0,1,2,3,4,5]console.log(Matrix.reshape(m,2,3).toJSON()); //[[0,1,2],[3,4,5]]//enables a matrix instance to be serialised by JSON.stringifyconsole.log(JSON.stringify(m)); //"[[0],[1],[2],[3],[4],[5]]"
```
<br>
* * *

&copy; 2019 Euan Smith