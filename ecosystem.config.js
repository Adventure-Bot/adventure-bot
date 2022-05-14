module.exports = {
  apps: [
    {
      name: 'Adventure Bot Game',
      script: 'packages/game/.build',
    },
    {
      name: 'Adventure Bot Web',
      script: 'yarn',
      args: 'web start',
      env: {
        PORT: '8080',
      },
      interpreter: '/bin/bash',
    },
  ],
}
