import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import {eye,ones,zeros,rand} from "../src/create";
import {diag} from "../src/manipulations";
import {sum,max,min} from "../src/operations";
describe('eye',function(){
  it('returns the identity matrix',function(){
    for (let s=1;s<100;s++){
      const m=eye(s);
      expect(m.size).to.eql([s,s]);
      expect(sum(diag(m))).to.equal(s);
      expect(max(diag(m))).to.equal(1);
      expect(min(diag(m))).to.equal(1);
      expect([...m]).to.eql([...m.t]);
      expect(sum(m)).to.equal(s);
    }
  })
});
describe('zeros',function(){
  it('returns a matrix initialised all with zeros',function(){
    for (let s=1;s<100;s++){
      const m=zeros(s);
      expect(m.size).to.eql([s,s]);
      expect(sum(m)).to.almost.equal(0);
      expect(max(m)).to.equal(0);
      expect(min(m)).to.equal(0);
      expect([...m]).to.eql([...m.t]);
    }
  })
});

describe('ones',function(){
  it('returns a matrix initialised all with ones',function(){
    for (let s=1;s<100;s++){
      const m=ones(s);
      expect(m.size).to.eql([s,s]);
      expect(sum(m)).to.equal(s*s);
      expect(max(m)).to.equal(1);
      expect(min(m)).to.equal(1);
      expect([...m]).to.eql([...m.t]);
    }
  })
});
describe('rand',function(){
  it('returns a matrix initialised all random values',function(){
    for (let s=1;s<100;s++){
      const m=rand(s);
      expect(m.size).to.eql([s,s]);
      expect(max(m)).to.be.lte(1);
      expect(min(m)).to.be.gte(0);
    }
  })
});

