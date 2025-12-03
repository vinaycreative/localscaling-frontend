"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DefaultRedirectByRole } from "@/constants/auth";
import { useLogin } from "@/hooks/use-login";
import { devLogin } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const roles = [
  { label: "Admin", email: "admin@example.com" },
  { label: "Support Head Admin", email: "support.head@example.com" },
  { label: "Support Admin", email: "support.admin@example.com" },
  { label: "Client", email: "user@example.com" },
];

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const devLoginMutation = useMutation({
    mutationFn: devLogin,
    onSuccess: (user) => {
      const target = DefaultRedirectByRole[user.role] ?? "/";
      toast.success(`Welcome ${user.name}`);
      router.replace(target);
    },
    onError: () => {
      toast.error("Dev Login failed");
    },
  });

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const user = await login.mutateAsync({ email, password });
      const target = DefaultRedirectByRole[user.role] ?? "/";
      toast.success(`Welcome ${user.name}`);
      router.replace(target);
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      toast.error("Login failed");
    }
  };

  const onDevLogin = async () => {
    devLoginMutation.mutate();
  };

  const quickFill = async (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("password");
  };

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
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? "Signing in..." : "Sign in"}
          </Button>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={onDevLogin}
            disabled={devLoginMutation.isPending}
          >
            {devLoginMutation.isPending ? "Signing in..." : "Dev Login"}
          </Button>
        </form>

        <div className="mt-6">
          <p className="text-xs text-muted-foreground mb-2">
            Quick roles (auto-fill):
          </p>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((r) => (
              <Button
                key={r.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickFill(r.email)}
                disabled={login.isPending}
                className="justify-center"
              >
                {r.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Password will be auto-filled as{" "}
            <span className="font-medium">password</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
