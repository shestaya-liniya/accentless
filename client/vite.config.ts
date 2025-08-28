import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import solidPlugin from 'vite-plugin-solid'
import solidSvg from 'vite-plugin-solid-svg'

export default defineConfig({
	plugins: [
		solidPlugin(),
		tailwindcss(),
		solidSvg(),
		checker({
			overlay: false,
			typescript: {
				buildMode: true,
				tsconfigPath: './tsconfig.json',
			},
			enableBuild: true,
		}),
	],
	server: {
		port: 1234,
	},
	build: {
		target: 'esnext',
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@server': path.resolve(__dirname, '../server/src'),
		},
	},
})
