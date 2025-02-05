import { z } from "zod"

export const onboardingSchema = z.object({
  industry: z.string({
    required_error: "Please select a industry",
  }),

  subIndustry: z.string({
    required_error: "Please select a industry",
  }),
  bio: z.string().max(500).optional(),

  experience: z
    .string()
    .transform((val) => parseInt(val, 10)) //convert a string into an integer in base 10
    .pipe(
      z
        .number()
        .min(0, "Experience must be at least 0 years")
        .max(50, "Experience cannot exceed 50 years")
    ),
  //The .transform() function modifies the input before validation.
  //.pipe() is used to apply further validation after transformation.
  skills: z.string().transform(
    (val) =>
      val
        ? val
            .split(",") //Splits the string by commas , into an array.
            .map((skill) => skill.trim()) //Removes extra spaces around each skill.
            .filter(Boolean) //Removes any empty values ("" or spaces).
        : undefined

    //If val is an empty string (""), null, or undefined, it returns undefined instead of an empty array.
    // This prevents errors when no skills are provided.
  ),
})
