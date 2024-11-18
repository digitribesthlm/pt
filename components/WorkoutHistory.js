import { savedWorkouts } from '../data/savedWorkouts'

export default function WorkoutHistory({ onStartEmptyWorkout }) {
  return (
    <div className="bg-base-300 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-base-300 border-b border-base-content/10">
        <button className="btn btn-ghost">Tillbaka</button>
        <div className="w-8 h-8 bg-warning rounded-full"></div>
        <button className="btn btn-ghost">Logga ut</button>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-bold text-center">Starta träningspass</h1>
        <p className="text-center text-sm opacity-75">
          Klicka nedan på passet du vill träna idag eller starta ett tomt.
        </p>

        {/* Empty Workout Button */}
        <div className="bg-base-200 rounded-lg p-4">
          <h2 className="font-bold mb-2">Start tomt pass</h2>
          <p className="text-sm opacity-75 mb-4">
            Starta och lägg till valfria tillgängliga övningar medans du tränar.
          </p>
          <button 
            onClick={onStartEmptyWorkout}
            className="btn btn-primary w-full"
          >
            Starta tomt pass
          </button>
        </div>

        {/* Saved Workouts */}
        <div className="bg-base-200 rounded-lg p-4">
          <h2 className="font-bold mb-4">Dina sparade pass</h2>
          <div className="space-y-2">
            {savedWorkouts.map((workout) => (
              <div 
                key={workout.id}
                className="bg-base-100 p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{workout.name}</div>
                  <div className="text-sm opacity-75">
                    Tränat: {workout.date} ({workout.daysAgo} dagar sen)
                  </div>
                </div>
                <button className="btn btn-circle btn-sm">
                  <span className="text-lg">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 