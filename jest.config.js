export default {
  transform: {
    "^.+\\.js$": ["babel-jest", { configFile: "./babel.config.test.mjs" }],
  },
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
