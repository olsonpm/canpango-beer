import getCommonConfig from './get-common'

const commonConfig = getCommonConfig({ environment: 'dev' })

const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
}

// dev and common don't have shared keys so nothing gets overwritten
Object.assign(devConfig, commonConfig)

export default devConfig
