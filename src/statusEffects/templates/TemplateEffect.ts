import { StatusEffect } from '@adventure-bot/statusEffects'

export type TemplateEffect = Omit<StatusEffect, 'started'>
