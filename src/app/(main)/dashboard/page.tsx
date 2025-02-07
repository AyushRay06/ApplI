import { getIndustryInsights } from "@/actions/dashboard.action"
import { getUserOnboardingStatus } from "@/actions/user.action"
import { redirect } from "next/navigation"
import DashboardView from "./_components/dashboard-view"

const IndustryInsightsPage = async () => {
  const { isOnborded } = await getUserOnboardingStatus()

  const insights = await getIndustryInsights()

  if (!isOnborded) {
    redirect("/onboarding")
  }
  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  )
}

export default IndustryInsightsPage
