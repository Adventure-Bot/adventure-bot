import type { NextPage } from 'next'
import Head from 'next/head'
import fetch from 'node-fetch'

import { Home } from '../components/Home'

const randomItem = <T extends Array<unknown>>(list: T) => {
  return list[Math.floor(Math.random() * list.length)]
}

const IndexPage: NextPage<{
  background: string
  version: string
}> = ({ background, version }) => {
  return (
    <div>
      <Head>
        <title>Adventure Bot</title>
        <meta
          name="description"
          content="Adventure Bot is the DM in your friend's Discord roleplaying game!"
        />
      </Head>

      <Home background={background} version={version} />
    </div>
  )
}

export async function getServerSideProps() {
  const fs = require('fs')
  const path = require('path')

  const backgrounds = fs
    .readdirSync(path.join(process.cwd(), 'public', 'backgrounds'))
    .map((file: string) => `/backgrounds/${file}`)

  const pkg = await fetch(
    'https://raw.githubusercontent.com/Adventure-Bot/adventure-bot/main/package.json'
  )
    .then((res) => res.json() as any as { version: string })
    .catch(() => ({ version: '0.0.0' }))

  return {
    props: {
      background: randomItem(backgrounds),
      version: pkg.version,
    },
  }
}

export default IndexPage
