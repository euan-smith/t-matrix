// rollup.config.js
import nodeResolve  from 'rollup-plugin-node-resolve';
import json         from 'rollup-plugin-json';

export default [
  {
    input: 'src/matrix.js',
    external:['events'],
    output: [
      {
        file: 'index.mjs',
        format: 'es',
      },
      {
        file: 'index.js',
        format: 'cjs',
      },
    ],
    plugins: [
      nodeResolve({jsnext: true}), // load npm modules from npm_modules
      json(), // avoid the package.json parsing issue
    ],
  },
];

