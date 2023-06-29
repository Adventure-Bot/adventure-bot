import { TextChannel, Webhook } from 'discord.js'

type HookName =
  | 'Equipment'
  | 'Status Effects'
  | 'Quests'
  | 'Characters'
  | 'Combat'
  | 'Inventory'
  | 'Roaming Monsters'

export async function getHook({
  name,
  channel,
}: {
  name: HookName
  channel: TextChannel
}): Promise<Webhook | undefined> {
  const webhooks = await channel.fetchWebhooks()
  const existingHook = webhooks.find((hook) => hook.name === name)
  if (existingHook) return existingHook
  return await channel.createWebhook({
    name,
    avatar:
      'https://www.wallpaperup.com/uploads/wallpapers/2013/02/22/43066/33ee1c3920aa37d0b18a0de6cd9796b9.jpg',
    reason: name,
  })
}
