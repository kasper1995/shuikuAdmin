import type { Device } from '@/interface/layout/index.interface';
import type { MenuChild } from '@/interface/layout/menu.interface';
import type { Role } from './login';

export type Locale = 'zh_CN' | 'en_US';

export interface UserState {
  username: string;

  /** menu list for init tagsView */
  menuList: MenuChild[];

  /** login status */
  logged: boolean;

  role: Role;

  /** user's device */
  device: Device;

  /** menu collapsed status */
  collapsed: boolean;

  /** notification count */
  noticeCount: number;

  /** user's language */
  locale: Locale;

  /** Is first time to view the site ? */
  newUser: boolean;
}

export interface DictState {
  dictList: Record<string, dictRecord[]>;
}
export interface dictRecord {
  ID: number;
  Item: string;
  Value: string;
  Desc: string;
}
