import { PatrolVideo } from '@/interface/patrol/video';
import { request } from '../request';

// 查询视频列表
export const queryPatrolVideo = () => {
  return request('post', '/query_patrol_video');
};

// 创建视频
export const createPatrolVideo = (data: Omit<PatrolVideo, 'ID'>) => {
  return request('post', '/create_patrol_video', data);
};

// 修改视频
export const modifyPatrolVideo = (data: PatrolVideo) => {
  return request('post', '/modify_patrol_video', data);
};

// 删除视频
export const deletePatrolVideo = (ID: number) => {
  return request('post', '/delete_patrol_video', { ID });
}; 