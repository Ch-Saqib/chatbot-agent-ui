"use client"

import { useState, useRef, useEffect } from "react"
import { useCoAgent } from "@copilotkit/react-core"
import { TextMessage, MessageRole } from "@copilotkit/runtime-client-gql"
import { useLearningAgentContext } from "@/lib/learning-agent-provider"
import { CodePreview } from "@/components/CodePreview"
import type { LearningAgentState, Message, AgentFramework, AgentConfig } from "@/lib/types"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { SendIcon, Loader2, Bot, History } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

const AGENT_CONFIGS: AgentConfig[] = [
  {
    name: "Next.js Expert",
    framework: "nextjs",
    description: "Specialized in Next.js and React development",
  },
  {
    name: "LangGraph Expert",
    framework: "langgraph",
    description: "Specialized in LangGraph development",
  },
  {
    name: "CrewAI Expert",
    framework: "crewai",
    description: "Specialized in CrewAI development",
  },
]

interface ChatHistory {
  id: string
  title: string
  createdAt: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialView, setIsInitialView] = useState(true)
  const [selectedFramework, setSelectedFramework] = useState<AgentFramework>("nextjs")
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { userInput, setUserInput } = useLearningAgentContext()

  const { run: runAgent, state: agentState } = useCoAgent<LearningAgentState>({
    name: `${selectedFramework}_agent`,
  })

  useEffect(() => {
    if (agentState?.messages) {
      setMessages(agentState.messages)
      setIsLoading(false)
    }
  }, [agentState?.messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    fetchChatHistory()
  }, [])

  const fetchChatHistory = async () => {
    setLoadingHistory(true)
    try {
      const response = await fetch("/api/chat/history")
      if (!response.ok) throw new Error("Failed to fetch chat history")
      const data = await response.json()
      setChatHistory(data)
    } catch (error) {
      console.error("Error fetching chat history:", error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleFrameworkChange = (framework: AgentFramework) => {
    setSelectedFramework(framework)
  }

  const handleSendMessage = async (input: string = userInput) => {
    if (input.trim() === "") return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, newMessage])
    setUserInput("")
    setIsLoading(true)
    setIsInitialView(false)

    await runAgent(() => {
      return new TextMessage({
        role: MessageRole.User,
        content: input,
      })
    })

    // Save chat history
    try {
      await fetch("/api/chat/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: input.slice(0, 50), // Use first 50 characters as title
          messages: [...messages, newMessage],
        }),
      })
      fetchChatHistory() // Refresh chat history
    } catch (error) {
      console.error("Failed to save chat history:", error)
    }
  }

  const loadChatHistory = async (id: string) => {
    try {
      const response = await fetch(`/api/chat/history/${id}`)
      if (!response.ok) throw new Error("Failed to load chat history")
      const data = await response.json()
      setMessages(JSON.parse(data.messages))
      setIsInitialView(false)
    } catch (error) {
      console.error("Error loading chat history:", error)
    }
  }

  const renderMessage = (message: Message) => {
    const hasCode = message.codeBlocks && message.codeBlocks.length > 0

    return (
      <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} w-full`}>
        <div
          className={`max-w-[85%] rounded-lg shadow-md ${
            message.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800"
          }`}
        >
          {message.type === "thinking" ? (
            <div className="p-4 italic text-muted-foreground">🤔 Thinking...</div>
          ) : (
            <>
              <div className="p-4">{message.content}</div>
              {hasCode && (
                <div className="mt-4">
                  <CodePreview codeBlocks={message.codeBlocks!} projectId={message.codeBlocks![0].projectId} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <header className="text-center p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">AI Assistant</h1>
          <div className="flex items-center space-x-4">
            <Select value={selectedFramework} onValueChange={(value) => handleFrameworkChange(value as AgentFramework)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent>
                {AGENT_CONFIGS.map((config) => (
                  <SelectItem key={config.framework} value={config.framework}>
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <div>
                        <p className="font-medium">{config.name}</p>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <History className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Chat History</SheetTitle>
                  <SheetDescription>Your previous conversations</SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  {loadingHistory ? (
                    <Skeleton className="h-10 w-full" />
                  ) : chatHistory.length === 0 ? (
                    <p className="text-center text-muted-foreground">No chat history available</p>
                  ) : (
                    chatHistory.map((chat) => (
                      <Button
                        key={chat.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => loadChatHistory(chat.id)}
                      >
                        <span className="truncate">{chat.title}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {new Date(chat.createdAt).toLocaleDateString()}
                        </span>
                      </Button>
                    ))
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {isInitialView ? (
            <motion.div
              key="initial-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full space-y-8"
            >
              <h2 className="text-3xl font-semibold text-gray-700 text-center">How can I help you today?</h2>
              <Textarea
                placeholder="Ask me anything..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="w-full max-w-2xl p-4 text-lg rounded-lg resize-none bg-white border-b shadow-lg"
                rows={3}
              />
            </motion.div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {renderMessage(message)}
              </motion.div>
            ))
          )}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 p-4 rounded-lg shadow-md">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {!isInitialView && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="p-6 bg-white shadow-md">
            <div className="flex space-x-4 max-w-4xl mx-auto">
              <Textarea
                placeholder="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-1 resize-none p-3 rounded-lg"
                rows={1}
              />
              <Button onClick={() => handleSendMessage()} disabled={isLoading} className="px-6 py-3 rounded-lg">
                <SendIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

