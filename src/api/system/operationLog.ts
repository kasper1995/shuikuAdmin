import { OperationLogQueryParams, OperationLogQueryResult } from '@/interface/system/operationLog';
import { request } from "@/api/request";

export const querySystemOperationLog = (params: { Status: string; Username: any; Limit: number; Offset: number }) => {
  return request<OperationLogQueryResult>('post', 'query_system_operation_log', params);
};
