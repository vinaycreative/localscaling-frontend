"use client";

import { logout as apiLogout } from "@/api/auth";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
  const qc = useQueryClient();
  const clear = useAuthStore((s) => s.clear);
  const router = useRouter();

  return useMutation({
    mutationFn: () => apiLogout(),
    onSuccess: async () => {
      clear();
      await qc.clear();
      router.refresh();
    },
  });
}
