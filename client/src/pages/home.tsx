import { useQuery } from "@tanstack/react-query";
import { FloatingParticles } from "@/components/floating-particles";
import { QuestionForm } from "@/components/question-form";
import { AnswerDisplay } from "@/components/answer-display";
import { LiveFeed } from "@/components/live-feed";
import { Zap } from "lucide-react";

interface Question {
  id: string;
  userName: string;
  question: string;
  answer: {
    code: string;
    explanation: string;
    language: string;
  };
  timestamp: string;
  expiresAt: string;
}

export default function Home() {
  const { data: questions = [], refetch } = useQuery<Question[]>({
    queryKey: ['/api/questions'],
    refetchInterval: 30000, // Refresh every 30 seconds for live updates
  });

  return (
    <div className="min-h-screen gradient-bg text-white overflow-x-hidden">
      <FloatingParticles />
      
      {/* Header */}
      <header className="relative z-10">
        <nav className="glass mx-4 mt-4 rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  CodeGenie
                </h1>
                <p className="text-xs text-gray-400">AI Programming Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="glass-strong px-3 py-1 rounded-full text-sm">
                <span className="text-green-400">●</span> Live Feed
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-1">
            <div className="glass-strong rounded-3xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ask Your Programming Question
              </h2>
              
              <QuestionForm onQuestionSubmitted={() => refetch()} />
              
              {/* API Setup Notice */}
              <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-500/30 rounded-xl">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <div>
                    <p className="text-sm text-yellow-300 font-medium">Setup Required</p>
                    <p className="text-xs text-yellow-400 mt-1">Configure your Gemini API key in the environment variables to enable AI responses.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Answer Display & Live Feed */}
          <div className="lg:col-span-2 space-y-8">
            <AnswerDisplay />
            <LiveFeed questions={questions} />
          </div>
        </div>
      </main>
    </div>
  );
}