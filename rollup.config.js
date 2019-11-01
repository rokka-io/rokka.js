import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'rokka',
      sourcemap: true,
      globals: {
        'form-data': 'formData',
        'cross-fetch': 'fetch'
      }
    },
    { file: 'dist/index.esm.js', format: 'es' }
  ],
  plugins: [
    commonjs(),
    resolve(),
    terser({
      include: [/^.+\.min\.js$/],
      sourcemap: true
    })
  ],
  external: ['cross-fetch', 'form-data']
}
