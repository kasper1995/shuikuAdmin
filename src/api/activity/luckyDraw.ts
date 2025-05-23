import { request } from '@/api/request';
import { LuckyDrawQueryParams, LuckyDrawQueryResult } from '@/interface/activity/luckyDraw';

export const queryLuckyDraw = (params: LuckyDrawQueryParams) => {
  return request<LuckyDrawQueryResult>('post', '/query_lucky_draw', params);
}; 