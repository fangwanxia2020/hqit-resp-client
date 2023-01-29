module.exports = {
  plugins: [
    [
      'import',
      {
        libraryName: 'ty-pc',
        camel2DashComponentName: false,
      }
    ]
  ],
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}
