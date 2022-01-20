import { StatusEffect } from '../StatusEffect'

export type TemplateEffect = Omit<StatusEffect, 'started'>
