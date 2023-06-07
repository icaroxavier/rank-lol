import { getDb } from '@/lib/mysql'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, please use GET' })
  }

  const db = await getDb()

  if (req.method === 'POST') {
    const { body } = req
    const {
      matchDate,
      winnerPlayerId,
      loserPlayerId,
      winnerChampion,
      loserChampion,
    } = body

    if (
      !matchDate ||
      !winnerPlayerId ||
      !loserPlayerId ||
      !winnerChampion ||
      !loserChampion
    ) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const [data] = await db.execute(
      `
      INSERT INTO matches (match_date, winner_player_id, loser_player_id, winner_champion, loser_champion, is_enabled)
      VALUES (?, ?, ?, ?, ?, TRUE)
    `,
      [matchDate, winnerPlayerId, loserPlayerId, winnerChampion, loserChampion],
    )

    return res.status(201).json(data)
  }

  const [data] = await db.execute(`
    SELECT
      m.*,
      loser.name AS loser_name,
      winner.name AS winner_name
    FROM
      matches m
    LEFT JOIN
      players loser ON loser.id = m.loser_player_id
    LEFT JOIN
      players winner ON winner.id = m.winner_player_id
    WHERE
      m.is_enabled is TRUE
    ORDER BY
      m.match_date DESC
      m.created_at DESC;

  `)

  return res.status(200).json(data)
}
