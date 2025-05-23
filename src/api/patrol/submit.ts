import { request } from '@/api/request';
import { ISubmitRecordQueryParams, ISubmitRecordResponse } from '@/services/patrol/interface';

export const querySubmitRecords = (params: ISubmitRecordQueryParams) => {
  return request<ISubmitRecordResponse>('post', '/query_patrol_submit', params);
};
