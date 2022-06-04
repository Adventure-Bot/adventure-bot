module.exports = {
  apps: [
    {
      name: 'game',
      script: 'yarn',
      args: 'game start',
      env: {
        DATABASE_PATH: '/home/brian/.adventure-bot', // TODO: make this not hardcoded
        NODE_ENV: 'production',
        REDUX_DEVTOOLS_ENABLED: true,
        REDUX_DEVTOOLS_PORT: 8000,
      },
      interpreter: '/bin/bash',
    },
    {
      name: 'redux-devtools',
      script: 'yarn',
      args: 'game redux-devtools',
      interpreter: '/bin/bash',
    },
    {
      name: 'web',
      script: 'yarn',
      args: 'web start',
      env: {
        PORT: '8080',
        NODE_ENV: 'production',
      },
      interpreter: '/bin/bash',
    },
  ],
}
