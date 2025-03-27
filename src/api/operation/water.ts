import { WaterLabModifyParams, WaterLabQueryParams } from '@/interface/operation/water';
import { request } from '../request';

// 创建水库
export const createWaterLab = (params: WaterLabModifyParams) => {
  return request('post', '/create_operations_water_lab', params);
};

// 删除水库
export const deleteWaterLab = (WaterLabID: number) => {
  return request('post', '/delete_operations_water_lab', { WaterLabID });
};

// 修改水库
export const modifyWaterLab = (params: WaterLabModifyParams) => {
  return request('post', '/modify_operations_water_lab', params);
};

// 查询水库列表
export const queryWaterLab = (params: WaterLabQueryParams) => {
  return request('post', '/query_operations_water_lab', params);
};
