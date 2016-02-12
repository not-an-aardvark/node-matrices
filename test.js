'use strict';
const expect = require('chai').expect;
const Matrix = require('.');
describe('node-matrices', () => {
  let m, smallBlock, smallBlockConstant, notSquare, symmetric, skewSymmetric, upperTriangular, lowerTriangular, diagonal, id,
    zeros;
  before(() => {
    m = new Matrix([1, 2, 3], [4, 5, 6], [7, 8, 9]);
    smallBlock = new Matrix([1, 2], [3, 4]);
    smallBlockConstant = new Matrix([5, 5], [5, 5]);
    notSquare = new Matrix([1, 2, 3], [4, 5, 6]);
    symmetric = new Matrix([1, 2], [2, 7]);
    skewSymmetric = new Matrix([0, 2], [-2, 0]);
    upperTriangular = new Matrix([1, 2], [0, 4]);
    lowerTriangular = new Matrix([1, 0], [55, 8]);
    diagonal = new Matrix([6, 0, 0], [0, 1, 0], [0, 0, Number.MAX_SAFE_INTEGER]);
    id = new Matrix([1, 0, 0], [0, 1, 0], [0, 0, 1]);
    zeros = new Matrix([0, 0, 0], [0, 0, 0]);
  });
  describe('basic manipulation', () => {
    it('can get the number of rows and columns', () => {
      expect(m.numRows()).to.equal(3);
      expect(m.numColumns()).to.equal(3);
    });
    it('can get specific values given a row and column', () => {
      expect(m.get(0, 1)).to.equal(2);
      expect(m.get(1, 2)).to.equal(6);
      expect(m.get(500, 0)).to.be.undefined;
      expect(m.get(0, 500)).to.be.undefined;
    });
    it('can get rows by index', () => {
      expect(m.getRow(1)).to.eql(new Matrix([4, 5, 6]));
    });
    it('can get columns by index', () => {
      expect(m.getColumn(2)).to.eql(new Matrix([3], [6], [9]));
    });
    it('can get slices of rows', () => {
      expect(m.sliceRows(0, 2)).to.eql(new Matrix([1, 2, 3], [4, 5, 6]));
    });
    it('can get slices of columns', () => {
      expect(m.sliceColumns(1)).to.eql(new Matrix([2, 3], [5, 6], [8, 9]));
    });
    it('can get block slices', () => {
      expect(m.sliceBlock(1, 2, 1, 3)).to.eql(new Matrix([5, 6]));
    });
    it('can omit rows', () => {
      expect(m.omitRow(2)).to.eql(new Matrix([1, 2, 3], [4, 5, 6]));
    });
    it('can omit columns', () => {
      expect(m.omitColumn(1)).to.eql(new Matrix([1, 3], [4, 6], [7, 9]));
    });
    it('can combine blocks horizontally', () => {
      expect(smallBlock.combineHorizontal(smallBlockConstant)).to.eql(new Matrix([1, 2, 5, 5], [3, 4, 5, 5]));
    });
    it('can combine blocks vertically', () => {
      expect(smallBlock.combineVertical(smallBlockConstant)).to.eql(new Matrix([1, 2], [3, 4], [5, 5], [5, 5]));
    });
    it('can replace elements in a matrix', () => {
      expect(m.replace(1, 2, 90)).to.eql(new Matrix([1, 2, 3], [4, 5, 90], [7, 8, 9]));
    });
  });
  describe('matrix operations', () => {
    it('can transpose a matrix', () => {
      expect(m.transpose()).to.eql(new Matrix([1, 4, 7], [2, 5, 8], [3, 6, 9]));
    });
    it('can calculate the determinant of a matrix', () => {
      expect(smallBlock.determinant()).to.equal(-2);
      expect(m.determinant()).to.equal(0);
    });
    it('can calulate the adjugate of a matrix', () => {
      expect(smallBlock.adjugate()).to.eql(new Matrix([4, -2], [-3, 1]));
    });
    it('can invert a matrix', () => {
      expect(smallBlock.inverse()).to.eql(new Matrix([-2, 1], [1.5, -0.5]));
      expect(m.inverse).to.throw();
    });
    it('can add two matrices', () => {
      expect(smallBlock.add(smallBlockConstant)).to.eql(new Matrix([6, 7], [8, 9]));
    });
    it('can subtract two matrices', () => {
      expect(smallBlock.subtract(smallBlockConstant)).to.eql(new Matrix([-4, -3], [-2, -1]));
    });
    it('can multiply two matrices', () => {
      expect(smallBlock.multiply(smallBlockConstant)).to.eql(new Matrix([15, 15], [35, 35]));
    });
    it('can multiply matrices by scalars', () => {
      expect(m.scale(5)).to.eql(new Matrix([5, 10, 15], [20, 25, 30], [35, 40, 45]));
    });
    it('can exponentiate matrices', () => {
      expect(m.pow(3)).to.eql(new Matrix([468, 576, 684], [1062, 1305, 1548], [1656, 2034, 2412]));
      expect(smallBlock.pow(-3)).to.eql(smallBlock.pow(3).inverse());
    });
  });
  describe('value-checking', () => {
    it('can test whether two matrices are equal', () => {
      expect(smallBlock.equals(smallBlock)).to.be.true;
      expect(smallBlock.equals(new Matrix([1, 2], [3, 4]))).to.be.true;
      expect(smallBlock.equals(smallBlockConstant)).to.be.false;
    });
    it('can test whether matrices are square', () => {
      expect(smallBlock.isSquare()).to.be.true;
      expect(m.isSquare()).to.be.true;
      expect(notSquare.isSquare()).to.be.false;
    });
    it('can test whether matrices are symmetric', () => {
      expect(smallBlock.isSymmetric()).to.be.false;
      expect(symmetric.isSymmetric()).to.be.true;
      expect(skewSymmetric.isSymmetric()).to.be.false;
    });
    it('can test whether matrices are skew-symmetric', () => {
      expect(smallBlock.isSkewSymmetric()).to.be.false;
      expect(symmetric.isSkewSymmetric()).to.be.false;
      expect(skewSymmetric.isSkewSymmetric()).to.be.true;
    });
    it('can test whether matrices are upper-triangular', () => {
      expect(m.isUpperTriangular()).to.be.false;
      expect(upperTriangular.isUpperTriangular()).to.be.true;
      expect(lowerTriangular.isUpperTriangular()).to.be.false;
      expect(diagonal.isUpperTriangular()).to.be.true;
    });
    it('can test whether matrices are lower-triangular', () => {
      expect(m.isLowerTriangular()).to.be.false;
      expect(upperTriangular.isLowerTriangular()).to.be.false;
      expect(lowerTriangular.isLowerTriangular()).to.be.true;
      expect(diagonal.isLowerTriangular()).to.be.true;
    });
    it('can test whether matrices are diagonal', () => {
      expect(m.isDiagonal()).to.be.false;
      expect(upperTriangular.isDiagonal()).to.be.false;
      expect(lowerTriangular.isDiagonal()).to.be.false;
      expect(diagonal.isDiagonal()).to.be.true;
    });
    it('can check whether matrices are the identity matrix', () => {
      expect(m.isIdentity()).to.be.false;
      expect(notSquare.isIdentity()).to.be.false;
      expect(id.isIdentity()).to.be.true;
    });
    it('can check whether matrices are nonzero', () => {
      expect(m.isNonZero()).to.be.true;
      expect(notSquare.isNonZero()).to.be.true;
      expect(zeros.isNonZero()).to.be.false;
    });
    it('can check whether matrices are singular', () => {
      expect(m.isSingular()).to.be.true;
      expect(smallBlock.isSingular()).to.be.false;
      expect(notSquare.isSingular).to.throw();
    });
    it('can create an identity matrix of a given size', () => {
      expect(Matrix.identity(3)).to.eql(id);
    });
    it('can create a zero matrix with given dimensions', () => {
      expect(Matrix.zeros(2, 3)).to.eql(zeros);
    });
  });
});
