import { clsx, type ClassValue } from "clsx"
import { jwtVerify } from "jose"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function logError(error: unknown) {
  if (error instanceof Error) {
    console.log("error.stack is ", error.stack)
    console.log("error.message is ", error.message)
  }
}

export async function verifyJwt(token: string) {
  try {
    const secret = process.env.SUPABASE_JWT_SECRET

    if (!secret) {
      console.error("JWT Secret is missing in environment variables")
      return null
    }

    const key = new TextEncoder().encode(secret)

    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    })

    return payload
  } catch (error) {
    logError(error)
    return null
  }
}

export const normalizedUrl = (url: string) => {
  const value = url.trim().toLowerCase()

  // Allow clearing input
  if (!value) {
    return ""
  }

  // If user is manually deleting "https://" → DO NOT auto-correct yet
  if ("https://".startsWith(value.toLowerCase())) {
    return value
  }

  const protocolPattern = /^https?:\/\//i
  const isExactProtocolOnly = value.match(protocolPattern)?.[0] === value
  const startsWithProtocol = protocolPattern.test(value)

  const normalizedUrl = startsWithProtocol && !isExactProtocolOnly ? value : `https://${value}`

  return normalizedUrl
}
