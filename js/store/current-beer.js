//
// TODO: figure out why getCategoryName is so brittle (I have to 'clear' at
//   times that feel unnecessary)
//

//---------//
// Imports //
//---------//

import { Container } from 'unstated'

import eventManager from '../event-manager'
import beerStore from './beer'
import categoriesStore from './categories'

import { bindAllFunctions } from '../utils'

//
//------//
// Init //
//------//

const createInitialState = () => ({
  currentBeerId: null,
  newBeerCategoryId: null,
  editableData: {},
})

//
//------//
// Main //
//------//

class CurrentBeer extends Container {
  state = createInitialState()

  clear() {
    return this.setState(createInitialState())
  }

  initializeEditableData() {
    const data = this.getData()
    this.setState({ editableData: Object.assign({}, data) })
  }

  getData() {
    const id = this.state.currentBeerId

    return id === null ? {} : beerStore.state.beer[id]
  }

  getCategoryName() {
    const { state } = this,
      { categories } = categoriesStore.state

    if (state.currentBeerId === null) {
      return state.newBeerCategoryId === null
        ? undefined
        : categories[state.newBeerCategoryId].name
    }

    const beerId = state.currentBeerId,
      { categoryId } = beerStore.state.beer[beerId]

    return categories[categoryId].name
  }

  updateEditableValue(value, key) {
    const updatedEditableData = Object.assign({}, this.state.editableData)
    updatedEditableData[key] = value

    return this.setState({ editableData: updatedEditableData })
  }
}

const instance = new CurrentBeer()
bindAllFunctions(instance)

eventManager.subscribeTo('deleteCategory', instance.clear)
eventManager.subscribeTo('filterBeer', instance.clear)

eventManager.subscribeTo(
  'goToBeer',
  (selectedBeerId = null, newBeerCategoryId = null) => {
    return instance.setState({
      newBeerCategoryId,
      currentBeerId: selectedBeerId,
      editableData: Object.assign({}, beerStore.state.beer[selectedBeerId]),
    })
  }
)

eventManager.subscribeTo('beerCreated', updatedCurrentBeerId => {
  return instance.setState({
    newBeerCategoryId: null,
    currentBeerId: updatedCurrentBeerId,
    editableData: Object.assign({}, beerStore.state.beer[updatedCurrentBeerId]),
  })
})

//
//---------//
// Exports //
//---------//

export default instance
