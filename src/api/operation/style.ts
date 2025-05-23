import { request } from '@/api/request';
import { StyleQueryResult } from '@/interface/operation/style';

export const queryStyle = () => {
  return request<StyleQueryResult>('post', '/query_style', {});
}; 