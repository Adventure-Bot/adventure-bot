import type { NextApiRequest, NextApiResponse } from 'next'

import { d6, d20 } from '@adventure-bot/game/.build/src/utils/dice'

export default async function GameDice(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  res.json({ d6: d6(), d20: d20() })
}
