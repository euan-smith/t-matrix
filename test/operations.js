import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import {eye,ones,zeros,rand} from "../src/create";
import {diag} from "../src/manipulations";
import {sum,max,min,trace,product, mult, det} from "../src/operations";
import {from, default as Matrix} from "../src/core"

const m=from([[1,2,4],[8,16,32],[64,128,256]]);

describe('max',function(){
  it('returns the row max',function(){
    expect([...max(m,null,1)]).to.eql([64,128,256]);
  });
  it('returns the col max',function(){
    expect([...max(m,null,2)]).to.eql([4,32,256]);
  });
  it('returns the matrix max',function(){
    expect(max(m)).to.equal(256);
  });
  it('maxes two matrices of the same size',function(){
    const ma=max(m,ones(3,3));
    expect(ma.size).to.eql([3,3]);
    expect([...ma]).to.eql([...m]);
  });
  it("throws an error if the dimensions don't match",function(){
    expect(()=>max(m,ones(3,4))).to.throw();
    expect(()=>max(m,ones(4,3))).to.throw();
  });
  it("maxes many matrices",function(){
    const m1=ones(3,3);
    expect([...max(m1,m1,m1,m1,m1,m1,m1,m)]).to.eql([...m]);
  });
  it("maxes row, column, values in the right way", function(){
    expect([...max(3,ones(1,3),ones(3,1))]).to.eql([3,3,3,3,3,3,3,3,3]);
    expect([...max(zeros(3,3),ones(1,3),ones(3,1))]).to.eql([1,1,1,1,1,1,1,1,1]);
  });
  it("nudges arrays to matrices if it can", function(){
    expect([...max([1,2,5],1,[[3,2,1]])]).to.eql([3,2,1,3,2,2,5,5,5]);
  })
});

describe('min',function(){
  it('returns the row min',function(){
    expect([...min(m,null,1)]).to.eql([1,2,4]);
  });
  it('returns the col min',function(){
    expect([...min(m,null,2)]).to.eql([1,8,64]);
  });
  it('returns the matrix min',function(){
    expect(min(m)).to.equal(1);
  });
});

describe('product',function(){
  it('returns the row product',function(){
    expect([...product(m,null,1)]).to.eql([512, 4096, 32768]);
  });
  it('returns the col min',function(){
    expect([...product(m,null,2)]).to.eql([ 8, 4096, 2097152]);
  });
  it('returns the matrix min',function(){
    expect(product(m)).to.equal(68719476736);
  });
  it('multiplies a matrix by a scalar',function(){
    expect([...product(m,2)]).to.eql([2,4,8,16,32,64,128,256,512]);
  })
});


describe('sum',function(){
  it('returns the row min',function(){
    expect([...sum(m,null,1)]).to.eql([73,146,292]);
  });
  it('returns the col min',function(){
    expect([...sum(m,null,2)]).to.eql([7,56,448]);
  });
  it('returns the matrix min',function(){
    expect(sum(m)).to.equal(511);
  });
  it('adds two matrices of the same size',function(){
    const ma=sum(m,ones(3,3));
    expect(ma.size).to.eql([3,3]);
    expect([...ma]).to.eql([2,3,5,9,17,33,65,129,257]);
  });
  it("throws an error if the dimensions don't match",function(){
    expect(()=>sum(m,ones(3,4))).to.throw();
    expect(()=>sum(m,ones(4,3))).to.throw();
  });
  it("adds together many matrices",function(){
    const m1=ones(2,3);
    expect([...sum(m1,m1,m1,m1,m1,m1,m1,m1)]).to.eql([8,8,8,8,8,8]);
  });
  it("adds together row, column, values in the right way", function(){
    expect([...sum(1,ones(1,3),ones(3,1))]).to.eql([3,3,3,3,3,3,3,3,3]);
    expect([...sum(zeros(3,3),ones(1,3),ones(3,1),1)]).to.eql([3,3,3,3,3,3,3,3,3]);
  });
  it("nudges arrays to matrices if it can", function(){
    expect([...sum([2,4,8],1,[[16,32,64]])]).to.eql([19,35,67,21,37,69,25,41,73]);
  })
});

describe('trace',function(){
  it('returns the sum of the diagonal',function(){
    expect(trace(m)).to.equal(273)
  })
});

describe('mult',function(){
  it('multiplies two matrices together',function(){
    expect([...mult(eye(3),m)]).to.eql([...m]);
  });
  it('multiplies n matrices together',function(){
    expect([...mult(eye(3),m,eye(3),eye(3))]).to.eql([...m]);
  });
  it('multiplies to get the correct dimensions',function(){
    expect(mult(ones(2,3),ones(3,5),ones(5,4)).size).to.eql([2,4]);
  });
  it("throws an error if the matrix dimensions don't agree",function(){
    expect(()=>mult(ones(2,3),ones(4,5),ones(5,4)).size).to.throw();
  })
});

describe('det',function () {
  it('calculates a 2x2 determinant',function () {
    expect(det(from([[1,2],[3,4]]))).to.equal(-2);
    const a=rand(2),da=det(a);
    expect(det(mult(a,a))).to.almost.equal(da*da);
    expect(det(product(a,2))).to.almost.equal(da*4);
  });
  it('calculates a 3x3 determinant',function () {
    const a=rand(3),da=det(a);
    expect(det(mult(a,a))).to.almost.equal(da*da);
    expect(det(product(a,2))).to.almost.equal(da*8);
  });
  it('calculates a 4x4 determinant',function () {
    const a=rand(4),da=det(a);
    expect(det(mult(a,a))).to.almost.equal(da*da);
    expect(det(product(a,2))).to.almost.equal(da*16);
  });
  it('calculates a 8x8 determinant',function () {
    const a=rand(8),da=det(a);
    expect(det(mult(a,a))).to.almost.equal(da*da);
    expect(det(product(a,2))).to.almost.equal(da*256);
  });
});


