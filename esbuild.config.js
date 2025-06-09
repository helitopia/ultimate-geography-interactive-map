const esbuild = require('esbuild');
const copy = require("esbuild-plugin-copy");

esbuild.build({
    entryPoints: ['src/init.js'],
    bundle: true,
    outfile: 'dist/_ug-im-bundle.js',
    minify: true,
    platform: 'browser',
    plugins: [
        copy.copy({
            assets: [
                {
                    from: ['./src/Country - Map [Experimental].html'],
                    to: ['./']
                }
            ]
        })
    ]
}).catch(() => process.exit(1));