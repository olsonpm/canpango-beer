//---------//
// Imports //
//---------//

import React from 'react'

import eventManager from '../../event-manager'
import { filter as FilterIcon } from '../../icons'

//
//------//
// Main //
//------//

const BeerFilter = () => (
  <form onSubmit={handleSubmit} noValidate>
    <label htmlFor="beer-filter-input">Beer filter</label>
    <div className="option-textbox beer-filter">
      <input id="beer-filter-input" maxLength={20} placeholder="{ name }" />
      <button>
        <FilterIcon />
      </button>
    </div>
  </form>
)

//
//------------------//
// Helper Functions //
//------------------//

function handleSubmit(event) {
  event.preventDefault()
  event.stopPropagation()

  const beerFilterEl = document.getElementById('beer-filter-input')
  return eventManager.publish('filterBeer', [beerFilterEl.value])
}

//
//---------//
// Exports //
//---------//

export default BeerFilter
