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
          // immer: true,
        },
        targets: {
          ie: 9,
        },
        locale: {
          enable: true, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
        // fastClick: true,
        dynamicImport: {
          // webpackChunkName: true,
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
  copy: [
    {
      from: 'src/copy/status.check',
      to: "status.check",
      flatten: true
    }, {
      from: 'src/copy/loginSuccess.html',
      to: "pc/loginSuccess.html",
      flatten: true
    }, {
      from: 'src/copy/root.txt',
      to: "pc/root.txt",
      flatten: true
    }, {
      from: 'src/copy/whiteList.htm',
      to: "pc/whiteList.htm",
      flatten: true
    }
  ],
  proxy: {
    "/user": {
      "target": "http://user.52wzg.com",
      "changeOrigin": true,
      "pathRewrite": { "^/user" : "" }
    }
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
      // component: '../layouts/AdminMainLayout',
      routes: [
        { path: '/', redirect: '/pc/index/homePage' },
        {
          path: '/pc',
          name: 'home',
          icon: 'home',
          // component: './index',
          routes: [
            {
              path: '/pc/index/homePage',
              name: 'home',
              icon: 'home',
              component: './Index',
            },
            {
              path: '/pc/admin/index/homePage',
              name: 'home',
              icon: 'home',
              component: './IndexPage',
            },
          ]
        },
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
              path: '/creative/article',
              name: 'article',
              icon: 'file-text',
              component: './Article',
            },
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
            },
            {
              path: '/setting/register',
              name: 'register',
              icon: 'user',
              component: './Account/Register',
            },
            {
              path: '/setting/user',
              name: 'user',
              icon: 'user',
              component: './Account/Setting',
            },
            {
              path: '/setting/staff',
              name: 'staff',
              icon: 'user',
              component: './Staff/StaffList',
            },
            {
              path: '/setting/tabs',
              name: 'tabs',
              icon: 'user',
              component: './Tabs',
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
