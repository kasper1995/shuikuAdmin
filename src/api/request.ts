import type { AxiosRequestConfig, Method } from 'axios';

import { message as $message } from 'antd';
import axios from 'axios';

import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
const location = window.location
// export const baseURL = import.meta.env.MODE !== 'development' ? '/water_source_area/' : 'http://14.103.136.48:8080/water_source_area/'
// export const FileURL = import.meta.env.MODE !== 'development' ? '/group1/upload' : 'http://14.103.136.48:8080/group1/upload';

export const baseURL = import.meta.env.MODE !== 'development' ? `https://${location.host}/water_source_area/` : 'https://sybserver.cn/water_source_area/'
// export const FileURL = import.meta.env.MODE !== 'development' ? `https://${location.host}/group1/upload` : 'https://sybserver.cn/group1/upload';
export const FileURL = 'https://sybserver.cn/group1/upload';


const axiosInstance = axios.create({
  timeout: 6000,
  baseURL,
});

axiosInstance.interceptors.request.use(
  config => {
    store.dispatch(
      setGlobalState({
        loading: true,
      }),
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.headers['Bearer'] = localStorage.getItem('t');
    if(config.url === FileURL){
      delete config.headers['Bearer'];
    }
    return config;
  },
  error => {
    store.dispatch(
      setGlobalState({
        loading: false,
      }),
    );
    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  config => {
    store.dispatch(
      setGlobalState({
        loading: false,
      }),
    );

    if (config?.data?.message) {
      // $message.success(config.data.message)
    }
    if(config?.data.Token){
      localStorage.setItem('t', config?.data.Token || '');
    }
    return config?.data;
  },
  error => {
    store.dispatch(
      setGlobalState({
        loading: false,
      }),
    );
    // if needs to navigate to login page when request exception
    // history.replace('/login');
    let errorMessage = '系统异常';
    if (error?.response?.data?.Message === 'token鉴权失败') {
      location.href = '/shuiku_admin_web/login';
    } else {
      errorMessage = error?.message;
    }

    console.dir(error);
    error.message && $message.error(error?.response?.data?.Message || errorMessage);

    return {
      status: false,
      message: errorMessage,
      result: null,
    };
  },
);

export type Response<T = any> = {
  status: boolean;
  message: string;
  result: T;
};

export type MyResponse<T = any> = Promise<T>;

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = <T = any>(
  method: Lowercase<Method>,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): MyResponse<T> => {
  // const prefix = '/api'
  const prefix = '';

  url = prefix + url;

  if (method === 'post') {
    return axiosInstance.post(url, data, config);
  } else {
    return axiosInstance.get(url, {
      params: data,
      ...config,
    });
  }
};
