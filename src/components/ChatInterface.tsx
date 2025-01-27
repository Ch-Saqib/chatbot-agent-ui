"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCoAgent } from "@copilotkit/react-core";
import { TextMessage, MessageRole } from "@copilotkit/runtime-client-gql";
import { useLearningAgentContext } from "@/lib/learning-agent-provider";
import type { LearningAgentState, Message } from "@/lib/types";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { SendIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userInput, setUserInput } = useLearningAgentContext();

  const { run: runResearchAgent, state: agentState } =
    useCoAgent<LearningAgentState>({
      name: "react_agent",
      // initialState: {
      //   course_code: "AI-201",
      //   user_id: "SAQIB1",
      // },
    });

  useEffect(() => {
    if (agentState?.messages) {
      setMessages(agentState.messages);
      setIsLoading(false);
    }
  }, [agentState?.messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    const newUserMessage: Message = {
      role: "user",
      content: userInput,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setUserInput("");
    setIsLoading(true);

    await runResearchAgent(() => {
      return new TextMessage({
        role: MessageRole.User,
        content: userInput,
      });
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="text-center bg-gray-300 p-4 text-lg font-bold border-black border-b">
            CHATBOT
          </header>
        </motion.div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
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
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 p-3 rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-4 bg-white border-t justify-center">
          <div className="flex space-x-2 max-w-4xl mx-auto justify-center">
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
              className="flex-1 resize-none"
              rows={1}
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              <SendIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
