const package = require("./package.json");

module.exports = {
  input: './src/index.ts',
  output: [
    {
      file: `dist/pro.esm.js`,
      format: 'esm'
    },
    {
      file: `dist/pro.umd.js`,
      format: 'umd',
      name: 'Test'
    }
  ]
}