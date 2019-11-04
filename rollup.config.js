import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'rokka',
      sourcemap: true,
      globals: {
        'form-data': 'FormData',
        'cross-fetch': 'fetch'
      }
    },

    plugins: [
      commonjs(),
      resolve(),
      terser({
        include: [/^.+\.min\.js$/],
        sourcemap: true
      })
    ],
    external: ['cross-fetch', 'form-data']
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/index.esm.js',
        format: 'esm'
      },
      {
        file: 'dist/index.js',
        format: 'cjs'
      }
    ],

    plugins: [resolve()],
    external: ['cross-fetch', 'form-data', 'query-string']
  }
]
