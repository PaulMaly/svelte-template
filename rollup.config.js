import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import eslint from 'rollup-plugin-eslint';
import visualizer from 'rollup-plugin-visualizer';
import includePaths from 'rollup-plugin-includepaths';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js',
  },
  moduleContext: {
    'node_modules/whatwg-fetch/fetch.js': 'window',
  },
  plugins: [
    eslint({
      include: [
        './src/**.js',
        './src/**.html',
      ],
    }),
    includePaths({
      include: {},
      paths: ['src'],
      external: [],
      extensions: ['.js', '.json', '.html'],
    }),
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: (css) => {
        css.write('public/bundle.css');
      },
      // this results in smaller CSS files
      cascade: false,
      shared: false,
      hydratable: false,
    }),
    resolve({
      browser: true,
    }),
    commonjs(),
    // If we're building for production (npm run build
    // instead of npm run dev), transpile and minify
    production && babel({
      exclude: [
        'node_modules/core-js/**',
        'node_modules/babel-runtime/**',
      ],
      runtimeHelpers: true,
      babelrc: true,
    }),
    production && uglify(),
    // visualizer({
    //   sourcemap: false,
    // }),
  ],
};
