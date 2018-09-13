//---------//
// Imports //
//---------//

import { Container } from 'unstated'

import api from '../api'
import eventManager from '../event-manager'

import { bindAllFunctions } from '../utils'
import { getIdFromUrl } from './helpers'

//
//------//
// Main //
//------//

class Categories extends Container {
  state = { categories: {} }

  addCategory(name) {
    return api.post('/categories/', { name }).then(serverCategoryData => {
      const updatedLocalCategories = Object.assign({}, this.state.categories),
        id = getIdFromUrl(serverCategoryData)

      updatedLocalCategories[id] = Object.assign({ id }, serverCategoryData)
      this.setState({ categories: updatedLocalCategories })
    })
  }

  deleteCategory(id) {
    const updatedLocalCategories = Object.assign({}, this.state.categories)
    delete updatedLocalCategories[id]

    return Promise.all([
      this.setState({ categories: updatedLocalCategories }),
      api.delete(`/category/${id}/`),
    ])
  }
}

const instance = new Categories()
bindAllFunctions(instance)
eventManager.subscribeTo('addCategory', instance.addCategory)
eventManager.subscribeTo('deleteCategory', instance.deleteCategory)

//
//---------//
// Exports //
//---------//

export default instance
