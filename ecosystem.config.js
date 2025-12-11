// @ts-expect-error
module.exports = {
  apps: [
    {
      name: 'car-service-tg-bot',
      script: 'npm',
      args: 'run start',
      cwd: '/root/car-service-tg-bot',
    },
  ],
};
