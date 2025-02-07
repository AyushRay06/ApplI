"use client"

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { BrainCircuit, LineChart, TrendingDown, TrendingUp } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
  const salaryData = insights.salaryRanges.map((range) => ({
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
      default:
        return { icon: LineChart, color: "text-grey-500" }
    }
  }
  //retrieving the value stored in the icon property of the object returned by the function.
  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook)?.icon
  //retrieving the value stored in the color property of the object returned by the function.
  const OutlookColor = getMarketOutlookInfo(insights.marketOutlook)?.color
  //retrieving the value stored in the color property of the object returned by the function.
  const demandLevelColor = getDemandLevelColor(insights.demandLevel)
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/mm/yyyy")
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  ) //Add "X ago"/"in X" in the locale language
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="secondary">Last Updated: {lastUpdatedDate}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* -------Market Outlook---------- */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            <OutlookIcon className={`h-4 w-4 ${OutlookColor}`} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{insights.marketOutlook}</p>
            <p className="text-xs text-muted-foreground">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>
        {/* -----Industry Growth------- */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </p>
            <div className="text-xs text-muted-foreground">
              <Progress value={insights.growthRate} className="mt-2" />
            </div>
          </CardContent>
        </Card>
        {/* ------Demand Level------- */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level </CardTitle>
            <BarChart className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.demandLevel}</div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${demandLevelColor} `}
            ></div>
          </CardContent>
        </Card>
        {/* --------Top Skills-------- */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* ---------------Salary Ranges Chart ---------*/}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Salary Ranges by Role</CardTitle>
          <CardDescription>
            Displaying minimum, median, and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                {/* THE PALOAD DATA COMES FROM THR SALARYDATA */}
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex  items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recomended Skills
            </CardTitle>
            <CardDescription>Skills you should consider.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skills, index) => (
                <Badge key={index} variant="outline">
                  {skills}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Key Industry Trends
            </CardTitle>
            <CardDescription>
              Current trends shaping the industry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary " />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardView
