import { ArticleModifyParams, ArticleQueryParams } from '@/interface/operation/article';
import { request } from '../request';


// 创建文章
export const createArticle = (params: Omit<ArticleModifyParams, 'ArticleID'>) => {
  return request('post', '/create_operations_article', params);
};

// 删除文章
export const deleteArticle = (ArticleID: number) => {
  return request('post','/delete_operations_article',{ ArticleID });
};

// 修改文章
export const modifyArticle = (params: ArticleModifyParams) => {
  return request('post', '/modify_operations_article', params);
};

// 查询文章列表
export const queryArticle = (params: ArticleQueryParams) => {
  return request('post', '/query_operations_article', params);
};
