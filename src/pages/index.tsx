import AppWrapper from '@/components/AppWrapper'
import { api } from '@/lib/axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Head from 'next/head'

interface Player {
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
          <div className="h-ful fixed bottom-0 left-0 right-0 top-0 z-10 flex w-full bg-zinc-400 opacity-70">
            <div className="m-auto">Loading...</div>
          </div>
        )}
        <h1 className="mx-auto text-2xl font-bold">Ranking</h1>
        {players.length > 0 && (
          <table className="relative">
            <thead>
              <tr>
                <th className="border border-zinc-50 px-3 py-1">Rank</th>
                <th className="border border-zinc-50 px-3 py-1">Player</th>
                <th className="border border-zinc-50 px-3 py-1">Vitórias</th>
                <th className="border border-zinc-50 px-3 py-1">Derrotas</th>
                <th className="border border-zinc-50 px-3 py-1">Winrate</th>
              </tr>
            </thead>
            <tbody className="">
              {players.map((player, index) => {
                return (
                  <tr key={player.id} className="">
                    <td className="border-b border-zinc-50 py-2 text-center first-of-type:border-l last-of-type:border-r">
                      {index + 1}
                    </td>
                    <td className="border-b border-zinc-50 py-2 text-center first-of-type:border-l last-of-type:border-r">
                      {player.name}
                    </td>
                    <td className="border-b border-zinc-50 py-2 text-center first-of-type:border-l last-of-type:border-r">
                      {player.matches_won}
                    </td>
                    <td className="border-b border-zinc-50 py-2 text-center first-of-type:border-l last-of-type:border-r">
                      {player.matches_lost}
                    </td>
                    <td className="border-b border-zinc-50 py-2 text-center first-of-type:border-l last-of-type:border-r">
                      {player.winrate}
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
