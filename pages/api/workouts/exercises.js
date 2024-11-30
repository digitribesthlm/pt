import { connectToDatabase } from '../../../utils/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { db } = await connectToDatabase()
    
    const exercises = await db.collection('workouts')
      .find({ 
        $and: [
          { type: { $in: ['strength', 'mobility', 'balance', 'olympic'] } }, // Include all exercise types
          { category: { $exists: true } }, // Must have a category (to ensure it's an exercise)
          { videoUrl: { $exists: true } }  // Must have a video URL (to ensure it's an exercise)
        ]
      })
      .toArray()
    
    if (!exercises || exercises.length === 0) {
      return res.status(404).json({ message: 'No exercises found' })
    }
    
    res.status(200).json(exercises)
  } catch (error) {
    console.error('Error fetching exercises:', error)
    res.status(500).json({ message: 'Error fetching exercises', error: error.message })
  }
}
