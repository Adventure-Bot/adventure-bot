module.exports = {
  name: 'Production',
  apps: [
    {
      name: 'Game',
      script: 'yarn',
      args: 'game start',
      env: {
        DATABASE_PATH: '~/.adventure-bot',
        NODE_ENV: 'production',
      },
      interpreter: '/bin/bash',
    },
    {
      name: 'Web',
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
