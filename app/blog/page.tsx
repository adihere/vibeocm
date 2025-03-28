import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog | VibeOCM",
  description: "Read our latest articles about organizational change management and digital transformation.",
}

// Sample blog post data
const blogPosts = [
  {
    slug: "effective-change-management-strategies",
    title: "Effective Change Management Strategies",
    description: "Learn about the most effective strategies for managing organizational change in 2024.",
    date: "2024-03-25",
    readTime: "5 min",
  },
  {
    slug: "measuring-change-management-success",
    title: "Measuring Change Management Success",
    description: "Discover key metrics and KPIs to track the success of your change management initiatives.",
    date: "2024-03-18",
    readTime: "7 min",
  },
  {
    slug: "overcoming-resistance-to-change",
    title: "Overcoming Resistance to Change",
    description: "Practical strategies to identify and address resistance to change in your organization.",
    date: "2024-03-10",
    readTime: "6 min",
  },
  {
    slug: "ai-powered-change-management",
    title: "AI-Powered Change Management",
    description: "How artificial intelligence is transforming the practice of organizational change management.",
    date: "2024-03-05",
    readTime: "8 min",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">VibeOCM Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights and resources to help you manage organizational change effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                  <time dateTime={post.date}>{post.date}</time>
                  <span className="mx-2">•</span>
                  <span>{post.readTime} read</span>
                </div>
                <CardTitle className="text-xl">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription>{post.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                  aria-label={`Read more about ${post.title}`}
                >
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

