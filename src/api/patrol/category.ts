import { PatrolCategory } from '@/interface/patrol/category';
import { request } from '../request';

// 查询分类列表
export const queryPatrolCategory = () => {
  return request('post', '/query_patrol_cate');
};

// 创建分类
export const createPatrolCategory = (data: { NAME: string }) => {
  return request('post', '/create_patrol_cate', data);
};

// 修改分类
export const modifyPatrolCategory = (data: PatrolCategory) => {
  return request('post', '/modify_patrol_cate', data);
};

// 删除分类
export const deletePatrolCategory = (ID: number) => {
  return request('post', '/delete_patrol_cate', { ID });
}; 