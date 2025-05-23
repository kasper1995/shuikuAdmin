import { request } from '@/api/request';
import { LimitLogQueryParams, LimitLogQueryResult } from '@/interface/activity/limitLog';

export const queryActiveLimitLog = (params: LimitLogQueryParams) => {
  return request<LimitLogQueryResult>('post', '/query_active_limit_log', params);
}; 