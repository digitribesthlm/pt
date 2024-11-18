import { connectToDatabase } from '../../../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  try {
    const { userId } = req.query
    console.log('Fetching saved workouts for userId:', userId)
    
    const { db } = await connectToDatabase()
    console.log('MongoDB connection successful')

    // Log the query we're about to make
    console.log('Attempting to find saved workouts with userId:', userId)
    
    const savedWorkouts = await db.collection('saved_workouts')
      .find({ 
        userId: userId
      })
      .sort({ date: -1 })
      .toArray()

    console.log('Saved workouts found:', savedWorkouts.length)
    console.log('Saved workouts data:', JSON.stringify(savedWorkouts, null, 2))

    res.status(200).json(savedWorkouts)
  } catch (error) {
    console.error('Detailed error in saved workouts:', {
      message: error.message,
      stack: error.stack,
      userId: req.query.userId,
      type: error.name
    })
    res.status(500).json({ error: 'Failed to fetch saved workouts' })
  }
} 