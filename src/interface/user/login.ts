/** user's role */
export type Role = 'guest' | 'admin';

export interface LoginParams {
  /** 用户名 */
  Username: string;
  /** 用户密码 */
  Password: string;
  /** 验证码 */
  Captcha: string;
  /** 验证码ID */
  CaptchaID: string;
}

export interface LoginResult {
  /** auth token */
  ID: string;
  Nick: string;
  Token: string;
  Status: string;
}

export interface LogoutParams {
  token: string;
}

export interface LogoutResult {}
