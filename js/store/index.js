//---------//
// Imports //
//---------//

import beer from './beer'
import categories from './categories'
import currentBeer from './current-beer'
import edit from './edit'

import api from '../api'

import { getIdFromUrl, toBeerState } from './helpers'

//
//------//
// Main //
//------//

const store = { beer, categories, currentBeer, edit }
initAsyncState(store)

//
//------------------//
// Helper Functions //
//------------------//

function initAsyncState(store) {
  return Promise.all([api.get('/categories'), api.get('/beers/')]).then(
    ([categories, beer]) => {
      const idToBeer = beer.reduce(toBeerState, {}),
        idToCategory = categories.reduce(toCategoriesState, {})

      //
      // unfortunately the order matters here due to the memoization.  There's
      //   probably a cleaner approach but this works fine for now
      //
      return store.beer
        .setBeer(idToBeer)
        .then(() => store.categories.setState({ categories: idToCategory }))
    }
  )
}

function toCategoriesState(idToData, aCategory) {
  const id = getIdFromUrl(aCategory)
  aCategory.id = id
  idToData[id] = aCategory
  return idToData
}

//
//---------//
// Exports //
//---------//

export default store
