import { Card, CardContent } from '@/components/ui/card'
import { FileText, MessageSquare, Users, Calendar, BarChart, FileCheck } from 'lucide-react'

const artifacts = [
  {
    title: 'Change Management Plan',
    icon: FileText
  },
  {
    title: 'Communication Plan',
    icon: MessageSquare
  },
  {
    title: 'Stakeholder Analysis',
    icon: Users
  },
  {
    title: 'Training Plan',
    icon: Calendar
  },
  {
    title: 'Impact Assessment',
    icon: BarChart
  },
  {
    title: 'Readiness Assessment',
    icon: FileCheck
  }
]

const testimonials = [
  {
    quote: "VibeOCM cut our change management planning time by 75%. What used to take weeks now takes hours.",
    author: "Sarah J., Change Manager at Fortune 500 Company"
  },
  {
    quote: "The quality of the artifacts is impressive. We've been able to customize them to our needs with minimal effort.",
    author: "Michael T., Transformation Lead"
  },
  {
    quote: "As a consultant, this tool has been a game-changer for how I deliver value to clients quickly.",
    author: "Elena R., OCM Consultant"
  }
]

export function ToolOverviewSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simplify Your Change Management Process</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Organizational Change Management (OCM) is critical for successful transformations. 
            VibeOCM leverages AI to streamline the creation of professional OCM artifacts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold mb-6">What is OCM?</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Organizational Change Management (OCM) is a framework for managing the people side of change.
              It helps organizations transition from a current state to a desired future state by addressing
              the human aspects of change.
            </p>
            <p className="text-lg text-muted-foreground">
              Effective OCM reduces resistance, increases adoption, and ensures that changes deliver
              the expected benefits to the organization.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-6">How VibeOCM Helps</h3>
            <p className="text-lg text-muted-foreground mb-4">
              VibeOCM uses advanced AI to generate comprehensive OCM artifacts based on your specific
              project context. Our tool understands the nuances of change management and produces
              tailored content that would normally take days or weeks to create.
            </p>
            <p className="text-lg text-muted-foreground">
              Simply provide your project details, and VibeOCM will generate professional-quality
              OCM artifacts ready for review and implementation.
            </p>
          </div>
        </div>
        
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center">Available Artifacts</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {artifacts.map((artifact, index) => {
              const Icon = artifact.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex justify-center">
                      <Icon className="h-12 w-12 text-primary" />
                    </div>
                    <h4 className="font-medium">{artifact.title}</h4>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold mb-6 text-center">What Our Users Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <blockquote className="text-lg italic mb-4">"{testimonial.quote}"</blockquote>
                  <p className="text-sm text-muted-foreground">— {testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

