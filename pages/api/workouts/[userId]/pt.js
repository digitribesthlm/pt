import { connectToDatabase } from '@/utils/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  try {
    const { userId } = req.query
    const { db } = await connectToDatabase()
    
    const ptWorkouts = await db.collection('ptWorkouts')
      .find({ userId: new ObjectId(userId) })
      .sort({ date: -1 })
      .toArray()

    res.status(200).json(ptWorkouts)
  } catch (error) {
    console.error('Error fetching PT workouts:', error)
    res.status(500).json({ error: 'Failed to fetch PT workouts' })
  }
} 