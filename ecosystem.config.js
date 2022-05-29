module.exports = {
  apps: [
    {
      name: 'Adventure Bot Game',
      script: 'packages/game/.build',
    },
    {
      name: 'Adventure Bot Web',
      script: 'packages/web/.build',
      env: {
        PORT: '8080',
      },
    },
  ],
}
