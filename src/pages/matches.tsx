import AppWrapper from '@/components/AppWrapper'
import { api } from '@/lib/axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface Match {
  id: number
  loser_champion: string
  loser_name: string
  match_date: string
  winner_champion: string
  winner_name: string
}

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api
      .get('/matches')
      .then((response) => {
        setMatches(response.data)
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
        <title>Partidas | League of Legends</title>
      </Head>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4">
        {loading && (
          <div className="h-ful fixed bottom-0 left-0 right-0 top-0 z-10 flex w-full bg-zinc-400 opacity-70">
            <div className="m-auto">Loading...</div>
          </div>
        )}
        <h1 className="mx-auto text-2xl font-bold">Partidas</h1>
        {matches.length > 0 && (
          <table className="relative">
            <thead>
              <tr>
                <th className="border border-zinc-50 px-3 py-1">
                  Data da partida
                </th>
                <th className="border border-zinc-50 px-3 py-1">Vitorioso</th>
                <th className="border border-zinc-50 px-3 py-1">Derrotado</th>
              </tr>
            </thead>
            <tbody className="">
              {matches.map((match) => {
                return (
                  <tr key={match.id} className="">
                    <td className="border-b border-zinc-50 py-2 text-center first-of-type:border-l last-of-type:border-r">
                      {match.match_date || 'Sem data'}
                    </td>
                    <td className="border-b border-zinc-50 py-2 text-center first-of-type:border-l last-of-type:border-r">
                      {match.winner_name} de {match.winner_champion}
                    </td>
                    <td className="border-b border-zinc-50 py-2 text-center first-of-type:border-l last-of-type:border-r">
                      {match.loser_name} de {match.loser_champion}
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
