export interface LearningAgentState {
  messages: Message[];
  user_id?: string;
}

export interface Message {
  content: string;
  role: "user" | "assistant";
  type?: "thinking" | "processing" | "response";
}
