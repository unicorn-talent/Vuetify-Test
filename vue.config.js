module.exports = {
  devServer: {
    // This will forward any request that does not match a static file to localhost:3000
    proxy: 'https://ftx.com'
  },
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vuetify-blog/'
    : '/',

}
      
      