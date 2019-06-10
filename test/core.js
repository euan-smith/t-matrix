import chai,{expect} from "chai";
import chaiAlmost from "chai-almost";
chai.use(chaiAlmost());
import {DATA, ROWS, COLS, Matrix} from "../src/core";


describe('Matrix',function(){
  it('creates a matrix',function(){
    const m=new Matrix(4,4,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
    console.log([...m]);
    for(let row of m.rows()) console.log([...row]);
    for(let row of m.t.rows()) console.log([...row]);
  });
});