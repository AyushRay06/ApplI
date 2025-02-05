"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

interface generateAIInsightsProps {}

export const generateAIInsights = async (industry) => {}

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

  if (!user.industryInsight) {
    //user.industry(so that the insights can be geenerate related to users industry)
    //eg: user is Ayush and his industy is Tech, so insights related to tech
    const insights = await generateAIInsights(user.industry)

    const result = await prisma.industryInsight.create({
      data:{
        industry:user.industry,
        ...insights,
        nextUpdate()
      }
    })
  }
}
