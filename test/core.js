import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import {Matrix, range, from, zeros, eye, sum} from "../src/core";


describe('range',function(){
  it('creates a range 0:2',function(){
    expect([...range([0,':',2])]).to.eql([0,1,2]);
  });
  it('creates a range 2::-1,0',function(){
    expect([...range([2,'::',-1,0])]).to.eql([2,1,0]);
  });
  it('creates a range :2',function(){
    expect([...range([':',2])]).to.eql([0,1,2]);
  });
  it('creates a range : for length 3',function(){
    expect([...range([':'],3)]).to.eql([0,1,2]);
  });
});
describe('eye',function(){
  it('returns the identity matrix',function(){
    const m=eye(4);
    expect(m.size).to.eql([4,4]);
    expect([...m.diag()]).to.eql([1,1,1,1]);
    expect([...m]).to.eql([...m.t]);
    expect(sum(m)).to.equal(4);
  })
});
describe('Matrix',function(){
  it('creates a matrix',function(){
    const m=new Matrix(2,3,[1,2,3,4,5,6]);
    expect(m.size).to.eql([2,3]);
    expect(m.get(0,1)).to.equal(2);
    expect(m.get(1,0)).to.equal(4);
    expect([...m]).to.eql([1,4,2,5,3,6]);
  });
  describe('get',function(){
    it('can flip the rows of a matrix',function(){
      const m=new Matrix(2,3,[1,2,3,4,5,6]);
      expect([...m.get([-1,'::',-1,0],':')]).to.eql([4,1,5,2,6,3]);
    });
    it('can flip the cols of a matrix',function(){
      const m=new Matrix(2,3,[1,2,3,4,5,6]);
      expect([...m.get(':',[-1,'::',-1,0])]).to.eql([3,6,2,5,1,4]);
    })
  });
  describe('set',function(){
    it('can set a submatrix',function(){
      const m=zeros(4);
      expect([...m.set([0,1],[0,1],1)]).to.eql([1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0]);
    });
    it('can make one matrix equal another',function(){
      const m=zeros(2);
      expect([...m.set([[1,2],[3,4]])]).to.eql([1,3,2,4]);
    })
  })
});
describe('from',function(){
  it('creates a column matrix',function(){
    expect(from([1,2,3]).size).to.eql([3,1]);
  });
  it('creates a row matrix',function(){
    expect(from([[1,2,3]]).size).to.eql([1,3]);
  });
  it('creates a general matrix',function(){
    expect(from([[1,2],[3,4]]).size).to.eql([2,2]);
  })
});