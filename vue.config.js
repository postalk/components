module.exports = {
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        data: `
        @import "@/scss/_variables.scss";
      `
      }
    }
  },
  pluginOptions: {
    storybook: {
      allowedPlugins: ['define']
    }
  }
}
