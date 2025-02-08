"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { AgentFramework } from "@/lib/types"

interface LearningAgentContextType {
  userQuery: string
  setUserQuery: (query: string) => void
  userInput: string
  setUserInput: (input: string) => void
  framework: AgentFramework
  setFramework: (framework: AgentFramework) => void
}

const LearningAgentContext = createContext<LearningAgentContextType | undefined>(undefined)

export const LearningAgentProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [userQuery, setUserQuery] = useState<string>("")
  const [userInput, setUserInput] = useState<string>("")
  const [framework, setFramework] = useState<AgentFramework>("nextjs")

  return (
    <LearningAgentContext.Provider
      value={{
        userQuery,
        setUserQuery,
        userInput,
        setUserInput,
        framework,
        setFramework,
      }}
    >
      {children}
    </LearningAgentContext.Provider>
  )
}

export const useLearningAgentContext = () => {
  const context = useContext(LearningAgentContext)
  if (context === undefined) {
    throw new Error("useLearningAgentContext must be used within a LearningAgentProvider")
  }
  return context
}

