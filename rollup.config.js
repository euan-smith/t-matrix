// rollup.config.js
import nodeResolve  from 'rollup-plugin-node-resolve';
import commonjs     from 'rollup-plugin-commonjs';
import babel        from 'rollup-plugin-babel';
import json         from 'rollup-plugin-json';

export default {
  input: 'index.js',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/bundle.mjs',
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    nodeResolve({ jsnext: true }), // load npm modules from npm_modules
    json(), // avoid the package.json parsing issue
    commonjs(), // convert CommonJS modules to ES6
    babel(), // convert to ES5
  ]
};

