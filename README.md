# node-matrices [![Build Status](https://travis-ci.org/not-an-aardvark/node-matrices.svg?branch=master)](https://travis-ci.org/not-an-aardvark/node-matrices)

node-matrices is a simple, lightweight matrix manipulation library supporting many common matrix operations.
## Installation
```bash
npm install node-matrices
```
```javascript
var Matrix = require('node-matrices');
```
## Documentation
General notes:

* All Matrix objects are immutable.
* All indices are zero-based.

---
### Basic manipulation
`.constructor(...rows)`
* Each parameter to the constructor should be an array of integers corresponding to a single row of the matrix. All of the rows should have the same length.
```javascript
var m = new Matrix(
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
);
// -> Matrix { data: [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ] }
```
---
* `#numRows()` - Returns the number of rows in the matrix.
* `#numColumns()` - Returns the number of columns in the matrix.
```javascript
var m = new Matrix(
  [1, 2, 3],
  [4, 5, 6]
);
m.numRows()
// -> 2
m.numColumns()
// -> 3
```
---
* `#get(rowIndex, columnIndex)` - Returns the value at a specific location. This will return `undefined` if either index is out of range.
```javascript
var m = new Matrix(
  [1, 2, 3],
  [4, 5, 6]
);
m.get(0, 1)
// -> 2
m.get(1, 2)
// -> 6
m.get(500, 0)
// -> undefined
```
---
* `#getRow(rowIndex)` - Returns a new matrix containing only the row at the specified index.
* `#getColumn(columnIndex)` - Returns a new matrix containing only the column at the specified index.
```javascript
var m = new Matrix(
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
);
m.getRow(1)
// -> Matrix { data: [ [ 4, 5, 6 ] ] }
m.getColumn(2)
// -> Matrix { data: [ [ 3 ], [ 6 ], [ 9 ] ] }
```
---
* `#sliceRows(startIndex[, endIndex])`
* `#sliceColumns(startIndex[, endIndex])`
* `#sliceBlock(startRowIndex, endRowIndex, startColumnIndex, endColumnIndex)`
* Returns a new matrix containing only the rows between `startIndex` and `endIndex - 1`, inclusive. If `endIndex` is not provided, the rows/columns will be sliced until the end of the matrix.
```javascript
var m = new Matrix(
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16]
);
m.sliceRows(1, 3)
// -> Matrix { data: [ [ 5, 6, 7, 8 ], [ 9, 10, 11, 12 ] ] }
m.sliceColumns(0, 2)
// -> Matrix { data: [ [ 1, 2 ], [ 5, 6 ], [ 9, 10 ], [ 13, 14 ] ] }
m.sliceBlock(0, 3, 1, 3)
// -> Matrix { data: [ [ 2, 3 ], [ 6, 7 ], [ 10, 11 ] ] }
```
---
* `#omitRow(rowIndex)`
* `#omitColumn(columnIndex)`
* Returns a new matrix with the specified row or column omitted.
```javascript
var m = new Matrix(
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
);
m.omitRow(0)
// -> Matrix { data: [ [ 4, 5, 6 ], [ 7, 8, 9 ] ] }
m.omitColumn(1)
// -> Matrix { data: [ [ 1, 3 ], [ 4, 6 ], [ 7, 9 ] ] }
```
---
* `#combineHorizontal(otherMatrix)`
* `#combineVertical(otherMatrix)`
* Combines two matrices as blocks. An error will be thrown if the matrices have a different number of rows (for `combineHorizontal`) or a different number of columns (for `combineVertical`).
```javascript
var m1 = new Matrix(
  [1, 2],
  [3, 4]
);
var m2 = new Matrix(
  [5, 6],
  [7, 8]
);
m1.combineHorizontal(m2)
// -> Matrix { data: [ [ 1, 2, 5, 6 ], [ 3, 4, 7, 8 ] ] }
m1.combineVertical(m2)
// -> Matrix { data: [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ], [ 7, 8 ] ] }
```
---
* `#replace(rowIndex, columnIndex, value)`
* Returns a new matrix where the which is exactly the same as the old matrix, except that the value at `rowIndex` and `columnIndex` is `value`.
```javascript
var m = new Matrix(
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
);
m.replace(1, 2, Infinity)
// -> Matrix { data: [ [ 1, 2, 3 ], [ 4, 5, Infinity ], [ 7, 8, 9 ] ] }
```
---
### Matrix operations
* `#transpose()`
* Returns the transpose of this matrix.
```javascript
var m = new Matrix(
  [1, 2, 3],
  [4, 5, 6],
);
m.transpose()
// -> Matrix { data: [ [ 1, 4 ], [ 2, 5 ], [ 3, 6 ] ] }
```
---
* `#determinant()`
* Returns the determinant of this matrix. An error will be thrown if this matrix is not square.
```javascript
var m = new Matrix(
  [1, 2],
  [3, 4]
);
m.determinant()
// -> -2
```
---
* `#adjugate()`
* Returns the [adjugate](https://en.wikipedia.org/wiki/Adjugate_matrix) of this matrix. An error will be thrown if this matrix is not square.
```javascript
var m = new Matrix(
  [1, 2],
  [3, 4]
);
m.adjugate()
// -> Matrix { data: [ [ 4, -2 ], [ -3, 1 ] ] }
```
---
* `#inverse()`
* Returns the inverse of this matrix. An error will be thrown if this matrix is not square, or if this matrix is singular.
```javascript
var m = new Matrix(
  [1, 2],
  [3, 4]
);
m.inverse()
// -> Matrix { data: [ [ -2, 1 ], [ 1.5, -0.5 ] ] }
```
---
* `#add(otherMatrix)`
* `#subtract(otherMatrix)`
* Returns the sum or difference of this matrix and another matrix. An error will be thrown if the two matrices have different dimensions.
```javascript
var m1 = new Matrix(
  [1, 2],
  [3, 4]
);
var m2 = new Matrix(
  [5, 5],
  [5, 5]
);
m1.add(m2)
// -> Matrix { data: [ [ 6, 7 ], [ 8, 9 ] ] }
m1.subtract(m2)
// -> Matrix { data: [ [ -4, -3 ], [ -2, -1 ] ] }
```
---
* `#multiply(otherMatrix)`
* Returns the product of this matrix and another matrix. An error will be thrown if the matrices do not have compatible sizes.
* To multiply a matrix by a scalar, use `#scale()`.
```javascript
var m1 = new Matrix(
  [1, 2, 3],
  [4, 5, 6]
);
var m2 = new Matrix(
  [7, 8],
  [9, 10],
  [11, 12]
);
m1.multiply(m2)
// -> Matrix { data: [ [ 58, 64 ], [ 139, 154 ] ] }
m1.multiply(m1)
// (throws an error)
```
---
* `#scale(scalar)`
* Returns the scalar product of this matrix and `scalar`.
```javascript
var m1 = new Matrix(
  [1, 2],
  [3, 4]
);
m1.scale(3)
// -> Matrix { data: [ [ 3, 6 ], [ 9, 12 ] ] }
```
---
* `#pow(exponent)`
* Raises this matrix to the `exponent` power. An error will be thrown if this matrix is not square, or if `exponent` is not an integer.
```javascript
var m1 = new Matrix(
  [1, 2],
  [3, 4]
);
m1.pow(5)
// -> Matrix { data: [ [ 37, 54 ], [ 81, 118 ] ] }
```
---
### Value-checking
* `#equals(otherMatrix)`
* Returns `true` if `this` and `otherMatrix` are equivalent, and `false` otherwise. Equivalent matrices contain all of the same values in the same locations.
```javascript
var m1 = new Matrix([1, 2, 3]);
var m2 = new Matrix([1, 2, 3]);
var m3 = new Matrix([1, 2, 4]);
m1.equals(m2)
// -> true
m1.equals(m3)
// -> false
```
---
* `#isSquare()`
* Returns `true` if this matrix is square (i.e. has the same number of rows and columns), and `false` otherwise.
```javascript
var m1 = new Matrix(
  [1, 2],
  [3, 4]
);
var m2 = new Matrix(
  [1, 2, 3],
  [4, 5, 6]
);
m1.isSquare()
// -> true
m2.isSquare()
// -> false
```
---
* `#isSymmetric()`
* `#isSkewSymmetric()`
* Returns `true` if this matrix is symmetric (for `isSymmetric`) or skew-symmetric (for `isSkewSymmetric`). Otherwise, returns `false`.
```javascript
var m1 = new Matrix(
  [1, 2],
  [2, 4]
);
var m2 = new Matrix(
  [0, 2],
  [-2, 0]
);
m1.isSymmetric()
// -> true
m1.isSkewSymmetric()
// -> false
m2.isSymmetric()
// -> false
m2.isSkewSymmetric()
// -> true
```
---
* `#isUpperTriangular()`
* `#isLowerTriangular()`
* `#isDiagonal()`
* Returns `true` if this matrix is upper triangular, lower triangular, or diagonal, respectively; otherwise, returns `false`.
```javascript
var m1 = new Matrix(
  [1, 2],
  [0, 5]
);
var m2 = new Matrix(
  [1, 0],
  [0, 5]
);
m1.isUpperTriangular()
// -> true
m1.isLowerTriangular()
// -> false
m1.isDiagonal()
// -> false
m2.isUpperTriangular()
// -> true
m2.isLowerTriangular()
// -> true
m2.isDiagonal()
// -> true
```
---
* `#isIdentity()`
* Returns `true` if this matrix is an identity matrix, otherwise `false`.
```javascript
var m1 = new Matrix(
  [1, 0],
  [0, 1]
);
var m2 = new Matrix(
  [1, 1],
  [0, 1]
);
m1.isIdentity()
// -> true
m2.isIdentity()
// -> false
```
---
* `#isNonZero()`
* Returns `true` if this matrix contains any nonzero values. Otherwise, returns `false`.
```javascript
var m1 = new Matrix(
  [0, 0],
  [0, 0]
);
var m2 = new Matrix(
  [0, 1],
  [0, 0]
);
m1.isNonZero()
// -> false
m2.isNonZero()
// -> true
```
---
* `#isSingular()`
* Returns `true` if this matrix is singular, otherwise `false`. An error will be thrown if this matrix is not square.
```javascript
var m1 = new Matrix(
  [1, 2],
  [3, 4]
);
var m2 = new Matrix(
  [1, 2],
  [2, 4]
);
m1.isSingular()
// -> false
m2.isSingular()
// -> true
```
---
### Static methods
* `.identity(size)`
* Returns an identity matrix of the specified size.
```javascript
Matrix.identity(3)
// -> Matrix { data: [ [ 1, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, 1 ] ] }
```
---
* `.zeros(numRows, numColumns)`
* Returns a matrix of the specified dimensions which only contains zeros.
```javascript
Matrix.zeros(2, 3)
// -> Matrix { data: [ [ 0, 0, 0 ], [ 0, 0, 0 ] ] }
```
