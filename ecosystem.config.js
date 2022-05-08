module.exports = {
  apps: [
    {
      name: 'Adventure Bot',
      script: 'yarn',
      args: 'game start',
      watch: true,
      ignore_watch: ['node_modules'],
    },
  ],
}
