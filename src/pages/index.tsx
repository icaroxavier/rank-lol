import AppWrapper from '@/components/AppWrapper'
import { api } from '@/lib/axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Head from 'next/head'
import { Spinner } from '@/components/Spinner'

export interface Player {
  id: number
  name: string
  matches_won: number
  matches_lost: number
  winrate: string
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api
      .get('/players')
      .then((response) => {
        setPlayers(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <AppWrapper>
      <Head>
        <title>Ranking | League of Legends</title>
      </Head>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4">
        {loading && (
          <div className="fixed bottom-0 left-0 right-0 top-0 z-10 flex h-full w-full items-center justify-center bg-zinc-400 opacity-70">
            <Spinner />
          </div>
        )}
        <h1 className="mx-auto text-2xl font-bold text-zinc-800">Ranking</h1>
        {players.length > 0 && (
          <table className="relative">
            <thead>
              <tr>
                <th className="border border-zinc-400 px-3 py-1">Rank</th>
                <th className="border border-zinc-400 px-3 py-1">Player</th>
                <th className="border border-zinc-400 px-3 py-1">Vitórias</th>
                <th className="border border-zinc-400 px-3 py-1">Derrotas</th>
                <th className="border border-zinc-400 px-3 py-1">
                  Partidas Jogadas
                </th>
                <th className="border border-zinc-400 px-3 py-1">Winrate %</th>
              </tr>
            </thead>
            <tbody className="">
              {players.map((player, index) => {
                return (
                  <tr key={player.id} className="">
                    <td
                      className={`border border-zinc-400 py-2 text-center
                        ${index === 0 && 'font-bold text-yellow-500 underline'}
                        ${index === 1 && 'font-bold text-cyan-700 underline'}
                        ${index === 2 && 'font-bold text-amber-700 underline'}
                        `}
                    >
                      {index + 1}
                    </td>
                    <td className={`border border-zinc-400 py-2 text-center`}>
                      {player.name}
                    </td>
                    <td className={`border border-zinc-400 py-2 text-center`}>
                      {player.matches_won}
                    </td>
                    <td className={`border border-zinc-400 py-2 text-center`}>
                      {player.matches_lost}
                    </td>
                    <td className={`border border-zinc-400 py-2 text-center`}>
                      {player.matches_won + player.matches_lost}
                    </td>
                    <td className={`border border-zinc-400 py-2 text-center`}>
                      {player.matches_won + player.matches_lost > 0
                        ? player.winrate
                        : 'Sem partidas jogadas'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </AppWrapper>
  )
}
