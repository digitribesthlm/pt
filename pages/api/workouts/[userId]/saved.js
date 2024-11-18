import { connectToDatabase } from '@/utils/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  try {
    const { userId } = req.query
    const { db } = await connectToDatabase()
    
    const savedWorkouts = await db.collection('savedWorkouts')
      .find({ userId: new ObjectId(userId) })
      .sort({ date: -1 })
      .toArray()

    res.status(200).json(savedWorkouts)
  } catch (error) {
    console.error('Error fetching saved workouts:', error)
    res.status(500).json({ error: 'Failed to fetch saved workouts' })
  }
} 