import mysql from 'mysql2/promise'

export async function getDb() {
  const connection = mysql.createConnection(
    process.env.NODE_DATABASE_URL as string,
  )
  return connection
}
