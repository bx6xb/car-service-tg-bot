import { build } from 'esbuild';

build({
  bundle: true,
  entryPoints: ['src/index.ts'],
  outfile: 'dist/bot.js',
  platform: 'node',
  target: 'node22',
  minify: true,
  keepNames: true,
  legalComments: 'none',
  treeShaking: true,
}).catch(() => process.exit(1));
