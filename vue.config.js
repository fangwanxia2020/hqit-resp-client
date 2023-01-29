'use strict'
const path = require('path')
const { name, version } = require('./package.json')
//时间戳
const timestamp = new Date().getTime()

/**
 * vue-cli 项目配置
 * @module config
 * @type {import("@vue/cli-service").ProjectOptions}
 */
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  productionSourceMap: false,
  devServer: {
    port: 8888, // 和主应用监听的端口一致
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      "/apigateway": {
        target: " http://124.227.1.175:9998",
      },
      "/preview/onlinePreview":{
        target: " http://124.227.1.175:8012/onlinePreview",
      }
    },
  },
  chainWebpack(config) {
    config.output
      .library(`${name}-[name]`)
      .libraryTarget('umd')
      .jsonpFunction(`webpackJsonp_${name}`)
      // 输出重构打包编译后的文件名称 [模块名称.版本号.时间戳]
      .filename(`js/[name].${version}.${timestamp}.js`)
      .chunkFilename(`js/[name].${version}.${timestamp}.js`)

    config.plugins
      .delete('preload')  // TODO: need test
      .delete('prefetch')  // TODO: need test

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    // 修改 html-webpack-plugin 中的 options 参数，用于 index.html
    config.plugin('html')
      .tap(args => {
        const [options] = args
        options.title = '企业负责人履职平台(微前端)'
        return args
      })

    config.when(
      process.env.NODE_ENV === 'development',
      config => config.devtool('cheap-source-map'),
      config => {
        config
          .plugin('ScriptExtHtmlWebpackPlugin')
          .after('html')
          .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }])
          .end()

        config.optimization.splitChunks({
          chunks: 'all',
          cacheGroups: {
            libs: {
              name: 'chunk-libs', // 打包后的文件名
              test: /[\\/]node_modules[\\/]/, // 匹配对应文件
              priority: 10, // 优先级配置，优先匹配优先级更高的规则，不设置的规则优先级默认为0
              chunks: 'initial', // 打包规则
            },
            elementUI: {
              name: 'chunk-elementUI',
              priority: 31,
              test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
            },
            tyPc: {
              name: 'chunk-tyPc',
              priority: 25,
              test: /[\\/]node_modules[\\/]_?ty-pc(.*)/,
            },
            commons: {
              name: 'chunk-commons',
              test: path.resolve(__dirname, 'src/components'), // can customize your rules
              minChunks: 3, //  minimum common number
              priority: 5,
              reuseExistingChunk: true
            }
          }
        })
      }
    )
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/styles/variable.scss";'
      }
    }
  }
}
