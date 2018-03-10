import typescript from "rollup-plugin-typescript2";
import uglify from "rollup-plugin-uglify";

const outputFile = "./dist/index.js";
const compilerOptions = {
  declaration: false,
};

const config = {
  input: "./src/index.ts",
  output: {
    name: "ToyDom",
    file: outputFile,
    sourcemap: true,
    format: "umd",
  },
  plugins: [
    typescript({
      check: false,
      tsConfigOverride: { compilerOptions },
    }),
  ]
};

export default [
  Object.assign({}, config),
  Object.assign({}, config, {
    output: Object.assign({}, config.output, {
      file: outputFile.replace('.js', '.min.js'),
    }),
    plugins: [
      typescript({
        check: false,
        tsConfigOverride: { compilerOptions },
      }),
      uglify(),
    ],
  }),
];
