// import pkg from "./package.json" assert {type: 'json'};
import typescript from '@rollup/plugin-typescript';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default {
  input: './src/index.ts',
  output: [
    {
      file: `dist/${pkg.name}.pro.esm.js`,
      format: 'esm'
    },
    {
      file: `dist/${pkg.name}.pro.umd.js`,
      format: 'umd',
      name: 'ReactVirtual',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
  ],
  plugins: [
    typescript({compilerOptions: {"jsx": "react"}})
  ],
  external: [
    "react",
    "react-dom"
  ]
}