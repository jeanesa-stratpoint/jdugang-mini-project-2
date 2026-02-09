'use server'

import bcrypt from 'bcryptjs'
import { eq, or, gt, and } from 'drizzle-orm'
import { redirect } from 'next/navigation';
import { db } from '@/lib/db'
import { SignupFormSchema, LoginFormSchema, ResetPasswordSchema, FormState } from '@/lib/definitions'
import { users, passwordResetTokens } from '@/lib/db/schema'
import { createSession } from '@/lib/session' 
import { deleteSession } from '@/lib/session';
import { Resend } from "resend";
import ResetPasswordEmail from '@/components/emails/ResetPasswordEmail';

export async function signup(_state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const { name, username, email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    const existingUser = await db.query.users.findFirst({
      where: or(eq(users.email, email), eq(users.username, username)),
    })

    if (existingUser) {
      if (existingUser.email === email) 
      return { 
        errors: { 
          email: ['Email already in use.'] 
        } 
      }

      if (existingUser.username === username) 
      return { 
        errors: { 
          username: ['Username taken.'] 
        } 
      }
    }

    const [newUser] = await db.insert(users).values({
      name,
      username,
      email,
      passwordHash: hashedPassword,
    }).returning({ id: users.id })

    await createSession(newUser.id)

  } catch (error) {
    return { 
      message: `Something went wrong... ${error}` 
    }
  }
  return { 
    message: "Success! Account created." 
  }
}

export async function checkUsernameAvailability(username: string) {
  if (!username || username.length < 3) 
  return { 
    available: false, 
    message: "Too short" 
  };
  
  const existingUser = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  return { 
    available: !existingUser, 
    message: existingUser ? "Username taken" : "Username available" 
  };
}

export async function login(_state: FormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!user || !user.passwordHash) {
      return { message: 'Invalid username or password.' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordsMatch) {
      return { 
        message: 'Invalid username or password.' 
      };
    }

    await createSession(user.id);

  } catch (error) {
    return { 
      message: `Something went wrong... ${error}` 
    };
  }

  return { 
    message: "Success! Logged in." 
  };
}


export async function logout() {
  await deleteSession();
  redirect('/'); 
}

const resend = new Resend(process.env.RESEND_KEY);
const API_URL = process.env.NEXT_PUBLIC_APP_URL;

export type AuthState = {
  success: boolean;
  message: string;
} | undefined;

export async function requestPasswordReset(
  _prevState: AuthState,
  formData: FormData
) {
  const email = formData.get("email") as string;
  if (!email) {
    return { 
      success: false, 
      message: "Email is required" 
    };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return { 
      success: false, 
      message: "No account found with that email." 
    };
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await db.insert(passwordResetTokens).values({
    userId: user.id,
    token: token,
    expiresAt: expiresAt,
  });

  const resetLink = `${API_URL}/reset-password?token=${token}`;
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", // don't have domain
      to: email, 
      subject: "Reset your password",
      react: ResetPasswordEmail({ resetLink: resetLink, userName: user.username }),
    });
  } catch (error) {
    return { 
      success: false, 
      message: `Failed to send email. Something went wrong... ${error}` 
    };
  }
  
  return { 
    success: true, 
    message: "Reset link sent! Check your inbox." 
  };
}

export async function resetPassword(
  _prevState: AuthState,
  formData: FormData
) {

  const rawData = {
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validatedFields = ResetPasswordSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.issues[0].message,
    };
  }

  const { token, password } = validatedFields.data;
  const storedToken = await db.query.passwordResetTokens.findFirst({
    where: and(
      eq(passwordResetTokens.token, token),
      gt(passwordResetTokens.expiresAt, new Date())
    ),
  });

  if (!storedToken) {
    return { 
      success: false, 
      message: "Invalid or expired link." 
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  await db.update(users)
    .set({ passwordHash: hashedPassword })
    .where(eq(users.id, storedToken.userId));


  await db.delete(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token));

  return { 
    success: true, 
    message: "Password updated successfully!" 
  };
}