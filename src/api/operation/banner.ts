
import { request } from '../request';

// 创建轮播图
export const createBanner = (params: Omit<any, 'ID' | 'CreateTime' | 'UpdateTime'>) => {
  return request('post', '/create_operations_banner', params);
};

// 删除轮播图
export const deleteBanner = (BannerID: number) => {
  return request('post', '/delete_operations_banner', { BannerID });
};

// 修改轮播图
export const modifyBanner = (params: any) => {
  return request('post', '/modify_operations_banner', params);
};

// 查询轮播图列表
export const queryBanner = (params: any) => {
  return request('post', '/query_operations_banner', params);
};
