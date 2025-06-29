const esbuild = require('esbuild');
const copy = require("esbuild-plugin-copy");

esbuild.build({
    entryPoints: ['src/js/index.ts'],
    bundle: true,
    outfile: 'dist/_ug-im-bundle.js',
    sourcemap: true,
    // minify: true,
    platform: 'browser',
    plugins: [
        copy.copy({
            assets: [
                {
                    from: ['./src/html/Country - Map [Experimental].html'],
                    to: ['./']
                }
            ]
        })
    ]
}).catch(() => process.exit(1));