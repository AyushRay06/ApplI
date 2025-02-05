import { industries } from "@/data/industries"
import OnboardingForm from "./_components/onboardingform"

const Onboarding = () => {
  //check if user  is already onBorded ie filled its info about cindustry etc etc
  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  )
}

export default Onboarding
