export type CodeBlock = {
  code: string
  language: string
  fileName?: string
  type: "react" | "nodejs" | "markdown" | "diagram"
  projectId?: string
}

export type AgentFramework = "nextjs" | "langgraph" | "crewai" | "react"

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  type?: "thinking" | "processing" | "response"
  codeBlocks?: CodeBlock[]
}

export interface LearningAgentState {
  messages: Message[]
  user_id?: string
  currentFramework?: AgentFramework
}

export interface AgentConfig {
  name: string
  framework: AgentFramework
  description: string
}

