"user client"

import { LineChart, TrendingDown, TrendingUp } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
interface DashboardViewProps {
  id: string
  industry: string
  salaryRanges: {
    role: string
    min: number
    max: number
    median: number
    location: string
  }[]
  growthRate: number
  demandLevel: string
  topSkills: string[]
  marketOutlook: string
  keyTrends: string[]
  recommendedSkills: string[]
  lastUpdated: Date
  nextUpdate: Date
}

const DashboardView = (insights: DashboardViewProps) => {
  //Transforming salary data for carts
  const salaryRanges = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }))

  const getDemandLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getMarketOutlookInfo = (outlook: string) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" }
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" }
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" }
    }
  }
  //retrieving the value stored in the icon property of the object returned by the function.
  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook)?.icon
  //retrieving the value stored in the color property of the object returned by the function.
  const OutlookColor = getMarketOutlookInfo(insights.marketOutlook)?.color

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/mm/yyyy")
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  ) //Add "X ago"/"in X" in the locale language
  return <div></div>
}

export default DashboardView
