module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',

    'plugin:import/typescript',

    'plugin:import/recommended',
    'next/core-web-vitals',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },

  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  globals: {
    // cy: true,
    // jest: true,
    es2021: true,
  },
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/quotes': ['error', 'single'],
    'import/no-unresolved': 'error',
    'import/no-duplicates': 'error',
    'import/no-unused-modules': 'error',
    'import/order': [
      'error',
      {
        groups: ['external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
    // 'import/order': [
    //   'error',
    //   {
    //     alphabetize: { order: 'asc', caseInsensitive: true },
    //     groups: [
    //       'builtin',
    //       'external',
    //       'internal',
    //       ['parent', 'sibling', 'index'],
    //       'object',
    //     ],
    //     pathGroups: [{ pattern: '@/**', group: 'internal' }],
    //     'newlines-between': 'always',
    //   },
    // ],

    'import/no-cycle': 'error',

    'react/display-name': 'off',
  },
  overrides: [
    {
      files: ['next.config.js', 'tailwind.config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],

  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['./tsconfig.json'],
      },
      node: true,
    },
  },
}
