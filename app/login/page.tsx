"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DefaultRedirectByRole } from "@/constants/auth"
import { useLogin } from "@/hooks/use-login"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"

const roles = [
  { label: "Admin", email: "admin@example.com" },
  { label: "Support Head Admin", email: "support.head@example.com" },
  { label: "Support Admin", email: "support.admin@example.com" },
  { label: "Client", email: "user@example.com" },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginType, setLoginType] = useState<"internal" | "client">("internal")
  const { login, isLoginLoading } = useAuth(loginType)

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    await login.mutateAsync({ email, password })
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-lg border bg-background p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-2">Sign in</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Use the quick role buttons below or enter credentials.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
            <p className="text-xs text-muted-foreground">
              Test password is <span className="font-medium">password</span>
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isLoginLoading}>
            {isLoginLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6">
          <p className="text-xs text-muted-foreground mb-2">Quick roles (auto-fill):</p>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((r) => (
              <Button
                key={r.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setLoginType(r.label === "Client" ? "client" : "internal")
                  setEmail(r.email)
                  setPassword("Dealer@1234")
                }}
                disabled={isLoginLoading}
                className="justify-center"
              >
                {r.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Password will be auto-filled as <span className="font-medium">password</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
