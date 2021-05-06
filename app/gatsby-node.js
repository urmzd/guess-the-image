const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

exports.onCreateWebpackConfig = ({ actions, plugins, target, resolve }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        child_process: false,
        fs: false,
        util: false,
        net: false,
        tls: false,
      },
    },
    target: "node",
    plugins: [new NodePolyfillPlugin()],
  });
};
