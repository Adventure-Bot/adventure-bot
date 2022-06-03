module.exports = {
  apps: [
    {
      name: 'Game',
      script: 'yarn',
      args: 'game start',
      env_production: {
        DATABASE_PATH: '~/.adventure-bot',
        NODE_ENV: 'production',
      },
      env_development: {
        DATABASE_PATH: '~/.adventure-bot-dev',
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
    {
      name: 'Web',
      script: 'yarn',
      args: 'web start',
      env_production: {
        PORT: '8080',
        NODE_ENV: 'production',
      },
      env_development: {
        PORT: '8081',
        NODE_ENV: 'development',
      },
      interpreter: '/bin/bash',
    },
  ],
}
