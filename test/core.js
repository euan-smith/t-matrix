import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import {Matrix, from, zeros, eye, sum} from "../src/core";



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
  describe('constructor',function(){
    it('creates a matrix',function(){
      const m=new Matrix(2,3,[1,2,3,4,5,6]);
      expect(m.size).to.eql([2,3]);
      expect(m.get(0,1)).to.equal(2);
      expect(m.get(1,0)).to.equal(4);
      expect([...m]).to.eql([1,2,3,4,5,6]);
    });
    it('throws an error if there is not enough data',function(){
      expect(()=>new Matrix(2,3,[1,2])).to.throw();
    });
  });
  describe('instance',function(){
    it('is iterable',function(){
      expect(Array.from(eye(2))).to.eql([1,0,0,1]);
    });
  });
  describe('clone',function(){
    it('produces an identical array',function(){
      const m=new Matrix(2,3,[1,2,3,4,5,6]);
      const mc = m.clone();
      expect([...m]).to.eql([...mc]);
      mc.set(0,0,10);
      expect([...m]).to.not.eql([...mc]);
    });
    it('produces an identical array to a sub array',function(){
      const m=new Matrix(10,10).set(()=>Math.random());
      const mc=m.clone([2,':',5],[2,':',5]);
      expect([...mc]).to.eql([...m.get([2,':',5],[2,':',5])]);
      mc.set(0,0,10);
      expect([...mc]).to.not.eql([...m.get([2,':',5],[2,':',5])]);

    })
  });
  describe('map',function(){
    it('produces a modified different array',function(){
      const m=new Matrix(2,3,[1,2,3,4,5,6]);
      const mc = m.map(v=>v*2);
      expect([...m]).to.eql([1,2,3,4,5,6]);
      expect([...mc]).to.eql([2,4,6,8,10,12]);
    });
  });
  describe('get',function(){
    it('can flip the rows of a matrix',function(){
      const m=new Matrix(2,3,[1,2,3,4,5,6]);
      expect([...m.get([-1,'::',-1,0],':')]).to.eql([4,5,6,1,2,3]);
    });
    it('can flip the cols of a matrix',function(){
      const m=new Matrix(2,3,[1,2,3,4,5,6]);
      expect([...m.get(':',[-1,'::',-1,0])]).to.eql([3,2,1,6,5,4]);
    })
  });
  describe('set',function(){
    it('can set a submatrix',function(){
      const m=zeros(4);
      expect([...m.set([0,1],[0,1],1)]).to.eql([1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0]);
    });
    it('can make one matrix equal another',function(){
      const m=zeros(2);
      expect([...m.set([[1,2],[3,4]])]).to.eql([1,2,3,4]);
    });
    it('can modify matrix contents with a function', function(){
      const m=zeros(2);
      expect([...m.set((v,r,c)=>r*2+c+1)]).to.eql([1,2,3,4]);
    });
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