import { connectToDatabase } from '../../../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  try {
    const { userId } = req.query
    console.log('Fetching PT workouts for userId:', userId)
    
    const { db } = await connectToDatabase()
    console.log('MongoDB connection successful')

    // Log the query we're about to make
    console.log('Attempting to find PT workouts with userId:', userId)
    
    const ptWorkouts = await db.collection('pt_workouts')
      .find({ 
        userId: userId
      })
      .sort({ date: -1 })
      .toArray()

    console.log('PT workouts found:', ptWorkouts.length)
    console.log('PT workouts data:', JSON.stringify(ptWorkouts, null, 2))

    res.status(200).json(ptWorkouts)
  } catch (error) {
    console.error('Detailed error in PT workouts:', {
      message: error.message,
      stack: error.stack,
      userId: req.query.userId,
      type: error.name
    })
    res.status(500).json({ error: 'Failed to fetch PT workouts' })
  }
} 