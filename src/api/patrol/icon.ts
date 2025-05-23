import { IIcon, IIconQueryParams } from '@/services/patrol/interface';
import { request } from '../request';

// 创建图标
export const createIcon = (params: Omit<IIcon, 'ID' | 'CreateTime' | 'UpdateTime'>) => {
  return request('post', '/create_patrol_icon', params);
};

// 删除图标
export const deleteIcon = (ID: number) => {
  return request('post', '/delete_patrol_icon', { ID });
};

// 修改图标
export const modifyIcon = (params: IIcon) => {
  return request('post', '/modify_patrol_icon', params);
};

// 查询图标列表
export const queryIcons = (params: IIconQueryParams) => {
  return request('post', '/query_patrol_icon', params);
}; 