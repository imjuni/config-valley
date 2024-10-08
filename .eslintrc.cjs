module.exports = {
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ['__test__/*', '__tests__/*', 'examples/*', 'coverage/*', 'dist/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'airbnb-base',
    'airbnb-typescript/base',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    // ----------------------------------------------------------------------------------------------------------
    // eslint
    // ----------------------------------------------------------------------------------------------------------
    'max-len': [
      'error',
      {
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
        ignoreTrailingComments: true,
        code: 120,
      },
    ],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration:not([const=true])',
        message: "Don't declare non-const enums",
      },
    ],
    'class-methods-use-this': 'off',
    // ----------------------------------------------------------------------------------------------------------
    // @typescript-eslint
    // ----------------------------------------------------------------------------------------------------------
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]+',
          match: true,
        },
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        custom: {
          regex: '^T[A-Z]+',
          match: true,
        },
      },
    ],
    '@typescript-eslint/member-delimiter-style': [
      'off',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_.+$',
        argsIgnorePattern: '^_.+$',
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
      },
    ],
    // ----------------------------------------------------------------------------------------------------------
    // eslint-plugin-import
    // ----------------------------------------------------------------------------------------------------------
    'import/prefer-default-export': ['off'],
    'import/no-default-export': ['error'],
  },
  overrides: [
    {
      files: ['**/CE_*.ts'],
      rules: {
        '@typescript-eslint/no-redeclare': ['off'],
        '@typescript-eslint/naming-convention': ['off'],
      },
    },
    {
      files: [
        'src/configs/transforms/transformCreateMode.ts',
        'src/configs/transforms/transformBundleMode.ts',
      ],
      rules: {
        'no-param-reassign': ['off'],
      },
    },
    {
      files: ['**/__tests__/*.ts'],
      rules: {
        'import/no-extraneous-dependencies': ['off'],
        '@typescript-eslint/no-unsafe-member-access': ['off'],
        '@typescript-eslint/no-non-null-assertion': ['off'],
        '@typescript-eslint/no-unsafe-argument': ['off'],
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-unsafe-assignment': ['off'],
        '@typescript-eslint/no-unsafe-return': ['off'],
        '@typescript-eslint/no-use-before-define': ['off'],
        'import/first': ['off'],
        'no-console': ['off'],
      },
    },
    {
      files: ['src/cli/ux/Reasoner.ts'],
      rules: {
        'no-console': ['off'],
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {
        // always try to resolve types under `<root>@types` directory even it doesn't contain any source code,
        // like `@types/unist`
        alwaysTryTypes: true,
        project: 'tsconfig.eslint.json',
      },
    },
  },
};
