"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function updateUser() {
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
  } catch (error) {}
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
    throw new Error("Failed to check onboarding status");
    
  }
}
