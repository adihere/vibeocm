"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Copy, RefreshCw, Edit } from "lucide-react"

interface ResultsSectionProps {
  content: string
  artifactType: string
  isLoading: boolean
  onReset: () => void
  onRefine: () => void
}

export function ResultsSection({ content, artifactType, isLoading, onReset, onRefine }: ResultsSectionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${artifactType.replace(/\s+/g, "-").toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="py-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Generating {artifactType}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Please wait while we create your document...
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="loading-animation flex justify-center py-12">
              <div className="animate-pulse space-y-4 w-full">
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mt-8"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!content) {
    return null
  }

  return (
    <div className="py-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{artifactType}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Review your AI-generated content below</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end space-x-2 mb-4">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"} <Copy className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              Download <Download className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="preview" className="document-preview">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="markdown">Markdown</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardContent className="p-6 prose max-w-none">
                  <div
                    id="aiOutput"
                    className="generated-content"
                    dangerouslySetInnerHTML={{
                      __html: content
                        .replace(/\n/g, "<br>")
                        .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
                        .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
                        .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/- (.*?)$/gm, "<ul><li>$1</li></ul>")
                        .replace(/<\/ul><ul>/g, ""),
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="markdown" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <pre className="bg-gray-100 p-4 rounded-md overflow-auto whitespace-pre-wrap font-mono text-sm">
                    {content}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={onReset}>
              <RefreshCw className="mr-2 h-4 w-4" /> Generate Another Artifact
            </Button>
            <Button onClick={onRefine}>
              <Edit className="mr-2 h-4 w-4" /> Refine Content
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

