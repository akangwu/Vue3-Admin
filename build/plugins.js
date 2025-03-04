const { resolve } = require("path");
const { visualizer } = require("rollup-plugin-visualizer");
const { createHtmlPlugin } = require("vite-plugin-html");
const { createSvgIconsPlugin } = require("vite-plugin-svg-icons");
const vue = require("@vitejs/plugin-vue");
const vueJsx = require("@vitejs/plugin-vue-jsx");
const viteCompression = require("vite-plugin-compression");
const vueSetupExtend = require("unplugin-vue-setup-extend-plus/vite").default; // 修改这里，确保导入的是函数

/**
 * 创建 vite 插件
 * @param viteEnv
 */
const createVitePlugins = (viteEnv) => {
  return [
    vue(),
    // vue 可以使用 jsx/tsx 语法
    vueJsx(),
    // name 可以写在 script 标签上
    vueSetupExtend(),
    // 创建打包压缩配置
    createCompression(viteEnv),
    // 注入变量到 html 文件
    createHtmlPlugin({
      inject: {
        data: { title: viteEnv.VITE_GLOB_APP_TITLE }
      }
    }),
    // 使用 svg 图标
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]"
    }),
    // 是否生成包预览，分析依赖包大小做优化处理
    viteEnv.VITE_REPORT && (visualizer({ filename: "stats.html", gzipSize: true, brotliSize: true }) /* as PluginOption */)
  ];
};

/**
 * 根据 compress 配置，生成不同的压缩规则
 * @param viteEnv
 */
const createCompression = (viteEnv) => {
  const { VITE_BUILD_COMPRESS = "none", VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv;
  const compressList = VITE_BUILD_COMPRESS.split(",");
  const plugins = [];

  if (compressList.includes("gzip")) {
    plugins.push(
      viteCompression({
        ext: ".gz",
        algorithm: "gzip",
        deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      })
    );
  }
  if (compressList.includes("brotli")) {
    plugins.push(
      viteCompression({
        ext: ".br",
        algorithm: "brotliCompress",
        deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      })
    );
  }

  return plugins;
};

export { createVitePlugins, createCompression };
