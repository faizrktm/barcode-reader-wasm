import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import serve from 'rollup-plugin-serve';
import OMT from '@surma/rollup-plugin-off-main-thread';
import filesize from 'rollup-plugin-filesize';
import del from 'rollup-plugin-delete';
import { wasm } from '@rollup/plugin-wasm';

function html() {
  return {
    generateBundle() {
      this.emitFile({type: 'asset', fileName: 'index.html', source: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Barcode Scanner</title>
  <link rel="stylesheet" href="./index.css">
</head>
<body>
  <div id="root"></div>
  <script src="./index.js" defer=""></script>
</body>
</html>`})
    }
  };
}

const production = !process.env.ROLLUP_WATCH;
const productionRun = process.env.RUN_SERVER;

export default {
	input: 'src/index.js',
	output: {
		sourcemap: true,
		format: 'amd',
		name: 'app',
		dir: 'public'
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			},
			include: 'src/**/*.svelte',
		}),

		// Tell any third-party plugins that we're building for the browser
		nodeResolve({
			browser: true,
			dedupe: ['svelte']
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		commonjs({
			include: 'node_modules/**',
		}),

		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'index.css' }),

		// In dev mode run dev server
		// the bundle has been generated
		(!production || productionRun) && serve('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
    
    // show bundle size
    production && filesize(),

		// html template
		html(),

		// wasm loader
		wasm(),

		// off main thread / worker loader
		OMT(),
		
		// clean public before bundling
		production && del({ targets: 'public/*' }),
	],
	watch: {
		clearScreen: false
	}
};