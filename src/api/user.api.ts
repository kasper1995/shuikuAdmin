import type { LoginParams, LoginResult, LogoutParams, LogoutResult } from '../interface/user/login';

import { request } from './request';
import { axiosResultData } from "@/interface";

/** 登录接口 */
export const apiLogin = (data: LoginParams) => request<axiosResultData<LoginResult>>('post', '/system_user_login', data);

/** 获取验证码 */
export const getCaptcha = () => request<axiosResultData<any>>('post', '/create_captcha', {});
