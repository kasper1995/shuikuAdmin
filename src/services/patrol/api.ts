import { request } from '@/api/request';
import { ISailView, ISailViewQueryParams, ISailViewResponse } from './interface';

// 查询航拍全景图列表
export async function querySailViews(params: ISailViewQueryParams) {
  return request<ISailViewResponse>('/api/patrol/query_operations_sail_view', {
    method: 'POST',
    data: params,
  });
}

// 新增航拍全景图
export async function addSailView(data: Omit<ISailView, 'ID' | 'CreateTime' | 'UpdateTime'>) {
  return request<{ ID: number }>('/api/patrol/add_operations_sail_view', {
    method: 'POST',
    data,
  });
}

// 更新航拍全景图
export async function updateSailView(data: Partial<ISailView> & { ID: number }) {
  return request('/api/patrol/update_operations_sail_view', {
    method: 'POST',
    data,
  });
}

// 删除航拍全景图
export async function deleteSailView(id: number) {
  return request('/api/patrol/delete_operations_sail_view', {
    method: 'POST',
    data: { ID: id },
  });
}
