import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import {isNum, range} from '../src/tools';

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
