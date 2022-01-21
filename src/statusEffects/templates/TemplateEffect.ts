import { StatusEffect } from '@adventure-bot/statusEffects/StatusEffect'

export type TemplateEffect = Omit<StatusEffect, 'started'>
