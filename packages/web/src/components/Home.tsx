import Image from 'next/image'
import { FunctionComponent } from 'react'
import { animated, config, easings, useSpring } from 'react-spring'

import { usePrefersReducedMotion } from '../utils/motions'

export const Home: FunctionComponent<{
  background: string
  version: string
}> = ({ background, version }) => {
  const topToBottom = Math.random() > 0.5

  const { percent } = useSpring({
    from: { percent: topToBottom ? 0 : 100 },
    to: { percent: topToBottom ? 100 : 0 },
    config: {
      ...config.molasses,
      duration: 20000,
      easing: easings.easeInOutQuad,
    },
    loop: {
      reverse: true,
    },
  })

  const prefersReducedMotion = usePrefersReducedMotion()
  const backgroundPositionY = prefersReducedMotion
    ? '25%'
    : percent.to((v) => `${v}%`)

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <animated.div
        className="w-full h-2/5 md:w-2/5 md:h-auto bg-gray-400 bg-cover"
        style={{
          backgroundImage: `url(${background})`,
          backgroundPositionY,
        }}
      >
        <div
          className={`grow w-full h-full bg-gradient-to-t md:bg-gradient-to-l from-black-transparent`}
        />
      </animated.div>

      <div className="w-full h-3/5 md:w-3/5 md:h-full justify-center p-5 text-center md:flex md:items-center">
        <div className="px-8">
          <h1 className="pt-4 text-4xl md:text-5xl lg:text-6xl">
            Adventure Bot
          </h1>

          <hr className="my-6 border-t" />
          <div className="flex space-x-4 flex-row justify-center items-center">
            <Image
              width={105}
              height={20}
              alt="Build"
              src="https://github.com/Adventure-Bot/adventure-bot/actions/workflows/adventure-bot.yml/badge.svg"
            />

            <span className="bg-gray-200 font-mono text-xs px-2 py-1 rounded">
              v{version}
            </span>
          </div>
          <hr className="my-6 border-t" />

          <p className="text-sm mb-6 text-gray-700">
            Embark on a journey with your friends or team to explore a rich
            world of fantasy. Slay monsters, earn gold, evade traps, travel,
            gear up, complete quests, and stab your friends when they&apos;re at
            their weakest so you can steal all <i>their</i> gold.
          </p>

          <hr className="my-6 border-t" />

          <a
            className="block mb-2 text-sm text-gray-500 align-baseline hover:text-purple-800"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/Adventure-Bot/adventure-bot"
          >
            View in GitHub
          </a>

          <a
            className="block mb-2 text-sm text-gray-500 align-baseline hover:text-purple-800"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/orgs/Adventure-Bot/projects/1"
          >
            Roadmap
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
    </div>
  )
}
