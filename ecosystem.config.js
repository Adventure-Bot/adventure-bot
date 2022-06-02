module.exports = {
  apps: [
    {
      name: 'Game',
      script: 'yarn',
      args: 'game start',
      env: {
        DATABASE_PATH: '~/.adventure-bot',
      },
      interpreter: '/bin/bash',
    },
    {
      name: 'Web',
      script: 'yarn',
      args: 'web start',
      env: {
        PORT: '8080',
      },
      interpreter: '/bin/bash',
    },
  ],
}
