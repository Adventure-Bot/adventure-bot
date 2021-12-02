import { manifest } from '../asset-manifest'
import crypto from 'crypto'
import path from 'path'
import { MessageAttachment } from 'discord.js';

function getAsset<
  D extends typeof manifest.data,
  A extends keyof D, 
  B extends keyof D[A]
> (kind: A, entity: B, seed?: string): {
  path: () => string
  attachment: () => MessageAttachment
} {
  // @ts-ignore: TS sucks and is losing context cause the object is deeply nested
  const images = manifest.data[kind][entity]

  let index: number
  if (seed) {
    const hash = crypto.createHash('md5').update(seed).digest('hex')
    index = parseInt(hash, 16) % images.length
  } else {
    index = Math.floor(Math.random() * images.length)
  }
  
  const image = images[index]

  const assetPath = path.join(String(kind), String(entity), image)
  const absolutePath = path.join(manifest.location, assetPath)

  return {
    path: () => absolutePath,
    attachment: () => new MessageAttachment(absolutePath, `${entity}.jpg`)
  }

  // return path.join(manifest.location, String(kind), String(entity), image)
}

export { getAsset }