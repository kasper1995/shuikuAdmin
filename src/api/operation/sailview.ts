import { ISailView, ISailViewQueryParams } from '@/services/operation/interface';
import { request } from '../request';

// 创建航拍全景图
export const createSailView = (params: Omit<ISailView, 'ID' | 'CreateTime' | 'UpdateTime'>) => {
  console.log(params);
  return request('post', '/create_operations_sail_view', params);
};

// 删除航拍全景图
export const deleteSailView = (ID: number) => {
  return request('post', '/delete_operations_sail_view', { ID });
};

// 修改航拍全景图
export const modifySailView = (params: ISailView) => {
  return request('post', '/modify_operations_sail_view', params);
};

// 查询航拍全景图列表
export const querySailViews = (params: ISailViewQueryParams) => {
  return request('post', '/query_operations_sail_view', params);
};
