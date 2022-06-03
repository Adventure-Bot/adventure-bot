module.exports = {
  apps: [
    {
      name: 'Game.dev',
      script: 'yarn',
      args: 'game start',
      env: {
        DATABASE_PATH: '/home/brian/.adventure-bot-dev', // TODO: make this not hardcoded
        NODE_ENV: 'development',
        REDUX_DEVTOOLS_ENABLED: true,
        REDUX_DEVTOOLS_PORT: 8000,
      },
      interpreter: '/bin/bash',
    },
    {
      name: 'Redux Devtools',
      script: 'yarn',
      args: 'game redux-devtools',
      interpreter: '/bin/bash',
    },
    // TODO: port is not honored
    // {
    //   name: 'Web.dev',
    //   script: 'yarn',
    //   args: 'web start',
    //   env: {
    //     PORT: '8081',
    //     NODE_ENV: 'development',
    //   },
    //   interpreter: '/bin/bash',
    // },
  ],
}
