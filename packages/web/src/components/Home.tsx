import Image from 'next/image'
import { FunctionComponent } from 'react'
import { animated, config, easings, useSpring } from 'react-spring'

import { usePrefersReducedMotion } from '@adventure-bot/web/utils/motions'

export const Home: FunctionComponent<{
  background: string
  version: string
}> = ({ background, version }) => {
  const topToBottom = Math.random() > 0.5

  const { percent } = useSpring({
    from: { percent: topToBottom ? 0 : 100 },
    to: { percent: topToBottom ? 100 : 0 },
    config: {
      ...config.slow,
      duration: 80000,
    },
    loop: {
      reverse: true,
    },
  })

  const prefersReducedMotion = usePrefersReducedMotion()
  const backgroundPositionX = prefersReducedMotion
    ? '25%'
    : percent.to((v) => `${v}%`)

  return (
    <animated.div
      className="h-screen w-screen bg-cover grid place-content-center items-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundPositionX,
      }}
    >
      <div className="p-5 m-3 text-center max-w-prose backdrop-blur bg-white/70 rounded drop-shadow-2xl">
        <div className="px-8">
          <h1 className="pt-4 text-4xl md:text-5xl lg:text-6xl">
            Adventure Bot
          </h1>

          <hr className="my-6 border-t" />

          <div className="">
            <p className="text-sm mb-6 text-gray-700">
              Adventure Bot is the dungeon master in your friend&apos;s Discord
              server!
            </p>
            <p className="text-sm mb-6 text-gray-700">
              Slay powerful monsters,  disarm and evade dangerous traps, earn riches, complete
              quests, and stab and loot your friends! Explore the world of Adventure Bot and become the most powerful adventurer!
            </p>
          </div>

          <hr className="my-6 border-t" />

          <a
            className="flex space-x-4 flex-row justify-center items-center"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/Adventure-Bot/adventure-bot"
          >
            <Image
              width={105}
              height={20}
              alt="Build"
              src="https://github.com/Adventure-Bot/adventure-bot/actions/workflows/build.yml/badge.svg"
            />
            <span className="text-xs bg-gray-200 font-mono px-2 py-1 rounded">
              v{version}
            </span>
          </a>

          <a
            className="block text-sm text-gray-500 align-baseline hover:text-purple-800"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/Adventure-Bot/adventure-bot/issues/new/choose"
          >
            Feedback/Bugs
          </a>
        </div>
      </div>
    </animated.div>

  )
}
