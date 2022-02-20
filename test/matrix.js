import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import * as Matrix from '../src/matrix.js';

describe('the matrix object',function(){
  it('can be used to create matrices',function(){
    expect([...Matrix.from([1,2,3])]).to.eql([1,2,3]);
  });
  it('can add chainable methods',function(){
    Matrix.mixin(Matrix.sum);
    const m=Matrix.eye(4);
    expect(m.sum()).to.equal(4);
  })
});