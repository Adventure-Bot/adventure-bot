import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { FunctionComponent } from 'react'

export const SignInWithDiscord: FunctionComponent = () => {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="fixed top-0 right-0 pr-6 pt-6">
        <button
          className="w-full pl-2 pr-3 py-2 transition bg-white md:bg-slate-200 hover:bg-slate-300 rounded-full focus:outline-none focus:shadow-outline inline-flex items-center"
          type="button"
        >
          <Image
            width={32}
            height={32}
            alt={session.user?.name || 'Avatar'}
            src={String(session.user?.image)}
            className="rounded-full"
          />
          <span className="ml-2" onClick={() => signOut()}>
            Sign Out {session.user?.name}
          </span>
        </button>
      </div>
    )
  }

  return (
    <button
      className="w-full px-4 py-2 font-bold text-white transition bg-slate-700 hover:bg-purple-800 rounded-full focus:outline-none focus:shadow-outline"
      type="button"
      onClick={() => signIn('discord')}
    >
      Sign In with Discord
    </button>
  )
}
