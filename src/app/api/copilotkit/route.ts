import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
  langGraphPlatformEndpoint,
} from "@copilotkit/runtime"
import OpenAI from "openai"
import type { NextRequest } from "next/server"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const llmAdapter = new OpenAIAdapter({ openai } as any)
const langsmithApiKey = process.env.LANGSMITH_API_KEY as string

export const POST = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const deploymentUrl = searchParams.get("lgcDeploymentUrl") || process.env.LGC_DEPLOYMENT_URL

  const remoteEndpoint = deploymentUrl
    ? langGraphPlatformEndpoint({
        deploymentUrl,
        langsmithApiKey,
        agents: [
          {
            name: "react_agent",
            description: "Learning agent for student interactions",
          },
        ],
      })
    : undefined

  const runtime = new CopilotRuntime({
    remoteEndpoints: remoteEndpoint ? [remoteEndpoint] : [],
  })

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: llmAdapter,
    endpoint: "/api/copilotkit",
  })

  return handleRequest(req)
}

