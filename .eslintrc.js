module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
    },
    plugins: [
        'import',
        'unicorn',
        '@typescript-eslint/eslint-plugin',
        'unused-imports',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:unicorn/recommended',
        'plugin:eslint-comments/recommended',
    ],
    root: true,
    env: {
        browser: false,
        node: true,
        jest: true,
        es6: true,
    },
    rules: {
        semi: 0,
        '@typescript-eslint/semi': [2, 'always'],
        'no-mixed-spaces-and-tabs': 2,
        curly: [2, 'multi-line'],
        indent: [2, 2, 2],
        quotes: [2, 'single'],
        'padding-line-between-statements': [2,
            {
                blankLine: 'always',
                prev: ['const', 'let', 'var', 'directive'],
                next: '*',
            },
            {
                blankLine: 'any',
                prev: ['const', 'let', 'var', 'directive'],
                next: ['const', 'let', 'var', 'directive'],
            },
        ],
        'no-trailing-spaces': 1,
        'no-multi-spaces': 2,
        'eol-last': [2, 'always'],
        'arrow-parens': [2, 'always'],
        'no-multiple-empty-lines': [2, { max: 2, maxEOF: 0, maxBOF: 0 }],
        'quote-props': [2, 'as-needed'],
        'object-curly-spacing': [2, 'always'],
        '@typescript-eslint/object-curly-spacing': [2, 'always'],
        'comma-dangle': [2, 'always-multiline'],
        'comma-spacing': [2, { before: false, after: true }],
        'lines-between-class-members': 0,
        '@typescript-eslint/lines-between-class-members': 0,
        'space-before-function-paren': 0,
        '@typescript-eslint/space-before-function-paren': [2, 'always'],
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
        ],
        'no-unused-vars': 0,
        '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: false }],
        '@typescript-eslint/no-empty-interface': 0,
        'import/order': [2, {
            'newlines-between': 'always',
            pathGroupsExcludedImportTypes: ['@app/**'],
            pathGroups: [{
                pattern: '@app/**',
                group: 'external',
                position: 'after',
            }],
            alphabetize: {
                order: 'asc',
                caseInsensitive: true,
            },
        }],
        'import/newline-after-import': [2, { count: 2 }],
        'unicorn/import-style': [
            'error',
            {
                styles: {
                    util: false,
                    path: {
                        named: true,
                    },
                },
            },
        ],
        'unicorn/no-null': 0,
        'unicorn/no-new-array': 0,
        'unicorn/no-array-callback-reference': 0,
        'unicorn/prefer-module': 0,
        'unicorn/no-array-reduce': 0,
        'unicorn/no-unsafe-regex': 2,
        'unicorn/prefer-node-protocol': 0,
        'unicorn/prevent-abbreviations': 0,
        'unicorn/prefer-top-level-await': 0,
        'unicorn/prefer-ternary': [2, 'only-single-line'],
        'eslint-comments/no-unused-disable': 2,
        'eslint-comments/no-restricted-disable': [2, '*'],
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        'unicorn/numeric-separators-style': 0,
        '@typescript-eslint/no-namespace': 0,
        'unicorn/prefer-type-error': 0,
        'unicorn/no-process-exit': 0,
        '@typescript-eslint/member-delimiter-style': ['error', {
            multiline: {
                delimiter: 'comma',
                requireLast: true,
            },
            singleline: {
                delimiter: 'comma',
                requireLast: false,
            },
            multilineDetection: 'brackets',
        }],
        '@typescript-eslint/consistent-type-imports': ['error', {
            prefer: 'no-type-imports',
            disallowTypeAnnotations: false,
            fixStyle: 'separate-type-imports',
        }],
        'keyword-spacing': ['error', {
            before: true,
            after: true,
        }],
        'arrow-spacing': ['error', {
            before: true,
            after: true,
        }],
    },
    ignorePatterns: ['**/prisma/src/client/**'],
};
