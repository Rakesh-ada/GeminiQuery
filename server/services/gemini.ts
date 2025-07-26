import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

export interface GeneratedAnswer {
  code: string;
  explanation: string;
  language: string;
}

export async function generateProgrammingAnswer(question: string): Promise<GeneratedAnswer> {
  try {
    const prompt = `You are an expert programming assistant. Answer the following programming question with:
1. Clean, working code that solves the problem
2. A clear explanation of how the solution works
3. Best practices and any important notes

Question: ${question}

Please respond in JSON format with:
{
  "code": "the complete code solution",
  "explanation": "detailed explanation of the solution",
  "language": "the programming language used (lowercase, e.g., 'python', 'javascript', 'java')"
}

Make sure the code is production-ready and follows best practices for the detected language.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            code: { type: "string" },
            explanation: { type: "string" },
            language: { type: "string" },
          },
          required: ["code", "explanation", "language"],
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini API");
    }

    const data: GeneratedAnswer = JSON.parse(rawJson);
    
    // Validate the response
    if (!data.code || !data.explanation || !data.language) {
      throw new Error("Invalid response format from Gemini API");
    }

    return data;
  } catch (error) {
    console.error("Gemini API error:", error);
    
    // Fallback response for API failures
    const detectedLanguage = detectLanguageFromQuestion(question);
    return {
      code: generateFallbackCode(question, detectedLanguage),
      explanation: "I apologize, but I'm currently unable to generate a detailed response. This is a basic code structure to get you started. Please try again in a moment.",
      language: detectedLanguage
    };
  }
}

function detectLanguageFromQuestion(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes("python")) return "python";
  if (lowerQuestion.includes("javascript") || lowerQuestion.includes("js")) return "javascript";
  if (lowerQuestion.includes("typescript") || lowerQuestion.includes("ts")) return "typescript";
  if (lowerQuestion.includes("java") && !lowerQuestion.includes("javascript")) return "java";
  if (lowerQuestion.includes("c++") || lowerQuestion.includes("cpp")) return "cpp";
  if (lowerQuestion.includes("c#") || lowerQuestion.includes("csharp")) return "csharp";
  if (lowerQuestion.includes("php")) return "php";
  if (lowerQuestion.includes("ruby")) return "ruby";
  if (lowerQuestion.includes("go") || lowerQuestion.includes("golang")) return "go";
  if (lowerQuestion.includes("rust")) return "rust";
  if (lowerQuestion.includes("swift")) return "swift";
  if (lowerQuestion.includes("kotlin")) return "kotlin";
  
  // Default to JavaScript for web-related terms
  if (lowerQuestion.includes("html") || lowerQuestion.includes("css") || lowerQuestion.includes("web") || lowerQuestion.includes("react") || lowerQuestion.includes("node")) {
    return "javascript";
  }
  
  return "javascript"; // Default fallback
}

function generateFallbackCode(question: string, language: string): string {
  const templates = {
    python: `def solve_problem():
    """
    Solution for: ${question.substring(0, 80)}...
    """
    # TODO: Implement your solution here
    pass

# Example usage
# result = solve_problem()
# print(result)`,
    
    javascript: `function solveProblem() {
    /**
     * Solution for: ${question.substring(0, 80)}...
     */
    
    // TODO: Implement your solution here
    return null;
}

// Example usage
// const result = solveProblem();
// console.log(result);`,
    
    java: `public class Solution {
    /**
     * Solution for: ${question.substring(0, 80)}...
     */
    public static void solveProblem() {
        // TODO: Implement your solution here
    }
    
    public static void main(String[] args) {
        solveProblem();
    }
}`,
    
    default: `// Solution for: ${question.substring(0, 80)}...

function solution() {
    // TODO: Implement your solution here
    return "Please try again for a detailed solution";
}`
  };
  
  return templates[language as keyof typeof templates] || templates.default;
}
