import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import vitePluginImp from 'vite-plugin-imp';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/shuiku_admin_web',
  resolve: {
    alias: {
      '@': path.join(__dirname, './src'),
    },
  },
  server: {
    port: 8889,
    proxy: {
      '/water_source_area': {
        // target: 'https://sk.szsybh.cn/water_source_area',
        target: 'https://sybserver.cn/water_source_area',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/water_source_area/, ''),
      },
    },
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    vitePluginImp({
      libList: [
        // {
        //   libName: 'antd',
        //   style: name => `antd/es/${name}/style/index.css`,
        // },
        {
          libName: 'lodash',
          libDirectory: '',
          camel2DashComponentName: false,
          style: () => {
            return false;
          },
        },
        {
          libName: 'antd',
          style: (name) => name !== 'theme' && `antd/es/${name}/style`,
        },
      ],
    }),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
  ],
  build: {
    rollupOptions: {
      external: [
        'antd/es/config-provider/style/css.js',
        'antd/es/config-provider/style/index.css',
      ]
    }
  }
});
