import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  // In a real app, you would fetch the blog post data based on the slug
  const title = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return {
    title: `${title} | VibeOCM Blog`,
    description: `Read our blog post about ${title} and learn more about organizational change management.`,
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  // In a real app, you would fetch the blog post data based on the slug
  const title = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            aria-label="Back to blog"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to blog
          </Link>
        </div>

        <article className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" aria-label={`Blog post: ${title}`}>
              {title}
            </h1>

            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                <time dateTime="2024-03-25">March 25, 2024</time>
              </div>

              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>John Doe</span>
              </div>

              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>5 min read</span>
              </div>
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead">
              Organizational change management (OCM) is a framework for managing the people side of change. When
              implemented effectively, it helps individuals transition from their current state to a desired future
              state.
            </p>

            <h2>Why OCM Matters</h2>
            <p>
              According to research by Prosci, projects with excellent change management are six times more likely to
              meet objectives than those with poor change management. Despite this, many organizations underinvest in
              the people side of change.
            </p>

            <h2>Key Components of Effective OCM</h2>
            <p>Successful organizational change management typically includes these essential elements:</p>

            <ul>
              <li>
                <strong>Leadership alignment and sponsorship</strong> - Active and visible executive sponsorship is the
                top contributor to success
              </li>
              <li>
                <strong>Stakeholder engagement</strong> - Identifying and involving the right people at the right time
              </li>
              <li>
                <strong>Communication planning</strong> - Crafting targeted messages for different audiences
              </li>
              <li>
                <strong>Training and support</strong> - Ensuring people have the skills and knowledge needed
              </li>
              <li>
                <strong>Resistance management</strong> - Identifying and addressing concerns proactively
              </li>
            </ul>

            <blockquote>
              "The rate of change is not going to slow down anytime soon. If anything, competition in most industries
              will probably speed up even more in the next few decades."
              <cite>— John P. Kotter</cite>
            </blockquote>

            <h2>Using AI to Enhance OCM</h2>
            <p>
              Artificial intelligence tools like VibeOCM can help change practitioners create more effective OCM
              deliverables in less time. By leveraging AI, organizations can:
            </p>

            <ol>
              <li>Generate comprehensive change management plans</li>
              <li>Create targeted communication strategies</li>
              <li>Develop stakeholder analysis frameworks</li>
              <li>Craft training needs assessments</li>
              <li>Design resistance management approaches</li>
            </ol>

            <h2>Getting Started</h2>
            <p>
              To begin using AI for your OCM initiatives, start by clearly defining your project parameters, identifying
              key stakeholders, and understanding the benefits and challenges of your change initiative.
            </p>

            <p>
              With this foundation in place, tools like VibeOCM can help you generate the artifacts you need to support
              successful organizational change.
            </p>
          </div>
        </article>
      </main>
    </div>
  )
}

