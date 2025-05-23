import { request } from '@/api/request';
import { LimitActivity } from '@/interface/activity/limitLog';

interface LimitActivityOption {
  option_name: string;
  is_mobile: string;
  is_require: string;
}

interface QueryLimitActivityParams {
  Page: number;
  PageSize: number;
  Title?: string;
}

interface QueryLimitActivityResult {
  Code: number;
  Data: LimitActivity[];
  Message?: string;
}

interface CreateLimitActivityParams {
  Title: string;
  Subtitle: string;
  Img: string;
  PassType: number;
  Pass: string;
  Content: string;
  Options: string;
  Hint: string;
  Prefix: string;
  People: number;
  EndTime: string;
  Type: number;
}

export const queryLimitActivities = (params: QueryLimitActivityParams) => {
  return request<QueryLimitActivityResult>('post', '/query_active_limit', params);
};

export const createLimitActivity = (params: CreateLimitActivityParams) => {
  return request<LimitActivity>('post', '/create_active_limit', params);
};

export const modifyLimitActivity = (params: Partial<LimitActivity>) => {
  return request<LimitActivity>('post', '/modify_active_limit', params);
};

export const deleteLimitActivity = (id: number) => {
  return request<LimitActivity>('post', '/delete_active_limit', { ID: id });
};
