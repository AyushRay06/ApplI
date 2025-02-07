import { Suspense } from "react"
import { BarLoader } from "react-spinners"

const InterviewLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
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

export default InterviewLayout
