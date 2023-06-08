import AppWrapper from '@/components/AppWrapper'
import { api } from '@/lib/axios'
import Head from 'next/head'
import { toast } from 'react-toastify'
import { Player } from '.'
import axios, { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Spinner } from '@/components/Spinner'
import { useQuery } from 'react-query'

const addMatchSchema = z
  .object({
    winnerPlayerId: z.number().min(1, 'Selecione um vencedor'),
    winnerChampion: z.string().min(1, 'Selecione o campeão do vencedor'),
    loserPlayerId: z.number().min(1, 'Selecione um derrotado'),
    loserChampion: z.string().min(1, 'Selecione o campeão do derrotado'),
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
  const { data: players, isLoading: isLoadingPlayers } = useQuery<Player[]>(
    'players',
    async () => {
      try {
        const response = await api.get('/players')
        return response.data
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message)
        } else {
          toast.error('Erro inesperado ao buscar os jogadores')
        }
      }
    },
  )

  const { data: champions, isLoading: isLoadingChampions } = useQuery<any>(
    'champions',
    async () => {
      try {
        const response = await axios.get(
          'https://ddragon.leagueoflegends.com/cdn/13.11.1/data/pt_BR/champion.json',
        )
        return response.data.data
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message)
        } else {
          toast.error('Erro inesperado ao buscar os Campeões')
        }
      }
    },
  )

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

  async function handleAddMatch(data: AddMatchFormData) {
    await api.post('/matches', data)
    reset()
    toast.success('Partida adicionada com sucesso')
  }

  return (
    <AppWrapper>
      <Head>
        <title>Adicionar Partida | League of Legends</title>
      </Head>
      {(isLoadingPlayers || isLoadingChampions) && (
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
                {players?.map((player) => {
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
                {!!champions &&
                  Object.keys(champions)
                    ?.map((champion) => champions[champion].name)
                    ?.map((champion) => {
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
                {players?.map((player) => {
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
                {!!champions &&
                  Object.keys(champions)
                    ?.map((champion) => champions[champion].name)
                    ?.map((champion) => {
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
          <button
            className="mt-4 flex w-full items-center justify-center rounded bg-blue-500 py-4 font-medium text-zinc-50 transition-all hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoadingPlayers || isLoadingChampions || isSubmitting}
            type="submit"
          >
            {isSubmitting && (
              <svg
                aria-hidden="true"
                role="status"
                className="mr-3 inline h-4 w-4 animate-spin text-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            )}
            Cadastrar partida
          </button>
        </form>
      </div>
    </AppWrapper>
  )
}
