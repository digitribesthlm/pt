import Navigation from './Navigation'

export default function Messages() {
  const messages = [
    {
      id: 1,
      from: "Jessica Nyström",
      subject: "Funkar toppen",
      date: "2024-03-20",
      unread: true
    }
    // Add more messages as needed
  ]

  return (
    <div className="min-h-screen bg-base-300">
      <Navigation title="Meddelanden" />
      
      <div className="p-4 space-y-2">
        {messages.map(message => (
          <div 
            key={message.id}
            className="bg-base-200 p-4 rounded-lg flex items-center gap-4"
          >
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{message.from}</span>
                <span className="text-sm opacity-75">{message.date}</span>
              </div>
              <div className="text-sm opacity-75">{message.subject}</div>
            </div>
            {message.unread && (
              <div className="w-2 h-2 bg-warning rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="p-4 text-center opacity-75">
          Inga meddelanden att visa
        </div>
      )}
    </div>
  )
} 