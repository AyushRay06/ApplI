import { Suspense } from "react"
import { BarLoader } from "react-spinners"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Industry Insights</h1>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {/* as in the children we will me soem api call so it will take time 
      so we added Suspense  ie loading screen type */}
        {children}
      </Suspense>
    </div>
  )
}

export default DashboardLayout
