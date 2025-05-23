import { request } from '@/api/request';
import { CreatePatrolBannerParams, PatrolBannerQueryResult } from '@/interface/patrol/banner';

export const queryPatrolBanner = () => {
  return request<PatrolBannerQueryResult>('post', '/query_patrol_banner', {});
};

export const createPatrolBanner = (params: CreatePatrolBannerParams) => {
  return request<PatrolBannerQueryResult>('post', '/create_patrol_banner', params);
};

export const modifyPatrolBanner = (params: CreatePatrolBannerParams & { ID: number }) => {
  return request<PatrolBannerQueryResult>('post', '/modify_patrol_banner', params);
};

export const deletePatrolBanner = (id: number) => {
  return request<PatrolBannerQueryResult>('post', '/delete_patrol_banner', { ID: id });
}; 