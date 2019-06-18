import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import {isNum, range, mapIter, zipIters,drop} from '../src/tools';

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

describe('isNum', function(){
  it('returns true for a number',function(){
    expect(isNum(0)).to.equal(true);
    expect(isNum(6)).to.equal(true);
    expect(isNum(1e-5)).to.equal(true);
    expect(isNum(Number.NaN)).to.equal(true);
  });
  it('returns false if not a number',function(){
    expect(isNum("5")).to.equal(false);
    expect(isNum({})).to.equal(false);
    expect(isNum([])).to.equal(false);
    expect(isNum()).to.equal(false);
    expect(isNum(null)).to.equal(false);
    expect(isNum(new Date())).to.equal(false);
  });
});

describe('mapIter',function(){
  it('maps an iterable as another iterable',function(){
    let l=0;
    const r = range([1,':',10]),fn=a=>l=a*2;
    const iter = mapIter(r,fn);
    expect(l).to.equal(0);
    expect([...iter]).to.eql([...range([2,'::',2,20])]);
    expect(l).to.equal(20);
  })
});

describe('zipIters',function(){
  it('zips together two arrays',function(){
    expect([...zipIters([1,2,3],[4,5,6])]).to.eql([[1,4],[2,5],[3,6]])
  });
});
