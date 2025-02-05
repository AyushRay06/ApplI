import { industries } from "@/data/industries"
import OnboardingForm from "./_components/onboardingform"
import { getUserOnboardingStatus } from "@/actions/user.action"
import { redirect } from "next/navigation"

const Onboarding = async () => {
  //check if user is already onBorded

  const { isOnborded } = await getUserOnboardingStatus()

  if (isOnborded) {
    redirect("/dashboard")
  }

  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  )
}

export default Onboarding
