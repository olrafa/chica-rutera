module.exports = {
  extends: [
    "react-app",
    "react-app/jest",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["simple-import-sort"],
  ignorePatterns: ["**/*.css", "**/*.scss"],
  rules: {
    "no-duplicate-imports": "error",
    camelcase: "error",
    complexity: "warn",
    "default-case": "error",
    "default-case-last": "error",
    "default-param-last": "error",
    "dot-notation": "error",
    eqeqeq: "error",
    "max-lines": ["warn", 500],
    "no-console": "warn",
    "no-else-return": "error",
    "no-empty": "error",
    "no-empty-function": "error",
    "no-unneeded-ternary": "warn",
    "no-useless-return": "warn",
    "prefer-destructuring": [
      "warn",
      {
        array: true,
        object: true,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    "require-await": "warn",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          ["^react$", "^[a-z]"],
          ["^@"],
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          ["^.+\\.s?css$"],
          ["^\\u0000"],
        ],
      },
    ],
  },
};
