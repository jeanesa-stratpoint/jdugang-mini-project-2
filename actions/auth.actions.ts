'use server'

import bcrypt from 'bcryptjs'
import { eq, or } from 'drizzle-orm'
import { redirect } from 'next/navigation';
import { SignupFormSchema, LoginFormSchema, FormState } from '@/lib/definitions'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { createSession } from '@/lib/session' 
import { deleteSession } from '@/lib/session';

export async function signup(state: FormState, formData: FormData) {
  // Validate fields
  const validatedFields = SignupFormSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const { name, username, email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    // Check for duplicates
    const existingUser = await db.query.users.findFirst({
      where: or(eq(users.email, email), eq(users.username, username)),
    })

    if (existingUser) {
      if (existingUser.email === email) return { errors: { email: ['Email already in use.'] } }
      if (existingUser.username === username) return { errors: { username: ['Username taken.'] } }
    }

    // Insert and get ID back using .returning()
    const [newUser] = await db.insert(users).values({
      name,
      username,
      email,
      passwordHash: hashedPassword,
    }).returning({ id: users.id })

    // LOG THE USER IN (Create the cookie)
    await createSession(newUser.id)

  } catch (error) {
    return { message: `Something went wrong... ${error}` }
  }

  return { message: "Success! Account created." }
}

export async function checkUsernameAvailability(username: string) {
  //  Basic format check
  if (!username || username.length < 3) return { available: false, message: "Too short" };
  
  // Database check
  const existingUser = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  return { 
    available: !existingUser, 
    message: existingUser ? "Username taken" : "Username available" 
  };
}

export async function login(state: FormState, formData: FormData) {
  // Validate fields
  const validatedFields = LoginFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  try {
    // Query DB by USERNAME
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    // Verify user exists and password matches
    if (!user || !user.passwordHash) {
      return { message: 'Invalid username or password.' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordsMatch) {
      return { message: 'Invalid username or password.' };
    }

    // Create Session
    await createSession(user.id);

  } catch (error) {
    return { message: `Something went wrong... ${error}` };
  }

  return { message: "Success! Logged in." };
}

export async function logout() {
  await deleteSession();
  redirect('/'); // Send them back to the landing page
}