import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Repeat, MessageSquare } from 'lucide-react'

const steps = [
  {
    title: "Provide Context",
    description: "Tell us about your project, stakeholders, and objectives. The more details you provide, the more tailored your artifacts will be.",
    icon: FileText
  },
  {
    title: "Generate Artifacts",
    description: "Choose from a variety of OCM artifacts like change plans, communication strategies, and stakeholder analyses. Our AI will create professional content based on your inputs.",
    icon: MessageSquare
  },
  {
    title: "Refine & Iterate",
    description: "Review the generated content and provide feedback for improvements. Our AI will refine the artifacts based on your specific needs and preferences.",
    icon: Repeat
  }
]

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            VibeOCM simplifies the creation of OCM artifacts with a straightforward three-step process.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card key={index} className="relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                  {index + 1}
                </div>
                <CardHeader className="pt-8 pb-2">
                  <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
                    <Icon className="h-5 w-5" />
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        <div className="flex justify-center mt-12">
          <div className="max-w-3xl text-center">
            <h3 className="text-xl font-bold mb-4">Why This Approach Works</h3>
            <p className="text-muted-foreground">
              Our AI has been trained on thousands of successful OCM projects and best practices.
              By combining your specific context with this knowledge, VibeOCM creates artifacts
              that are both tailored to your needs and aligned with industry standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

