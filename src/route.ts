import type { MenuList } from '@/interface/layout/menu.interface';

export const menuList: MenuList = [
  {
    code: 'dashboard',
    label: {
      zh_CN: '首页',
      en_US: 'Dashboard',
    },
    icon: 'dashboard',
    path: '/dashboard',
  },
  {
    code: 'system',
    label: {
      zh_CN: '系统管理',
      en_US: 'System',
    },
    icon: 'config',
    path: '/system',
    children: [
      {
        code: 'group',
        label: {
          zh_CN: '分组管理',
          en_US: 'Group Management',
        },
        path: '/system/group',
      },
      {
        code: 'user',
        label: {
          zh_CN: '用户管理',
          en_US: 'User Management',
        },
        path: '/system/user',
      },
      {
        code: 'api',
        label: {
          zh_CN: 'API管理',
          en_US: 'API Management',
        },
        path: '/system/api',
      },
    ],
  },
  {
    code: 'operation',
    label: {
      zh_CN: '运营管理',
      en_US: 'Operation',
    },
    icon: 'appstore',
    path: '/operation',
    children: [
      {
        code: 'reservoir',
        label: {
          zh_CN: '水库管理',
          en_US: 'Reservoir Management',
        },
        path: '/operation/reservoir',
      },
      {
        code: 'article',
        label: {
          zh_CN: '文章管理',
          en_US: 'Article Management',
        },
        path: '/operation/article',
      },
    ],
  },
];
