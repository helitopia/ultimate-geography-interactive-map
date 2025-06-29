const esbuild = require('esbuild');
const copy = require("esbuild-plugin-copy");

const commonConfig = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/playground-bundle.js',
    platform: 'browser',
    loader: {'.html': 'text'},
    plugins: [
        copy.copy({
            assets: [
                {from: ['./src/index.html'], to: ['./']},
                {from: ['./src/css/*'], to: ['./css']},
                {from: ['./src/js/*'], to: ['./js']},
                {from: ['../../node_modules/interactive-map/dist/_ug-im-bundle.js'], to: ['./']},
                {from: ['../../node_modules/interactive-map/dist/_ug-im-bundle.js.map'], to: ['./']},
                {from: ['../../node_modules/interactive-map/dist/_ug-im-bundle.css'], to: ['./']},
            ]
        })
    ]
};

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
            .then(ctx => ctx.serve({servedir: 'dist'}))
            .catch(() => process.exit(1));
        break;
    default:
        throw new Error(`Unknown environment or absence of such: ${process.argv[2]}`);
}