import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Code } from "lucide-react";

const formSchema = z.object({
  userName: z.string().min(1, "Name is required").max(50, "Name too long"),
  question: z.string().min(10, "Question must be at least 10 characters").max(1000, "Question too long"),
  userCode: z.string().optional(),
  hasCode: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface QuestionFormProps {
  onQuestionSubmitted: () => void;
}

export function QuestionForm({ onQuestionSubmitted }: QuestionFormProps) {
  const { toast } = useToast();
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [hasCode, setHasCode] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      question: "",
      userCode: "",
      hasCode: false,
    },
  });

  const submitQuestionMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/questions", data);
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentAnswer(data);
      onQuestionSubmitted();
      form.reset();
      toast({
        title: "Success!",
        description: "Your question has been answered and added to the live feed.",
      });
      
      // Scroll to answer section
      setTimeout(() => {
        const answerSection = document.getElementById("answer-section");
        if (answerSection) {
          answerSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    },
    onError: (error: any) => {
      console.error("Error submitting question:", error);
      toast({
        title: "Error",
        description: "Failed to generate answer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    submitQuestionMutation.mutate(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-300">Your Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-300">Programming Question</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="e.g., How do I implement a binary search algorithm in Python?"
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Toggle for user code */}
          <div className="flex items-center space-x-3 p-4 bg-black/20 rounded-xl border border-white/10">
            <Switch
              checked={hasCode}
              onCheckedChange={(checked) => {
                setHasCode(checked);
                form.setValue("hasCode", checked);
                if (!checked) {
                  form.setValue("userCode", "");
                }
              }}
              className="data-[state=checked]:bg-purple-600"
            />
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">I have code to share</span>
            </div>
          </div>

          {/* User code input */}
          {hasCode && (
            <FormField
              control={form.control}
              name="userCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-300">Your Code</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="Paste your code here..."
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm resize-none font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            disabled={submitQuestionMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitQuestionMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Answer"
            )}
          </Button>
        </form>
      </Form>

      {/* Pass current answer to global state for AnswerDisplay */}
      {currentAnswer && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__currentAnswer = ${JSON.stringify(currentAnswer)};`,
          }}
        />
      )}
    </>
  );
}