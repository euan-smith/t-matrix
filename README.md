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
<dt>Matrix.<a href="#diag">diag(matrix, [set])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
          <dd><p>gets, sets or creates diagonal matrices</p>
</dd>
</dl>

## Matrix Manipulation

  <dl>
<dt>Matrix.<a href="#mcat">mcat(array)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Concatenate matrices horizontally and vertically</p>
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
<dt>Matrix.<a href="#diag">diag(matrix, [set])</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
          <dd><p>gets, sets or creates diagonal matrices</p>
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
  *The core matrix class*

<br>
  
* [Matrix](#Matrix)
    * [new Matrix()](#new_Matrix_new)
    * [.size](#Matrix+size) ⇒ <code>Array.&lt;Number&gt;</code>
    * [.t](#Matrix+t) ⇒ [<code>Matrix</code>](#Matrix)
    * [\[Symbol\.iterator\]()](#Matrix+[Symbol-iterator])
    * [.get(rows, cols)](#Matrix+get) ⇒ [<code>Matrix</code>](#Matrix) \| <code>Number</code>
    * [.set([rows], [cols], val)](#Matrix+set) ⇒ [<code>Matrix</code>](#Matrix)
    * [.clone([rows], [cols])](#Matrix+clone) ⇒ [<code>Matrix</code>](#Matrix)
    * [.map(fn)](#Matrix+map) ⇒ [<code>Matrix</code>](#Matrix)
    * [.toJSON()](#Matrix+toJSON) ⇒ <code>Array.&lt;Array.&lt;Number&gt;&gt;</code>

    <a name="new_Matrix_new"></a>

### new Matrix()
This class is not intended to be directly created by a user of this library, rather it is returnedby the various creation functions (such as [zeros](#zeros), [eye](#eye) or [from](#from)) and as a returned result fromvarious operation and manipulation methods and functions.

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

### matrix.set([rows], [cols], val) ⇒ [<code>Matrix</code>](#Matrix)
Set a value or range of values of the matrix


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
<a name="rows"></a>

  ## Matrix.rows(matrix) ⇒ <code>IterableIterator.&lt;Array.&lt;Number&gt;&gt;</code>
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

  ## Matrix.cols(matrix) ⇒ <code>IterableIterator.&lt;Array.&lt;Number&gt;&gt;</code>
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
  <a name="mixin"></a>

  ## Matrix.mixin(methods)
  Add static functions of the form `fn(matrix,...args)` to the [Matrix](#Matrix) prototype as `matrix.fn(args)`


| Param | Type | Description |
| --- | --- | --- |
| methods | <code>function</code> | The method(s) to add |

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
Matrix.mixin(sqrt);
const m=Matrix.from([1,4,9]);
console.log([...m.sqrt()]); //=> [1,2,3]
```
**Example** *(Using a config file for the Matrix class)*  
```js
// inside 'matrix-setup.js'
import {mixin, reshape} from 't-matrix';
mixin(reshape);

// inside other modules
import * as Matrix from 't-matrix';
console.log(Matrix.from([1,':',9).reshape(3,3).toJSON());//[[1,2,3],[4,5,6],[7,8,9]]
```
**Example** *(Just include everything which can be included)*  
```js
import * as Matrix from 't-matrix';
Matrix.mixin(Matrix);
console.log(Matrix.from([1,':',9]).reshape(3,3).mult(2).toJSON());//[[2,4,6],[8,10,12],[14,16,18]]
```
<br>
  <a name="sum"></a>

  ## Matrix.sum(matrices) ⇒ [<code>Matrix</code>](#Matrix) \| <code>Number</code>
  Sum the matrix in the direction specified or sum the set of matrices.


| Param | Type |
| --- | --- |
| matrices | [<code>Matrix</code>](#Matrix) \| <code>Number</code> \| <code>null</code> | 

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
  creates a new identity matrix of size n

**Category**: creation  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>number</code> | number of rows and columns |

<br>
  <a name="rand"></a>

  ## Matrix.rand(rows, [cols]) ⇒ [<code>Matrix</code>](#Matrix)
  creates a new matrix filled with random values [0|1)

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
| matrix | [<code>Matrix</code>](#Matrix) | 
| [set] | [<code>Matrix</code>](#Matrix) \| <code>Array</code> \| <code>function</code> \| <code>Number</code> | 

**Example**  
```js
//Create a random matrixconst mRand = random(20);//Extract the diagonal of the matrix (as a column vector)const vect = diag(mRand);//Create a new matrix with the same diagonalconst mDiag = diag(vect);//Set the diagonal of the original to zerodiag(mRand,0);
```
<br>
  <a name="mcat"></a>

  ## Matrix.mcat(array) ⇒ [<code>Matrix</code>](#Matrix)
  *Concatenate matrices horizontally and vertically*

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
  *Get the minor of a matrix*

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
  * * *

&copy; 2019 Euan Smith