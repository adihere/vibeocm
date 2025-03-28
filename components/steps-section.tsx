import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Key, FileText, FileOutput } from 'lucide-react'

export function StepsSection() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Step 1</CardTitle>
          <Key className="h-6 w-6 text-primary" />
        </CardHeader>
        <CardContent>
          <h3 className="font-bold text-lg mb-2">Enter OpenAI API Key</h3>
          <p className="text-gray-600">
            Provide your OpenAI API key which is stored only in your browser for the current session. 
            Your key is never sent to our servers.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Step 2</CardTitle>
          <FileText className="h-6 w-6 text-primary" />
        </CardHeader>
        <CardContent>
          <h3 className="font-bold text-lg mb-2">Describe Project Context</h3>
          <p className="text-gray-600">
            Tell us about your change initiative, including objectives, scope, stakeholders, 
            and any specific challenges you're facing.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Step 3</CardTitle>
          <FileOutput className="h-6 w-6 text-primary" />
        </CardHeader>
        <CardContent>
          <h3 className="font-bold text-lg mb-2">Generate OCM Deliverables</h3>
          <p className="text-gray-600">
            Choose from various OCM deliverables like change plans, communication strategies, 
            stakeholder analyses, and training plans.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

