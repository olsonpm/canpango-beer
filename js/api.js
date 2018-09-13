//---------//
// Imports //
//---------//

import axios from 'axios'

import { getValueAt } from './utils'

//
//------//
// Init //
//------//

const returnData = getValueAt('data'),
  instance = axios.create({
    baseURL: 'http://apichallenge.canpango.com',
  })

//
//------//
// Main //
//------//

//
// as far as I know there's no way to configure axios to just return the data
//   itself.  This is the reason for the api wrapper
//
const api = {
  delete: path => instance.delete(path).then(returnData),
  get: path => instance.get(path).then(returnData),
  post: (path, data) => instance.post(path, data).then(returnData),
  put: (path, data) => instance.put(path, data).then(returnData),
}

//
//---------//
// Exports //
//---------//

export default api
