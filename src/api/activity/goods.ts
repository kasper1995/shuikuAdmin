import { request } from '@/api/request';
import { IGoodsCreateParams, IGoodsModifyParams, IGoodsQueryParams, IGoodsResponse } from '@/services/patrol/interface';

export const queryGoods = (params: IGoodsQueryParams) => {
  return request<IGoodsResponse>('post','/query_goods', params);
};

export const createGoods = (params: IGoodsCreateParams) => {
  return request<IGoodsResponse>('post','/create_goods', params);
};

export const modifyGoods = (params: IGoodsModifyParams) => {
  return request<IGoodsResponse>('post','/modify_goods', params);
};

export const deleteGoods = (id: number) => {
  return request<IGoodsResponse>('post','/delete_goods', { ID: id });
}; 