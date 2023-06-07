import { ReactNode } from 'react'
import Link from 'next/link'

interface AppWrapperProps {
  children: ReactNode
}

export default function AppWrapper({ children }: AppWrapperProps) {
  return (
    <main className="flex min-h-screen w-full flex-col bg-white">
      <nav className="flex h-16 w-full items-center justify-around gap-4 bg-zinc-900 px-4 sm:justify-start sm:px-8 ">
        <Link
          href="/"
          className="text-xl font-medium text-zinc-50 hover:underline"
        >
          Ranking
        </Link>
        <Link
          href="/matches"
          className="text-xl font-medium text-zinc-50 hover:underline"
        >
          Partidas
        </Link>
        <Link
          href="/add-match"
          className="text-xl font-medium text-zinc-50 hover:underline"
        >
          Adicionar Partida
        </Link>
      </nav>
      {children}
    </main>
  )
}
