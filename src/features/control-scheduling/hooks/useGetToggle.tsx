import { useQuery } from "@tanstack/react-query";
import { getToggleApi } from "../api/toggleApi";

export default function useGetToggle() {
  const { data: toggle, isLoading: isGettingToggle } =
    useQuery({
      queryKey: ["toggle-list"],
      queryFn:  getToggleApi,
    });

  return {
    toggle,
    isGettingToggle,
  };
}
