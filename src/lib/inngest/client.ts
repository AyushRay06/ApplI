import { Inngest } from "inngest"

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "tech-companion",
  name: "Tech-Companion",
  credentials: {
    apikey: process.env.GEMINI_API_KEY!,
  },
})
