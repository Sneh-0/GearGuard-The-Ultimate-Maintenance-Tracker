import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

dotenv.config()

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gearguard'

async function ensureIndexes(db) {
  await db.collection('users').createIndex({ email: 1 }, { unique: true })
  await db.collection('equipment').createIndex({ status: 1 })
  await db.collection('maintenance_requests').createIndex({ status: 1 })
  await db.collection('calendar_events').createIndex({ date: 1 })
}

async function seedUsers(db) {
  const count = await db.collection('users').countDocuments()
  if (count === 0) {
    await db.collection('users').insertMany([
      { email: 'admin@gearguard.com', password: 'admin123', name: 'Admin User', role: 'Admin' },
      { email: 'manager@gearguard.com', password: 'manager123', name: 'Manager User', role: 'Manager' },
      { email: 'tech@gearguard.com', password: 'tech123', name: 'Technician User', role: 'Technician' },
    ])
    console.log('Seeded demo users.')
  } else {
    console.log('Users already present; skipping seed.')
  }
}

async function main() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db()
    // Create collections explicitly
    const collections = ['users', 'equipment', 'maintenance_requests', 'teams', 'calendar_events']
    const existing = await db.listCollections().toArray()
    const existingNames = new Set(existing.map(c => c.name))
    for (const name of collections) {
      if (!existingNames.has(name)) {
        await db.createCollection(name)
        console.log(Created collection: ${name})
      }
    }
    await ensureIndexes(db)
    await seedUsers(db)
    console.log('MongoDB initialization complete.')
  } catch (e) {
    console.error('Failed to initialize MongoDB:', e)
    process.exitCode = 1
  } finally {
    await client.close()
  }
}

main()
