import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertDelivery } from "@shared/schema";

export function useDeliveries() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["api", "deliveries"],
    queryFn: async () => {
      console.log("[useDeliveries] fetching deliveries");
      const res = await apiRequest("/api/deliveries");
      return res.json();
    },
    meta: {
      onError: (error: unknown) => {
        console.log("[useDeliveries] error", error);
        toast({
          title: "Failed to load deliveries",
          description: String(error),
          variant: "destructive",
        });
      },
    },
  });
}

export function useCreateDelivery() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["api", "deliveries", "create"],
    mutationFn: async (payload: InsertDelivery) => {
      console.log("[useCreateDelivery] payload", payload);
      const response = await apiRequest("/api/deliveries", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Delivery logged successfully." });
      queryClient.invalidateQueries({ queryKey: ["api", "deliveries"] });
    },
    meta: {
      onError: (error: unknown) => {
        console.log("[useCreateDelivery] error", error);
        toast({
          title: "Failed to create delivery",
          description: String(error),
          variant: "destructive",
        });
      },
    },
  });
}