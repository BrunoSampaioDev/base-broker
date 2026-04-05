module.exports = function babelConfig(api) {
  api.cache(true);

  const plugins = [];

  if (process.env.CYPRESS_COVERAGE === "true") {
    plugins.push("istanbul");
  }

  return {
    presets: ["next/babel"],
    plugins,
  };
};
