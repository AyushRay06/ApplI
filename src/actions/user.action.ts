"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { generateAIInsights } from "./dashboard.action"

interface updatedUserProps {
  skills: string[]
  experience: number
  industry: string
  bio: string
}

export async function updateUser(data: updatedUserProps) {
  // Check if you is loggedin
  const { userId } = await auth()

  if (!userId) throw new Error("Unauthorized")

  // check if teh loggedin user exist in the postgeSQL DB
  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  })

  if (!user) throw new Error("User not found")

  try {
    // Start a transaction to handle both operations
    const result = await prisma.$transaction(
      async (tx) => {
        // First check if industry exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        })

        // If industry doesn't exist, create it with default values
        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry)

          industryInsight = await prisma.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          })
        }

        // Now update the user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        })

        return { updatedUser, industryInsight }
      },
      {
        timeout: 10000, // default: 5000
      }
    )

    revalidatePath("/")
    return { success: true, ...result }
  } catch (error) {
    console.error("Error updating user and industry:", (error as Error).message)
    throw new Error("Failed to update profile")
  }
}

export async function getUserOnboardingStatus() {
  // check user is loggedin or not
  const { userId } = await auth()

  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  })
  if (!user) throw new Error("User not Found")

  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    })
    return {
      isOnborded: !!user?.industry,
    }
  } catch (error) {
    console.log("Error in getUserOnboardingStatus!!!", error)
    throw new Error("Failed to check onboarding status")
  }
}
