"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface LearningAgentContextType {
  userQuery: string;
  setUserQuery: (query: string) => void;
  userInput: string;
  setUserInput: (input: string) => void;
}

const LearningAgentContext = createContext<
  LearningAgentContextType | undefined
>(undefined);

export const LearningAgentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [userQuery, setUserQuery] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");

  return (
    <LearningAgentContext.Provider
      value={{
        userQuery,
        setUserQuery,
        userInput,
        setUserInput,
      }}
    >
      {children}
    </LearningAgentContext.Provider>
  );
};

export const useLearningAgentContext = () => {
  const context = useContext(LearningAgentContext);
  if (context === undefined) {
    throw new Error(
      "useLearningAgentContext must be used within a LearningAgentProvider"
    );
  }
  return context;
};
