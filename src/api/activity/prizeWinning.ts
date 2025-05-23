import { request } from '@/api/request';
import { PrizeWinningModifyParams, PrizeWinningQueryParams, PrizeWinningQueryResult } from '@/interface/activity/prizeWinning';

export const queryPrizeWinning = (params: PrizeWinningQueryParams) => {
  return request<PrizeWinningQueryResult>('post', '/query_prize_winning', params);
};

export const modifyPrizeWinning = (params: PrizeWinningModifyParams) => {
  return request<PrizeWinningQueryResult>('post', '/modify_prize_winning', params);
}; 