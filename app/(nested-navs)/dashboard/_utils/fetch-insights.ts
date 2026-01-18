export const fetchAiInsights = async (name: string, description: string, feedback: string) => {
    const hobbyNamne = name ?? "Your Hobby Name" // Replace with actual hobby name
    const hobbyDescription = description ?? "Your Hobby Description" // Replace with actual hobby description
    const hoobyFeedback = feedback ?? "Your Hobby Feedback" // Replace with actual hobby feedback

    try {
      const response = await fetch('/api/ai-generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hobbyName: hobbyNamne,
          hobbyDescription: hobbyDescription,
          hobbyFeedback: hoobyFeedback,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch AI insights')
      }

      const data = await response.json()
      // console.log(data, "ai insghts!!")
      return data
    } catch (error) {
      console.error('Error fetching AI insights:', error)
      return null
    }
  }