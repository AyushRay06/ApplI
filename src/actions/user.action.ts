"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function updateUser(data) {
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
    const newUser = await prisma.user.update({})
  } catch(error) {}
}
