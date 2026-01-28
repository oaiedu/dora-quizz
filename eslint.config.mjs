import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  // Base JavaScript recommended rules
  js.configs.recommended,

  // Vue 3 recommended rules
  ...pluginVue.configs['flat/recommended'],

  // Prettier integration
  prettierConfig,

  {
    files: ['**/*.{js,vue}'],
    plugins: {
      prettier
    },
    rules: {
      // Prettier as ESLint rule
      'prettier/prettier': 'error',

      // Vue-specific rules
      'vue/multi-word-component-names': 'off', // Allow single-word component names
      'vue/require-default-prop': 'error',
      'vue/require-prop-types': 'error',
      'vue/no-unused-vars': 'error',
      'vue/no-v-html': 'warn', // Warn but allow (needed for rich descriptions)

      // JavaScript best practices (Senior-level code quality)
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-implicit-coercion': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-with': 'error',

      // Code quality (adjusted for scenario management complexity)
      complexity: ['warn', 15], // Increased for scenario validation logic
      'max-depth': ['warn', 4],
      'max-lines-per-function': ['warn', { max: 60, skipBlankLines: true, skipComments: true }],
      'max-params': ['warn', 4],

      // Prevent common mistakes
      'no-duplicate-imports': 'off', // Allow for better code organization
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'require-atomic-updates': 'error'
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        console: 'readonly'
      }
    }
  },

  // Ignore patterns
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '.vscode/**', '.git/**', '*.min.js']
  }
]
