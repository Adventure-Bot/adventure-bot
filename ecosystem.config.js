module.exports = {
  apps: [
    {
      name: 'Adventure Bot',
      script: 'packages/game/src/index.ts',
      watch: ['packages/game/src', 'packages/game/src/index.ts'],
      ignore_watch: ['node_modules'],
    },
  ],
}
