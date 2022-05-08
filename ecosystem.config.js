module.exports = {
  apps: [
    {
      name: 'Adventure Bot',
      script: 'yarn',
      args: 'game start',
      interpreter: '/bin/bash',
      ignore_watch: ['node_modules', '.git'],
    },
  ],
}
