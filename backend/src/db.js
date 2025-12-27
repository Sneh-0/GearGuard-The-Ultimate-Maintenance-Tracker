import dotenv from 'dotenv'
import { MongoClient, ObjectId } from 'mongodb'

dotenv.config()

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gearguard'
let client
let db

export async function connect() {
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db()
  }
  return db
}

export async function getCollection(name) {
  const database = await connect()
  return database.collection(name)
}

export { ObjectId }
