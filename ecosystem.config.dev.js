module.exports = {
  apps: [
    {
      name: 'Game [dev]',
      script: 'yarn',
      args: 'game start',
      env: {
        DATABASE_PATH: '~/.adventure-bot-dev',
        REDUX_DEVTOOLS_ENABLED: true,
        REDUX_DEVTOOLS_PORT: 5011,
        NODE_ENV: 'development',
      },
      interpreter: '/bin/bash',
    },
    {
      name: 'Web [dev]',
      script: 'yarn',
      args: 'web start',
      env: {
        PORT: '8081',
        NODE_ENV: 'development',
      },
      interpreter: '/bin/bash',
    },
  ],
}
