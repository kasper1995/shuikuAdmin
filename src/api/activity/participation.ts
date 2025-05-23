import { request } from '@/api/request';
import { IActivity, IActivityQueryParams, IActivityResponse } from '@/services/patrol/interface';

export const queryActivities = (params: IActivityQueryParams) => {
  return request<IActivityResponse>('post', '/query_active_list', {});
};

export const createActivity = (params: Omit<IActivity, 'ID'>) => {
  return request<{ Code: number; Message: string }>('post', '/create_active_list', params);
};

export const modifyActivity = (params: IActivity) => {
  return request<{ Code: number; Message: string }>('post', '/modify_active_list', params);
};

export const deleteActivity = (id: number) => {
  return request<{ Code: number; Message: string }>('post', '/delete_active_list', { ID: id });
};
