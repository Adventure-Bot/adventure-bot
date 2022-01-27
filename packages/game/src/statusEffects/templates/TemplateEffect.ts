import { StatusEffect } from '@adventure-bot/game/statusEffects'

export type TemplateEffect = Omit<StatusEffect, 'started'>
