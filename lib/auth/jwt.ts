type JwtHeader = { alg: "HS256"; typ: "JWT" }

export type JwtPayload = {
  sub: string
  role: string
  name: string
  email: string
  iat: number
  exp: number
}

function getCrypto(): Crypto {
  if (typeof globalThis.crypto !== "undefined") return globalThis.crypto as Crypto
  throw new Error("Web Crypto API not available")
}

function encodeBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
  }
  let binary = ""
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const base64 = btoa(binary)
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function stringToUint8(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

function utf8ToBase64Url(str: string): string {
  return encodeBase64Url(stringToUint8(str))
}

function base64UrlToUint8(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/")
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(base64, "base64"))
  }
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function hmacSha256(keyBytes: Uint8Array, data: string): Promise<Uint8Array> {
  const subtle = getCrypto().subtle
  const cryptoKey = await subtle.importKey(
    "raw",
    keyBytes as unknown as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await subtle.sign("HMAC", cryptoKey, stringToUint8(data) as unknown as BufferSource)
  return new Uint8Array(sig)
}

function getSecretBytes(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "dev-secret-change-me"
  return stringToUint8(secret)
}

export async function signJwt(
  payload: Omit<JwtPayload, "iat" | "exp">,
  expiresInSeconds = 15 * 60
): Promise<string> {
  const header: JwtHeader = { alg: "HS256", typ: "JWT" }
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + expiresInSeconds
  const fullPayload: JwtPayload = { ...payload, iat, exp } as JwtPayload

  const headerB64 = utf8ToBase64Url(JSON.stringify(header))
  const payloadB64 = utf8ToBase64Url(JSON.stringify(fullPayload))
  const data = `${headerB64}.${payloadB64}`
  const signature = await hmacSha256(getSecretBytes(), data)
  const signatureB64 = encodeBase64Url(signature)
  return `${data}.${signatureB64}`
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split(".")
    if (!headerB64 || !payloadB64 || !signatureB64) return null
    const data = `${headerB64}.${payloadB64}`
    const expected = await hmacSha256(getSecretBytes(), data)
    const expectedB64 = encodeBase64Url(expected)
    if (expectedB64 !== signatureB64) return null
    const payloadJsonBytes = base64UrlToUint8(payloadB64)
    const payloadJson = new TextDecoder().decode(payloadJsonBytes)
    const payload = JSON.parse(payloadJson) as JwtPayload
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && now > payload.exp) return null
    return payload
  } catch {
    return null
  }
}
