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
      m.approved = 1
    ORDER BY
      CASE WHEN STR_TO_DATE(m.match_date, '%d/%m/%Y') IS NULL THEN 1 ELSE 0 END,
      STR_TO_DATE(m.match_date, '%d/%m/%Y') DESC;

  `)

  return res.status(200).json(data)
}
