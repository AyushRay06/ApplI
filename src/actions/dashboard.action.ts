"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

import { GoogleGenerativeAI } from "@google/generative-ai"

//Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

interface generateAIInsightsProps {}

export const generateAIInsights = async (industry: string) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim()

  return JSON.parse(cleanedText)
}

export async function getIndustryInsights() {
  const { userId } = await auth()

  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      industryInsight: true,
    },
  })

  if (!user) throw new Error("User not found")
    //
  if (!user.industry) throw new Error("User industry is missing")

  if (!user.industryInsight) {
    //user.industry(so that the insights can be geenerate related to users industry)
    //eg: user is Ayush and his industy is Tech, so insights related to tech
    const insights = await generateAIInsights(user.industry)

    const result = await prisma.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })
  }
}
