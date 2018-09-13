//---------//
// Imports //
//---------//

import _ from 'lodash'
import { Container } from 'unstated'

import api from '../api'
import eventManager from '../event-manager'

import { getIdFromUrl, toBeerState } from './helpers'

import {
  bindAllFunctions,
  getArrayOfValues_object as getArrayOfValues,
  justReturn,
  keepWhen_object as keepWhen,
  omitAll_object as omitAll,
  passThrough,
} from '../utils'

//
//------//
// Init //
//------//

const localOnlyFields = ['id', 'categoryId'],
  sanitizeForServer = omitAll(localOnlyFields)

//
//------//
// Main //
//------//

class Beer extends Container {
  constructor() {
    super()

    bindAllFunctions(this)
    this.getBeersForCategoryId = _.memoize(this.getBeersForCategoryId)

    this.state = { beer: {} }

    eventManager.subscribeTo('createBeer', this.createBeer)
    eventManager.subscribeTo('deleteCurrentBeer', this.deleteCurrentBeer)
    eventManager.subscribeTo('filterBeer', this.filterBeer)
    eventManager.subscribeTo('updateBeer', this.updateBeer)
  }

  filterBeer(query) {
    return api
      .get(`/beers/search?q=${encodeURIComponent(query)}`)
      .then(beer => this.setBeer(beer.reduce(toBeerState, {})))
  }

  //
  // newBeerData has categoryId but not id at this point
  //
  createBeer(newBeerData) {
    const beerToSend = sanitizeForServer(newBeerData)

    return api
      .post(`/beers/`, beerToSend)
      .then(responseBeer => {
        const id = getIdFromUrl(responseBeer),
          updatedLocalBeer = Object.assign({}, this.state.beer)

        updatedLocalBeer[id] = Object.assign({ id }, newBeerData, responseBeer)
        return this.setBeer(updatedLocalBeer).then(justReturn(id))
      })
      .then(newBeerId => {
        eventManager.publish('beerCreated', [newBeerId])
      })
  }

  deleteCurrentBeer(id) {
    const updatedLocalBeers = Object.assign({}, this.state.beer)
    delete updatedLocalBeers[id]

    // we want this method to resolve after the state has been set, not after
    //   the api call resolves because "optimistic ux".  Still, I feel like the
    //   api call should be returned somewhere, so I need to think of a pattern
    //   for this scenario
    api.delete(`/beers/${id}/`)

    return this.setBeer(updatedLocalBeers)
  }

  updateBeer(newBeerData) {
    const { id } = newBeerData,
      beerDataToSend = sanitizeForServer(newBeerData),
      updatedLocalBeer = Object.assign({}, this.state.beer)

    updatedLocalBeer[id] = newBeerData

    return Promise.all([
      this.setBeer(updatedLocalBeer),
      api.put(`/beers/${id}/`, beerDataToSend),
    ])
  }

  setBeer(idToBeer) {
    this.getBeersForCategoryId.cache.clear()
    return this.setState({ beer: idToBeer })
  }

  getBeersForCategoryId(id) {
    return passThrough(this.state.beer, [
      keepWhen(categoryIdEquals(id)),
      getArrayOfValues,
    ])
  }
}

//
//------------------//
// Helper Functions //
//------------------//

function categoryIdEquals(id) {
  return ({ categoryId }) => categoryId === id
}

//
//---------//
// Exports //
//---------//

export default new Beer()
