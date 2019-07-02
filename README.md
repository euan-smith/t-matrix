[![view on npm](http://img.shields.io/npm/v/example.svg)](https://www.npmjs.org/package/example)
# t-matrix

# Aims
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
  - expressive get and set methods ([Matlab](https://www.mathworks.com/products/matlab.html)/[Octave](https://www.gnu.org/software/octave/)-like range selection and manipulation)
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

# Guide

## Creating matrices
There is no way to create a [Matrix](#Matrix) class instance directly (using a `new` operator), instead there are five
standard (and one less standard) way of creating a matrix - [`zeros`](#zeros), [`ones`](#ones), [`eye`](#eye),
[`rand`](#rand) and [`from`](#from) (the less standard one is [`magic`](#magic)).

[`zeros`](#zeros), [`ones`](#ones) and [`rand`](#rand) all have the same general form:
```
import {zeros,ones,rand} from 't-matrix';
const m1=zeros(3); //a 3x3 square matrix filled with zeros
const m2=ones(4,5); //a matrix with 4 rows and 5 columns filled with ones
const m3=rand([6,5]); //a matrix with 6 rows and 5 columns filled with random values in the range [0,1)
const m4=zeros(m3.size); //a matrix the same size as m4 filled with zeros.
```

[`eye`](#eye) and [`magic`](#magic) both take just one number which is the matrix size as both produce only square matrices:
```
import {eye,magic} from 't-matrix';
const m5=eye(3); //a 3x3 identity matrix
console.log(JSON.stringify(m5));
//'[[1,0,0],[0,1,0],[0,0,1]]'
const m6=magic(4); //a 4x4 magic square
console.log(JSON.stringify(m6));
//'[[16,2,3,13],[5,11,10,8],[9,7,6,12],[4,14,15,1]]'
```

[`from`](#from) is the more general purpose function and will try and convert arrays into a matrix:
```
import * as Matrix from 't-matrix';
const m7=Matrix.from([1,2,3]); //An array of numbers becomes a column matrix
const m8=Matrix.from([[1,2,3]]); //An array of arrays assumes row-major order, so this becomes a row matrix
const m9=Matrix.from([[1,2],[3,4]]); //and this is a 2x2 matrix.
```

There is one final function which can be used to create matrices, but in this case is not purely a creation function, and that is [diag](#diag).
To use it to create a matrix, provide a single parameter which is an array or a column or row matrix:
```
import {diag} from 't-matrix';
const m10=Matrix.diag([1,2,3,4]);//a 4x4 matrix with 1,2,3,4 on the diagonal.
```
In addition [diag](#diag) can als be used to get or set the diagonal elements of a matrix.  See the API help for more details.

## Matrix methods and properties

### Core methods
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

The was to define a range should be (at least somewhat) familiar to those used to [Matlab](https://www.mathworks.com/products/matlab.html)/[Octave](https://www.gnu.org/software/octave/).
For example `m.set(0,':',1)` will set all the values in row 0 to 1, or `m.get([1,2],[':',4])` will return a matrix which
contains all columns up to (and including) column 4 of rows 1 and 2 (a 2x5 matrix).

An important point to note is that `.get`, when it returns a matrix, returns one which maps onto the same underlying data
array as the original matrix - any changes to either matrix will be reflected in each other.  There are many more examples
in the documentation for the [Range](#Range) data type and the [get](#Matrix+get) and [set](#Matrix+set) methods, however
a couple of basic examples:
```
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
### Iterables
A matrix is itself an iterable, iterating in a row-major order over all values:
```
import * as Matrix from 't-matrix';
let t=0;
for(let v of Matrix.magic(3)) t+=v;
console.log('Total of a 3x3 magic square = '+t);
//Total of a 3x3 magic square = 45
```
There are also helper functions, [Matrix.rows](#rows) and [Matrix.cols](#cols), to iterate over rows and columns:
```
import * as Matrix from 't-matrix';
const tots=[];
for(let r of Matrix.rows(Matrix.magic(3))) tots.push(Matrix.sum(r));
console.log('Row sums = '+tots);
//Row sums = 15,15,15
```
These functions can be mixed-in to become methods
```
import * as Matrix from 't-matrix';
Matrix.mixin(Matrix.cols);
const tots=[];
for(let r of Matrix.magic(3).cols()) tots.push(Matrix.sum(r));
console.log('Column sums = '+tots);
//Column sums = 15,15,15
```
## Operations on matrices
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
    <dd><p>creates a new <a href="https://en.wikipedia.org/wiki/Identity_matrix">identity matrix</a> of size n</p>
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
<dt>Matrix.<a href="#rows">rows(matrix)</a> ⇒ <code>IterableIterator.&lt;Array.Number&gt;</code></dt>
    <dd><p>Iterate over the rows.</p>
</dd>
<dt>Matrix.<a href="#cols">cols(matrix)</a> ⇒ <code>IterableIterator.&lt;Array.Number&gt;</code></dt>
    <dd><p>Iterate over the columns.</p>
</dd>
<dt>Matrix.<a href="#isMatrix">isMatrix(val)</a> ⇒ <code>boolean</code></dt>
    <dd><p>Tests if a value is an instance of a Matrix</p>
</dd>
<dt>Matrix.<a href="#mixin">mixin(...methods)</a></dt>
    <dd><p>Add static functions of the form <code>fn(matrix,...args)</code> to the <a href="#Matrix">Matrix</a> prototype as <code>matrix.fn(args)</code></p>
</dd>
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
<dt>Matrix.<a href="#mult">mult(...matrices)</a> ⇒ <code><a href="#Matrix">Matrix</a></code></dt>
    <dd><p>Performs matrix multiplication on a list of matrices and/or scalars</p>
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
    * [\[Symbol\.iterator\]()](#Matrix+[Symbol-iterator]) ⇒ <code>IterableIterator.&lt;Number&gt;</code>
    * [.get(rows, cols)](#Matrix+get) ⇒ [<code>Matrix</code>](#Matrix) \| <code>Number</code>
    * [.set([rows], [cols], val)](#Matrix+set) ⇒ [<code>Matrix</code>](#Matrix)
    * [.clone([rows], [cols])](#Matrix+clone) ⇒ [<code>Matrix</code>](#Matrix)
    * [.map(fn)](#Matrix+map) ⇒ [<code>Matrix</code>](#Matrix)
    * [.toJSON()](#Matrix+toJSON) ⇒ <code>Array.Array.Number</code>

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

### matrix.toJSON() ⇒ <code>Array.Array.Number</code>
Convert the matrix to an array of number arrays.

**Example**  
```js
const m=Matrix.from([0,':',5]); //will create a column vectorconsole.log(m.toJSON()); //[[0],[1],[2],[3],[4],[5]]console.log(m.t.toJSON()); //[0,1,2,3,4,5]console.log(Matrix.reshape(m,2,3).toJSON()); //[[0,1,2],[3,4,5]]//enables a matrix instance to be serialised by JSON.stringifyconsole.log(JSON.stringify(m)); //"[[0],[1],[2],[3],[4],[5]]"
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
  <a name="sum"></a>

  ## Matrix.sum(...matrices) ⇒ [<code>Matrix</code>](#Matrix) \| <code>Number</code>
  *Return the sum of the matrix in the direction specified or the element-wise sum of the set of matrices.*

`Matrix.sum(m)` or `m.sum()` will sum all the values of a matrix, returning a number.`Matrix.sum(m,null,1)` or `m.sum(null,1)` will sum the matrix columns, returning a row matrix.`Matrix.sum(m,null,2)` or `m.sum(null,2)` will sum the matrix rows, returning a column matrix.`Matrix.sum(m1,m2,m3,...)` or `m1.sum(m2,m3,...)` will calculate an element-wise sum over all the matrices.For the last case, the supplied list of matrices must either have the same row count or a row count of 1, and thesame column count or a column count of 1.  This includes scalar values which implicitly are treated as 1x1 matrices.Arrays can also be provided and these will be converted to matrices using Matrix.[from](#from).  Row matrices will beadded to every row, column matrices to every column and scalar values to every matrix element.


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


| Param |
| --- |
| matrix | 

<br>
  <a name="mult"></a>

  ## Matrix.mult(...matrices) ⇒ [<code>Matrix</code>](#Matrix)
  Performs matrix multiplication on a list of matrices and/or scalars


| Param | Type | Description |
| --- | --- | --- |
| ...matrices | [<code>Matrix</code>](#Matrix) \| <code>Number</code> | At least one parameter must be a matrix or convertible to a matrix through Matrix.[from](#from) |

**Example**  
```js
import * as Matrix from 't-matrix';const mag = Matrix.magic(3);console.log(mag.mult(mag.inv()).toJSON());//a 3x3 identity matrix (plus some round-off error)
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
  creates a new [identity matrix](https://en.wikipedia.org/wiki/Identity_matrix) of size n

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
| matrix | [<code>Matrix</code>](#Matrix) \| <code>Array</code> | 
| [set] | [<code>Matrix</code>](#Matrix) \| <code>Array</code> \| <code>function</code> \| <code>Number</code> | 

**Example** *(Extract the diagonal elements from a matrix)*  
```js
import * as Matrix from 't-matrix';
//Create a magic square
const mag = Matrix.magic(3);
//Get the sum of the diagonal elements - should add up to 15 for a 3x3 magic square
console.log(Matrix.sum(Matrix.diag(mag)); //15
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