import AppWrapper from '@/components/AppWrapper'
import Head from 'next/head'

export default function Matches() {
  return (
    <AppWrapper>
      <Head>
        <title>Adicionar Partida | League of Legends</title>
      </Head>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4">
        <h1 className="mx-auto text-2xl font-bold">Adicionar partida</h1>
      </div>
    </AppWrapper>
  )
}
