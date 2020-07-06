import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import {zeros,rand,eye} from "../src/create";
import {diag, reshape, swapCols, swapRows, repmat, hcat, vcat, cat, shift} from "../src/manipulations";
import {sum} from "../src/operations";
import {from} from "../src/core";

function *skip(iter,N){
  let n=0;
  for(let i of iter){
    if (!n){
      n=N;
      yield i;
    }
    n--;
  }
}

describe('diag',function(){
  it('converts a square matrix to a column vector of the diagonal',function(){
    const m=rand(10);
    const v=diag(m);
    expect(v.size).to.eql([10,1]);
    expect([...v]).to.eql([...skip(m,11)]);
  });
  it('converts a column vector into a square matrix with the set diagonal',function(){
    const v=rand(10,1);
    const m=diag(v);
    expect(m.size).to.eql([10,10]);
    expect([...v]).to.eql([...skip(m,11)]);
    expect(sum(v)).to.almost.equal(sum(m));
  });
  it('deals with wide or tall matrices',function(){
    expect(diag(zeros(10,5)).size).to.eql([5,1]);
    expect(diag(zeros(10,20)).size).to.eql([10,1]);
  })
});

describe('reshape',function(){
  it('changes the shape of a matrix, retaining the row-major element order',function(){
    const m=rand(10);
    expect([...reshape(m,5,20)]).to.eql([...m]);
    expect([...reshape(m.t,5,20)]).to.not.eql([...m]);
  })
});

describe('swapRows',function(){
  it('exchanges a set of rows',function(){
    const m=eye(4);
    m.set(0,3,1);
    expect([...swapRows(m,0,3)]).to.eql([0,0,0,1, 0,1,0,0, 0,0,1,0, 1,0,0,1]);
  })
});

describe('swapCols',function(){
  it('exchanges a set of columns',function(){
    const m=eye(4);
    m.set(0,3,1);
    expect([...swapCols(m,0,3)]).to.eql([1,0,0,1, 0,1,0,0, 0,0,1,0, 1,0,0,0]);
  })
});

describe('repmat',function(){
  it('repeats a matrix',function(){
    const m=from([[1,2],[3,4]]);
    expect([...repmat(m,2,2)]).to.eql([1,2,1,2, 3,4,3,4, 1,2,1,2, 3,4,3,4]);
  });
  it('defaults to no repeat on rows and/or cols',function(){
    const m=from([[1,2],[3,4]]);
    expect([...repmat(m)]).to.eql([...m]);
  });
});

describe('concat',function(){
  it('hcat concats horizontally',function(){
    const m=from([[1,2],[3,4]]);
    expect(hcat(m,m).toJSON()).to.eql([[1,2,1,2],[3,4,3,4]]);
  });
  it("hcat throws an error if the sizes don't match",function(){
    expect(()=>hcat([1,2],[1,2,3])).to.throw();
  });
  it('vcat concats vertically',function(){
    const m=from([[1,2],[3,4]]);
    expect(vcat(m,m).toJSON()).to.eql([[1,2],[3,4],[1,2],[3,4]]);
  });
  it("vcat throws an error if the sizes don't match",function(){
    expect(()=>vcat([[1,2]],[[1,2,3]])).to.throw();
  });
});

describe('shift', function(){
  it('shifts a matrix', function(){
    const m=from([[1,2,3],[4,5,6],[7,8,9]]);
    expect(shift(m).toJSON()).to.eql([[1,2,3],[4,5,6],[7,8,9]])
    expect(shift(m,0).toJSON()).to.eql([[1,2,3],[4,5,6],[7,8,9]])
    expect(shift(m,0,0).toJSON()).to.eql([[1,2,3],[4,5,6],[7,8,9]])
    expect(shift(m,1,0).toJSON()).to.eql([[7,8,9],[1,2,3],[4,5,6]])
    expect(shift(m,0,1).toJSON()).to.eql([[3,1,2],[6,4,5],[9,7,8]])
    expect(shift(m,1,1).toJSON()).to.eql([[9,7,8],[3,1,2],[6,4,5]])
    expect(shift(m,2,2).toJSON()).to.eql(shift(m,-1,-1).toJSON())
    expect(shift(m,0,0).toJSON()).to.eql(shift(m,3,3).toJSON())
    expect(shift(m.get(0,':'),0).toJSON()).to.eql([[1,2,3]])
    expect(shift(m.get(0,':'),1).toJSON()).to.eql([[3,1,2]])
    expect(shift(m.get(':',0),0).toJSON()).to.eql([1,4,7])
    expect(shift(m.get(':',0),1).toJSON()).to.eql([7,1,4])
    expect(()=>shift(m,'foo')).to.throw();
  })
})