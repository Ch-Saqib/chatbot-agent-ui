import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center mt-20">
        Welcome to Chat Bot
      </h1>
      <p className="text-center mt-5">
        Click the link below to start chatting with Chatbot
      </p>
      <div className="flex justify-center mt-5">
        <Link
          href="/chat"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Chat with Copilot
        </Link>
      </div>
    </div>
  );
}
