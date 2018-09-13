import getCommonConfig from './get-common'
import TerserPlugin from 'terser-webpack-plugin'

const commonConfig = getCommonConfig({ environment: 'prod' })

const prodConfig = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
}

// prod and common don't have shared keys so nothing gets overwritten
Object.assign(prodConfig, commonConfig)

export default prodConfig
