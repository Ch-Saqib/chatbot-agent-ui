"use client";

import { useState, useRef, useEffect } from "react";
import { useCoAgent } from "@copilotkit/react-core";
import { TextMessage, MessageRole } from "@copilotkit/runtime-client-gql";
import { useLearningAgentContext } from "@/lib/learning-agent-provider";
import type { LearningAgentState, Message } from "@/lib/types";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { SendIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const starterPrompts = [
  "Tell me about the latest advancements in AI",
  "How can I improve my coding skills?",
  "Explain the concept of machine learning",
  "What are the best practices for web development?",
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialView, setIsInitialView] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userInput, setUserInput } = useLearningAgentContext();

  const { run: runResearchAgent, state: agentState } =
    useCoAgent<LearningAgentState>({
      name: "react_agent",
    });

  useEffect(() => {
    if (agentState?.messages) {
      setMessages(agentState.messages);
      setIsLoading(false);
    }
  }, [agentState?.messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesEndRef]);

  const handleSendMessage = async (input: string = userInput) => {
    if (input.trim() === "") return;

    const newUserMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setUserInput("");
    setIsLoading(true);
    setIsInitialView(false);

    await runResearchAgent(() => {
      return new TextMessage({
        role: MessageRole.User,
        content: input,
      });
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="text-center p-6 text-2xl font-bold text-gray-800 shadow-sm bg-white">
          AI Learning Assistant
        </header>
      </motion.div>

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
              <h2 className="text-3xl font-semibold text-gray-700 text-center">
                Welcome to your AI Learning Assistant!
              </h2>

              <Textarea
                placeholder="Ask me anything..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="w-full max-w-2xl p-4 text-lg rounded-lg resize-none bg-white border-b shadow-lg border-black"
                rows={3}
              />

              <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                {starterPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-left p-4 h-auto shadow-md"
                    variant="outline"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-lg shadow-md ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 bg-white shadow-md">
            <div className="flex space-x-4 max-w-4xl mx-auto">
              <Textarea
                placeholder="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 resize-none p-3 rounded-lg"
                rows={1}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading}
                className="px-6 py-3 rounded-lg"
              >
                <SendIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
