import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Answer {
  id: string;
  userName: string;
  question: string;
  answer: {
    code: string;
    explanation: string;
    language: string;
  };
  timestamp: string;
}

export function AnswerDisplay() {
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Listen for new answers from the form component
    const checkForNewAnswer = () => {
      const answer = (window as any).__currentAnswer;
      if (answer) {
        setCurrentAnswer(answer);
        (window as any).__currentAnswer = null;
      }
    };

    const interval = setInterval(checkForNewAnswer, 100);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async () => {
    if (!currentAnswer?.answer.code) return;

    try {
      await navigator.clipboard.writeText(currentAnswer.answer.code);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!currentAnswer) {
    return null;
  }

  return (
    <div id="answer-section" className="glass-strong rounded-3xl p-8">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold text-white">Generated Answer</h3>
        <Button
          onClick={copyToClipboard}
          variant="ghost"
          size="sm"
          className="glass px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition-all flex items-center space-x-2"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{copied ? "Copied!" : "Copy Code"}</span>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              {currentAnswer.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-white">{currentAnswer.userName}</p>
              <p className="text-xs text-gray-400">{formatTimestamp(currentAnswer.timestamp)}</p>
            </div>
          </div>
          <p className="text-gray-300 mb-4">
            <strong>Question:</strong> {currentAnswer.question}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Generated Code:</h4>
            <pre className="code-block rounded-lg p-4 text-sm overflow-x-auto">
              <code className={`language-${currentAnswer.answer.language}`}>
                {currentAnswer.answer.code}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}