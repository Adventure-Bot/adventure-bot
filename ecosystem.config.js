module.exports = {
  apps: [
    {
      name: 'Adventure Bot Game',
      script: 'packages/game/.build',
    },
    {
      name: 'Adventure Bot Web',
      script: 'packages/web/.next',
      env: {
        PORT: '8080',
      },
    },
  ],
}
