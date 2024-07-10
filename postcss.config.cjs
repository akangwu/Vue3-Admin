const autoprefixer = require('autoprefixer');
// const px2rem = require('postcss-pxtorem');
module.exports = {
  plugins: [
    // propList：需要进行转换的css属性的值，*意思是将全部属性单位都进行转换
    // px2rem({ rootValue: 16, propList:['*'] }),
    autoprefixer({}),
  ]
};

