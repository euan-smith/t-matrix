import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import {magic} from "../src/extras.js";
import {sum,trace} from "../src/operations.js"

describe('magic',function(){
  it('throws if a square of size 2 is requested',function(){
    expect(()=>magic(2)).to.throw();
  });
  it('throws if a square of non-integer size is requested',function(){
    expect(()=>magic(3.5)).to.throw();
  });
  it('produces an nxn magic square where n is odd',function(){
    for (let n=3;n<10;n+=2){
      const t=(n*n*n+n)>>1;
      const m=magic(n);
      expect(m.size).to.eql([n,n]);
      expect(sum(m)).to.equal(n*t);
      const mrs=sum(m,null,1),mcs=sum(m,null,2),md=trace(m);
      expect(Math.max(...mrs)).to.equal(t);
      expect(Math.min(...mrs)).to.equal(t);
      expect(Math.max(...mcs)).to.equal(t);
      expect(Math.min(...mcs)).to.equal(t);
      expect(md).to.equal(t);
    }
  });
  it('produces an nxn magic square where n is doubly even',function(){
    for (let n=4;n<20;n+=4){
      const t=(n*n*n+n)>>1;
      const m=magic(n);
      expect(m.size).to.eql([n,n]);
      expect(sum(m)).to.equal(n*t);
      const mrs=sum(m,null,1),mcs=sum(m,null,2),md=trace(m);
      expect(Math.max(...mrs)).to.equal(t);
      expect(Math.min(...mrs)).to.equal(t);
      expect(Math.max(...mcs)).to.equal(t);
      expect(Math.min(...mcs)).to.equal(t);
      expect(md).to.equal(t);
    }
  });
  it('produces an nxn magic square where n is singly even',function(){
    for (let n=6;n<20;n+=4){
      const t=(n*n*n+n)>>1;
      const m=magic(n);
      expect(m.size).to.eql([n,n]);
      expect(sum(m)).to.equal(n*t);
      const mrs=sum(m,null,1),mcs=sum(m,null,2),md=trace(m);
      expect(Math.max(...mrs)).to.equal(t);
      expect(Math.min(...mrs)).to.equal(t);
      expect(Math.max(...mcs)).to.equal(t);
      expect(Math.min(...mcs)).to.equal(t);
      expect(md).to.equal(t);
    }
  });
});