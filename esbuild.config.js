// esbuild.config.js
const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['TODO'],
    bundle: true,
    outfile: 'dist/_ug-im-bundle.js',
    minify: false,
    sourcemap: true,
    platform: 'browser',
}).catch(() => process.exit(1));