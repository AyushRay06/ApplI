"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// -------------------------Gemini config---------------------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

//------------------------Generate quiz-----------------------------------
export async function generateQuiz() {
  const { userId } = await auth()

  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    select: {
      industry: true,
      skills: true,
    },
  })

  if (!user) throw new Error("User not found in te DB")

  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim()
    const quiz = JSON.parse(cleanedText)
    return quiz.questions
  } catch (error) {
    console.error("Error generating quiz:", error)
    throw new Error("Failed to generate quiz question")
  }
}

// NOT SURE ABOUT THE DATA TYPES FOR NOW
interface QuestionProps {
  question: string
  correctAnswer: string
  explanation: string
  options: string[]
}

interface SaveQuizeResultProps {
  questions: QuestionProps[] //as questions is an array of QuestionProps{object} ie array of object
  answers: string[]
  score: number
}

export async function saveQuizeResult({
  questions,
  answers,
  score,
}: SaveQuizeResultProps) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  })

  if (!user) throw new Error("User not found in the DB")

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }))

  //   get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect)

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null
  if (wrongAnswers.length >= 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n")

    const improvementPrompt = ` The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `

    try {
      const tipResult = await model.generateContent(improvementPrompt)
      improvementTip = tipResult.response.text().trim()
      console.log(improvementTip)
      //   return improvementTip
    } catch (error) {
      console.error("Error generating improvement tip:", error)
      // Continue without improvement tip if generation fails
    }
  }

  //   saving the saaesment details into the DB in Assesment Tabel
  try {
    const quizResult = await prisma.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "technical",
        improvementTip,
      },
    })

    return quizResult
  } catch (error) {
    console.error("Error saving quiz result:", error)
    throw new Error("Error in SaveQuizeResult")
  }
}

// ----------------------Geting Assesments---------------------------

export async function getAssesment() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthenticated")

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  })
  if (!user) throw new Error("User not found in DB")
  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    })
    return assessments
  } catch (error) {
    console.error("Error in getting Assesments:", error)
    throw new Error("Failed to fetch assesment")
  }
}
