import {COLS, DATA, ROWS} from "./const";

export function *rows(m){
  const cols = Array.from(m[COLS]);
  for(let r of m[ROWS])
    yield cols.map(c=>m[DATA][r+c]);
}

export function *cols(m){
  const rows = Array.from(m[ROWS]);
  for(let c of m[COLS])
    yield rows.map(r=>m[DATA][r+c]);
}

