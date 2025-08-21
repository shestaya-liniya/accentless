import pluginJs from '@eslint/js'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import * as solidEslintPlugin from 'eslint-plugin-solid'
import globals from 'globals'
import * as tslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ['**/*.{js,mjs,cjs,ts,tsx}'],
		languageOptions: {
			globals: globals.browser,
		},
		plugins: {
			'simple-import-sort': simpleImportSortPlugin,
			'solid-eslint': solidEslintPlugin,
		},
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
		},
	},
	{
		files: ['src/global/actions/**/*'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},
	pluginJs.configs.recommended,
	...tslint.configs.recommended,
]
