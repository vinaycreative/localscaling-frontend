"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout as apiLogout } from '@/lib/auth/api';
import { useAuthStore } from '@/store/auth';

export function useLogout() {
  const qc = useQueryClient();
  const clear = useAuthStore((s) => s.clear);

  return useMutation({
    mutationFn: () => apiLogout(),
    onSuccess: async () => {
      clear();
      await qc.clear();
    },
  });
}


