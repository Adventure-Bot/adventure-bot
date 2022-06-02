module.exports = {
  apps: [
    {
      name: 'Adventure Bot Game',
      script: 'yarn',
      args: 'game start',
      interpreter: '/bin/bash',
    },
    {
      name: 'Adventure Bot Web',
      script: 'yarn',
      args: 'web start',
      interpreter: '/bin/bash',
    },
  ],
}
