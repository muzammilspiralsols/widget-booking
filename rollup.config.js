import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import * as sass from "sass";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/widget.js",
      format: "iife",
      name: "HotelBookingWidget",
      sourcemap: !production,
    },
    {
      file: "dist/widget.min.js",
      format: "iife",
      name: "HotelBookingWidget",
      plugins: production ? [terser()] : [],
    },
     
  ],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      sourceMap: !production,
      inlineSources: !production,
    }),
    postcss({
      extract: "widget.css",
      minimize: production,
      sourceMap: !production,
      use: {
        sass: sass,
      },
    }),
    ...(production ? [terser()] : []),
  ],
  watch: {
    clearScreen: false,
  },
};
