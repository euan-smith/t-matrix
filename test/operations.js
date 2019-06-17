import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import {eye,ones,zeros,rand} from "../src/create";
import {diag} from "../src/manipulations";
import {sum,max,min,trace} from "../src/operations";
import {from} from "../src/core"

const m=from([[1,2,4],[8,16,32],[64,128,256]]);

describe('max',function(){
  it('returns the row max',function(){
    expect([...max(m,1)]).to.eql([64,128,256]);
  });
  it('returns the col max',function(){
    expect([...max(m,2)]).to.eql([4,32,256]);
  });
  it('returns the matrix max',function(){
    expect(max(m)).to.equal(256);
  });
});

describe('min',function(){
  it('returns the row min',function(){
    expect([...min(m,1)]).to.eql([1,2,4]);
  });
  it('returns the col min',function(){
    expect([...min(m,2)]).to.eql([1,8,64]);
  });
  it('returns the matrix min',function(){
    expect(min(m)).to.equal(1);
  });
});


describe('sum',function(){
  it('returns the row min',function(){
    expect([...sum(m,1)]).to.eql([73,146,292]);
  });
  it('returns the col min',function(){
    expect([...sum(m,2)]).to.eql([7,56,448]);
  });
  it('returns the matrix min',function(){
    expect(sum(m)).to.equal(511);
  });
});

describe('trace',function(){
  it('returns the sum of the diagonal',function(){
    expect(trace(m)).to.equal(273)
  })
});