import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import {Matrix, from, mixin, isBinary} from "../src/core";
import {METHOD} from "../src/const";
import {eye,zeros,rand} from "../src/create";
import * as Operations from "../src/operations";
import * as Manipulations from "../src/manipulations"
import {magic} from "../src/extras";


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
    it('creates a binary matrix', function(){
      expect(isBinary(new Matrix(1,1,[1],{binary: true})))
    })
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
    });
    it('can use binary linear addressing', function(){
      const m=magic(4);
      const d = Manipulations.diag(m);
      const b = Operations.bin(eye(4));
      m.get(b);
      expect(m.get(b).toJSON()).to.eql(d.toJSON());
    });
    it('throws an error when the binary addressing does not match', function(){
      const m=magic(4);
      const b = Operations.bin(eye(3));
      expect(()=>m.get(b)).to.throw();
    });
    it('can use binary vector addressing', function(){
      const m=magic(4);
      const b=Operations.bin([1,0,0,1]);
      expect(m.get(b,b).toJSON()).to.eql([ [ 16, 13 ], [ 4, 1 ] ]);
    });
    it('can use linear addressing', function(){
      const m=magic(4);
      console.log(m.toJSON());
      expect(m.get([0,3,12,15]).toJSON()).to.eql([ 16, 13, 4, 1 ]);
      expect(m.get(from([0,3,12,15])).toJSON()).to.eql([ 16, 13, 4, 1 ]);
    })
    it('binary vector addressing throws an error when sizes do not match', function(){
      const m=magic(4);
      const b=Operations.bin([1,0,1]);
      expect(()=>m.get(b,b).toJSON()).to.throw();
    });
    it('can mix different types of index addressing', function(){
      const m=magic(4);
      const b=Operations.bin([1,0,0,1]);
      expect(m.get([0,3],b).toJSON()).to.eql([ [ 16, 13 ], [ 4, 1 ] ]);
      expect(m.get(0,b).toJSON()).to.eql([ [ 16, 13 ] ]);
      expect(m.get(from([[0,3]]),b).toJSON()).to.eql([ [ 16, 13 ], [ 4, 1 ] ]);
    });
    it('returns a column vector', function(){
      const m=magic(3);
      expect(m.get(':').toJSON()).to.eql([8,1,6,3,5,7,4,9,2])
    });
    it('gets a submatrix of a binary matrix', function(){
      const m=Operations.bin(magic(4).map(v=>v%2));
      const s = m.get([0,1],[0,1]);
      expect(isBinary(s));
      expect(s.toJSON()).to.eql([[0,0],[1,1]]);
      s.set(0,0,2);
      expect(m.get(0,0)).to.equal(1);
    })
  });
  describe('set',function(){
    it('can set a submatrix',function(){
      const m=zeros(4);
      expect([...m.set([0,1],[0,1],2)]).to.eql([2,2,0,0,2,2,0,0,0,0,0,0,0,0,0,0]);
    });
    it('can make one matrix equal another',function(){
      const m=zeros(2);
      expect([...m.set([[1,2],[3,4]])]).to.eql([1,2,3,4]);
    });
    it('can modify matrix contents with a function', function(){
      const m=zeros(2);
      expect([...m.set((v,r,c)=>r*2+c+1)]).to.eql([1,2,3,4]);
    });
    it('throws an error when the set size does not match',function(){
      expect(()=>eye(3).set(eye(2))).to.throw();
    });
    it('can use a binary matrix to set values', function(){
      const m=rand(10).map(v=>v-0.5);
      const b=Operations.bin(m,v=>v<0);
      m.set(b,0);
      expect(Operations.sum(m.get(b))).to.equal(0);
    });
    it('can ensure set binary matrix values are restricted to 1 or 0', function(){
      const m=Operations.bin(zeros(3));
      m.set(0,0,3);
      m.set(0,[1,2],4);
      m.set([1,2],0,(v,r,c)=>r+c);
      m.set([1,2],[1,2],[[0,1],[1,0]]);
      expect(m.toJSON()).to.eql([[1,1,1],[0,0,1],[1,1,0]]);
      m.set(0,0,false);
      m.set(0,[1,2],0);
      expect(m.toJSON()).to.eql([[0,0,0],[0,0,1],[1,1,0]]);
    })
  });
  describe('toJSON',function(){
    it('can serialise to a nested array',function(){
      const m=eye(2);
      expect(JSON.stringify(m)).to.equal("[[1,0],[0,1]]");
    })
    it('can serialise a column vector to a simple array', function(){
      const m=from([1,2,3,4]);
      expect(JSON.stringify(m)).to.equal("[1,2,3,4]")
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
  });
  it('throws an error with unsupported data',function(){
    expect(()=>from(0)).to.throw();
    expect(()=>from(null)).to.throw();
    expect(()=>from('foo')).to.throw();
    expect(()=>from(['foo'])).to.throw();
    expect(()=>from([[1],[2,3]])).to.throw();
  });
  it('returns a matrix when passed',function(){
    const m=eye(4);
    expect(from(m)).to.equal(m);
  });
  it('can create a matrix from a range specification',function(){
    expect([...from([1,':',5])]).to.eql([1,2,3,4,5])
  });
});
describe('mixin',function(){
  it('adds a METHOD to the matrix prototype',function(){
    const foo=()=>"foo";
    foo[METHOD]="foo";
    const m=zeros(4);
    expect(m).to.not.have.a.property('foo');
    mixin(foo);
    expect(m).to.have.a.property('foo');
    expect(m.foo()).to.equal("foo");
  });
  it('adds a custom function to the matrix prototype',function(){
    const bar=()=>"bar";
    const m=zeros(4);
    expect(m).to.not.have.a.property('bar');
    mixin('bar',bar);
    expect(m).to.have.a.property('bar');
    expect(m.bar()).to.equal("bar");
  });
  it('adds a load of in-built methods at a time',function(){
    mixin(Operations);
    expect(zeros(4)).to.have.a.property('sum');
  });
  it('does not add object properties which are not methods',function(){
    mixin({baz:'bar'});
    expect(zeros(4)).to.not.have.a.property('baz');
  })
});