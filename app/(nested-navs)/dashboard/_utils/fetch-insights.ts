export const fetchAiInsights = async (name: string, description: string, feedback: string, url: string = 'ai-generate-insights') => {
    const hobbyName = name ?? "Your Hobby Name" // Replace with actual hobby name
    const hobbyDescription = description ?? "Your Hobby Description" // Replace with actual hobby description
    const hobbyFeedback = feedback ?? "Your Hobby Feedback" // Replace with actual hobby feedback

    const urlStr = `/api/${url}`

    try {

      if(!hobbyName || !hobbyDescription || !hobbyFeedback) {
        console.log("Missing required fields")
        return null
      }
      
      const response = await fetch(
        urlStr,
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hobbyName: hobbyName,
          hobbyDescription: hobbyDescription,
          hobbyFeedback: hobbyFeedback,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch AI insights')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching AI insights:', error)
      return null
    }
  }