import { connectToDatabase } from '../../../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { id } = req.query
    const { db } = await connectToDatabase()

    const workout = await db.collection('workout_programs').findOne({
      _id: new ObjectId(id)
    })

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' })
    }

    res.status(200).json(workout)
  } catch (error) {
    console.error('Error fetching workout:', error)
    res.status(500).json({ message: 'Failed to fetch workout' })
  }
}
