import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertHotHoldingRecord } from "@shared/schema";

export function useHotHoldingRecords() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["api", "hot-holding"],
    queryFn: async () => {
      console.log("[useHotHoldingRecords] fetching records");
      const res = await apiRequest("/api/hot-holding");
      return res.json();
    },
    meta: {
      onError: (error: unknown) => {
        console.log("[useHotHoldingRecords] error", error);
        toast({
          title: "Failed to load hot holding records",
          description: String(error),
          variant: "destructive",
        });
      },
    },
  });
}

export function useCreateHotHoldingRecord() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["api", "hot-holding", "create"],
    mutationFn: async (payload: InsertHotHoldingRecord) => {
      console.log("[useCreateHotHoldingRecord] payload", payload);
      const response = await apiRequest("/api/hot-holding", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Hot holding record added successfully." });
      queryClient.invalidateQueries({ queryKey: ["api", "hot-holding"] });
    },
    meta: {
      onError: (error: unknown) => {
        console.log("[useCreateHotHoldingRecord] error", error);
        toast({
          title: "Failed to create hot holding record",
          description: String(error),
          variant: "destructive",
        });
      },
    },
  });
}