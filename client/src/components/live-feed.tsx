import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface LiveFeedProps {
  questions: Question[];
}

export function LiveFeed({ questions }: LiveFeedProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getLanguageColor = (language: string) => {
    const colors = {
      python: "text-green-300",
      javascript: "text-yellow-300",
      typescript: "text-blue-300",
      java: "text-orange-300",
      cpp: "text-red-300",
      csharp: "text-purple-300",
      php: "text-indigo-300",
      ruby: "text-pink-300",
      go: "text-cyan-300",
      rust: "text-amber-300",
    };
    return colors[language as keyof typeof colors] || "text-gray-300";
  };

  const getLanguageDisplay = (language: string) => {
    const displays = {
      python: "Python",
      javascript: "JavaScript",
      typescript: "TypeScript",
      java: "Java",
      cpp: "C++",
      csharp: "C#",
      php: "PHP",
      ruby: "Ruby",
      go: "Go",
      rust: "Rust",
    };
    return displays[language as keyof typeof displays] || language.toUpperCase();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getGradientColor = (index: number) => {
    const gradients = [
      "from-green-400 to-blue-500",
      "from-purple-400 to-pink-500",
      "from-orange-400 to-red-500",
      "from-blue-400 to-indigo-500",
      "from-pink-400 to-rose-500",
      "from-cyan-400 to-teal-500",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="glass-strong rounded-3xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Live Programming Q&A Feed</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live Updates</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {questions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No questions yet. Be the first to ask!</p>
          </div>
        ) : (
          questions.map((question, index) => (
            <div
              key={question.id}
              className="glass rounded-2xl p-6 hover:bg-white/20 transition-all cursor-pointer"
              onClick={() => toggleExpanded(question.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${getGradientColor(index)} rounded-full flex items-center justify-center text-sm font-bold`}>
                    {getInitials(question.userName)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{question.userName}</p>
                    <p className="text-xs text-gray-400">{getTimeAgo(question.timestamp)}</p>
                  </div>
                </div>
                <div className={`glass px-3 py-1 rounded-full text-xs ${getLanguageColor(question.answer.language)}`}>
                  {getLanguageDisplay(question.answer.language)}
                </div>
              </div>

              <div className="question-preview mb-3">
                <p className="text-gray-300 line-clamp-2">{question.question}</p>
              </div>

              {expandedItems.has(question.id) && (
                <div className="border-t border-white/10 pt-4 mt-4" onClick={(e) => e.stopPropagation()}>
                  <p className="text-sm text-gray-400 mb-3">Generated Code:</p>
                  <pre className="code-block rounded-lg p-4 text-sm overflow-x-auto">
                    <code className={`language-${question.answer.language}`}>
                      {question.answer.code}
                    </code>
                  </pre>
                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-xs text-gray-500">Click to copy code</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCode(question.answer.code)}
                      className="text-purple-400 hover:text-purple-300 text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}