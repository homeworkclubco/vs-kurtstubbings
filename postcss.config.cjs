module.exports = {
  plugins: [
    require("autoprefixer"),
    require("postcss-import"),
    require("@csstools/postcss-color-mix-function"),
    require("postcss-ruler")({
      minWidth: 375,
      maxWidth: 1760,
      generateAllCrossPairs: true,
    }),
    require("@csstools/postcss-global-data")({
      files: [require.resolve("./src/styles/breakpoints.css")],
    }),
    require("postcss-custom-media")({
      preserve: false,
    }),
    require("postcss-nested"),
  ],
};
