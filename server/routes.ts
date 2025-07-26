import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { submitQuestionSchema } from "@shared/schema";
import { generateProgrammingAnswer } from "./services/gemini";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Submit a new programming question
  app.post("/api/questions", async (req, res) => {
    try {
      const validatedData = submitQuestionSchema.parse(req.body);
      
      // Generate answer using Gemini AI
      const generatedAnswer = await generateProgrammingAnswer(
        validatedData.question, 
        validatedData.userCode
      );
      
      // Store the question and answer
      const question = await storage.createQuestion({
        userName: validatedData.userName,
        question: validatedData.question,
        answer: generatedAnswer.code,
        explanation: generatedAnswer.explanation,
        language: generatedAnswer.language,
      });
      
      res.json({
        id: question.id,
        userName: question.userName,
        question: question.question,
        answer: {
          code: question.answer,
          explanation: question.explanation,
          language: question.language,
        },
        timestamp: question.createdAt.toISOString(),
      });
    } catch (error) {
      console.error("Error processing question:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: "Failed to generate answer. Please try again." 
      });
    }
  });
  
  // Get all active questions for the live feed
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await storage.getActiveQuestions();
      
      const formattedQuestions = questions.map(q => ({
        id: q.id,
        userName: q.userName,
        question: q.question,
        answer: {
          code: q.answer,
          explanation: q.explanation,
          language: q.language,
        },
        timestamp: q.createdAt.toISOString(),
        expiresAt: q.expiresAt.toISOString(),
      }));
      
      res.json(formattedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ 
        message: "Failed to fetch questions" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
