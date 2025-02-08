"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, Terminal } from "lucide-react"
import type { CodeBlock } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CodePreviewProps {
  codeBlocks: CodeBlock[]
  projectId?: string
}

export function CodePreview({ codeBlocks, projectId }: CodePreviewProps) {
  const [activeTab, setActiveTab] = React.useState("preview")
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border bg-background shadow-sm">
      <Tabs defaultValue="preview" className="w-full">
        <div className="flex items-center justify-between border-b px-4">
          <TabsList className="h-12">
            <TabsTrigger value="preview" onClick={() => setActiveTab("preview")}>
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" onClick={() => setActiveTab("code")}>
              Code
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleCopy(codeBlocks[0]?.code || "")}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Terminal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <TabsContent value="preview" className="border-none p-0">
          <div className="p-4">
            {/* Add preview rendering logic here */}
            Preview content
          </div>
        </TabsContent>
        <TabsContent value="code" className="border-none p-0">
          <div className="p-4">
            <pre className={cn("relative rounded-lg bg-muted p-4", "overflow-x-auto")}>
              <code className="relative text-sm font-mono">{codeBlocks[0]?.code}</code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

