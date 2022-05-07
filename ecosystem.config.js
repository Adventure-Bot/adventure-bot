module.exports = {
  apps: [
    {
      name: 'Adventure Bot',
      script: 'packages/game/.build/index.js',
      watch: true,
      ignore_watch: ['node_modules'],
    },
  ],
}
