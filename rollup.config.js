import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
export default [
  {
    input: 'src/index.umd.ts',
    output: {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'rokka',
      sourcemap: true,
      exports: 'default',
      globals: {
        'form-data': 'FormData',
        'cross-fetch': 'fetch',
      },
    },

    plugins: [
      typescript(),
      commonjs(),
      resolve(),
      terser({
        //        include: [/^.+\.min\.js$/],
        output: {
          comments: false,
        },
      }),
    ],
    external: ['cross-fetch', 'form-data'],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        exports: 'named',
      },
      {
        file: 'dist/index.js',
        format: 'cjs',
        exports: 'named',
      },
    ],

    plugins: [typescript(), commonjs({}), resolve()],
    external: [
      'cross-fetch',
      'form-data',
      'query-string',
      'simple-js-sha2-256',
    ],
  },
]
