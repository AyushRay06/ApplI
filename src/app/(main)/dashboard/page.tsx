import { getUserOnboardingStatus } from "@/actions/user.action"
import { redirect } from "next/navigation"

const IndustryInsightsPage = async () => {
  const { isOnborded } = await getUserOnboardingStatus()

  if (!isOnborded) {
    redirect("/onboarding")
  }
  return <div>page</div>
}

export default IndustryInsightsPage
