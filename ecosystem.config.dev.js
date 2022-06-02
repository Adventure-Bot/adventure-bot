module.exports = {
  apps: [
    {
      name: '[dev] Adventure Bot Game',
      script: 'yarn',
      args: 'game start',
      env: {
        DATABASE_PATH: '~/.adventure-bot-dev',
        REDUX_DEVTOOLS_ENABLED: true,
        REDUX_DEVTOOLS_PORT: 5011,
      },
      interpreter: '/bin/bash',
    },
    {
      name: '[dev] Adventure Bot Web',
      script: 'yarn',
      args: 'web start',
      env: {
        PORT: '8081',
      },
      interpreter: '/bin/bash',
    },
  ],
}
