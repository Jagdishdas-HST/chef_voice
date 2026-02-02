import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertCookRecord } from "@shared/schema";

export function useCookRecords() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["api", "cook-records"],
    queryFn: async () => {
      console.log("[useCookRecords] fetching records");
      const res = await apiRequest("/api/cook-records");
      return res.json();
    },
    meta: {
      onError: (error: unknown) => {
        console.log("[useCookRecords] error", error);
        toast({
          title: "Failed to load cook records",
          description: String(error),
          variant: "destructive",
        });
      },
    },
  });
}

export function useCreateCookRecord() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["api", "cook-records", "create"],
    mutationFn: async (payload: InsertCookRecord) => {
      console.log("[useCreateCookRecord] payload", payload);
      const response = await apiRequest("/api/cook-records", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Cook record added successfully." });
      queryClient.invalidateQueries({ queryKey: ["api", "cook-records"] });
    },
    meta: {
      onError: (error: unknown) => {
        console.log("[useCreateCookRecord] error", error);
        toast({
          title: "Failed to create cook record",
          description: String(error),
          variant: "destructive",
        });
      },
    },
  });
}