export type DecodedJwt = {
  sub?: string
  role?: string
  name?: string
  email?: string
  [k: string]: unknown
}

function base64UrlDecode(input: string): string | null {
  try {
    const base64 = input.replace(/-/g, "+").replace(/_/g, "/")
    if (typeof Buffer !== "undefined") {
      return Buffer.from(base64, "base64").toString("utf8")
    }
    const binary = atob(base64)
    let out = ""
    for (let i = 0; i < binary.length; i++) out += String.fromCharCode(binary.charCodeAt(i))
    return decodeURIComponent(escape(out))
  } catch {
    return null
  }
}

export function parseJwtPayload(token: string): DecodedJwt | null {
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const payloadJson = base64UrlDecode(parts[1])
    if (!payloadJson) return null
    return JSON.parse(payloadJson) as DecodedJwt
  } catch {
    return null
  }
}


