import { getDb } from '@/lib/mysql'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed, please use GET' })
  }

  const db = await getDb()

  const [data] = await db.execute(
    `SELECT
      p.id AS id,
      p.name AS name,
      COUNT(CASE WHEN m.winner_player_id = p.id THEN 1 ELSE NULL END) AS matches_won,
      COUNT(CASE WHEN m.loser_player_id = p.id THEN 1 ELSE NULL END) AS matches_lost,
      CONCAT(FORMAT((COUNT(CASE WHEN m.winner_player_id = p.id THEN 1 ELSE NULL END) / COUNT(*) * 100), 0), '%') AS winrate
    FROM
      players p
    LEFT JOIN
      matches m ON (m.loser_player_id = p.id OR m.winner_player_id = p.id) AND m.approved = 1
    GROUP BY
      p.id, p.name
    ORDER BY
      winrate DESC;
    `,
  )

  return res.status(200).json(data)
}
