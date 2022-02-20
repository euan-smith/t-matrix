import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import {eye,ones,zeros,rand} from "../src/create.js";
import {diag} from "../src/manipulations.js";
import {sum,max,min} from "../src/operations.js";
const sizes = [1,2,3,4,11,17,32,54,89,123];
describe('eye',function(){
  it('returns the identity matrix',function(){
    for (let s of sizes){
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
    for (let s of sizes){
      const m=zeros(s);
      expect(m.size).to.eql([s,s]);
      expect(sum(m)).to.almost.equal(0);
      expect(max(m)).to.equal(0);
      expect(min(m)).to.equal(0);
      expect([...m]).to.eql([...m.t]);
      expect(zeros(m.size).size).to.eql([s,s]);
    }
    expect(zeros().size).to.eql([1,1]);
  })
});

describe('ones',function(){
  it('returns a matrix initialised all with ones',function(){
    for (let s of sizes){
      const m=ones(s);
      expect(m.size).to.eql([s,s]);
      expect(sum(m)).to.equal(s*s);
      expect(max(m)).to.equal(1);
      expect(min(m)).to.equal(1);
      expect([...m]).to.eql([...m.t]);
      expect(ones(m.size).size).to.eql([s,s]);
    }
    expect(ones().size).to.eql([1,1]);
  })
});
describe('rand',function(){
  it('returns a matrix initialised all random values',function(){
    for (let s of sizes){
      const m=rand(s);
      expect(m.size).to.eql([s,s]);
      expect(max(m)).to.be.lte(1);
      expect(min(m)).to.be.gte(0);
    }
  })
});

