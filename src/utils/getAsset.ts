import { manifest } from '../asset-manifest'
import crypto from 'crypto'
import path from 'path'

function getAsset<
  D extends typeof manifest,
  A extends keyof D, 
  B extends keyof D[A]
> (kind: A, entity: B, seed?: string): string {
  // @ts-ignore: TS sucks and is losing context cause the object is deeply nested
  const images = manifest[kind][entity]

  let index: number
  if (seed) {
    const hash = crypto.createHash('md5').update(seed).digest('hex')
    index = parseInt(hash, 16) % images.length
  } else {
    index = Math.floor(Math.random() * images.length)
  }
  
  const image = images[index]
  return path.join(String(kind), String(entity), image)
}

export { getAsset }