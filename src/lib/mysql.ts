import mysql from 'mysql2/promise'

export async function getDb() {
  const connection = mysql.createConnection(process.env.DATABASE_URL as string)
  return connection
}
