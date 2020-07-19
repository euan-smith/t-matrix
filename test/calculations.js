import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import {gridInterp1, cumsum} from "../src/calculations";
import {from} from "../src/core";
import {rand} from "../src/create";
import {reshape} from "../src/manipulations";
import {magic} from "../src/extras";
import {sum} from "../src/operations";

describe('gridInterp1',function(){
  it('interpolates simple data correctly',function(){
    const r=rand(10,1);
    r.set(v=>v*10);
    expect(gridInterp1([0,':',10],r).toJSON()).to.almost.eql(r.toJSON());
  });
  it('interpolates multi-column v data correctly',function(){
    const d=reshape(from([0,':',32]),3,11).t;
    const r=rand(10,1);
    r.set(v=>v*10);
    const i = gridInterp1(d,r);
    expect(i.get(':',0).toJSON()).to.almost.eql(r.toJSON());
    expect(i.get(':',1).toJSON()).to.almost.eql(r.map(v=>v+11).toJSON());
    expect(i.get(':',2).toJSON()).to.almost.eql(r.map(v=>v+22).toJSON());
  });
  it('interpolates multi-column q data correctly',function(){
    const r=rand(4,4);
    r.set(v=>v*10);
    expect(gridInterp1([0,'::',2,20],r).toJSON()).to.almost.eql(r.map(v=>v*2).toJSON());
  });
  it('throws an error if neither matrix is a column',function(){
    expect(()=>gridInterp1(rand(2,2),rand(2,2))).to.throw();
  });
});

describe('cumsum',function(){
  it('operates on the columns of a matrix', function(){
    const m = magic(4);
    const c = cumsum(m);
    expect(c.get(0,':').toJSON()).to.eql(m.get(0,':').toJSON())
    expect(c.get(3,':').toJSON()).to.eql(sum(m,null,1).toJSON())
  });
  it('operates on the rows of a matrix', function(){
    const m = magic(4);
    const c = cumsum(m,2);
    expect(c.get(':',0).toJSON()).to.eql(m.get(':',0).toJSON())
    expect(c.get(':',3).toJSON()).to.eql(sum(m,null,2).toJSON())
  });
})