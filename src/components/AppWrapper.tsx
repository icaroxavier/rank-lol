import { ReactNode } from 'react'
import Link from 'next/link'

interface AppWrapperProps {
  children: ReactNode
}

export default function AppWrapper({ children }: AppWrapperProps) {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <nav className="flex h-24 w-full items-center gap-4 bg-slate-700 px-8">
        <Link href="/" className="text-xl font-medium hover:underline">
          Ranking
        </Link>
        <Link href="/matches" className="text-xl font-medium hover:underline">
          Partidas
        </Link>
        <Link href="/add-match" className="text-xl font-medium hover:underline">
          Adicionar Partida
        </Link>
      </nav>
      {children}
    </main>
  )
}
