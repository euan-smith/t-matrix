import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import * as Matrix from "../src/matrix";
import {DATA, SKIP, SPAN} from "../src/base";

function printAll(m){
  console.log(m,m.toArray().join(','),{span:m[SPAN],skip:m[SKIP]})
}
describe("matrix",function () {
  describe("minor",function(){
    it('produces a minor(0,0) matrix',function () {
      const a=Matrix.from([1,2,3,4,4,1,2,3,3,4,1,2,2,3,4,1]);
      expect(a.minor(0,0).toFloatArray()).to.eql(new Float64Array([1,2,3,4,1,2,3,4,1]));
    });
    it('produces a minor(1,1) matrix',function () {
      const a=Matrix.from([1,2,3,4,4,1,2,3,3,4,1,2,2,3,4,1]);
      expect(a.minor(1,1).toFloatArray()).to.eql(new Float64Array([1,3,4,3,1,2,2,4,1]));
    });
    it('produces a minor(2,2) matrix',function () {
      const a=Matrix.from([1,2,3,4,4,1,2,3,3,4,1,2,2,3,4,1]);
      expect(a.minor(2,2).toFloatArray()).to.eql(new Float64Array([1,2,4,4,1,3,2,3,1]));
    });
    it('produces a minor(3,3) matrix',function () {
      const a=Matrix.from([1,2,3,4,4,1,2,3,3,4,1,2,2,3,4,1]);
      expect(a.minor(3,3).toFloatArray()).to.eql(new Float64Array([1,2,3,4,1,2,3,4,1]));
    });

  });
  describe('det',function () {
    it('calculates a 2x2 determinant',function () {
      expect(Matrix.det(Matrix.from([1,2,3,4]))).to.equal(-2);
      const a=Matrix.rand(2),da=Matrix.det(a);
      expect(Matrix.det(a.mult(a))).to.almost.equal(da*da);
      expect(Matrix.det(a.mult(2))).to.almost.equal(da*4);
    });
    it('calculates a 3x3 determinant',function () {
      const a=Matrix.rand(3),da=Matrix.det(a);
      expect(Matrix.det(a.mult(a))).to.almost.equal(da*da);
      expect(Matrix.det(a.mult(2))).to.almost.equal(da*8);
    });
    it('calculates a 4x4 determinant',function () {
      const a=Matrix.rand(4),da=Matrix.det(a);
      expect(Matrix.det(a.mult(a))).to.almost.equal(da*da);
      expect(Matrix.det(a.mult(2))).to.almost.equal(da*16);
    });
    it('calculates a 8x8 determinant',function () {
      const a=Matrix.rand(8),da=Matrix.det(a);
      expect(Matrix.det(a.mult(a))).to.almost.equal(da*da);
      expect(Matrix.det(a.mult(2))).to.almost.equal(da*256);
    });
  });
  describe('ldiv',function(){
    it('solves an equation correctly', function(){
      const m=Matrix.from([1,2,3,4,2,3,4,1,3,4,1,2,4,1,2,3]);
      const v=Matrix.vect([2,-2,2,-2]);
      expect(m.ldiv(v).toFloatArray()).to.eql(new Float64Array([-1,1,-1,1]));
    })
  });
  describe('toArray',function(){
    it('outputs the right thing for an eye(4) array', function(){
      expect(Matrix.eye(4).toFloatArray()).to.eql(new Float64Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]));
    });
    it('outputs the correct array for a submatrix', function(){
      const m=Matrix.from([1,2,3,4,5,6,7,8,9]);
      expect(m.subMatrix(1,1).toFloatArray()).to.eql(new Float64Array([5,6,8,9]));
    })
  });
  describe('diag instance function',function(){
    it('returns a vector containing the diagonal elements', function(){
      expect(Matrix.eye(6).diag().toFloatArray()).to.eql(Matrix.ones(6,1).toFloatArray());
    });
  });
  describe('sum',function(){
    it('adds up the contents of a matrix',function(){
      const m=Matrix.from([1,2,3,4,2,3,4,1,3,4,1,2,4,1,2,3]);
      expect(Matrix.sum(m)).to.eql(40);
    })
  });
  describe('sumColumns',function(){
    it('adds up the columns of a matrix', function(){
      const m=Matrix.from([1,2,3,4,2,3,4,1,3,4,1,2,4,1,2,3]);
      expect(Matrix.sumColumns(m).toFloatArray()).to.eql(new Float64Array([10,10,10,10]));
    })
  });
  describe('trace',function(){
    it('returns the trace of a matrix',function(){
      const m=Matrix.from([1,2,3,4,2,3,4,1,3,4,1,2,4,1,2,3]);
      expect(Matrix.trace(m)).to.eql(8);
    })
  });
});