import { type User, type InsertUser, type Question, type InsertQuestion } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  getActiveQuestions(): Promise<Question[]>;
  cleanExpiredQuestions(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private questions: Map<string, Question>;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    
    // Start cleanup interval for expired questions
    setInterval(() => {
      this.cleanExpiredQuestions();
    }, 60000); // Check every minute
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hours from now
    
    const question: Question = {
      id,
      userName: insertQuestion.userName,
      question: insertQuestion.question,
      answer: insertQuestion.answer,
      explanation: insertQuestion.explanation || null,
      language: insertQuestion.language || "javascript",
      createdAt: now,
      expiresAt,
    };
    
    this.questions.set(id, question);
    return question;
  }

  async getActiveQuestions(): Promise<Question[]> {
    const now = new Date();
    return Array.from(this.questions.values())
      .filter(q => q.expiresAt > now)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async cleanExpiredQuestions(): Promise<void> {
    const now = new Date();
    const toDelete: string[] = [];
    
    this.questions.forEach((question, id) => {
      if (question.expiresAt <= now) {
        toDelete.push(id);
      }
    });
    
    for (const id of toDelete) {
      this.questions.delete(id);
    }
  }
}

export const storage = new MemStorage();
