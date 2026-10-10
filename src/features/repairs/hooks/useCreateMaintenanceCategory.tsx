import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMaintenanceCategoryApi } from "../api/repairsApi";

export function useCreateMaintenanceCategory() {
  const queryClient = useQueryClient();
  const { isPending: isCreatingMaintenanceCategory, mutateAsync: createMaintenanceCategory } =
    useMutation({
      mutationFn: createMaintenanceCategoryApi,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["maintenance-categories"],
        });
      },
    });

  return { createMaintenanceCategory, isCreatingMaintenanceCategory };
}
