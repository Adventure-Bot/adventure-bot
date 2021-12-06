import { manifest, Manifest } from '../asset-manifest'
import crypto from 'crypto'
import path from 'path'
import { MessageAttachment } from 'discord.js';

function getAsset<
  Theme extends keyof Manifest, 
  Kind extends keyof Manifest[Theme],
  Entity extends Manifest[Theme][Kind]
> (theme: Theme, kind: Kind, entity: Entity, seed?: string): {
  path: () => string
  attachment: () => MessageAttachment
  attachmentString: () => string
  s3Url: () => string
} {
  // @ts-ignore: TS sucks and is losing context cause the object is deeply nested
  const images = manifest.data[theme][kind][entity]

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
    attachment: () => new MessageAttachment(absolutePath, `${entity}.jpg`),
    attachmentString: () => `attachment://${entity}.jpg`,
    s3Url: () => `${process.env.AWS_S3_HOST}/${theme}/${kind}/${String(entity).replace(/[\s]+/g, '+')}/${image}`
  }
}

export { getAsset }