import { useQuery } from "@tanstack/react-query";
import { getAuditsLogsApi } from "../api/audit-logs";

export default function useGetAuditLogs(deviceId:string) {
  const {
    data: auditLogs,
    isLoading: isGettingAuditLogs,
  } = useQuery({
    queryKey: ["audit-logs"],
    queryFn:()=>getAuditsLogsApi(deviceId),
  });

  return {
    auditLogs,isGettingAuditLogs
  };
}