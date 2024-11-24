module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  roots: ["<rootDir>/tests"],
  moduleFileExtensions: ["ts", "js", "json", "tsx", "jsx", "node"],
  coverageDirectory: "./coverage",
  collectCoverageFrom: ["src/**/*.ts"],
};
