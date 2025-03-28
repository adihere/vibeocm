// This is a client-side only module for interacting with OpenAI API
// The API key is never sent to our server

export async function generateOCMDeliverable(
  apiKey: string,
  projectContext: string,
  deliverableType: string
): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert in Organizational Change Management (OCM). 
            You help create professional OCM deliverables based on project context.
            Format your response in Markdown.`
          },
          {
            role: 'user',
            content: `Create a detailed ${deliverableType} for the following project:
            
            ${projectContext}
            
            Make it comprehensive, professional, and ready to use.`
          }
        ],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate content')
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Error generating OCM deliverable:', error)
    throw error
  }
}

