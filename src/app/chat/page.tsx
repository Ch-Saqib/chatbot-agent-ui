"use client";

import ChatInterface from "@/components/ChatInterface";
import { LearningAgentProvider } from "@/lib/learning-agent-provider";
import {
  ModelSelectorProvider,
  useModelSelectorContext,
} from "@/lib/model-selector-provider";

import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export default function ModelSelectorWrapper() {
  return (
    <main className="">
      <ModelSelectorProvider>
        <Home />
      </ModelSelectorProvider>
    </main>
  );
}

function Home() {
  const { agent, lgcDeploymentUrl } = useModelSelectorContext();

  return (
    <CopilotKit
      runtimeUrl={`/api/copilotkit?lgcDeploymentUrl=${lgcDeploymentUrl ?? ""}`}
      showDevConsole={false}
      agent={agent}
    >
      <LearningAgentProvider>
        <ChatInterface />
      </LearningAgentProvider>
    </CopilotKit>
  );
}
