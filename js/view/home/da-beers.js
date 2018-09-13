//---------//
// Imports //
//---------//

import _ from 'lodash'
import React from 'react'
import { Provider, Subscribe } from 'unstated'

import Category from './category'
import store from '../../store'

import {
  getArrayOfValues_object as getArrayOfValues,
  isEmpty_object as isEmpty,
  isLaden_object as isLaden,
  keepWhen_object as keepWhen,
  map_array as map,
  passThrough,
  sortBy,
} from '../../utils'

//
//------//
// Main //
//------//

const DaBeers = ({ categories }) => {
  if (isEmpty(categories)) return null

  const arrayOfComponents = passThrough(categories, [
    getArrayOfValues,
    sortBy('id'),
    map(toComponents),
  ])

  const threeColumns = distributeAmongColumns(3, arrayOfComponents),
    twoColumns = distributeAmongColumns(2, arrayOfComponents),
    oneColumn = distributeAmongColumns(1, arrayOfComponents)

  //
  // this is a little weird but is necessary to get the html and css working
  //   together for expandable categories within columns
  //
  // also note that for now I'm just going to keep the multiple column html
  //   structure even though it's unnecessary for phones.  It will keep the css
  //   normalized until I decide to clean it up.
  //
  return (
    <>
      <ul className="category-columns for-desktops">{threeColumns}</ul>
      <ul className="category-columns for-tablets">{twoColumns}</ul>
      <ul className="category-columns for-phones-and-smaller">{oneColumn}</ul>
    </>
  )
}

//
// TODO: figure out a way to optimize so we don't re-render if beers change
//   when the data is _not_ editable
//
const ConnectedDaBeers = () => (
  <Provider>
    <Subscribe to={[store.categories, store.beer, store.edit]}>
      {(categoriesStore, beerStore, editStore) => {
        let { categories } = categoriesStore.state

        if (!editStore.state.canEdit) {
          const hasBeer = makeHasBeer(beerStore)
          categories = keepWhen(hasBeer)(categories)
        }

        return <DaBeers categories={categories} />
      }}
    </Subscribe>
  </Provider>
)

//
//------------------//
// Helper Functions //
//------------------//

function makeHasBeer(beerStore) {
  return function hasBeer({ id }) {
    return isLaden(beerStore.getBeersForCategoryId(id))
  }
}

function distributeAmongColumns(nColumns, categoryComponents) {
  const columns = _.range(nColumns).map(createEmptyArray)

  for (let i = 0; i < categoryComponents.length; i += 1) {
    columns[i % nColumns].push(categoryComponents[i])
  }

  return columns.map((aColumn, idx) => (
    <li key={idx}>
      <ul>{aColumn}</ul>
    </li>
  ))
}

function createEmptyArray() {
  return []
}

function toComponents(categoryDatum) {
  const { id } = categoryDatum
  return <Category key={id} {...categoryDatum} />
}

//
//---------//
// Exports //
//---------//

export default ConnectedDaBeers
