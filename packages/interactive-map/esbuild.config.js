const esbuild = require('esbuild');
const copy = require("esbuild-plugin-copy");

const commonConfig = {
    entryPoints: ['src/js/index.ts'],
    bundle: true,
    outfile: 'dist/_ug-im-bundle.js',
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
}

switch (process.argv[2]) {
    case 'production':
        esbuild.build({
            ...commonConfig,
            minify: true
        })
            .catch(() => process.exit(1));
        break;
    case 'development':
        esbuild.context({
            ...commonConfig,
            sourcemap: true,
        })
            .then(ctx => ctx.watch())
            .catch(() => process.exit(1));
        break;
    default:
        throw new Error(`Unknown environment or absence of such: ${process.argv[2]}`);
}