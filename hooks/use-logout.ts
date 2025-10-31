"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout as apiLogout } from '@/lib/auth/api';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

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


