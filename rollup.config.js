import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
export default [
  {
    input: 'src/index.ts',
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
      typescript(),
      commonjs(),
      resolve(),
      terser({
        include: [/^.+\.min\.js$/],
        sourcemap: true,
        output: {
          comments: false
        }
      })
    ],
    external: ['cross-fetch', 'form-data']
  },
  {
    input: 'src/index.ts',
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

    plugins: [typescript(), resolve()],
    external: ['cross-fetch', 'form-data', 'query-string']
  }
]
