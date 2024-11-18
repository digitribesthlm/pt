import { useApp } from '../context/AppContext'
import Navigation from './Navigation'
import { workouts } from '../data/workouts'

export default function WorkoutList() {
  const { activeWorkout, endWorkout } = useApp()
  const [selectedExercises, setSelectedExercises] = useState([])

  const handleAddExercise = (exercise) => {
    setSelectedExercises([...selectedExercises, {
      ...exercise,
      sets: [],
      timeAdded: new Date()
    }])
  }

  const handleEndWorkout = () => {
    // Save workout data here
    endWorkout()
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div>
      <Navigation title="Aktuellt pass" />
      
      {/* Previous WorkoutList content... */}
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-base-300">
        <button 
          onClick={handleEndWorkout}
          className="btn btn-error w-full"
        >
          Avsluta pass
        </button>
      </div>
    </div>
  )
}