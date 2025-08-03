/* eslint-disable */
module.exports = {
  apps: [
    {
      name: 'tg-bot',
      script: './dist/bot.js', // путь к сборке
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
