import AppWrapper from '@/components/AppWrapper'
import { Spinner } from '@/components/Spinner'
import { api } from '@/lib/axios'
import { format } from 'date-fns'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export interface Match {
  id: number
  loser_champion: string
  loser_name: string
  match_date: Date
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
          <div className="fixed bottom-0 left-0 right-0 top-0 z-10 flex h-full w-full items-center justify-center bg-zinc-400 opacity-70">
            <Spinner />
          </div>
        )}
        <h1 className="mx-auto text-2xl font-bold text-zinc-800">Partidas</h1>
        {matches.length > 0 && (
          <table className="relative">
            <thead>
              <tr>
                <th className="border border-zinc-400 px-3 py-1">
                  Data da partida
                </th>
                <th className="border border-zinc-400 px-3 py-1">Vitorioso</th>
                <th className="border border-zinc-400 px-3 py-1">Derrotado</th>
              </tr>
            </thead>
            <tbody className="">
              {matches.map((match) => {
                return (
                  <tr key={match.id} className="">
                    <td className="border border-zinc-400 py-2 text-center">
                      {match.match_date
                        ? format(new Date(match.match_date), 'dd/MM/yyyy')
                        : 'Sem data'}
                    </td>
                    <td className="border border-zinc-400 py-2 text-center">
                      <strong>{match.winner_name}</strong> de{' '}
                      <strong>{match.winner_champion}</strong>
                    </td>
                    <td className="border border-zinc-400 py-2 text-center">
                      <strong>{match.loser_name}</strong> de{' '}
                      <strong>{match.loser_champion}</strong>
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
