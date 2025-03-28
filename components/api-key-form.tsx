'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-react'

interface ApiKeyFormProps {
  onSubmit: (apiKey: string) => void
}

export function ApiKeyForm({ onSubmit }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key')
      return
    }
    
    if (!apiKey.startsWith('sk-')) {
      setError('This doesn\'t look like a valid OpenAI API key. It should start with "sk-"')
      return
    }
    
    // Store in session storage (not sent to server)
    sessionStorage.setItem('openai-api-key', apiKey)
    
    onSubmit(apiKey)
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Step 1: Enter Your OpenAI API Key</h2>
        <p className="text-gray-600 mt-2">
          Your API key is stored only in your browser for this session and is never sent to our servers.
        </p>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          You can get your OpenAI API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">OpenAI dashboard</a>.
        </AlertDescription>
      </Alert>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">OpenAI API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="font-mono"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        
        <Button type="submit" className="w-full">Continue to Step 2</Button>
      </form>
    </div>
  )
}

