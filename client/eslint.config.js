import pluginJs from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
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
			import: importPlugin,
		},
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
			'import/no-relative-packages': 'error',
		},
		settings: {
			'import/resolver': {
				alias: {
					map: [['@', './src']],
					extensions: ['.ts', '.tsx', '.js', '.jsx'],
				},
			},
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
