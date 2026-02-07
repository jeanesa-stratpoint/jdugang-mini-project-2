'use server'

import { SignupFormSchema, LoginFormSchema, FormState } from '@/lib/definitions'
// import { db } from '@/lib/db' // You will use this once Neon is connected

export async function signup(state: FormState, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse(Object.fromEntries(formData.entries()))

  // 2. If any form fields are invalid, return errors early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // 3. (Next step) Call your Database (Neon) to create the user
  // const { name, email, password } = validatedFields.data
  
  console.log("SERVER ACTION: User created", validatedFields.data)
  
  // 4. (Next step) Create session/redirect
  return { message: "Success! Account created." }
}

export async function login(state: FormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  console.log("SERVER ACTION: User logged in", validatedFields.data)
  return { message: "Success! Redirecting..." }
}