import type { MenuList } from '@/interface/layout/menu.interface';

export const menuList: MenuList = [
  {
    code: 'dashboard',
    label: {
      zh_CN: '首页',
      en_US: 'Dashboard',
    },
    path: '/dashboard',
  },
  {
    code: 'system',
    label: {
      zh_CN: '系统管理',
      en_US: 'System',
    },
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
      {
        code: 'operation_log',
        label: {
          zh_CN: '操作日志',
          en_US: 'Operation Log',
        },
        path: '/system/operation_log',
      },
      {
        code: 'dict',
        label: {
          zh_CN: '字典管理',
          en_US: 'Dictionary',
        },
        path: '/system/dict',
      },
    ],
  },
  {
    code: 'operation',
    label: {
      zh_CN: '运营管理',
      en_US: 'Operation',
    },
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
      {
        code: 'Banner',
        label: {
          zh_CN: '轮播图',
          en_US: 'Banner Management',
        },
        path: '/operation/banner',
      },
      {
        code: 'SailViews',
        label: {
          zh_CN: '航拍全景图',
          en_US: 'SailViews Management',
        },
        path: '/operation/sailViews',
      },
      {
        code: 'user',
        label: {
          zh_CN: '用户查询',
          en_US: 'User Query',
        },
        icon: 'user',
        path: '/operation/user',
      },
      {
        code: 'QuickSnap',
        label: {
          zh_CN: '随手拍',
          en_US: 'QuickSnap Management',
        },
        path: '/operation/quickSnap',
      },
      {
        code: 'UserFeedback',
        label: {
          zh_CN: '用户反馈',
          en_US: 'UserFeedback Management',
        },
        path: '/operation/userFeedback',
      },
      {
        code: 'WechatService',
        label: {
          zh_CN: '微信客服',
          en_US: 'WeChat Customer Service',
        },
        path: '/operation/wechatService',
      },
    ],
  },
  {
    code: 'patrol',
    path: '/patrol',
    label: {
      zh_CN: '巡查管理',
      en_US: 'Patrol Management',
    },
    children: [
      {
        code: 'question',
        path: '/patrol/question',
        label: {
          zh_CN: '试题管理',
          en_US: 'Question Management',
        },
      },
      {
        code: 'video',
        label: {
          zh_CN: '视频管理',
          en_US: 'Video Management',
        },
        path: '/patrol/video',
      },
      {
        code: 'icon',
        path: '/patrol/icon',
        label: {
          zh_CN: '图标管理',
          en_US: 'Icon Management',
        },
      },
      {
        code: 'module',
        path: '/patrol/module',
        label: {
          zh_CN: '模块管理',
          en_US: 'Module Management',
        },
      },
      {
        code: 'submit',
        path: '/patrol/submit',
        label: {
          zh_CN: '答题记录',
          en_US: 'Answer Records',
        },
      },
      {
        code: 'banner',
        path: '/patrol/banner',
        label: {
          zh_CN: '轮播图管理',
          en_US: 'Banner Management',
        },
      },
    ],
  },
  {
    code: 'activity',
    path: '/activity',
    label: {
      zh_CN: '活动管理',
      en_US: 'Activity Management',
    },
    children: [
      {
        code: 'participant',
        path: '/activity/participant',
        label: {
          zh_CN: '活动参与',
          en_US: 'Activity Participation',
        },
      },
      {
        code: 'limit',
        path: '/activity/limit',
        label: {
          zh_CN: '限时活动',
          en_US: 'Limit Participation',
        },
      },
      {
        code: 'limit_log',
        label: {
          zh_CN: '限时活动信息收集查询',
          en_US: 'Limit Activity Registration Log',
        },
        path: '/activity/limit_log',
      },
      {
        code: 'goods',
        path: '/activity/goods',
        label: {
          zh_CN: '活动商城',
          en_US: 'Goods Participation',
        },
      },
      {
        code: 'activityQuestion',
        path: '/activity/question',
        label: {
          zh_CN: '活动考试试题',
          en_US: 'Activity Question Participation',
        },
      },
      {
        code: 'prize',
        path: '/activity/prize',
        label: {
          zh_CN: '奖品兑换',
          en_US: 'Prize Exchange',
        },
      },
      {
        code: 'pioneer',
        path: '/activity/pioneer',
        label: {
          zh_CN: '少先队员',
          en_US: 'Young Pioneers',
        },
      },
      {
        code: 'luckyDraw',
        path: '/activity/lucky_draw',
        label: {
          zh_CN: '抽奖活动记录',
          en_US: 'Lucky Draw Records',
        },
      },
      {
        code: 'prizeWinning',
        path: '/activity/prize_winning',
        label: {
          zh_CN: '抽奖活动中奖记录',
          en_US: 'Prize Winning Records',
        },
      },
    ],
  },
];
