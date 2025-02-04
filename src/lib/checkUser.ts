//To save the clerk user data into the postgreSQl DB

import { currentUser } from "@clerk/nextjs/server"
import prisma from "./prisma"

export const checkUser = async () => {
  //Check if user is signedin
  const user = await currentUser()

  if (!user) {
    return null
  }

  try {
    //checking if the data of the loggedin user is already saved in the  pstg db
    const loggedInUser = await prisma.user.findUnique({
      where: {
        clerkUserId: user.id, //user here regerence to above user
      },
    })

    if (loggedInUser) {
      return loggedInUser
    }

    const name = `${user.firstName} ${user.lastName}`
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress, //cleark can provide more than one email
      },
    })
    return newUser
  } catch (error) {
    console.log("Error In CHECKUSER!!!!", error)
  }
}
