/* eslint-disable */
module.exports = {
  apps: [
    {
      name: 'tg-bot',
      script: './dist/bot.js',
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
