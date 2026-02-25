import { build } from 'esbuild';

const target = process.argv[2];

const configs = {
  tg: {
    entryPoints: ['src/index.ts'],
    outfile: 'dist/bot.js',
  },
  max: {
    entryPoints: ['src-max/index.ts'],
    outfile: 'dist/max-bot.js',
  },
};

const selected = target === 'max' ? [configs.max] : target === 'tg' ? [configs.tg] : [configs.tg, configs.max];

Promise.all(
  selected.map((cfg) =>
    build({
      bundle: true,
      ...cfg,
      platform: 'node',
      target: 'node22',
      minify: true,
      keepNames: true,
      legalComments: 'none',
      treeShaking: true,
    }),
  ),
).catch(() => process.exit(1));
