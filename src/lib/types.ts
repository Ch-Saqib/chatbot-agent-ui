export interface UserProfile {
  [key: string]: any;
}

export interface ArtifactVisual {
  index: number;
  type: string;
  title: string;
  query: string;
}

export interface ArtifactCode {
  index: number;
  type: string;
  title: string;
  language: string;
  code: string;
  recent_editor: "ai" | "human";
}

export interface ArtifactState {
  index: number;
  contents: ArtifactContent[];
  is_open: boolean;
}

export interface Answer {
  answer_id: string;
  answer_text?: string;
  is_correct?: boolean;
  reasoning: string;
}

export interface UserAnswer {
  user_answer: string;
  evaluation?: string;
  reasoning?: string;
  feedback?: string;
}

export interface QuestionType {
  question_type_name: string;
  question_type_description?: string;
}

export interface Question {
  question_id: string;
  question_text: string;
  question_type: QuestionType;
  user_answer?: UserAnswer;
  answers: Answer[];
}

export interface Competency {
  competency_id: string;
  competency_name: string;
  competency_description?: string;
  questions: Question[];
  no_of_questions?: number;
}

export interface LearningAgentState {
  messages: Message[];
  profile_data?: UserProfile;
  enrolled_courses?: Record<string, any>;
  enrolled?: boolean;
  course_code?: string;
  section_code?: string;
  active_topic_name?: string;
  active_topic_data?: any;
  active_topic_interaction?: any;
  canvas_state?: ArtifactState;
  topic_content?: any;
  interaction?: Competency[];
  assigned_interaction_id?: string;
  user_id?: string;
}

export interface Message {
  content: string;
  role: "user" | "assistant";
  type?: "thinking" | "processing" | "response";
}

export type ArtifactContent = ArtifactVisual | ArtifactCode;

export function isCodeArtifact(
  artifact: ArtifactContent
): artifact is ArtifactCode {
  return artifact.type === "code";
}

export function isVisualArtifact(
  artifact: ArtifactContent
): artifact is ArtifactVisual {
  return artifact.type === "visual";
}
