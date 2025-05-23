import { OperationUserQueryParams, OperationUserQueryResult } from '@/interface/operation/user';
import { request } from '@/api/request';

export const queryOperationUser = (params: OperationUserQueryParams) => {
  return request<OperationUserQueryResult>('post', '/query_operation_user', params);
};
