const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['src/init.js'],
    bundle: true,
    outfile: 'dist/_ug-im-bundle.js',
    minify: true,
    platform: 'browser',
}).catch(() => process.exit(1));