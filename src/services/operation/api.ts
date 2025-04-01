import { request } from '@/api/request';
import { IResponse, ISailView, ISailViewQueryParams, ISailViewResponse } from './interface';

// 查询航拍全景图列表
export async function querySailViews(params: ISailViewQueryParams) {
  return request<IResponse<ISailViewResponse>>('/api/operation/query_sail_view', {
    method: 'POST',
    data: params,
  });
}

// 新增航拍全景图
export async function addSailView(data: Omit<ISailView, 'ID' | 'CreateTime' | 'UpdateTime'>) {
  return request<IResponse<{ ID: number }>>('/api/operation/add_sail_view', {
    method: 'POST',
    data,
  });
}

// 更新航拍全景图
export async function updateSailView(data: Partial<ISailView> & { ID: number }) {
  return request<IResponse>('/api/operation/update_sail_view', {
    method: 'POST',
    data,
  });
}

// 删除航拍全景图
export async function deleteSailView(id: number) {
  return request<IResponse>('/api/operation/delete_sail_view', {
    method: 'POST',
    data: { ID: id },
  });
} 