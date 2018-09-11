import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import * as Matrix from "../src/matrix";
describe("matrix",function () {
  describe("minor",function(){
    it('produces a minor(0,0) matrix',function () {
      const a=Matrix.from([1,2,3,4,4,1,2,3,3,4,1,2,2,3,4,1]);
      expect(a.minor(0,0).toArray()).to.eql(new Float64Array([1,2,3,4,1,2,3,4,1]));
    });
    it('produces a minor(1,1) matrix',function () {
      const a=Matrix.from([1,2,3,4,4,1,2,3,3,4,1,2,2,3,4,1]);
      expect(a.minor(1,1).toArray()).to.eql(new Float64Array([1,3,4,3,1,2,2,4,1]));
    });
    it('produces a minor(2,2) matrix',function () {
      const a=Matrix.from([1,2,3,4,4,1,2,3,3,4,1,2,2,3,4,1]);
      expect(a.minor(2,2).toArray()).to.eql(new Float64Array([1,2,4,4,1,3,2,3,1]));
    });
    it('produces a minor(3,3) matrix',function () {
      const a=Matrix.from([1,2,3,4,4,1,2,3,3,4,1,2,2,3,4,1]);
      expect(a.minor(3,3).toArray()).to.eql(new Float64Array([1,2,3,4,1,2,3,4,1]));
    });

  });
  describe('det',function () {
    it('calculates a 2x2 determinant',function () {
      expect(Matrix.from([1,2,3,4]).det()).to.equal(-2);
      const a=Matrix.rand(2),da=a.det();
      expect(a.mult(a).det()).to.almost.equal(da*da);
      expect(a.mult(2).det()).to.almost.equal(da*4);
    });
    it('calculates a 3x3 determinant',function () {
      const a=Matrix.rand(3),da=a.det();
      expect(a.mult(a).det()).to.almost.equal(da*da);
      expect(a.mult(2).det()).to.almost.equal(da*8);
    });
    it('calculates a 4x4 determinant',function () {
      const a=Matrix.rand(4),da=a.det();
      expect(a.mult(a).det()).to.almost.equal(da*da);
      expect(a.mult(2).det()).to.almost.equal(da*16);
    });
    it('calculates a 8x8 determinant',function () {
      const a=Matrix.rand(8),da=a.det();
      expect(a.mult(a).det()).to.almost.equal(da*da);
      expect(a.mult(2).det()).to.almost.equal(da*256);
    });
  });
  describe('ldiv',function(){
    it('solves an equation correctly', function(){
      const m=Matrix.from([1,2,3,4,2,3,4,1,3,4,1,2,4,1,2,3]);
      const v=Matrix.vect([2,-2,2,-2]);
      expect(m.ldiv(v).toArray()).to.eql(new Float64Array([-1,1,-1,1]));
    })
  })
});