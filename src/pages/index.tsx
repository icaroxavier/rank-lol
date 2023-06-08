import AppWrapper from '@/components/AppWrapper'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import Head from 'next/head'
import { Spinner } from '@/components/Spinner'
import { AxiosError } from 'axios'
import { useQuery } from 'react-query'

export interface Player {
  id: number
  name: string
  matches_won: number
  matches_lost: number
  totalMatches: number
  winrate: number
}

export default function Home() {
  const { data: players, isLoading } = useQuery<Player[]>(
    'players',
    async () => {
      try {
        const response = await api.get('/players')
        const data = response.data.map((player: Player) => {
          return {
            ...player,
            winrate: Number(player.winrate),
            totalMatches: player.matches_won + player.matches_lost,
          }
        })
        return data.sort((a: Player, b: Player) => {
          if (a.winrate < b.winrate) {
            return 1
          } else if (a.winrate > b.winrate) {
            return -1
          } else if (
            a.winrate === b.winrate &&
            a.totalMatches < b.totalMatches
          ) {
            return 1
          } else if (
            a.winrate === b.winrate &&
            a.totalMatches > b.totalMatches
          ) {
            return -1
          } else {
            return 0
          }
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message)
        } else {
          toast.error('Erro inesperado ao buscar os jogadores')
        }
      }
    },
  )

  console.log('players', players)

  return (
    <AppWrapper>
      <Head>
        <title>Ranking | League of Legends</title>
      </Head>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 overflow-x-auto p-4">
        {isLoading && (
          <div className="fixed bottom-0 left-0 right-0 top-0 z-10 flex h-full w-full items-center justify-center bg-zinc-400 opacity-70">
            <Spinner />
          </div>
        )}
        <h1 className="mx-auto text-2xl font-bold text-zinc-800">Ranking</h1>
        {!!players && players.length > 0 && (
          <table className="relative w-full">
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
                      {player.totalMatches}
                    </td>
                    <td className={`border border-zinc-400 py-2 text-center`}>
                      {player.totalMatches > 0
                        ? player.winrate + '%'
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
