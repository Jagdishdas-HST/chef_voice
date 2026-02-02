import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertRefrigerationUnit, InsertTemperatureLog } from "@shared/schema";

export function useRefrigerationUnits() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["api", "refrigeration", "units"],
    queryFn: async () => {
      console.log("[useRefrigerationUnits] fetching units");
      const res = await apiRequest("/api/refrigeration/units");
      return res.json();
    },
    meta: {
      onError: (error: unknown) => {
        console.log("[useRefrigerationUnits] error", error);
        toast({
          title: "Failed to load units",
          description: String(error),
          variant: "destructive",
        });
      },
    },
  });
}

export function useCreateRefrigerationUnit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["api", "refrigeration", "units", "create"],
    mutationFn: async (payload: InsertRefrigerationUnit) => {
      console.log("[useCreateRefrigerationUnit] payload", payload);
      const response = await apiRequest("/api/refrigeration/units", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Unit added successfully." });
      queryClient.invalidateQueries({ queryKey: ["api", "refrigeration", "units"] });
    },
    meta: {
      onError: (error: unknown) => {
        console.log("[useCreateRefrigerationUnit] error", error);
        toast({
          title: "Failed to create unit",
          description: String(error),
          variant: "destructive",
        });
      },
    },
  });
}

export function useDeleteRefrigerationUnit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["api", "refrigeration", "units", "delete"],
    mutationFn: async (id: string) => {
      console.log("[useDeleteRefrigerationUnit] id", id);
      const response = await apiRequest(`/api/refrigeration/units/${id}`, {
        method: "DELETE",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Unit removed successfully." });
      queryClient.invalidateQueries({ queryKey: ["api", "refrigeration", "units"] });
    },
    meta: {
      onError: (error: unknown) => {
        console.log("[useDeleteRefrigerationUnit] error", error);
        toast({
          title: "Failed to delete unit",
          description: String(error),
          variant: "destructive",
        });
      },
    },
  });
}

export function useTemperatureLogs() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["api", "refrigeration", "logs"],
    queryFn: async () => {
      console.log("[useTemperatureLogs] fetching logs");
      const res = await apiRequest("/api/refrigeration/logs");
      return res.json();
    },
    meta: {
      onError: (error: unknown) => {
        console.log("[useTemperatureLogs] error", error);
        toast({
          title: "Failed to load logs",
          description: String(error),
          variant: "destructive",
        });
      },
    },
  });
}

export function useCreateTemperatureLog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["api", "refrigeration", "logs", "create"],
    mutationFn: async (payload: InsertTemperatureLog) => {
      console.log("[useCreateTemperatureLog] payload", payload);
      const response = await apiRequest("/api/refrigeration/logs", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Temperature logged successfully." });
      queryClient.invalidateQueries({ queryKey: ["api", "refrigeration", "logs"] });
    },
    meta: {
      onError: (error: unknown) => {
        console.log("[useCreateTemperatureLog] error", error);
        toast({
          title: "Failed to log temperature",
          description: String(error),
          variant: "destructive",
        });
      },
    },
  });
}