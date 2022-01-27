import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types'

import admin from '@adventure-bot/commands/admin/admin'
import cleanse from '@adventure-bot/commands/admin/cleanse'
import encounter from '@adventure-bot/commands/admin/encounter'
import item from '@adventure-bot/commands/admin/item'
import lootchest from '@adventure-bot/commands/admin/lootchest'
import lootme from '@adventure-bot/commands/admin/lootme'
import lootmonster from '@adventure-bot/commands/admin/lootmonster'
import adventure from '@adventure-bot/commands/adventure'
import attack from '@adventure-bot/commands/attack'
import cooldowns from '@adventure-bot/commands/cooldowns'
import d20 from '@adventure-bot/commands/d20'
import dance from '@adventure-bot/commands/dance'
import db from '@adventure-bot/commands/db'
import heal from '@adventure-bot/commands/heal'
import hp from '@adventure-bot/commands/hp'
import hpbartest from '@adventure-bot/commands/hpbartest'
import inspect from '@adventure-bot/commands/inspect/inspect'
import inventory from '@adventure-bot/commands/inventory'
import list from '@adventure-bot/commands/list/list'
import quests from '@adventure-bot/commands/quests'
import renew from '@adventure-bot/commands/renew'
import set from '@adventure-bot/commands/set'
import { CommandHandler } from '@adventure-bot/utils'

const commands = new Map<
  string,
  {
    command: { toJSON(): RESTPostAPIApplicationCommandsJSONBody }
    execute: CommandHandler
  }
>()
commands.set('adventure', adventure)
commands.set('attack', attack)
commands.set('cooldowns', cooldowns)
commands.set('dance', dance)
commands.set('heal', heal)
commands.set('d20', d20)
commands.set('hp', hp)
commands.set('inspect', inspect)
commands.set('inventory', inventory)
commands.set('list', list)
commands.set('quests', quests)
commands.set('renew', renew)
commands.set('set', set)

if (process.env.DEV_COMMANDS === 'true') {
  commands.set('db', db)
  console.warn('⚠ DEV COMMANDS LOADED ⚠')
  commands.set('admin', admin)
  commands.set('encounter', encounter)
  commands.set('item', item)
  commands.set('cleanse', cleanse)
  commands.set('hpbartest', hpbartest)
  commands.set('lootchest', lootchest)
  commands.set('lootme', lootme)
  commands.set('lootmonster', lootmonster)
} else {
  console.warn('🔒 Dev commands disabled')
}

export default commands
