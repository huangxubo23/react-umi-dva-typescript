// ref: https://umijs.org/config/
import { primaryColor } from '../src/defaultSettings';

export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        targets: {
          ie: 11,
        },
        locale: {
          enable: true, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
        },
      },
    ],
    [
      'umi-plugin-pro-block',
      {
        moveMock: false,
        moveService: false,
        modifyRequest: true,
        autoAddMenu: true,
      },
    ],
  ],
  targets: {
    ie: 11,
  },

  /**
   * 路由相关配置
   */
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [{ path: '/user', component: './Welcome' }],
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      routes: [
        { path: '/', redirect: '/welcome' },
        // dashboard
        {
          path: '/welcome',
          name: 'welcome',
          icon: 'smile',
          component: './Welcome',
        },
        {
          path: '/creative',
          name: 'creativeManagement',
          icon: 'form',
          // component: './Welcome',
          routes: [
            {
              path: '/creative/new',
              name: 'new',
              icon: 'plus',
              component: './Product',
            },
            {
              path: '/creative/list',
              name: 'list',
              icon: 'file-text',
              component: './Welcome',
            },
            {
              path: '/creative/video',
              name: 'video',
              icon: 'video-camera',
              component: './VideoEditor',
            }
          ]
        },
        {
          path: '/analysis',
          name: 'analysis',
          icon: 'line-chart',
          // component: './Welcome',
          routes: [
            {
              path: '/analysis/content',
              name: 'content',
              icon: 'file-unknown',
              component: './Welcome',
            }
          ]
        },
        {
          path: '/setting',
          name: 'setting',
          icon: 'setting',
          // component: './Welcome',
          routes: [
            {
              path: '/setting/profile',
              name: 'profile',
              icon: 'user',
              component: './Welcome',
            }
          ]
        },
        {
          path: 'https://github.com/huangxubo23/react-umi-dva-typescript/blob/master/README.md',
          name: 'help',
          icon: 'book',
        },
      ],
    },
  ],
  disableRedirectHoist: true,

  /**
   * webpack 相关配置
   */
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
};
