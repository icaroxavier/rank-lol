import AppWrapper from '@/components/AppWrapper'
import { api } from '@/lib/axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Player } from '.'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Spinner } from '@/components/Spinner'
import { format } from 'date-fns'

const addMatchSchema = z
  .object({
    winnerPlayerId: z.number().min(1, 'Selecione um vencedor'),
    winnerChampion: z.string().min(1, 'Selecione o campeão do vencedor'),
    loserPlayerId: z.number().min(1, 'Selecione um derrotado'),
    loserChampion: z.string().min(1, 'Selecione o campeão do derrotado'),
    matchDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  })
  .refine(
    (data) => {
      return data.winnerPlayerId !== data.loserPlayerId
    },
    {
      message: 'O vencedor e o derrotado não podem ser o mesmo jogador',
      path: ['loserPlayerId'],
    },
  )

type AddMatchFormData = z.infer<typeof addMatchSchema>

export default function AddMatche() {
  const [players, setPlayers] = useState<Player[]>([])
  const [champions, setChampions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<AddMatchFormData>({
    resolver: zodResolver(addMatchSchema),
    defaultValues: {
      winnerPlayerId: 0,
      winnerChampion: '',
      loserPlayerId: 0,
      loserChampion: '',
    },
  })

  async function getPlayers() {
    const response = await api.get('/players')
    return response.data
  }

  async function handleAddMatch(data: AddMatchFormData) {
    await api.post('/matches', data)
    reset()
    toast.success('Partida adicionada com sucesso')
  }

  useEffect(() => {
    async function setupSelects() {
      try {
        setLoading(true)
        setPlayers(await getPlayers())
      } catch {
        toast.error('Erro ao carregar jogadores')
        setLoading(false)
      }
      try {
        const response = await axios.get(
          'https://ddragon.leagueoflegends.com/cdn/11.11.1/data/en_US/champion.json',
        )
        const championNames = Object.keys(response.data.data) as string[]
        setChampions(championNames)
      } catch {
        toast.error('Erro ao carregar campeões')
      } finally {
        setLoading(false)
      }
    }
    setupSelects()
  }, [])

  return (
    <AppWrapper>
      <Head>
        <title>Adicionar Partida | League of Legends</title>
      </Head>
      {loading && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-10 flex h-full w-full items-center justify-center bg-zinc-400 opacity-70">
          <Spinner />
        </div>
      )}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4">
        <h1 className="mx-auto text-2xl font-bold text-zinc-800">
          Adicionar partida
        </h1>
        <form
          className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded bg-slate-600 p-4"
          onSubmit={handleSubmit(handleAddMatch)}
        >
          <label className="flex flex-col gap-2">
            <span className="font-bold text-zinc-50">
              Vencedor <strong className="text-red-500">*</strong>
            </span>
            <div className="flex w-full flex-1 flex-wrap gap-4">
              <select
                className="flex-1 rounded px-3 py-2 text-zinc-600"
                {...register('winnerPlayerId', {
                  valueAsNumber: true,
                })}
              >
                <option value={0}>Selecione o vencedor</option>
                {players.map((player) => {
                  return (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  )
                })}
              </select>
              <select
                className="flex-1 rounded px-3 py-2 text-zinc-600"
                {...register('winnerChampion')}
              >
                <option value={''}>Selecione o campeão</option>
                {champions.map((champion) => {
                  return (
                    <option key={champion} value={champion}>
                      {champion}
                    </option>
                  )
                })}
              </select>
            </div>
            {errors.winnerPlayerId && (
              <span className="text-sm text-red-500">
                {errors.winnerPlayerId.message}
              </span>
            )}
            {errors.winnerChampion && (
              <span className="text-sm text-red-500">
                {errors.winnerChampion.message}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-bold text-zinc-50">
              Derrotado <strong className="text-red-500">*</strong>
            </span>
            <div className="flex w-full flex-1 flex-wrap gap-4">
              <select
                className="flex-1 rounded px-3 py-2 text-zinc-600"
                {...register('loserPlayerId', {
                  valueAsNumber: true,
                })}
              >
                <option value={0}>Selecione o derrotado</option>
                {players.map((player) => {
                  return (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  )
                })}
              </select>
              <select
                className="flex-1 rounded px-3 py-2 text-zinc-600"
                {...register('loserChampion')}
              >
                <option value="">Selecione o campeão</option>
                {champions.map((champion) => {
                  return (
                    <option key={champion} value={champion}>
                      {champion}
                    </option>
                  )
                })}
              </select>
            </div>
            {errors.loserPlayerId && (
              <span className="text-sm text-red-500">
                {errors.loserPlayerId.message}
              </span>
            )}
            {errors.loserChampion && (
              <span className="text-sm text-red-500">
                {errors.loserChampion.message}
              </span>
            )}
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-bold text-zinc-50">
              Data <strong className="text-red-500">*</strong>
            </span>
            <input
              type="date"
              className="rounded px-3 py-2 text-zinc-600"
              {...register('matchDate', {
                valueAsDate: true,
              })}
            />
            {errors.matchDate && (
              <span className="text-sm text-red-500">
                {errors.matchDate.message}
              </span>
            )}
          </label>
          <button
            className="mt-4 flex w-full items-center justify-center gap-4 rounded bg-blue-500 py-4 font-medium text-zinc-50 transition-all hover:bg-blue-600 disabled:opacity-50"
            disabled={loading || isSubmitting}
            type="submit"
          >
            Enviar para análise
          </button>
        </form>
      </div>
    </AppWrapper>
  )
}
