import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAccount, updateAccount, changePassword, deleteAccount } from "@/lib/api/user";

export function useAccount(access: string) {
  return useQuery({
    queryKey: ["account"],
    queryFn: () => getAccount(access),
    enabled: !!access,
  });
}

export function useUpdateAccount(access: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email?: string; phone?: string }) => updateAccount(access, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });
}

export function useChangePassword(access: string) {
  return useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      changePassword(access, data),
  });
}

export function useDeleteAccount(access: string) {
  return useMutation({
    mutationFn: () => deleteAccount(access),
  });
}
