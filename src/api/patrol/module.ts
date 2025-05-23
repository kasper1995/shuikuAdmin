import { IModule, IModuleQueryParams } from '@/services/patrol/interface';
import { request } from '../request';

// 创建模块
export const createModule = (params: Omit<IModule, 'ID' | 'CreateTime' | 'UpdateTime'>) => {
  return request('post', '/create_patrol_module', params);
};

// 删除模块
export const deleteModule = (ID: number) => {
  return request('post', '/delete_patrol_module', { ID });
};

// 修改模块
export const modifyModule = (params: IModule) => {
  return request('post', '/modify_patrol_module', params);
};

// 查询模块列表
export const queryModules = (params: IModuleQueryParams) => {
  return request('post', '/query_patrol_module', params);
}; 