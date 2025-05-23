import { QuickSnapDeleteParams, QuickSnapModifyParams, QuickSnapQueryParams, QuickSnapQueryResult } from '@/interface/operation/quickSnap';
import { request } from '../request';

// 查询随手拍列表
export const queryQuickSnap = (params: QuickSnapQueryParams) => {
  return request<QuickSnapQueryResult>('post', '/query_operations_quick_snap', params);
};

// 修改随手拍状态
export const modifyQuickSnap = (params: QuickSnapModifyParams) => {
  return request('post', '/modify_operations_quick_snap', params);
};

// 删除随手拍
export const deleteQuickSnap = (params: QuickSnapDeleteParams) => {
  return request('post', '/delete_operations_quick_snap', params);
}; 