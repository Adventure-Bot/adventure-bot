import { RESTPostAPIApplicationCommandsJSONBody } from 'discord.js'

import admin from '@adventure-bot/game/commands/admin/admin'
import cleanse from '@adventure-bot/game/commands/admin/cleanse'
import effect from '@adventure-bot/game/commands/admin/effect'
import encounter from '@adventure-bot/game/commands/admin/encounter'
import item from '@adventure-bot/game/commands/admin/item'
import lootchest from '@adventure-bot/game/commands/admin/lootchest'
import lootme from '@adventure-bot/game/commands/admin/lootme'
import lootmonster from '@adventure-bot/game/commands/admin/lootmonster'
import monster from '@adventure-bot/game/commands/admin/monster'
import adventure from '@adventure-bot/game/commands/adventure'
import attack from '@adventure-bot/game/commands/attack'
// import d20 from '@adventure-bot/game/commands/d20'
import heal from '@adventure-bot/game/commands/heal'
import hp from '@adventure-bot/game/commands/hp'
import hpbartest from '@adventure-bot/game/commands/hpbartest'
import inspect from '@adventure-bot/game/commands/inspect/inspect'
import inventory from '@adventure-bot/game/commands/inventory'
import newgame from '@adventure-bot/game/commands/newgame'
// import list from '@adventure-bot/game/commands/list/list'
import quests from '@adventure-bot/game/commands/quests'
// import renew from '@adventure-bot/game/commands/renew'
import set from '@adventure-bot/game/commands/set'
import { CommandHandler } from '@adventure-bot/game/utils'

const commands = new Map<
  string,
  {
    command: { toJSON(): RESTPostAPIApplicationCommandsJSONBody }
    execute: CommandHandler
  }
>()

commands.set('adventure', adventure)
commands.set('attack', attack)
commands.set('heal', heal)
// commands.set('d20', d20)
commands.set('hp', hp)
commands.set('inspect', inspect)
commands.set('inventory', inventory)
// commands.set('list', list)
commands.set('quests', quests)
// commands.set('renew', renew)
commands.set('set', set)
commands.set('newgame', newgame)
commands.set('admin', admin)

if (process.env.DEV_COMMANDS === 'true') {
  console.warn('⚠ DEV COMMANDS LOADED ⚠')
  commands.set('encounter', encounter)
  commands.set('monster', monster)
  commands.set('item', item)
  commands.set('effect', effect)
  commands.set('cleanse', cleanse)
  commands.set('hpbartest', hpbartest)
  commands.set('lootchest', lootchest)
  commands.set('lootme', lootme)
  commands.set('lootmonster', lootmonster)
  commands.set('lootmonster', lootmonster)
} else {
  console.warn('🔒 Dev commands disabled')
}

export default commands
